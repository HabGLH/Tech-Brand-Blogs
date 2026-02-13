// Axios instance/wrapper with interceptors for token handling
// Base URL pointing to /api.
// Request interceptor: Adds `Authorization: Bearer token` if available.
// Response interceptor: Handles global errors (e.g., 401 redirect to login).
const API_BASE_URL = "/api";

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Handle non-2xx responses
      if (response.status === 401) {
        // Unauthorized, redirect to login
        window.location.href = "/login";
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error; // Re-throw for caller to handle
  }
}
