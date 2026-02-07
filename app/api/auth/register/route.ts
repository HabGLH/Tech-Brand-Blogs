import dbConnect from "@/lib/db";
import User from "@/models/User";
import RefreshToken from "@/models/RefreshToken";
import { cookies } from "next/headers";
import { NextResponse as res } from "next/server";
import {
  buildAccessTokenPayload,
  signAccessToken,
  generateOpaqueToken,
  hashToken,
} from "@/lib/auth";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return res.json(
        { status: "error", message: "All fields are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json(
        { status: "error", message: "User already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const accessToken = signAccessToken(buildAccessTokenPayload(user));
    const refreshToken = generateOpaqueToken();
    const refreshTokenExpires =
      Number(process.env.REFRESH_TOKEN_EXPIRES) || 14;

    const newRefreshToken = new RefreshToken({
      token: hashToken(refreshToken),
      userId: user._id,
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
        message: "User registered successfully",
        data: {
          accessToken,
          refreshToken,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown registration error";
    console.error("Error in registration:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}
