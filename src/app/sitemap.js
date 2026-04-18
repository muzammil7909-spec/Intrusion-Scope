import dbConnect from '@/lib/mongodb/db';
import Post from '@/models/Post';

// Cache the sitemap — regenerate every 6 hours
export const revalidate = 21600;

export default async function sitemap() {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://intrusionscope.site').replace(/\/$/, '');

  await dbConnect();
  // Fetch ALL published posts — sitemap.js in Next.js handles large arrays well
  const posts = await Post.find({ published: true })
    .select('slug updatedAt createdAt')
    .sort({ createdAt: -1, _id: -1 })
    .lean();

  // Use the most recent activity (create or update) across the whole collection
  const latestPostDate = posts.length > 0
    ? new Date(Math.max(...posts.map(p => new Date(p.updatedAt || p.createdAt)))).toISOString()
    : new Date('2026-01-01').toISOString();


  const blogEntries = posts.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: (post.updatedAt ? new Date(post.updatedAt) : new Date(post.createdAt)).toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: latestPostDate,
      changeFrequency: 'daily',
      priority: 1.0,
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

