import dbConnect from "@/lib/mongodb/db";
import Post from "@/models/Post";
import { notFound } from "next/navigation";
import PostClient from "@/components/blogs/PostClient";
import { getRelatedPosts } from "@/actions/blogActions";

// ISR: revalidate blog posts every hour
export const revalidate = 3600;
// Pre-render all published blog posts at build time
export async function generateStaticParams() {
  await dbConnect();
  const posts = await Post.find({ published: true }).select("slug").lean();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await dbConnect();
  const post = await Post.findOne({ slug }).lean();
  if (!post) return {};

  const title = post.metaTitle || post.blogTitle;
  const description = post.metaDescription || post.shortDescription;

  return {
    title,
    description,
    keywords: post.keywords?.join(", "),
    alternates: {
      canonical: `/blogs/${slug}`,
    },
    openGraph: {
      title: post.openGraph?.title || title,
      description: post.openGraph?.description || description,
      url: `/blogs/${slug}`,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: ["IntrusionScope"],
      tags: post.keywords,
      images: [
        {
          url: "/Banner.png",
          width: 1500,
          height: 750,
          alt: post.openGraph?.imageAlt || `${title} — IntrusionScope`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.openGraph?.title || title,
      description: post.openGraph?.description || description,
      images: ["/Banner.png"],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  await dbConnect();
  const post = await Post.findOne({ slug }).lean();
  if (!post) notFound();

  const [relatedPosts] = await Promise.all([
    getRelatedPosts(slug, post.classification)
  ]);
  
  const serializedPost = JSON.parse(JSON.stringify(post));
  const serializedRelated = JSON.parse(JSON.stringify(relatedPosts));

  // Build JSON-LD structured data
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: serializedPost.blogTitle,
    description: serializedPost.metaDescription || serializedPost.shortDescription,
    datePublished: serializedPost.createdAt,
    dateModified: serializedPost.updatedAt,
    author: {
      "@type": "Organization",
      name: "IntrusionScope",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "IntrusionScope",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/Banner.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blogs/${slug}`,
    },
    image: `${baseUrl}/Banner.png`,
    keywords: serializedPost.keywords?.join(", "),
    articleSection: serializedPost.category || "Cybersecurity Intelligence",
  };

  // Build FAQ JSON-LD if FAQs exist
  const faqJsonLd =
    serializedPost.faq && serializedPost.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: serializedPost.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  // Build BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Intelligence Feed",
        item: `${baseUrl}/blogs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: serializedPost.blogTitle,
        item: `${baseUrl}/blogs/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PostClient post={serializedPost} relatedPosts={serializedRelated} />
    </>
  );
}
