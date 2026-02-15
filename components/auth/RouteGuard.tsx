"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";
import { adminService } from "@/services/admin-service";
interface RouteGuardProps {
  children: React.ReactNode;
} /** * RouteGuard implements a proxy-layer for authentication. * It intercept attempts to access protected routes and performs * real-time session validation and refreshing. */
const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isHydrated, logout } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);
  useEffect(() => {
    if (!isHydrated) return;
    const verifySession = async () => {
      if (isAuthenticated) {
        if (pathname.startsWith("/admin")) {
          try {
            const response = await adminService.getStatus();
            if (!response.data.isAdmin) {
              router.push("/my-posts");
              return;
            }
          } catch {
            logout();
            router.push(`/login?from=${pathname}`);
            return;
          }
        }
        setIsVerifying(false);
        return;
      }
      logout();
      router.push(`/login?from=${pathname}`);
    };
    verifySession();
  }, [isHydrated, isAuthenticated, router, pathname, logout]);
  if (!isHydrated || isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[rgb(var(--surface-elevated))] ">
        {" "}
        <div className="relative">
          {" "}
          <div className="w-16 h-16 border-4 border-[rgb(var(--accent))]/20 border-t-blue-600 rounded-full animate-spin" />{" "}
          <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[rgb(var(--accent))]" />{" "}
        </div>{" "}
        <p className="mt-6 text-sm font-bold text-[rgb(var(--text-muted))] animate-pulse tracking-widest uppercase">
          {" "}
          Verifying Identity{" "}
        </p>{" "}
      </div>
    );
  }
  return <>{children}</>;
};
export default RouteGuard;
