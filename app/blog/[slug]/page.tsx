import { Metadata } from "next";

async function getBlog(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/blog/${slug}`,
    { cache: "force-cache" }
  );

  if (!res.ok) throw new Error("Blog not found");
  return res.json();
}


export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const blog = await getBlog(params.slug);

  return {
    title: blog.seoTitle || blog.title,
    description: blog.seoDescription,
    keywords: blog.seoKeywords,

    alternates: {
      canonical: `http://localhost:4000/blog/${blog.slug}`,
    },

    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription,
      images: [
        {
          url: blog.seoImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription,
      images: [blog.seoImage],
    },
  };
}

