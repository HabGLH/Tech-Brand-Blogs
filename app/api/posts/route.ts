import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { PostData } from "@/types/post";
import { NextResponse as res } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const posts = await Post.find({});
    return res.json({
      status: "success",
      message: "Posts fetched successfully",
      data: { posts },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error fetching posts";
    console.error("Error fetching posts:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: PostData = await req.json();
    const user = getUserFromRequest(req);
    if (!user?.userId) {
      return res.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 },
      );
    }
    await dbConnect();
    const newPost = new Post({ ...body, authorId: user.userId });
    await newPost.save();
    return res.json({
      status: "success",
      message: "Post created successfully",
      data: { post: newPost },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error creating post";
    console.error("Error creating post:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}
