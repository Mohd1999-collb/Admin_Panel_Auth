// import mongoose from "mongoose";
// import slugify from "slugify";

// const BlogSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//      slug: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     content: { type: String, required: true },
//     excerpt: { type: String },

//     // SEO
//     seoTitle: { type: String },
//     seoDescription: { type: String },
//     seoKeywords: [{ type: String }],
//     seoImage: { type: String },

//     // Schema
//     authorName: { type: String, required: true },
//     authorImage: { type: String },

//     isPublished: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// BlogSchema.pre("validate", async function (next) {
//   if (!this.slug && this.title) {
//     let baseSlug = slugify(this.title, {
//       lower: true,
//       strict: true,
//     });

//     let slug = baseSlug;
//     let count = 1;

//     while (
//       await mongoose.models.Blog.exists({ slug })
//     ) {
//       slug = `${baseSlug}-${count}`;
//       count++;
//     }
//     this.slug = slug;
//   }
//   next();
// });

// export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

import mongoose, { Schema, models } from "mongoose";

/* FAQ SUB-SCHEMA */
const faqSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/* CATEGORY SUB-SCHEMA */
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/* MAIN BLOG SCHEMA */
const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // SEO + fast lookup
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    schemaMarkup: {
      type: String,
      required: true,
      trim: true
    },

    content: {
      type: String, // HTML from rich text editor
      required: true,
    },

    faqs: {
      type: [faqSchema],
      default: [],
    },

    category: {
      type: categorySchema,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },

    author: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true, // createdAt & updatedAt (used in schema)
  }
);

blogSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

/* PREVENT MODEL RE-COMPILE ERROR */
const Blog = models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;
