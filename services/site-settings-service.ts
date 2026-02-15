import apiClient from "./api-client";
import { ApiResponse, SiteSettingsData } from "@/types";

export const siteSettingsService = {
  async getSettings(): Promise<ApiResponse<{ settings: SiteSettingsData }>> {
    const { data } = await apiClient.get<ApiResponse<{ settings: SiteSettingsData }>>(
      "/settings",
    );
    return data;
  },
};
