import Comment from "@/models/Comment";
import Like from "@/models/Like";
import PasswordResetToken from "@/models/PasswordResetToken";
import Post from "@/models/Post";
import RefreshToken from "@/models/RefreshToken";
import User from "@/models/User";

type CountByPost = {
  _id: string;
  count: number;
};

const applyPostCountDecrements = async (
  items: CountByPost[],
  field: "commentsCount" | "likesCount",
) => {
  if (!items.length) return;

  await Promise.all(
    items.map((item) =>
      Post.updateOne(
        { _id: item._id },
        { $inc: { [field]: -item.count } },
      ),
    ),
  );
};

export const deleteUserAndRelatedData = async (userId: string) => {
  const user = await User.findById(userId).select("-passwordHash");
  if (!user) return null;

  const authoredPosts = await Post.find({ authorId: userId }).select("_id");
  const authoredPostIds = authoredPosts.map((post) => post._id);

  if (authoredPostIds.length) {
    await Promise.all([
      Comment.deleteMany({ postId: { $in: authoredPostIds } }),
      Like.deleteMany({ postId: { $in: authoredPostIds } }),
      Post.deleteMany({ _id: { $in: authoredPostIds } }),
    ]);
  }

  const [commentCounts, likeCounts] = await Promise.all([
    Comment.aggregate<CountByPost>([
      {
        $match: {
          userId: user._id,
          ...(authoredPostIds.length
            ? { postId: { $nin: authoredPostIds } }
            : {}),
        },
      },
      { $group: { _id: "$postId", count: { $sum: 1 } } },
    ]),
    Like.aggregate<CountByPost>([
      {
        $match: {
          userId: user._id,
          ...(authoredPostIds.length
            ? { postId: { $nin: authoredPostIds } }
            : {}),
        },
      },
      { $group: { _id: "$postId", count: { $sum: 1 } } },
    ]),
  ]);

  await Promise.all([
    Comment.deleteMany({ userId: user._id }),
    Like.deleteMany({ userId: user._id }),
    RefreshToken.deleteMany({ userId: user._id }),
    PasswordResetToken.deleteMany({ userId: user._id }),
  ]);

  await Promise.all([
    applyPostCountDecrements(commentCounts, "commentsCount"),
    applyPostCountDecrements(likeCounts, "likesCount"),
  ]);

  await user.deleteOne();
  return user;
};

