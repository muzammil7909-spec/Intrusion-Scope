export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/login', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
