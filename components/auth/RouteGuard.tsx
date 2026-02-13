"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth-service";
import { Loader2 } from "lucide-react";

interface RouteGuardProps {
  children: React.ReactNode;
}

/**
 * RouteGuard implements a proxy-layer for authentication.
 * It intercept attempts to access protected routes and performs
 * real-time session validation and refreshing.
 */
const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isHydrated, setUser, logout } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    const verifySession = async () => {
      // If store says we are authenticated, we trust it initially but 
      // the first API call will trigger a refresh via axios if token is expired.
      if (isAuthenticated) {
        setIsVerifying(false);
        return;
      }

      // If store says we are NOT authenticated, we try to refresh as a secondary check
      // (The user might have a valid httpOnly refreshToken)
      try {
        const response = await authService.refresh();
        if (response.status === "success" && response.data) {
          setUser(response.data.user);
          setIsVerifying(false);
        } else {
          throw new Error("Session expired");
        }
      } catch (err) {
        logout();
        router.push(`/login?from=${pathname}`);
      }
    };

    verifySession();
  }, [isHydrated, isAuthenticated, router, pathname, setUser, logout]);

  if (!isHydrated || isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
        </div>
        <p className="mt-6 text-sm font-bold text-gray-500 animate-pulse tracking-widest uppercase">
          Verifying Identity
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteGuard;
