import { NextResponse as res } from "next/server";
import { compare, hash } from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password, newPassword } = await req.json();
    if (!password || !newPassword) {
      return res.json(
        { status: "error", message: "Password and new password are required" },
        { status: 400 },
      );
    }
    const requestUser = getUserFromRequest(req);
    if (!requestUser?.userId) {
      return res.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 },
      );
    }
    await dbConnect();
    const user = await User.findById(requestUser?.userId).select("+password");
    if (!user) {
      return res.json(
        { status: "error", message: "User not found" },
        { status: 404 },
      );
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.json(
        { status: "error", message: "Current password is incorrect" },
        { status: 400 },
      );
    }
    const hashedNewPassword = await hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    return res.json(
      { status: "success", message: "Password reset successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error resetting password";
    console.log("Reset Password error:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}
