import dbConnect from "@/lib/db";
import Tag from "@/models/Tag";
import { ok, serverError } from "@/lib/api";

export async function GET() {
  try {
    await dbConnect();
    const tags = await Tag.find({});
    return ok("Tags fetched successfully", { tags });
  } catch (error: unknown) {
    return serverError("Error fetching tags:", error);
  }
}
