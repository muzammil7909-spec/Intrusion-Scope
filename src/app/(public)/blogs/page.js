import { getPosts, getAllClassifications } from "@/actions/blogActions";
import BlogsClient from "@/components/blogs/BlogsClient";

export const metadata = {
  title: "Intelligence Feed",
  description:
    "Browse all verified security advisories, vulnerability disclosures, and deep-dive technical research from IntrusionScope.",
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    title: "Intelligence Feed | IntrusionScope",
    description:
      "Browse all verified security advisories, vulnerability disclosures, and deep-dive technical research.",
    url: "/blogs",
    type: "website",
    images: [
      {
        url: "/Banner.png",
        width: 1500,
        height: 750,
        alt: "IntrusionScope — Real Time Intel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Intelligence Feed | IntrusionScope",
    description:
      "Browse all verified security advisories, vulnerability disclosures, and deep-dive technical research.",
    images: ["/Banner.png"],
  },
};

export default async function BlogsPage({ searchParams }) {
  const queryParams = await searchParams;
  const page = Number(queryParams.page) || 1;
  const search = queryParams.search || "";
  const category = queryParams.category ? queryParams.category.split("/").map(p => p.trim()).join("/") : "";
  const limit = 12;

  const { posts, pagination } = await getPosts({
    page,
    limit,
    search,
    category,
    publishedOnly: true
  });

  const categoriesRoot = await getAllClassifications();

  return (
    <BlogsClient 
      posts={posts} 
      pagination={pagination} 
      categoriesRoot={categoriesRoot} 
      category={category} 
    />
  );
}
