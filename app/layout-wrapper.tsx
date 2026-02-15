"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuthStore } from "@/store/auth-store";
import apiClient, {
  getAccessToken,
  hydrateAccessToken,
  setAccessToken,
} from "@/services/api-client";
import { ApiResponse, User } from "@/types";

export default function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setHydrated, setUser, user } = useAuthStore();
  const isDashboardRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/my-posts") ||
    pathname.startsWith("/create-post") ||
    pathname.startsWith("/profile");

  useEffect(() => {
    const bootstrapAuth = async () => {
      hydrateAccessToken();
      const token = getAccessToken();
      if (user || !token) {
        setHydrated();
        return;
      }

      try {
        const { data } =
          await apiClient.get<ApiResponse<{ user: User }>>("/users/me");
        setUser(data.data.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setHydrated();
      }
    };
    bootstrapAuth();
  }, [setHydrated, setUser, user]);

  return (
    <>
      <Navbar />
      <main
        className={isDashboardRoute ? "min-h-screen" : "min-h-screen pt-20"}
      >
        {children}
      </main>
      {!isDashboardRoute && <Footer />}
    </>
  );
}
