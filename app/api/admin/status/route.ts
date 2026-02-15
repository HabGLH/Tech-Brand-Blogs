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
    const user = await User.findById(auth.user.userId).select("role");
    if (!user) {
      return error("User not found", 404);
    }

    return ok("Admin status fetched successfully", {
      isAdmin: user.role === "admin",
    });
  } catch (err: unknown) {
    return serverError("Error fetching admin status:", err);
  }
}
