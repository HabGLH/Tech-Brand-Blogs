import { ok, error, serverError } from "@/lib/api";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import { generateOpaqueToken, hashToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return error("Email is required", 400);

    await dbConnect();
    const user = await User.findOne({ email }).select("_id isBlocked");

    // Always return success to avoid account enumeration
    if (!user || user.isBlocked) {
      return ok("If the email exists, a reset link will be sent.");
    }

    const resetToken = generateOpaqueToken();
    const resetTokenExpiresHours =
      Number(process.env.RESET_TOKEN_EXPIRES_HOURS) || 2;

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash: hashToken(resetToken),
      expiresAt: new Date(Date.now() + resetTokenExpiresHours * 60 * 60 * 1000),
    });

    // No email service wired; return token for now.
    return ok("Password reset token created.", { resetToken });
  } catch (error: unknown) {
    return serverError("Forgot Password error:", error);
  }
}
