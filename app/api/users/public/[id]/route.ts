import dbConnect from "@/lib/db";
import User from "@/models/User";
import { ok, error, serverError } from "@/lib/api";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params)?.id;
    if (!id) return error("User id is required", 400);

    await dbConnect();
    const user = await User.findById(id)
      .select("name role bio location website twitter linkedin avatarUrl createdAt")
      .lean();

    if (!user) return error("User not found", 404);

    return ok("Public user fetched successfully", { user });
  } catch (err: unknown) {
    return serverError("Error fetching public user:", err);
  }
}
