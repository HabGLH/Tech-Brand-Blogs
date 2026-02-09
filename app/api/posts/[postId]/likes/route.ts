import dbConnect from "@/lib/db";
import Like from "@/models/Like";
import Post from "@/models/Post";
import requireAuth from "@/lib/middleware/authe";
import User from "@/models/User";
import { ok, error, serverError } from "@/lib/api";

type params = Promise<{ postId: string }>;

export async function POST(req: Request, { params }: { params: params }) {
  try {
    const auth = requireAuth(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    const postId = (await params).postId;
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
    const existingLike = await Like.findOne({
      postId,
      userId: auth.user.userId,
    });
    if (existingLike) {
      return error("You have already liked this post.", 400);
    }
    const like = new Like({ postId, userId: auth.user.userId });
    await like.save();
    await Post.updateOne({ _id: postId }, { $inc: { likesCount: 1 } });
    return ok("Post liked successfully.", { like }, 201);
  } catch (error: unknown) {
    return serverError("Failed to like post:", error);
  }
}

export async function DELETE(req: Request, { params }: { params: params }) {
  try {
    const auth = requireAuth(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    const postId = (await params).postId;
    await dbConnect();
    const user = await User.findById(auth.user.userId).select("isBlocked");
    if (!user) {
      return error("User not found.", 404);
    }
    if (user.isBlocked) {
      return error("User is blocked.", 403);
    }
    const like = await Like.findOneAndDelete({
      postId,
      userId: auth.user.userId,
    });
    if (!like) {
      return error("You have not liked this post.", 400);
    }
    await Post.updateOne({ _id: postId }, { $inc: { likesCount: -1 } });
    return ok("Post unliked successfully.");
  } catch (error: unknown) {
    return serverError("Failed to unlike post:", error);
  }
}
