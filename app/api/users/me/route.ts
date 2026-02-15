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
    const updatePayload: Record<string, unknown> = {};
    if (typeof body.name === "string") {
      updatePayload.name = body.name.trim();
    }
    if (typeof body.email === "string") {
      const normalizedEmail = body.email.trim().toLowerCase();
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: auth.user.userId },
      }).select("_id");
      if (existingUser) return error("Email already in use", 409);
      updatePayload.email = normalizedEmail;
    }
    if (typeof body.bio === "string") {
      updatePayload.bio = body.bio.trim().slice(0, 500);
    }
    if (typeof body.location === "string") {
      updatePayload.location = body.location.trim().slice(0, 120);
    }
    if (typeof body.website === "string") {
      updatePayload.website = body.website.trim().slice(0, 200);
    }
    if (typeof body.twitter === "string") {
      updatePayload.twitter = body.twitter.trim().slice(0, 120);
    }
    if (typeof body.linkedin === "string") {
      updatePayload.linkedin = body.linkedin.trim().slice(0, 120);
    }
    if (typeof body.avatarUrl === "string") {
      updatePayload.avatarUrl = body.avatarUrl.trim().slice(0, 500);
    }
    if (!Object.keys(updatePayload).length) {
      return error("No valid fields provided for update", 400);
    }
    const updatedUser = await User.findByIdAndUpdate(auth.user.userId, updatePayload, {
      new: true,
    }).select("-passwordHash");
    if (!updatedUser) return error("User not found", 404);
    return ok("User updated successfully", { user: updatedUser });
  } catch (error: unknown) {
    return serverError("Error updating user:", error);
  }
}
