import apiClient, { setAccessToken } from "./api-client";
import {
  AuthData,
  ApiResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types";

type AuthPayloadWithUser = AuthData & { user: User };

const getCurrentUser = async (): Promise<User> => {
  const { data } =
    await apiClient.get<ApiResponse<{ user: User }>>("/users/me");
  return data.data.user;
};

export const authService = {
  async login(
    credentials: LoginCredentials,
  ): Promise<ApiResponse<AuthPayloadWithUser>> {
    const { data } = await apiClient.post<ApiResponse<AuthData>>(
      "/auth/login",
      credentials,
    );
    if (data.status === "success" && data.data.accessToken) {
      setAccessToken(data.data.accessToken);
      const user = await getCurrentUser();
      return {
        ...data,
        data: {
          ...data.data,
          user,
        },
      };
    }
    return data as ApiResponse<AuthPayloadWithUser>;
  },

  async register(
    payload: RegisterCredentials,
  ): Promise<ApiResponse<AuthPayloadWithUser>> {
    const { data } = await apiClient.post<ApiResponse<AuthData>>(
      "/auth/register",
      payload,
    );
    if (data.status === "success" && data.data.accessToken) {
      setAccessToken(data.data.accessToken);
      const user = await getCurrentUser();
      return {
        ...data,
        data: {
          ...data.data,
          user,
        },
      };
    }
    return data as ApiResponse<AuthPayloadWithUser>;
  },

  async logout(): Promise<ApiResponse<{ ok: true }>> {
    const { data } =
      await apiClient.post<ApiResponse<{ ok: true }>>("/auth/logout");
    setAccessToken(null);
    return data;
  },

  async refresh(): Promise<ApiResponse<AuthData>> {
    const { data } =
      await apiClient.post<ApiResponse<AuthData>>("/auth/refresh");
    if (data.status === "success" && data.data.accessToken) {
      setAccessToken(data.data.accessToken);
    }
    return data;
  },
};
