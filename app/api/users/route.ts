import User from "@/models/User";
import requireAdmin from "@/lib/middleware/role";
import { hash } from "bcryptjs";
import { ok, error } from "@/lib/api";
import { createHandler } from "@/lib/api-handler";

export const GET = createHandler(async (req: Request) => {
  const auth = requireAdmin(req);
  if (!auth.ok) {
    return error(auth.message, auth.status);
  }
  const users = await User.find({}).select("-passwordHash");
  return ok("Users fetched successfully", { users });
});

export const POST = createHandler(async (req: Request) => {
  const auth = requireAdmin(req);
  if (!auth.ok) {
    return error(auth.message, auth.status);
  }
  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password || !name) {
    return error("Email, password, and name are required", 400);
  }

  const role = body.role === "admin" ? "admin" : "user";
  const existingUser = await User.findOne({ email });
  if (existingUser) return error("Email already in use", 409);
  const passwordHash = await hash(password, 10);

  const newUser = new User({
    name,
    email,
    role,
    isBlocked: Boolean(body.isBlocked),
    passwordHash,
  });
  await newUser.save();
  const safeUser = await User.findById(newUser._id).select("-passwordHash");
  return ok("User created successfully", { user: safeUser }, 201);
});
