/**
 * API Response Interfaces
 */
export interface ApiResponse<T = unknown> {
  status: "success" | "error";
  message: string;
  data: T;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedData<T> {
  posts: T[];
  categories?: T[];
  tags?: T[];
  users?: T[];
  pagination: PaginationInfo;
}

/**
 * User & Auth Types
 */
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isBlocked: boolean;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export type AuthResponse = ApiResponse<AuthData>;

export type LoginCredentials = Record<"email" | "password", string>;
export type RegisterCredentials = Record<"name" | "email" | "password", string>;

/**
 * Blog Types
 */
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
}

export interface SiteSettingsLink {
  label: string;
  href: string;
}

export interface HomeSettings {
  badge: string;
  title: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

export interface FooterSettings {
  brandName: string;
  description: string;
  companyLinks: SiteSettingsLink[];
  supportLinks: SiteSettingsLink[];
  legalLinks: SiteSettingsLink[];
  copyrightText: string;
}

export interface SiteSettingsData {
  home: HomeSettings;
  footer: FooterSettings;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl?: string;
  authorId: string | User;
  categoryId: string | Category;
  tagIds: (string | Tag)[];
  status: "draft" | "published";
  likesCount: number;
  commentsCount: number;
  likedByViewer?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  postId: string;
  authorId: string | User;
  createdAt: string;
  updatedAt: string;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;
export type IUser = User;

/**
 * Form / Payload Types
 */
export interface PostPayload {
  title: string;
  content: string;
  imageUrl?: string;
  status: "draft" | "published";
  categoryId?: string;
  tagIds?: string[];
  slug?: string;
}

export type PostFormData = PostPayload;
