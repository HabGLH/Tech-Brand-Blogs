import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import requireAdmin from "@/lib/middleware/role";
import { ok, error, serverError } from "@/lib/api";

export async function GET() {
  try {
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
    if (!body.name || !body.slug) {
      return error("Category name and slug are required", 400);
    }
    await dbConnect();
    const newCategory = new Category(body);
    await newCategory.save();
    return ok("Category created successfully", { category: newCategory }, 201);
  } catch (error: unknown) {
    return serverError("Error creating category:", error);
  }
}
