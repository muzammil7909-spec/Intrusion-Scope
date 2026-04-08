export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/_next/static/', '/favicon.svg'],
        disallow: ['/dashboard', '/login', '/api/'],
      },
    ],
    sitemap: `${baseUrl.replace(/\/$/, '')}/sitemap.xml`,
  };
}
