import { randomBytes, createHash } from "crypto";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "@/types/custom";

export const hashToken = (token: string) => {
  return createHash("sha256").update(token).digest("hex");
};

export const generateOpaqueToken = () => {
  return randomBytes(40).toString("hex");
};

export const signAccessToken = (payload: CustomJwtPayload): string => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "1h",
  });
};

export const getRoleCode = (role: unknown): number =>
  role === "admin" ? 777 : 555;

export const buildAccessTokenPayload = (user: {
  _id: { toString(): string } | string;
  email: string;
  role?: unknown;
}): CustomJwtPayload => ({
  userId: typeof user._id === "string" ? user._id : user._id.toString(),
  email: user.email,
  role: getRoleCode(user.role),
});
export const verifyAccessToken = (token: string): CustomJwtPayload => {
  return jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
  ) as CustomJwtPayload;
};

export function getUserFromRequest(req: Request): CustomJwtPayload | null {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];

  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}
