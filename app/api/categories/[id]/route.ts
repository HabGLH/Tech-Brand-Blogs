import { NextResponse as res } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import requireAdmin from "@/lib/middleware/role";
import { getIdFromRequest } from "@/lib/utils";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return res.json(
        { status: "error", message: auth.message },
        { status: auth.status },
      );
    }
    const body = await req.json();
    const id = (await params)?.id ?? getIdFromRequest(req);
    if (!id) {
      return res.json(
        { status: "error", message: "Category id is required" },
        { status: 400 },
      );
    }
    await dbConnect();
    const updatedCategory = await Category.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedCategory) {
      return res.json(
        { status: "error", message: "Category not found" },
        { status: 404 },
      );
    }
    return res.json({
      status: "success",
      message: "Category updated successfully",
      data: { category: updatedCategory },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error updating category";
    console.error("Error updating category:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return res.json(
        { status: "error", message: auth.message },
        { status: auth.status },
      );
    }
    const id = (await params)?.id ?? getIdFromRequest(req);
    if (!id) {
      return res.json(
        { status: "error", message: "Category id is required" },
        { status: 400 },
      );
    }
    await dbConnect();
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.json(
        { status: "error", message: "Category not found" },
        { status: 404 },
      );
    }
    return res.json({
      status: "success",
      message: "Category deleted successfully",
      data: { category: deletedCategory },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error deleting category";
    console.error("Error deleting category:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}
