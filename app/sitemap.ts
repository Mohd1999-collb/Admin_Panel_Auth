import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/blog`,
    { cache: "force-cache" }
  ).then(res => res.json());

  return [
    {
      url: "http://localhost:4000",
      lastModified: new Date(),
    },
    {
      url: "http://localhost:4000/blog",
      lastModified: new Date(),
    },
    ...blogs.map((blog: any) => ({
      url: `http://localhost:4000/blog/${blog.slug}`,
      lastModified: new Date(blog.updatedAt),
    })),
  ];
}
