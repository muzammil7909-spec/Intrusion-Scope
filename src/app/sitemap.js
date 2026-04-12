import dbConnect from '@/lib/mongodb/db';
import Post from '@/models/Post';

// Cache the sitemap — regenerate every 6 hours
export const revalidate = 21600;

export default async function sitemap() {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://intrusionscope.site').replace(/\/$/, '');

  await dbConnect();
  const posts = await Post.find({ published: true })
    .select('slug updatedAt createdAt')
    .sort({ createdAt: -1 })
    .lean();

  // Use the most recent post's date for aggregate pages
  const latestPostDate = posts.length > 0
    ? new Date(posts[0].updatedAt || posts[0].createdAt)
    : new Date('2026-01-01');

  const blogEntries = posts.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.createdAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: latestPostDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: latestPostDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...blogEntries,
  ];
}
