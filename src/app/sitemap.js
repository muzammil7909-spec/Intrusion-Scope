import dbConnect from '@/lib/mongodb/db';
import Post from '@/models/Post';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  await dbConnect();
  const posts = await Post.find({ published: true })
    .select('slug updatedAt')
    .lean();

  const blogEntries = posts.map((post) => ({
    url: `${baseUrl.replace(/\/$/, '')}/blogs/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl.replace(/\/$/, '')}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...blogEntries,
  ];
}
