import dbConnect from "./src/lib/mongodb/db.js";
import Post from "./src/models/Post.js";
import mongoose from "mongoose";

async function check() {
  try {
    await dbConnect();
    console.log("Connected to DB");
    
    // Check for the specific post
    const id = "69cfb40619012466c7848d92";
    console.log("Checking for post ID:", id);
    const postById = await Post.findById(id);
    if (postById) {
      console.log("Post found by ID:");
      console.log("Title:", postById.blogTitle);
      console.log("Slug:", postById.slug);
      console.log("Published:", postById.published);
    } else {
      console.log("Post NOT found by ID.");
    }

    // List recent slugs
    console.log("\nListing 10 most recent posts:");
    const allPosts = await Post.find({}, { blogTitle: 1, slug: 1, published: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(10);
    allPosts.forEach(p => {
      console.log(`- [${p.published ? "P" : "D"}] ${p.blogTitle} | slug: ${p.slug} | updated: ${p.updatedAt}`);
    });

  } catch (error) {
    console.error("DB Script Error:", error);
  } finally {
    process.exit(0);
  }
}

check();
