import { NextResponse as res } from "next/server";
import dbConnect from "@/lib/db";
import Tag from "@/models/Tag";
import requireAdmin from "@/lib/middleware/role";

export async function GET() {
  try {
    await dbConnect();
    const tags = await Tag.find({});
    return res.json({
      status: "success",
      message: "Tags fetched successfully",
      data: { tags },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error fetching tags";
    console.error("Error fetching tags:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return res.json(
        { status: "error", message: auth.message },
        { status: auth.status },
      );
    }
    const body = await req.json();
    if (!body.name || !body.slug) {
      return res.json(
        { status: "error", message: "Tag name and slug are required" },
        { status: 400 },
      );
    }
    await dbConnect();
    const newTag = new Tag(body);
    await newTag.save();
    return res.json({
      status: "success",
      message: "Tag created successfully",
      data: { tag: newTag },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error creating tag";
    console.error("Error creating tag:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}
