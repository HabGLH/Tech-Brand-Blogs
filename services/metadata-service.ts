import apiClient from "./api-client";
import { Category, Tag, ApiResponse } from "@/types";

export const metadataService = {
  async getCategories(): Promise<ApiResponse<{ categories: Category[] }>> {
    const { data } = await apiClient.get<ApiResponse<{ categories: Category[] }>>("/categories");
    return data;
  },

  async getTags(): Promise<ApiResponse<{ tags: Tag[] }>> {
    const { data } = await apiClient.get<ApiResponse<{ tags: Tag[] }>>("/tags");
    return data;
  },
};
