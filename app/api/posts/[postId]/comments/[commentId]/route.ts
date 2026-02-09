import dbConnect from "@/lib/db";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import requireAuth from "@/lib/middleware/authe";
import User from "@/models/User";
import { ok, error, serverError } from "@/lib/api";

type params = Promise<{ postId: string; commentId: string }>;

export async function PUT(req: Request, { params }: { params: params }) {
  try {
    const auth = requireAuth(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    const { postId, commentId } = await params;
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
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return error("Comment not found.", 404);
    }
    if (comment.postId.toString() !== postId) {
      return error("Comment not found.", 404);
    }
    if (comment.userId.toString() !== auth.user.userId) {
      return error("Unauthorized.", 403);
    }
    comment.content = content;
    await comment.save();
    return ok("Comment updated successfully.", { comment });
  } catch (error: unknown) {
    return serverError("Failed to update comment:", error);
  }
}

export async function DELETE(req: Request, { params }: { params: params }) {
  try {
    const auth = requireAuth(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    const { postId, commentId } = await params;
    await dbConnect();
    const user = await User.findById(auth.user.userId).select("isBlocked");
    if (!user) {
      return error("User not found.", 404);
    }
    if (user.isBlocked) {
      return error("User is blocked.", 403);
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return error("Comment not found.", 404);
    }
    if (comment.postId.toString() !== postId) {
      return error("Comment not found.", 404);
    }
    if (comment.userId.toString() !== auth.user.userId) {
      return error("Unauthorized.", 403);
    }
    const associatedPostId = comment.postId;
    await comment.deleteOne();
    await Post.updateOne(
      { _id: associatedPostId },
      { $inc: { commentsCount: -1 } },
    );
    return ok("Comment deleted successfully.");
  } catch (error: unknown) {
    return serverError("Failed to delete comment:", error);
  }
}
