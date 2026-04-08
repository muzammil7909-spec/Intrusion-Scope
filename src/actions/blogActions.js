"use server";

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


import dbConnect from "@/lib/mongodb/db";
import Post from "@/models/Post";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

// Helper to check authentication
async function checkAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function createPost(formData) {
  try {
    await checkAuth();
    await dbConnect();
    
    // Convert formData to object and handle arrays/nested objects
    const faqQuestion = formData.get("faq_question");
    const faqAnswer = formData.get("faq_answer");
    const faq = [];
    if (faqQuestion && faqAnswer) {
      faq.push({ question: faqQuestion, answer: faqAnswer });
    }

    const postData = {
      blogTitle: formData.get("blogTitle"),
      cveId: formData.get("cveId"),
      product: formData.get("product"),
      vendorProject: formData.get("vendorProject"),
      cwes: formData.get("cwes")?.split(",").map(c => c.trim()) || [],
      classification: formData.get("classification"),
      dateDisclosed: formData.get("dateDisclosed") ? new Date(formData.get("dateDisclosed")) : undefined,
      remediationDeadline: formData.get("remediationDeadline") ? new Date(formData.get("remediationDeadline")) : undefined,
      shortDescription: formData.get("shortDescription"),
      keywords: formData.get("keywords")?.split(",").map(k => k.trim()) || [],
      data: formData.get("data"),
      published: formData.get("published") === "on",
      slug: formData.get("slug") || formData.get("blogTitle")?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
      faq,
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      openGraph: {
        title: formData.get("ogTitle"),
        description: formData.get("ogDescription"),
        type: formData.get("ogType") || "article",
        imageAlt: formData.get("ogImageAlt"),
      },
      // For complex fields like JSON-LD and TOC, we'll try to parse them if provided as JSON strings
      jsonLd: {
        articleSchema: formData.get("articleSchema") ? JSON.parse(formData.get("articleSchema")) : undefined,
        faqSchema: formData.get("faqSchema") ? JSON.parse(formData.get("faqSchema")) : undefined,
      },
      tableOfContents: formData.get("tableOfContents") ? JSON.parse(formData.get("tableOfContents")) : [],
    };

    const post = await Post.create(postData);
    revalidatePath("/dashboard");
    revalidatePath("/blogs");
    return { success: true, id: post._id.toString() };
  } catch (error) {
    console.error("Create Post Error:", error);
    return { error: error.message };
  }
}

export async function updatePost(id, formData) {
  try {
    await checkAuth();
    await dbConnect();

    const faqQuestion = formData.get("faq_question");
    const faqAnswer = formData.get("faq_answer");
    const faq = [];
    if (faqQuestion && faqAnswer) {
      faq.push({ question: faqQuestion, answer: faqAnswer });
    }

    const postData = {
      blogTitle: formData.get("blogTitle"),
      cveId: formData.get("cveId"),
      product: formData.get("product"),
      vendorProject: formData.get("vendorProject"),
      cwes: formData.get("cwes")?.split(",").map(c => c.trim()) || [],
      classification: formData.get("classification"),
      dateDisclosed: formData.get("dateDisclosed") ? new Date(formData.get("dateDisclosed")) : undefined,
      remediationDeadline: formData.get("remediationDeadline") ? new Date(formData.get("remediationDeadline")) : undefined,
      shortDescription: formData.get("shortDescription"),
      keywords: formData.get("keywords")?.split(",").map(k => k.trim()) || [],
      data: formData.get("data"),
      published: formData.get("published") === "on",
      slug: formData.get("slug"),
      faq,
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      openGraph: {
        title: formData.get("ogTitle"),
        description: formData.get("ogDescription"),
        type: formData.get("ogType") || "article",
        imageAlt: formData.get("ogImageAlt"),
      },
      jsonLd: {
        articleSchema: formData.get("articleSchema") ? JSON.parse(formData.get("articleSchema")) : undefined,
        faqSchema: formData.get("faqSchema") ? JSON.parse(formData.get("faqSchema")) : undefined,
      },
      tableOfContents: formData.get("tableOfContents") ? JSON.parse(formData.get("tableOfContents")) : [],
    };

    await Post.findByIdAndUpdate(id, postData);
    revalidatePath("/dashboard");
    revalidatePath(`/blogs/${postData.slug}`);
    return { success: true };
  } catch (error) {
    console.error("Update Post Error:", error);
    return { error: error.message };
  }
}

