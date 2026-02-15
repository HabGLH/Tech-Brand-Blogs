import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";
import Category from "@/models/Category";
import Tag from "@/models/Tag";
import requireAdmin from "@/lib/middleware/role";
import { ok, error, serverError } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }

    await dbConnect();

    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalUsers,
      activeUsers,
      blockedUsers,
      totalCategories,
      totalTags,
      engagement,
      recentDrafts,
      recentUsers,
    ] = await Promise.all([
      Post.countDocuments({}),
      Post.countDocuments({ status: "published" }),
      Post.countDocuments({ status: "draft" }),
      User.countDocuments({}),
      User.countDocuments({ isBlocked: false }),
      User.countDocuments({ isBlocked: true }),
      Category.countDocuments({}),
      Tag.countDocuments({}),
      Post.aggregate([
        {
          $group: {
            _id: null,
            totalLikes: { $sum: "$likesCount" },
            totalComments: { $sum: "$commentsCount" },
          },
        },
      ]),
      Post.find({ status: "draft" })
        .select("title createdAt updatedAt likesCount commentsCount")
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean(),
      User.find({})
        .select("name email role isBlocked createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const totalLikes = engagement[0]?.totalLikes ?? 0;
    const totalComments = engagement[0]?.totalComments ?? 0;

    return ok("Overview data fetched successfully", {
      metrics: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalUsers,
        activeUsers,
        blockedUsers,
        totalCategories,
        totalTags,
        totalLikes,
        totalComments,
        publishRate: totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0,
      },
      recentDrafts,
      recentUsers,
    });
  } catch (err: unknown) {
    return serverError("Error fetching admin overview:", err);
  }
}
