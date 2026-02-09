import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import requireAuth from "@/lib/middleware/authe";
import { ok, error, serverError } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const auth = requireAuth(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    const { searchParams } = new URL(req.url);
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit") || 20), 1),
      100,
    );

    await dbConnect();
    const [posts, total] = await Promise.all([
      Post.find({ authorId: auth.user.userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Post.countDocuments({ authorId: auth.user.userId }),
    ]);

    return ok("Posts fetched successfully", {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error: unknown) {
    return serverError("Error fetching posts:", error);
  }
}
