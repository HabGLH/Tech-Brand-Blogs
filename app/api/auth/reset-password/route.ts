import { compare, hash } from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/lib/db";
import { getUserFromRequest, hashToken } from "@/lib/auth";
import PasswordResetToken from "@/models/PasswordResetToken";
import { ok, error, serverError } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const { password, newPassword, token } = await req.json();
    if (!newPassword) return error("New password is required", 400);
    await dbConnect();

    if (token) {
      const storedToken = await PasswordResetToken.findOne({
        tokenHash: hashToken(token),
      });
      if (!storedToken) return error("Invalid or expired token", 400);
      const user = await User.findById(storedToken.userId).select(
        "+passwordHash",
      );
      if (!user) {
        await storedToken.deleteOne();
        return error("User not found", 404);
      }
      const hashedNewPassword = await hash(newPassword, 10);
      user.passwordHash = hashedNewPassword;
      await user.save();
      await storedToken.deleteOne();
      return ok("Password reset successfully", undefined, 200);
    }

    // Authenticated change-password flow (backward compatible)
    if (!password) return error("Current password is required", 400);
    const requestUser = getUserFromRequest(req);
    if (!requestUser?.userId) {
      return error("Unauthorized", 401);
    }
    const user = await User.findById(requestUser?.userId).select(
      "+passwordHash",
    );
    if (!user) return error("User not found", 404);
    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) return error("Current password is incorrect", 400);
    const hashedNewPassword = await hash(newPassword, 10);
    user.passwordHash = hashedNewPassword;
    await user.save();
    return ok("Password reset successfully", undefined, 200);
  } catch (error: unknown) {
    return serverError("Reset Password error:", error);
  }
}
