import dbConnect from "@/lib/db";
import User from "@/models/User";
import requireAuth from "@/lib/middleware/authe";
import { hash } from "bcryptjs";
import { ok, error, serverError } from "@/lib/api";
import { deleteUserAndRelatedData } from "@/lib/user-cleanup";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params)?.id ?? new URL(req.url).searchParams.get("id");
    if (!id) return error("User id is required", 400);
    const auth = requireAuth(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    //user get only their own data or admin can get any user data
    if (auth.user?.userId !== id && auth.user?.role !== 777) {
      return error("Forbidden", 403);
    }
    await dbConnect();
    const user = await User.findById(id).select("-passwordHash");
    if (!user) return error("User not found", 404);
    return ok("User fetched successfully", { user });
  } catch (error: unknown) {
    return serverError("Error fetching user:", error);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params)?.id ?? new URL(req.url).searchParams.get("id");
    if (!id) return error("User id is required", 400);
    const auth = requireAuth(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    if (auth.user?.userId !== id && auth.user?.role !== 777) {
      return error("Forbidden", 403);
    }
    await dbConnect();
    const body = await req.json();
    const updatePayload: Record<string, unknown> = {};

    if (typeof body.name === "string") {
      updatePayload.name = body.name.trim();
    }

    if (typeof body.email === "string") {
      const normalizedEmail = body.email.trim().toLowerCase();
      const existingEmail = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      }).select("_id");
      if (existingEmail) {
        return error("Email already in use", 409);
      }
      updatePayload.email = normalizedEmail;
    }

    if (auth.user?.role === 777) {
      if (body.role && ["user", "admin"].includes(body.role)) {
        updatePayload.role = body.role;
      }
      if (typeof body.isBlocked === "boolean") {
        updatePayload.isBlocked = body.isBlocked;
      }
    }

    if (body.password) {
      if (auth.user?.role !== 777 && auth.user?.userId !== id) {
        return error("Forbidden", 403);
      }
      updatePayload.passwordHash = await hash(body.password, 10);
    }

    if (!Object.keys(updatePayload).length) {
      return error("No valid fields provided for update", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatePayload, {
      new: true,
    }).select("-passwordHash");
    if (!updatedUser) return error("User not found", 404);
    return ok("User updated successfully", { user: updatedUser });
  } catch (error: unknown) {
    return serverError("Error updating user:", error);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params)?.id ?? new URL(req.url).searchParams.get("id");
    if (!id) return error("User id is required", 400);
    const auth = requireAuth(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    if (auth.user?.userId !== id && auth.user?.role !== 777) {
      return error("Forbidden", 403);
    }
    await dbConnect();
    const deletedUser = await deleteUserAndRelatedData(id);
    if (!deletedUser) return error("User not found", 404);
    return ok("User deleted successfully", { user: deletedUser });
  } catch (error: unknown) {
    return serverError("Error deleting user:", error);
  }
}
