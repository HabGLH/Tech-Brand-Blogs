import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
import requireAdmin from "@/lib/middleware/role";
import { ok, error, serverError } from "@/lib/api";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    const { id } = await params;
    if (!id) return error("Post id is required", 400);
    await dbConnect();
    const post = await Post.findByIdAndDelete(id); // Use findByIdAndDelete
    if (!post) return error("Post not found", 404); // Check if post was found and deleted
    await Promise.all([
      Comment.deleteMany({ postId: post._id }),
      Like.deleteMany({ postId: post._id }),
    ]);
    return ok("Post deleted successfully");
  } catch (error: unknown) {
    return serverError("Error deleting post:", error);
  }
}
