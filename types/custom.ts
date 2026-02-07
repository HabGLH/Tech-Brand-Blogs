//custom paylod for jwt
import { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  role: number;
}
