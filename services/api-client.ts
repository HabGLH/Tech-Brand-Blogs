import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const ACCESS_TOKEN_STORAGE_KEY = "accessToken";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let accessToken: string | null = null;

const canUseStorage = () => typeof window !== "undefined";

const readStoredAccessToken = (): string | null => {
  if (!canUseStorage()) return null;
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
};

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (!canUseStorage()) return;
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }
};

export const getAccessToken = (): string | null => accessToken;

export const hydrateAccessToken = () => {
  if (accessToken) return;
  accessToken = readStoredAccessToken();
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!accessToken) {
      hydrateAccessToken();
    }
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const requestUrl = originalRequest?.url ?? "";
    const isAuthEndpoint = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"]
      .some((path) => requestUrl.includes(path));

    // Handle 401 Unauthorized via Refresh Token for protected endpoints only.
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const response = await axios.post("/api/auth/refresh", {}, { withCredentials: true });
        const newToken = response.data?.data?.accessToken;

        if (newToken) {
          setAccessToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch {
        setAccessToken(null);
        // Preserve the original endpoint error so UI doesn't show refresh-specific messages.
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
