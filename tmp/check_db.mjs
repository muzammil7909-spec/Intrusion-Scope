import dbConnect from "./src/lib/mongodb/db.js";
import Post from "./src/models/Post.js";
import mongoose from "mongoose";

async function check() {
  await dbConnect();
  console.log("Connected to DB");
  
  const post = await Post.findById("69cfb40619012466c7848d92");
  if (post) {
    console.log("Post found:");
    console.log("Title:", post.blogTitle);
    console.log("Slug:", post.slug);
    console.log("Published:", post.published);
  } else {
    console.log("Post 69cfb40619012466c7848d92 not found.");
    const allPosts = await Post.find({}, { blogTitle: 1, slug: 1, published: 1 }).limit(5);
    console.log("Recent posts:", allPosts);
  }
  
  process.exit(0);
}

check();
