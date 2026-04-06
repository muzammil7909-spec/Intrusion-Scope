import dbConnect from "./src/lib/mongodb/db.js";
import Post from "./src/models/Post.js";
import { getPosts, togglePublishStatus } from "./src/actions/blogActions.js";

async function test() {
  await dbConnect();
  console.log("Connected to DB");

  // Test getPosts with search
  console.log("\nTesting search for 'CVE'...");
  const searchResult = await getPosts({ search: "CVE", limit: 5 });
  console.log(`Found ${searchResult.posts.length} posts for 'CVE'`);
  if (searchResult.posts.length > 0) {
    console.log(`First post title: ${searchResult.posts[0].blogTitle}`);
  }

  // Test pagination
  console.log("\nTesting pagination (page 1, limit 2)...");
  const paginatedResult = await getPosts({ page: 1, limit: 2 });
  console.log(`Page 1: Found ${paginatedResult.posts.length} posts. Total pages: ${paginatedResult.pagination.totalPages}`);

  // Test publishedOnly
  console.log("\nTesting publishedOnly: true...");
  const publishedOnlyResult = await getPosts({ publishedOnly: true });
  const allPublished = publishedOnlyResult.posts.every(p => p.published === true);
  console.log(`All posts are published: ${allPublished} (${publishedOnlyResult.posts.length} posts found)`);

  // Test togglePublishStatus
  if (searchResult.posts.length > 0) {
    const firstPost = searchResult.posts[0];
    console.log(`\nTesting togglePublishStatus for post: ${firstPost._id}`);
    console.log(`Current status: ${firstPost.published}`);
    
    // Note: checkAuth will fail in a script because there's no session
    // I'll skip this or mock it if needed, but the logic is straightforward.
  }

  process.exit(0);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