export async function deletePost(id) {
  try {
    await checkAuth();
    await dbConnect();
    await Post.findByIdAndDelete(id);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete Post Error:", error);
    return { error: error.message };
  }
}

export async function getPosts(options = {}) {
  const { 
    page = 1, 
    limit = 10, 
    search = "", 
    publishedOnly = false 
  } = options;

  try {
    await dbConnect();
    
    const query = {};
    if (publishedOnly) {
      query.published = true;
    }
    
    if (search) {
      query.$or = [
        { blogTitle: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { cveId: { $regex: search, $options: "i" } },
        { product: { $regex: search, $options: "i" } },
        { classification: { $regex: search, $options: "i" } },
        { keywords: { $in: [new RegExp(search, "i")] } }
      ];
    }

    // Specific category filtering (top-level or sub-level)
    if (options.category) {
      // Create a flexible regex that allows for optional whitespace around slashes
      // Example: "A/B" becomes "^A\s*/\s*B"
      const flexibleCategory = options.category
        .split("/")
        .map(part => escapeRegExp(part.trim()))
        .join("\\s*/\\s*");
      
      query.classification = { $regex: `^${flexibleCategory}`, $options: "i" };
    }

    const skip = (page - 1) * Number(limit);
    
    const totalCount = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    return {
      posts: JSON.parse(JSON.stringify(posts)),
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: Number(page),
        limit: Number(limit),
      }
    };
  } catch (error) {
    console.error("Get Posts Error:", error);
    return { 
      posts: [], 
      pagination: { totalCount: 0, totalPages: 0, currentPage: 1, limit: Number(limit) } 
    };
  }
}

export async function getRelatedPosts(currentSlug, category, limit = 3) {
  try {
    await dbConnect();
    
    // Find posts in same category, excluding current post
    const query = {
      published: true,
      slug: { $ne: currentSlug }
    };

    if (category) {
      query.classification = category;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // If not enough related posts in same category, fill with latest posts
    if (posts.length < limit) {
      const additionalLimit = limit - posts.length;
      const excludedSlugs = [currentSlug, ...posts.map(p => p.slug)];
      
      const latestPosts = await Post.find({
        published: true,
        slug: { $nin: excludedSlugs }
      })
      .sort({ createdAt: -1 })
      .limit(additionalLimit)
      .lean();
      
      posts.push(...latestPosts);
    }

    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Get Related Posts Error:", error);
    return [];
  }
}

export async function togglePublishStatus(id) {
  try {
    await checkAuth();
    await dbConnect();
    const post = await Post.findById(id);
    if (!post) throw new Error("Post not found");
    
    post.published = !post.published;
    await post.save();
    
    revalidatePath("/dashboard");
    revalidatePath("/");
    revalidatePath(`/blogs/${post.slug}`);
    return { success: true, published: post.published };
  } catch (error) {
    console.error("Toggle Publish Error:", error);
    return { error: error.message };
  }
}

export async function getPost(id) {
  try {
    await dbConnect();
    const post = await Post.findById(id).lean();
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error("Get Post Error:", error);
    return null;
  }
}

export async function getUniqueCategories() {
  try {
    await dbConnect();
    // Get all unique classifications from published posts
    const classifications = await Post.distinct("classification", { published: true });
    
    // Extract top-level categories (everything before the first slash)
    const categories = new Set();
    classifications.forEach(c => {
      if (c) {
        const topLevel = c.split("/")[0].trim();
        if (topLevel) categories.add(topLevel);
      }
    });

    return Array.from(categories).sort();
  } catch (error) {
    console.error("Get Categories Error:", error);
    return [];
  }
}

export async function getAllClassifications() {
  try {
    await dbConnect();
    // Get all unique classifications from published posts
    const classifications = await Post.distinct("classification", { published: true });
    
    // Build tree
    const root = {};

    classifications.forEach((classification) => {
      if (!classification) return;
      // split by slash to get the hierarchy
      const parts = classification.split("/").map(p => p.trim());
      let currentLevel = root;

      parts.forEach((part, index) => {
        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part,
            path: parts.slice(0, index + 1).join("/"),
            children: {}
          };
        }
        currentLevel = currentLevel[part].children;
      });
    });

    return root;
  } catch (error) {
    console.error("Get All Classifications Error:", error);
    return {};
  }
}
