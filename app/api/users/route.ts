import { NextResponse as res } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import requireAdmin from "@/lib/middleware/role";

export async function GET(req: Request) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return res.json(
        { status: "error", message: auth.message },
        { status: auth.status },
      );
    }
    await dbConnect();
    const users = await User.find({}).select("-password");
    return res.json({
      status: "success",
      message: "Users fetched successfully",
      data: { users },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error fetching users";
    console.error("Error fetching users:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return res.json(
        { status: "error", message: auth.message },
        { status: auth.status },
      );
    }
    const body = await req.json();
    if (!body.email || !body.password || !body.name) {
      return res.json(
        { status: "error", message: "Email, password, and name are required" },
        { status: 400 },
      );
    }
    await dbConnect();
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return res.json(
        { status: "error", message: "Email already in use" },
        { status: 409 },
      );
    }
    const newUser = new User(body);
    await newUser.save();
    return res.json({
      status: "success",
      message: "User created successfully",
      data: { user: newUser },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error creating user";
    console.error("Error creating user:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}
