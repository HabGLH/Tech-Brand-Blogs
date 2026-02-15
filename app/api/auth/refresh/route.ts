import { cookies } from "next/headers";
import {
  buildAccessTokenPayload,
  signAccessToken,
  hashToken,
  generateOpaqueToken,
} from "@/lib/auth";
import RefreshToken from "@/models/RefreshToken";
import User from "@/models/User";
import dbConnect from "@/lib/db";
import { ok, error, serverError } from "@/lib/api";

export async function POST() {
  try {
    const refreshToken = (await cookies()).get("refreshToken")?.value;
    if (!refreshToken) return error("No refresh token found", 400);
    await dbConnect();
    const storedToken = await RefreshToken.findOne({
      tokenHash: hashToken(refreshToken),
    });
    if (!storedToken) return error("Invalid refresh token", 401);
    const user = await User.findById(storedToken.userId);
    if (!user) return error("User not found", 404);
    if (user.isBlocked) {
      await storedToken.deleteOne();
      return error("User is blocked", 403);
    }
    const accessToken = signAccessToken(buildAccessTokenPayload(user));
    const refreshTokenExpires =
      Number(process.env.REFRESH_TOKEN_EXPIRES) || 14;
    const newRefreshToken = generateOpaqueToken();
    storedToken.tokenHash = hashToken(newRefreshToken);
    storedToken.expiresAt = new Date(
      Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000,
    );
    await storedToken.save();
    const cookieStore = await cookies();
    cookieStore.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: refreshTokenExpires * 24 * 60 * 60,
    });
    return ok("Token refreshed", {
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error: unknown) {
    return serverError("Refresh token error:", error);
  }
}
