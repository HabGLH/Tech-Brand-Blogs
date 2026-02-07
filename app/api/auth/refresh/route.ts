import { NextResponse as res } from "next/server";
import { cookies } from "next/headers";
import { buildAccessTokenPayload, signAccessToken, hashToken } from "@/lib/auth";
import RefreshToken from "@/models/RefreshToken";
import User from "@/models/User";
import dbConnect from "@/lib/db";

export async function POST() {
  try {
    const refreshToken = (await cookies()).get("refreshToken")?.value;
    if (!refreshToken) {
      return res.json(
        { status: "error", message: "No refresh token found" },
        { status: 400 },
      );
    }
    await dbConnect();
    const storedToken = await RefreshToken.findOne({
      token: hashToken(refreshToken),
    });
    if (!storedToken) {
      return res.json(
        { status: "error", message: "Invalid refresh token" },
        { status: 401 },
      );
    }
    const user = await User.findById(storedToken.userId);
    if (!user) {
      return res.json(
        { status: "error", message: "User not found" },
        { status: 404 },
      );
    }
    const accessToken = signAccessToken(buildAccessTokenPayload(user));
    return res.json({
      status: "success",
      message: "Token refreshed",
      data: { accessToken },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error refreshing token";
    console.log("Refresh token error:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}
