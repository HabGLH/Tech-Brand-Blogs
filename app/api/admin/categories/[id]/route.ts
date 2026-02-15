import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import requireAdmin from "@/lib/middleware/role";
import { getIdFromRequest, slugify } from "@/lib/utils";
import { ok, error, serverError } from "@/lib/api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    const id = (await params)?.id ?? getIdFromRequest(req);
    if (!id) return error("Category id is required", 400);
    await dbConnect();
    const category = await Category.findById(id);
    if (!category) return error("Category not found", 404);
    return ok("Category fetched successfully", { category });
  } catch (error: unknown) {
    return serverError("Error fetching category:", error);
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
    const id = (await params)?.id ?? getIdFromRequest(req);
    if (!id) return error("Category id is required", 400);
    await dbConnect();

    const updatePayload: Record<string, unknown> = {};
    if (typeof body.name === "string") {
      updatePayload.name = body.name.trim();
    }
    if (body.slug !== undefined || updatePayload.name) {
      const baseSlug =
        typeof body.slug === "string" && body.slug.trim()
          ? body.slug
          : String(updatePayload.name ?? "");
      const normalizedSlug = slugify(baseSlug);
      if (!normalizedSlug) return error("Invalid category slug", 400);
      const existingCategory = await Category.findOne({
        slug: normalizedSlug,
        _id: { $ne: id },
      }).select("_id");
      if (existingCategory) return error("Category slug already exists", 409);
      updatePayload.slug = normalizedSlug;
    }
    if (!Object.keys(updatePayload).length) {
      return error("No valid fields provided for update", 400);
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });
    if (!updatedCategory) return error("Category not found", 404);
    return ok("Category updated successfully", { category: updatedCategory });
  } catch (error: unknown) {
    return serverError("Error updating category:", error);
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
    const id = (await params)?.id ?? getIdFromRequest(req);
    if (!id) return error("Category id is required", 400);
    await dbConnect();
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) return error("Category not found", 404);
    return ok("Category deleted successfully", { category: deletedCategory });
  } catch (error: unknown) {
    return serverError("Error deleting category:", error);
  }
}
