export default function BlogSchema({ blog }: { blog: any }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.seoDescription,
    image: blog.seoImage,
    author: {
      "@type": "Person",
      name: blog.authorName,
    },
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `http://localhost:4000/blog/${blog.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
