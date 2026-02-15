import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import requireAdmin from "@/lib/middleware/role";
import { slugify } from "@/lib/utils";
import { ok, error, serverError } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    await dbConnect();
    const categories = await Category.find({});
    return ok("Categories fetched successfully", { categories });
  } catch (error: unknown) {
    return serverError("Error fetching categories:", error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const slugInput =
      typeof body.slug === "string" && body.slug.trim() ? body.slug : name;
    const slug = slugify(slugInput);

    if (!name) return error("Category name is required", 400);
    if (!slug) return error("Invalid category slug", 400);

    await dbConnect();
    const existingCategory = await Category.findOne({ slug }).select("_id");
    if (existingCategory) return error("Category slug already exists", 409);

    const newCategory = new Category({ name, slug });
    await newCategory.save();
    return ok("Category created successfully", { category: newCategory }, 201);
  } catch (error: unknown) {
    return serverError("Error creating category:", error);
  }
}
