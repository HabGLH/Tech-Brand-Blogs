import { cookies } from "next/headers";
import { hashToken } from "@/lib/auth";
import RefreshToken from "@/models/RefreshToken";
import dbConnect from "@/lib/db";
import { ok, error, serverError } from "@/lib/api";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) return error("No refresh token found", 400);
    await dbConnect();
    await RefreshToken.deleteOne({ tokenHash: hashToken(refreshToken) });
    cookieStore.delete("refreshToken"); // Clear the refresh token cookie
    return ok("Logged out successfully");
  } catch (error: unknown) {
    return serverError("Logout error:", error);
  }
}
