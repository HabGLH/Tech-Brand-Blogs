import apiClient from "./api-client";
import { ApiResponse, Category, SiteSettingsData, Tag } from "@/types";

type CategoryPayload = {
  name: string;
  slug?: string;
};

type TagPayload = {
  name: string;
  slug?: string;
};

export interface AdminOverviewMetrics {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalCategories: number;
  totalTags: number;
  totalLikes: number;
  totalComments: number;
  publishRate: number;
}

export interface AdminOverviewDraft {
  _id: string;
  title: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOverviewUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isBlocked: boolean;
  createdAt: string;
}

export interface AdminOverviewData {
  metrics: AdminOverviewMetrics;
  recentDrafts: AdminOverviewDraft[];
  recentUsers: AdminOverviewUser[];
}

export const adminService = {
  async getStatus(): Promise<ApiResponse<{ isAdmin: boolean }>> {
    const { data } = await apiClient.get<ApiResponse<{ isAdmin: boolean }>>("/admin/status");
    return data;
  },

  async getOverview(): Promise<ApiResponse<AdminOverviewData>> {
    const { data } = await apiClient.get<ApiResponse<AdminOverviewData>>("/admin/overview");
    return data;
  },

  async getCategories(): Promise<ApiResponse<{ categories: Category[] }>> {
    const { data } = await apiClient.get<ApiResponse<{ categories: Category[] }>>(
      "/admin/categories",
    );
    return data;
  },

  async createCategory(payload: CategoryPayload): Promise<ApiResponse<{ category: Category }>> {
    const { data } = await apiClient.post<ApiResponse<{ category: Category }>>(
      "/admin/categories",
      payload,
    );
    return data;
  },

  async updateCategory(
    id: string,
    payload: CategoryPayload,
  ): Promise<ApiResponse<{ category: Category }>> {
    const { data } = await apiClient.put<ApiResponse<{ category: Category }>>(
      `/admin/categories/${id}`,
      payload,
    );
    return data;
  },

  async deleteCategory(id: string): Promise<ApiResponse<{ category: Category }>> {
    const { data } = await apiClient.delete<ApiResponse<{ category: Category }>>(
      `/admin/categories/${id}`,
    );
    return data;
  },

  async getTags(): Promise<ApiResponse<{ tags: Tag[] }>> {
    const { data } = await apiClient.get<ApiResponse<{ tags: Tag[] }>>("/admin/tags");
    return data;
  },

  async createTag(payload: TagPayload): Promise<ApiResponse<{ tag: Tag }>> {
    const { data } = await apiClient.post<ApiResponse<{ tag: Tag }>>("/admin/tags", payload);
    return data;
  },

  async updateTag(id: string, payload: TagPayload): Promise<ApiResponse<{ tag: Tag }>> {
    const { data } = await apiClient.put<ApiResponse<{ tag: Tag }>>(
      `/admin/tags/${id}`,
      payload,
    );
    return data;
  },

  async deleteTag(id: string): Promise<ApiResponse<{ tag: Tag }>> {
    const { data } = await apiClient.delete<ApiResponse<{ tag: Tag }>>(`/admin/tags/${id}`);
    return data;
  },

  async getSettings(): Promise<ApiResponse<{ settings: SiteSettingsData }>> {
    const { data } = await apiClient.get<ApiResponse<{ settings: SiteSettingsData }>>(
      "/admin/settings",
    );
    return data;
  },

  async updateSettings(
    settings: SiteSettingsData,
  ): Promise<ApiResponse<{ settings: SiteSettingsData }>> {
    const { data } = await apiClient.put<ApiResponse<{ settings: SiteSettingsData }>>(
      "/admin/settings",
      { settings },
    );
    return data;
  },
};
