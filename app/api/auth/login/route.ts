import dbConnect from "@/lib/db";
import User from "@/models/User";
import RefreshToken from "@/models/RefreshToken";
import { cookies } from "next/headers";
import { NextResponse as res } from "next/server";
import {
  buildAccessTokenPayload,
  signAccessToken,
  hashToken,
  generateOpaqueToken,
} from "@/lib/auth";
import { compare } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const refreshTokenExpires =
      Number(process.env.REFRESH_TOKEN_EXPIRES) || 14;
    if (!email || !password) {
      return res.json(
        { status: "error", message: "Email and password are required" },
        { status: 400 },
      );
    }
    await dbConnect();
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.json(
        { status: "error", message: "Invalid credentials" },
        { status: 401 },
      );
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.json(
        { status: "error", message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const accessToken = signAccessToken(buildAccessTokenPayload(user));
    const refreshToken = generateOpaqueToken();
    const newRefreshToken = new RefreshToken({
      token: hashToken(refreshToken),
      userId: user.id,
      expiresAt: new Date(
        Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000,
      ),
      createdByIp: req.headers.get("x-forwarded-for") || "unknown",
    });
    await newRefreshToken.save();
    const cookieStore = await cookies();
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: refreshTokenExpires * 24 * 60 * 60,
    });

    return res.json(
      {
        status: "success",
        message: "User successfully logged in",
        data: {
          accessToken,
          refreshToken,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error during login:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}
