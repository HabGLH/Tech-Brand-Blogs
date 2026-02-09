import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
import requireAuth from "@/lib/middleware/authe";
import { getIdFromRequest, slugify } from "@/lib/utils";
import { getUserFromRequest } from "@/lib/auth";
import { ok, error, serverError } from "@/lib/api";

type params = Promise<{ postId: string }>;

export async function GET(req: Request, { params }: { params: params }) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const postId = getIdFromRequest(req) || (await params).postId;
    await dbConnect();
    const isObjectId = /^[a-fA-F0-9]{24}$/.test(postId);
    const post = slug
      ? await Post.findOne({ slug })
      : isObjectId
        ? await Post.findById(postId)
        : await Post.findOne({ slug: postId });
    if (!post) return error("Post not found.", 404);
    const viewer = getUserFromRequest(req);
    if (
      post.status === "draft" &&
      (!viewer || (viewer.role !== 777 && post.authorId.toString() !== viewer.userId))
    ) {
      return error("Forbidden.", 403);
    }
    return ok("Post fetched successfully.", { post });
  } catch (error: unknown) {
    return serverError("Failed to fetch post:", error);
  }
}

export async function PUT(req: Request, { params }: { params: params }) {
  try {
    const auth = requireAuth(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    const postId = getIdFromRequest(req) || (await params).postId;
    const body = await req.json();
    await dbConnect();
    const post = await Post.findById(postId);
    if (!post) return error("Post not found.", 404);
    if (post.authorId.toString() !== auth.user.userId && auth.user.role !== 777) {
      return error("Unauthorized.", 403);
    }
    if (body.status && !["draft", "published"].includes(body.status)) {
      return error("Invalid status value.", 400);
    }

    if (typeof body.title === "string" && body.title.trim()) {
      post.title = body.title.trim();
    }
    if (typeof body.content === "string" && body.content.trim()) {
      post.content = body.content.trim();
    }
    if (body.imageUrl !== undefined) {
      post.imageUrl = body.imageUrl;
    }
    if (body.categoryId !== undefined) {
      post.categoryId = body.categoryId;
    }
    const incomingTagIds = Array.isArray(body.tagIds)
      ? body.tagIds
      : Array.isArray(body.tags)
        ? body.tags
        : undefined;
    if (incomingTagIds) {
      post.tagIds = incomingTagIds;
    }
    if (body.status) {
      post.status = body.status;
    }
    if (typeof body.slug === "string" || typeof body.title === "string") {
      const slugInput =
        typeof body.slug === "string" && body.slug.trim()
          ? body.slug
          : post.title;
      const newSlug = slugify(slugInput);
      if (!newSlug) {
        return error("Invalid slug.", 400);
      }
      const existingSlug = await Post.findOne({
        slug: newSlug,
        _id: { $ne: post._id },
      }).select("_id");
      if (existingSlug) return error("Slug already in use.", 409);
      post.slug = newSlug;
    }
    await post.save();
    return ok("Post updated successfully.", { post });
  } catch (error: unknown) {
    return serverError("Failed to update post:", error);
  }
}

export async function DELETE(req: Request, { params }: { params: params }) {
  try {
    const auth = requireAuth(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    const postId = getIdFromRequest(req) || (await params).postId;
    await dbConnect();
    const post = await Post.findById(postId);
    if (!post) return error("Post not found.", 404);
    if (post.authorId.toString() !== auth.user.userId && auth.user.role !== 777) {
      return error("Unauthorized.", 403);
    }
    await Promise.all([
      post.deleteOne(),
      Comment.deleteMany({ postId: post._id }),
      Like.deleteMany({ postId: post._id }),
    ]);
    return ok("Post deleted successfully.");
  } catch (error: unknown) {
    return serverError("Failed to delete post:", error);
  }
}
