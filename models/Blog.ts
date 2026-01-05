import mongoose from "mongoose";
import slugify from "slugify";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
     slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: { type: String, required: true },
    excerpt: { type: String },

    // SEO
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: [{ type: String }],
    seoImage: { type: String },

    // Schema
    authorName: { type: String, required: true },
    authorImage: { type: String },

    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);


BlogSchema.pre("validate", async function (next) {
  if (!this.slug && this.title) {
    let baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
    });

    let slug = baseSlug;
    let count = 1;

    while (
      await mongoose.models.Blog.exists({ slug })
    ) {
      slug = `${baseSlug}-${count}`;
      count++;
    }
    this.slug = slug;
  }
  next();
});


export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);