import User from "@/models/User";
import RefreshToken from "@/models/RefreshToken";
import { cookies } from "next/headers";
import { ok, error } from "@/lib/api";
import { createHandler } from "@/lib/api-handler";
import {
  buildAccessTokenPayload,
  signAccessToken,
  hashToken,
  generateOpaqueToken,
} from "@/lib/auth";
import { compare } from "bcryptjs";

export const POST = createHandler(async (req: Request) => {
  const { email, password } = await req.json();
  const refreshTokenExpires = Number(process.env.REFRESH_TOKEN_EXPIRES) || 14;
  if (!email || !password) {
    return error("Email and password are required", 400);
  }
  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user) return error("Invalid credentials", 401);
  if (user.isBlocked) return error("User is blocked", 403);
  const isPasswordValid = await compare(password, user.passwordHash);
  if (!isPasswordValid) return error("Invalid credentials", 401);

  const accessToken = signAccessToken(buildAccessTokenPayload(user));
  const refreshToken = generateOpaqueToken();
  const newRefreshToken = new RefreshToken({
    tokenHash: hashToken(refreshToken),
    userId: user.id,
    expiresAt: new Date(Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000),
    createdByIp: req.headers.get("x-forwarded-for") || "unknown",
  });
  await newRefreshToken.save();
  const cookieStore = await cookies();
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: refreshTokenExpires * 24 * 60 * 60,
  });

  return ok(
    "User successfully logged in",
    { accessToken, refreshToken },
    200,
  );
});
