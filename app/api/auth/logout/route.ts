import { NextResponse as res } from "next/server";
import { cookies } from "next/headers";
import { hashToken } from "@/lib/auth";
import RefreshToken from "@/models/RefreshToken";
import dbConnect from "@/lib/db";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) {
      return res.json(
        { status: "error", message: "No refresh token found" },
        { status: 400 },
      );
    }
    await dbConnect();
    await RefreshToken.deleteOne({ token: hashToken(refreshToken) });
    cookieStore.delete("refreshToken"); // Clear the refresh token cookie
    return res.json({ status: "success", message: "Logged out successfully" });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error logging out";
    console.log("Logout error:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}
