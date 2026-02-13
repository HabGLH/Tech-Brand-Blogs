import apiClient from "./api-client";
import { Post, ApiResponse, PaginatedData, PostPayload } from "@/types";

export const postService = {
  async getAll(params: Record<string, any> = {}): Promise<ApiResponse<PaginatedData<Post>>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedData<Post>>>("/posts", { params });
    return data;
  },

  async getBySlug(slug: string): Promise<ApiResponse<{ post: Post }>> {
    const { data } = await apiClient.get<ApiResponse<{ post: Post }>>(`/posts/${slug}`);
    return data;
  },

  async create(payload: PostPayload): Promise<ApiResponse<{ post: Post }>> {
    const { data } = await apiClient.post<ApiResponse<{ post: Post }>>("/posts", payload);
    return data;
  },

  async update(id: string, payload: PostPayload): Promise<ApiResponse<{ post: Post }>> {
    const { data } = await apiClient.patch<ApiResponse<{ post: Post }>>(`/posts/${id}`, payload);
    return data;
  },

  async delete(id: string): Promise<ApiResponse<any>> {
    const { data } = await apiClient.delete<ApiResponse<any>>(`/posts/${id}`);
    return data;
  },
};
