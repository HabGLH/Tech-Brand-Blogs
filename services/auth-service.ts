import apiClient, { setAccessToken } from "./api-client";
import { AuthData, ApiResponse } from "@/types";

export const authService = {
  async login(credentials: any): Promise<ApiResponse<AuthData>> {
    const { data } = await apiClient.post<ApiResponse<AuthData>>("/auth/login", credentials);
    if (data.status === "success" && data.data.accessToken) {
      setAccessToken(data.data.accessToken);
    }
    return data;
  },

  async register(payload: any): Promise<ApiResponse<AuthData>> {
    const { data } = await apiClient.post<ApiResponse<AuthData>>("/auth/register", payload);
    if (data.status === "success" && data.data.accessToken) {
      setAccessToken(data.data.accessToken);
    }
    return data;
  },

  async logout(): Promise<ApiResponse<any>> {
    const { data } = await apiClient.post<ApiResponse<any>>("/auth/logout");
    setAccessToken(null);
    return data;
  },

  async refresh(): Promise<ApiResponse<AuthData>> {
    const { data } = await apiClient.post<ApiResponse<AuthData>>("/auth/refresh");
    if (data.status === "success" && data.data.accessToken) {
      setAccessToken(data.data.accessToken);
    }
    return data;
  },
};
