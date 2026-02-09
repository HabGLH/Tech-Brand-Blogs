import dbConnect from "@/lib/db";
import Tag from "@/models/Tag";
import requireAdmin from "@/lib/middleware/role";
import { ok, error, serverError } from "@/lib/api";

export async function GET() {
  try {
    await dbConnect();
    const tags = await Tag.find({});
    return ok("Tags fetched successfully", { tags });
  } catch (error: unknown) {
    return serverError("Error fetching tags:", error);
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
      return error("Tag name and slug are required", 400);
    }
    await dbConnect();
    const newTag = new Tag(body);
    await newTag.save();
    return ok("Tag created successfully", { tag: newTag }, 201);
  } catch (error: unknown) {
    return serverError("Error creating tag:", error);
  }
}
