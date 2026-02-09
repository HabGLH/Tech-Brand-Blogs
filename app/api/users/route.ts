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
  if (!body.email || !body.password || !body.name) {
    return error("Email, password, and name are required", 400);
  }
  const existingUser = await User.findOne({ email: body.email });
  if (existingUser) return error("Email already in use", 409);
  const passwordHash = await hash(body.password, 10);
  const newUser = new User({
    ...body,
    passwordHash,
  });
  await newUser.save();
  const safeUser = await User.findById(newUser._id).select("-passwordHash");
  return ok("User created successfully", { user: safeUser }, 201);
});
