import { getUserFromRequest } from "@/lib/auth";
import { CustomJwtPayload } from "@/types/custom";

type AuthResult =
  | { ok: true; user: CustomJwtPayload }
  | { ok: false; status: number; message: string };

export default function requireAdmin(req: Request): AuthResult {
  const user = getUserFromRequest(req);
  if (!user?.userId) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }
  if (user.role !== 777) {
    return { ok: false, status: 403, message: "Forbidden" };
  }
  return { ok: true, user };
}
