import dbConnect from "@/lib/db";
import User from "@/models/User";
import requireAdmin from "@/lib/middleware/role";
import { ok, error, serverError } from "@/lib/api";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    const { id } = await params;
    if (!id) return error("User id is required", 400);
    await dbConnect();
    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true },
    ).select("-passwordHash");
    if (!user) return error("User not found", 404);
    return ok("User blocked successfully", { user });
  } catch (error: unknown) {
    return serverError("Error blocking user:", error);
  }
}
