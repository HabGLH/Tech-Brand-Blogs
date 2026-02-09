import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tagIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

postSchema.index({ title: 1 });
postSchema.index({ authorId: 1 });
postSchema.index({ categoryId: 1 });
postSchema.index({ status: 1 });

const Post = mongoose.models?.Post || mongoose.model("Post", postSchema);

export default Post;
