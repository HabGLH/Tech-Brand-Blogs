import { NextResponse as res } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import requireAdmin from "@/lib/middleware/role";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({});
    return res.json({
      status: "success",
      message: "Categories fetched successfully",
      data: { categories },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error fetching categories";
    console.error("Error fetching categories:", errorMessage);
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
        { status: "error", message: "Category name and slug are required" },
        { status: 400 },
      );
    }
    await dbConnect();
    const newCategory = new Category(body);
    await newCategory.save();
    return res.json({
      status: "success",
      message: "Category created successfully",
      data: { category: newCategory },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error creating category";
    console.error("Error creating category:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}
