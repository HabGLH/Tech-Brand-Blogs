import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import requireAdmin from "@/lib/middleware/role";
import { ok, error, serverError } from "@/lib/api";

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function GET(req: Request) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const authorId = searchParams.get("authorId");
    const categoryId = searchParams.get("categoryId");
    const tagId = searchParams.get("tagId");
    const statusParam = searchParams.get("status");
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit") || 20), 1),
      100,
    );

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.title = { $regex: new RegExp(escapeRegExp(search), "i") };
    }
    if (authorId) filter.authorId = authorId;
    if (categoryId) filter.categoryId = categoryId;
    if (tagId) filter.tagIds = tagId;
    if (statusParam) filter.status = statusParam;

    await dbConnect();
    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Post.countDocuments(filter),
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
