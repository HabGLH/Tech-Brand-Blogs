import dbConnect from "@/lib/db";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import requireAuth from "@/lib/middleware/authe";
import { getUserFromRequest } from "@/lib/auth";
import User from "@/models/User";
import { ok, error, serverError } from "@/lib/api";

type params = Promise<{ postId: string }>;

export async function GET(req: Request, { params }: { params: params }) {
  try {
    const postId = (await params).postId;
    await dbConnect();
    const post = await Post.findById(postId).select("status authorId");
    if (!post) {
      return error("Post not found.", 404);
    }
    if (post.status === "draft") {
      const viewer = getUserFromRequest(req);
      if (
        !viewer ||
        (viewer.role !== 777 && post.authorId.toString() !== viewer.userId)
      ) {
        return error("Forbidden.", 403);
      }
    }
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    return ok("Comments fetched successfully.", { comments });
  } catch (error: unknown) {
    return serverError("Failed to fetch comments:", error);
  }
}

export async function POST(req: Request, { params }: { params: params }) {
  try {
    const auth = requireAuth(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    const postId = (await params).postId;
    const body = await req.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!content) {
      return error("Content is required.", 400);
    }
    await dbConnect();
    const user = await User.findById(auth.user.userId).select("isBlocked");
    if (!user) {
      return error("User not found.", 404);
    }
    if (user.isBlocked) {
      return error("User is blocked.", 403);
    }
    const post = await Post.findById(postId).select("status authorId");
    if (!post) {
      return error("Post not found.", 404);
    }
    if (
      post.status === "draft" &&
      auth.user.role !== 777 &&
      post.authorId.toString() !== auth.user.userId
    ) {
      return error("Forbidden.", 403);
    }
    const comment = new Comment({
      content,
      userId: auth.user.userId,
      postId,
    });
    await comment.save();
    await Post.updateOne({ _id: postId }, { $inc: { commentsCount: 1 } });
    return ok("Comment created successfully.", { comment }, 201);
  } catch (error: unknown) {
    return serverError("Failed to create comment:", error);
  }
}
