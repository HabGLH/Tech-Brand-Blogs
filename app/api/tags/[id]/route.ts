import { NextResponse as res } from "next/server";
import dbConnect from "@/lib/db";
import Tag from "@/models/Tag";
import { getIdFromRequest } from "@/lib/utils";
import requireAdmin from "@/lib/middleware/role";

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
        { status: "error", message: "Tag id is required" },
        { status: 400 },
      );
    }
    await dbConnect();
    const updatedTag = await Tag.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedTag) {
      return res.json(
        { status: "error", message: "Tag not found" },
        { status: 404 },
      );
    }
    return res.json({
      status: "success",
      message: "Tag updated successfully",
      data: { tag: updatedTag },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error updating tag";
    console.error("Error updating tag:", errorMessage);
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
        { status: "error", message: "Tag id is required" },
        { status: 400 },
      );
    }
    await dbConnect();
    const deletedTag = await Tag.findByIdAndDelete(id);
    if (!deletedTag) {
      return res.json(
        { status: "error", message: "Tag not found" },
        { status: 404 },
      );
    }
    return res.json({
      status: "success",
      message: "Tag deleted successfully",
      data: { tag: deletedTag },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error deleting tag";
    console.error("Error deleting tag:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}
