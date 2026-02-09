import { IUser } from "./user";

export interface IPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl?: string;
  authorId: string | IUser; // Could be populated
  categoryId?: string; // Could be populated
  tagIds: string[]; // Could be populated
  status: "draft" | "published";
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export type PostStatus = "draft" | "published";
