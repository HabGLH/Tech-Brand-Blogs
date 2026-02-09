import Post from "@/models/Post";
import User from "@/models/User";
import requireAuth from "@/lib/middleware/authe";
import { getUserFromRequest } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { ok, error } from "@/lib/api";
import { createHandler } from "@/lib/api-handler";

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildSort = (value: string | null): Record<string, 1 | -1> => {
  switch (value) {
    case "createdAt":
      return { createdAt: 1 };
    case "-createdAt":
      return { createdAt: -1 };
    case "title":
      return { title: 1 };
    case "-title":
      return { title: -1 };
    default:
      return { createdAt: -1 };
  }
};

export const GET = createHandler(async (req: Request) => {
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
  const sort = buildSort(searchParams.get("sort"));

  const user = getUserFromRequest(req);
  let visibilityFilter: Record<string, unknown> = {};
  if (!user) {
    visibilityFilter = { status: "published" };
  } else if (user.role !== 777) {
    visibilityFilter = {
      $or: [
        { status: "published" },
        { status: "draft", authorId: user.userId },
      ],
    };
  }

  if (statusParam) {
    if (!["published", "draft"].includes(statusParam)) {
      return error("Invalid status filter.", 400);
    }
    if (statusParam === "draft") {
      if (!user) {
        return error("Unauthorized.", 401);
      }
      visibilityFilter =
        user.role === 777
          ? { status: "draft" }
          : { status: "draft", authorId: user.userId };
    } else {
      visibilityFilter = { status: "published" };
    }
  }

  const filter: Record<string, unknown> = {};
  if (search) {
    filter.title = { $regex: new RegExp(escapeRegExp(search), "i") };
  }
  if (authorId) filter.authorId = authorId;
  if (categoryId) filter.categoryId = categoryId;
  if (tagId) filter.tagIds = tagId;

  const andFilters = [];
  if (Object.keys(visibilityFilter).length) andFilters.push(visibilityFilter);
  if (Object.keys(filter).length) andFilters.push(filter);
  const finalFilter =
    andFilters.length > 1 ? { $and: andFilters } : andFilters[0] || {};

  const [posts, total] = await Promise.all([
    Post.find(finalFilter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Post.countDocuments(finalFilter),
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
});

export const POST = createHandler(async (req: Request) => {
  const auth = requireAuth(req);
  if (!auth.ok) {
    return error(auth.message, auth.status);
  }
  const body = await req.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!title || !content) {
    return error("Title and content are required", 400);
  }
  const status = body.status ?? "draft";
  if (status && !["draft", "published"].includes(status)) {
    return error("Invalid status value.", 400);
  }
  const slugInput =
    typeof body.slug === "string" && body.slug.trim() ? body.slug : title;
  const slug = slugify(slugInput);
  if (!slug) {
    return error("Invalid slug.", 400);
  }
  const user = await User.findById(auth.user.userId).select("isBlocked");
  if (!user) return error("User not found", 404);
  if (user.isBlocked) return error("User is blocked", 403);
  const existingSlug = await Post.findOne({ slug }).select("_id");
  if (existingSlug) return error("Slug already in use.", 409);
  const tagIds = Array.isArray(body.tagIds)
    ? body.tagIds
    : Array.isArray(body.tags)
      ? body.tags
      : [];
  const newPost = new Post({
    title,
    slug,
    content,
    imageUrl: body.imageUrl,
    authorId: auth.user.userId,
    categoryId: body.categoryId,
    tagIds,
    status,
  });
  await newPost.save();
  return ok("Post created successfully", { post: newPost }, 201);
});
