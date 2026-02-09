import dbConnect from "@/lib/db";
import User from "@/models/User";
import requireAuth from "@/lib/middleware/authe";
import { ok, error, serverError } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const auth = requireAuth(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    await dbConnect();
    const user = await User.findById(auth.user.userId).select("-passwordHash");
    if (!user) return error("User not found", 404);
    return ok("User fetched successfully", { user });
  } catch (error: unknown) {
    return serverError("Error fetching user:", error);
  }
}

export async function PUT(req: Request) {
  try {
    const auth = requireAuth(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    const body = await req.json();
    // Do not allow role or password changes here
    if (body.role || body.password || body.passwordHash || body.isBlocked) {
      return error("Forbidden", 403);
    }
    await dbConnect();
    const updatedUser = await User.findByIdAndUpdate(auth.user.userId, body, {
      new: true,
    }).select("-passwordHash");
    if (!updatedUser) return error("User not found", 404);
    return ok("User updated successfully", { user: updatedUser });
  } catch (error: unknown) {
    return serverError("Error updating user:", error);
  }
}
