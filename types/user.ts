export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | 777; // 777 usually means super admin based on code I saw
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  passwordHash?: string; // Optional as it's often excluded
}

export type UserRole = "user" | "admin" | 777;
