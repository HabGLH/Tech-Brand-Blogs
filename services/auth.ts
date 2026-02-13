import axiosInstance, { setAccessToken } from "@/lib/axios";
import { AuthResponse, LoginCredentials, RegisterCredentials } from "@/types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await axiosInstance.post("/auth/login", credentials);
    const data = res.data;
    if (data.status === "success") {
      setAccessToken(data.data.accessToken);
    }
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const res = await axiosInstance.post("/auth/register", credentials);
    const data = res.data;
    if (data.status === "success") {
      setAccessToken(data.data.accessToken);
    }
    return data;
  },

  async logout() {
    await axiosInstance.post("/auth/logout");
    setAccessToken(null);
  },

  async refreshToken(): Promise<string | null> {
    try {
      const res = await axiosInstance.post("/auth/refresh");
      const token = res.data.data.accessToken;
      setAccessToken(token);
      return token;
    } catch (error) {
      setAccessToken(null);
      return null;
    }
  },
};
