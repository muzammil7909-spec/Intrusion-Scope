import { getPosts, getUniqueCategories } from "@/actions/blogActions";
import HomeClient from "@/components/home/HomeClient";

export const metadata = {
  title: {
    absolute: "IntrusionScope — Real-time Security Intelligence for Modern SecOps",
  },
  description:
    "Deep-dive CVE analysis, zero-day disclosures, and rapid remediation strategies for critical vulnerabilities across the global software supply chain.",
  alternates: {
    canonical: "/",
  },
};

export const revalidate = 600;

export default async function HomePage({ searchParams }) {
  const queryParams = await searchParams;
  const page = Number(queryParams.page) || 1;
  const search = queryParams.search || "";
  const category = queryParams.category || "";
  const limit = 6;

  const { posts, pagination } = await getPosts({
    page,
    limit,
    search,
    category,
    publishedOnly: true
  });

  const categories = await getUniqueCategories();

  return (
    <HomeClient 
      posts={posts} 
      categories={categories} 
      pagination={pagination} 
      category={category} 
      search={search} 
    />
  );
}
