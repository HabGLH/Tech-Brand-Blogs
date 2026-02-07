import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { NextResponse as res } from "next/server";

type Params = {
  params: { id: string };
};

export async function GET(req: Request, { params }: Params) {
  try {
    await dbConnect();
    const post = await Post.findById(params.id);
    if (!post) {
      return res.json(
        { status: "error", message: "Post not found" },
        { status: 404 },
      );
    }
    return res.json({
      status: "success",
      message: "Post fetched successfully",
      data: { post },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error fetching post";
    console.error("Error fetching post:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}
