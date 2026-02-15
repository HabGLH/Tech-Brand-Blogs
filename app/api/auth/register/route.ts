import User from "@/models/User";
import RefreshToken from "@/models/RefreshToken";
import { cookies } from "next/headers";
import { ok, error } from "@/lib/api";
import { createHandler } from "@/lib/api-handler";
import {
  buildAccessTokenPayload,
  signAccessToken,
  generateOpaqueToken,
  hashToken,
} from "@/lib/auth";
import { hash } from "bcryptjs";

export const POST = createHandler(async (req: Request) => {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return error("All fields are required", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return error("User already exists", 409);

  const hashedPassword = await hash(password, 10);

  const user = new User({
    name,
    email,
    passwordHash: hashedPassword,
  });

  await user.save();

  const accessToken = signAccessToken(buildAccessTokenPayload(user));
  const refreshToken = generateOpaqueToken();
  const refreshTokenExpires = Number(process.env.REFRESH_TOKEN_EXPIRES) || 14;

  const newRefreshToken = new RefreshToken({
    tokenHash: hashToken(refreshToken),
    userId: user._id,
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

  return ok("User registered successfully", { accessToken, refreshToken }, 201);
});
