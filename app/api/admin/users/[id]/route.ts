import dbConnect from "@/lib/db";
import User from "@/models/User";
import requireAdmin from "@/lib/middleware/role";
import { ok, error, serverError } from "@/lib/api";

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
    if (!id) return error("User id is required", 400);
    await dbConnect();
    const deletedUser = await User.findByIdAndDelete(id).select(
      "-passwordHash",
    );
    if (!deletedUser) return error("User not found", 404);
    return ok("User deleted successfully", { user: deletedUser });
  } catch (error: unknown) {
    return serverError("Error deleting user:", error);
  }
}
