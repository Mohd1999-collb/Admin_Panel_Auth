import { Metadata } from "next";
import Script from "next/script";

async function getBlog(slug: string) {
  const res = await fetch(`http://localhost:4000/api/auth/blog/${slug}`, {
    cache: "force-cache",
  });

  if (!res.ok) throw new Error("Blog not found");
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {

  const { slug } = await params;
  const blog = await getBlog(slug);

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

export default async function BlogDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const blog = await getBlog(slug);

  const {title, description, content, faqs, schemaMarkup} = blog.data;
  return (
    <>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaMarkup),
        }}
      />

      {/* 📄 Blog Content */}
      <article className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>

        <p className="text-gray-600 mb-6">{description}</p>       

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {/* FAQ Section */}
        {faqs?.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">FAQs</h2>

            {faqs.map((faq: any, index: number) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </section>
        )}
      </article>
    </>
  );
}
