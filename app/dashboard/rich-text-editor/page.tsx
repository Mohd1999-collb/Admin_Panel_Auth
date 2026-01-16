"use client";

import RichTextEditor from "@/components/RichTextEditor";
import { useState } from "react";

export default function CreateBlog() {
  const [content, setContent] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    schemaMarkup: "",
    content: "",
    category: {
      name: "",
      slug: "",
    },
    faqs: [{ question: "", answer: "" }],
  });

  async function handleSubmit(e:any) {
    e.preventDefault();
    const res = await fetch("/api/auth/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Blog published");
    } else {
      alert("Error");
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Blog Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            className="border-2 rounded-md"
          />
          <input
            placeholder="Category Name"
            value={form.category.name}
            onChange={(e) =>
              setForm({
                ...form,
                category: {
                  ...form.category,
                  name: e.target.value,
                  slug: generateSlug(e.target.value),
                },
              })
            }
            className="border-2 rounded-md"
          />

          <input
            placeholder="Category Slug"
            value={form.category.slug}
            readOnly
            className="border-2 rounded-md"
          />

          <textarea
            placeholder="Short description (SEO)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input h-24"
          />
        </div>

        <textarea
            placeholder="Blog Schema Markup (JSON-LD)"
            value={form.schemaMarkup}
            onChange={(e) => setForm({ ...form, schemaMarkup: e.target.value })}
            className="input mt-4 h-24"
          />
            

        <h3 className="text-lg font-semibold">FAQs</h3>

        {form.faqs.map((faq, index) => (
          <div key={index} className="border p-3 mt-3 rounded space-y-2">
            <input
              placeholder="Question"
              value={faq.question}
              onChange={(e) => {
                const faqs = [...form.faqs];
                faqs[index].question = e.target.value;
                setForm({ ...form, faqs });
              }}
              className="input"
            />

            <textarea
              placeholder="Answer"
              value={faq.answer}
              onChange={(e) => {
                const faqs = [...form.faqs];
                faqs[index].answer = e.target.value;
                setForm({ ...form, faqs });
              }}
              className="input h-20"
            />

            <button
              type="button"
              onClick={() => {
                const faqs = form.faqs.filter((_, i) => i !== index);
                setForm({ ...form, faqs });
              }}
              className="text-red-600 text-sm"
            >
              Remove FAQ
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              faqs: [...form.faqs, { question: "", answer: "" }],
            })
          }
          className="text-blue-600"
        >
          + Add FAQ
        </button>

        <RichTextEditor
          value={form.content}
          onChange={(content) => setForm({ ...form, content })}
        />
        <button
          type="submit"
          className="bg-black cursor-pointer text-white px-6 py-2 rounded"
        >
          Publish Blog
        </button>
      </form>
    </div>
  );
}

const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
