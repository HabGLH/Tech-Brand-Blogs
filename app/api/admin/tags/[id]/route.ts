import dbConnect from "@/lib/db";
import Tag from "@/models/Tag";
import requireAdmin from "@/lib/middleware/role";

import { ok, error, serverError } from "@/lib/api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) return error("Tag id is required", 400);
    await dbConnect();
    const tag = await Tag.findById(id);
    if (!tag) return error("Tag not found", 404);
    return ok("Tag fetched successfully", { tag });
  } catch (error: unknown) {
    return serverError("Error fetching tag:", error);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    const body = await req.json();
    const { id } = await params;
    if (!id) return error("Tag id is required", 400);
    await dbConnect();
    const updatedTag = await Tag.findByIdAndUpdate(id, body, { new: true });
    if (!updatedTag) return error("Tag not found", 404);
    return ok("Tag updated successfully", { tag: updatedTag });
  } catch (error: unknown) {
    return serverError("Error updating tag:", error);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    const { id } = await params;
    if (!id) return error("Tag id is required", 400);
    await dbConnect();
    const deletedTag = await Tag.findByIdAndDelete(id);
    if (!deletedTag) return error("Tag not found", 404);
    return ok("Tag deleted successfully", { tag: deletedTag });
  } catch (error: unknown) {
    return serverError("Error deleting tag:", error);
  }
}
