import axiosInstance from "@/lib/axios";
import { Post, ApiResponse, PaginatedResponse } from "@/types";

export const postService = {
  async getPosts(params?: Record<string, any>): Promise<PaginatedResponse<Post>> {
    const res = await axiosInstance.get("/posts", { params });
    return res.data;
  },

  async getPostById(id: string): Promise<ApiResponse<Post>> {
    const res = await axiosInstance.get(`/posts/${id}`);
    return res.data;
  },

  async createPost(data: Partial<Post>): Promise<ApiResponse<Post>> {
    const res = await axiosInstance.post("/posts", data);
    return res.data;
  },

  async updatePost(id: string, data: Partial<Post>): Promise<ApiResponse<Post>> {
    const res = await axiosInstance.patch(`/posts/${id}`, data);
    return res.data;
  },

  async deletePost(id: string): Promise<ApiResponse<null>> {
    const res = await axiosInstance.delete(`/posts/${id}`);
    return res.data;
  },
};
