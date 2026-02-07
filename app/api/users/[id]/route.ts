import { NextResponse as res } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import requireAuth from "@/lib/middleware/authe";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params)?.id ?? new URL(req.url).searchParams.get("id");
    if (!id) {
      return res.json(
        { status: "error", message: "User id is required" },
        { status: 400 },
      );
    }
    const auth = requireAuth(req);
    if (!auth.ok) {
      return res.json(
        { status: "error", message: auth.message },
        { status: auth.status },
      );
    }
    //user get only their own data or admin can get any user data
    if (auth.user?.userId !== id && auth.user?.role !== 777) {
      return res.json(
        { status: "error", message: "Forbidden" },
        { status: 403 },
      );
    }
    await dbConnect();
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.json(
        { status: "error", message: "User not found" },
        { status: 404 },
      );
    }
    return res.json({
      status: "success",
      message: "User fetched successfully",
      data: { user },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error fetching user";
    console.error("Error fetching user:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params)?.id ?? new URL(req.url).searchParams.get("id");
    if (!id) {
      return res.json(
        { status: "error", message: "User id is required" },
        { status: 400 },
      );
    }
    const auth = requireAuth(req);
    if (!auth.ok) {
      return res.json(
        { status: "error", message: auth.message },
        { status: auth.status },
      );
    }
    if (auth.user?.userId !== id && auth.user?.role !== 777) {
      return res.json(
        { status: "error", message: "Forbidden" },
        { status: 403 },
      );
    }
    const body = await req.json();
    if (auth.user?.role !== 777) {
      if (body.role || body.password) {
        return res.json(
          { status: "error", message: "Forbidden" },
          { status: 403 },
        );
      }
    }
    await dbConnect();
    const updatedUser = await User.findByIdAndUpdate(id, body, {
      new: true,
    }).select("-password");
    if (!updatedUser) {
      return res.json(
        { status: "error", message: "User not found" },
        { status: 404 },
      );
    }
    return res.json({
      status: "success",
      message: "User updated successfully",
      data: { user: updatedUser },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error updating user";
    console.error("Error updating user:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params)?.id ?? new URL(req.url).searchParams.get("id");
    if (!id) {
      return res.json(
        { status: "error", message: "User id is required" },
        { status: 400 },
      );
    }
    const auth = requireAuth(req);
    if (!auth.ok) {
      return res.json(
        { status: "error", message: auth.message },
        { status: auth.status },
      );
    }
    if (auth.user?.userId !== id && auth.user?.role !== 777) {
      return res.json(
        { status: "error", message: "Forbidden" },
        { status: 403 },
      );
    }
    await dbConnect();
    const deletedUser = await User.findByIdAndDelete(id).select("-password");
    if (!deletedUser) {
      return res.json(
        { status: "error", message: "User not found" },
        { status: 404 },
      );
    }
    return res.json({
      status: "success",
      message: "User deleted successfully",
      data: { user: deletedUser },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "error deleting user";
    console.error("Error deleting user:", errorMessage);
    return res.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}
