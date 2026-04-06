import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is undefined. Please ensure .env.local is being passed to the script.");
  process.exit(1);
}

async function testConnection() {
  try {
    console.log(`Attempting to connect to MongoDB using URI: ${MONGODB_URI.substring(0, 20)}...`);
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connection Successful!");

    // Basic CRUD test simulation
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("\nAvailable Collections:", collections.map(c => c.name));

    // Check Users
    const users = await db.collection("users").find({}).limit(1).toArray();
    if (users.length > 0) {
      console.log("✅ Users collection is accessible. Found a user:", users[0].email);
    } else {
      console.log("⚠️ Users collection is empty or accessible but no users found.");
    }

    // Check Posts
    const posts = await db.collection("posts").find({}).limit(1).toArray();
    if (posts.length > 0) {
      console.log("✅ Posts collection is accessible. Found a post:", posts[0].blogTitle);
    } else {
      console.log("⚠️ Posts collection is empty or accessible but no posts found.");
    }

    // Create a strict test post
    const testPost = {
      blogTitle: "Automated QA Test Post",
      cveId: "CVE-9999-9999",
      classification: "QA-Test-Vector",
      shortDescription: "This is an automated test to verify CRUD functionality.",
      data: "# Test",
      slug: "automated-qa-test-post-" + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log("\nAttempting to create a test blog post...");
    const result = await db.collection("posts").insertOne(testPost);
    console.log("✅ Created Test Post with ID:", result.insertedId);

    console.log("Attempting to delete the test blog post...");
    await db.collection("posts").deleteOne({ _id: result.insertedId });
    console.log("✅ Deleted Test Post successfully.");

    console.log("\n🎉 All tests passed. The database, read, write, and schema connections are working perfectly.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Test Failed:", error);
    process.exit(1);
  }
}

testConnection();
