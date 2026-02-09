import dbConnect from "@/lib/db";
import User from "@/models/User";
import requireAdmin from "@/lib/middleware/role";
import { ok, error, serverError } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }
    await dbConnect();
    const users = await User.find({}).select("-passwordHash");
    return ok("Users fetched successfully", { users });
  } catch (error: unknown) {
    return serverError("Error fetching users:", error);
  }
}
