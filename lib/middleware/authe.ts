import { getUserFromRequest } from "@/lib/auth";
import { CustomJwtPayload } from "@/types/custom";

type AuthResult =
  | { ok: true; user: CustomJwtPayload }
  | { ok: false; status: number; message: string };

export default function requireAuth(req: Request): AuthResult {
  const user = getUserFromRequest(req);
  if (!user?.userId) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }
  return { ok: true, user };
}
