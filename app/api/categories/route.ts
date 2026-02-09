import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { ok, serverError } from "@/lib/api";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({});
    return ok("Categories fetched successfully", { categories });
  } catch (error: unknown) {
    return serverError("Error fetching categories:", error);
  }
}
