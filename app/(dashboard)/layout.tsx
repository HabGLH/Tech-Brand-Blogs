"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  FileText,
  FolderTree,
  LayoutDashboard,
  Menu,
  PlusCircle,
  Shield,
  SlidersHorizontal,
  Tags,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import RouteGuard from "@/components/auth/RouteGuard";
import { useAuthStore } from "@/store/auth-store";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  const sidebarLinks = isAdmin
    ? [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "All Posts", href: "/admin/posts", icon: FileText },
        { name: "Categories", href: "/admin/categories", icon: FolderTree },
        { name: "Tags", href: "/admin/tags", icon: Tags },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Settings", href: "/admin/settings", icon: SlidersHorizontal },
        { name: "Create Post", href: "/create-post", icon: PlusCircle },
        { name: "Profile", href: "/profile", icon: UserCircle },
      ]
    : [
        { name: "My Posts", href: "/my-posts", icon: FileText },
        { name: "Create Post", href: "/create-post", icon: PlusCircle },
        { name: "Profile", href: "/profile", icon: UserCircle },
      ];

  useEffect(() => {
    document.body.style.overflow = isMobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileNavOpen]);

  const isLinkActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  const currentSection =
    sidebarLinks.find((link) => isLinkActive(link.href))?.name ?? "Dashboard";

  return (
    <RouteGuard>
      <div className="flex min-h-screen bg-[rgb(var(--background))] pt-20">
        <aside className="fixed left-0 hidden h-[calc(100vh-80px)] w-64 overflow-y-auto border-r border-[rgb(var(--border))] bg-[rgb(var(--surface))] lg:block">
          <div className="p-6">
            <p className="mb-6 text-[10px] font-bold uppercase tracking-wide text-[rgb(var(--text-muted))]">
              Main Menu
            </p>
            <nav className="space-y-1.5">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
                    isLinkActive(link.href)
                      ? "bg-[rgb(var(--accent))] text-[rgb(var(--on-primary))] shadow-lg shadow-[rgb(var(--accent)/0.2)]"
                      : "text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--surface-elevated))] hover:text-[rgb(var(--secondary))]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <link.icon
                      className={`h-5 w-5 ${
                        isLinkActive(link.href)
                          ? "text-[rgb(var(--on-primary))]"
                          : "group-hover:text-[rgb(var(--secondary))]"
                      }`}
                    />
                    <span className="text-sm font-bold">{link.name}</span>
                  </div>
                  {isLinkActive(link.href) && <ChevronRight className="h-4 w-4" />}
                </Link>
              ))}
            </nav>

            {isAdmin && (
              <div className="mt-8 rounded-xl border border-[rgb(var(--accent-soft)/0.6)] bg-[rgb(var(--accent-soft)/0.15)] p-3 text-xs font-semibold text-[rgb(var(--accent))]">
                <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide">
                  <Shield className="h-3.5 w-3.5" /> Admin Access
                </div>
                You can manage users, block/unblock accounts, and moderate all posts.
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 lg:ml-64">
          <div className="sticky top-20 z-30 border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))/0.95] backdrop-blur lg:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-[rgb(var(--text-muted))]">
                  Dashboard
                </p>
                <p className="text-sm font-bold text-[rgb(var(--text-primary))]">
                  {currentSection}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elevated))] p-2 text-[rgb(var(--text-primary))]"
                aria-label="Open dashboard navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>

      {isMobileNavOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 bg-[rgb(var(--text-primary)/0.38)] backdrop-blur-sm"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[86%] max-w-sm border-r border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-lg font-bold text-[rgb(var(--text-primary))]">Dashboard Menu</p>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(false)}
                className="rounded-lg p-2 text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--surface-elevated))]"
                aria-label="Close dashboard navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-2">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${
                    isLinkActive(link.href)
                      ? "bg-[rgb(var(--accent))] text-[rgb(var(--on-primary))]"
                      : "text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--surface-elevated))] hover:text-[rgb(var(--secondary))]"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </RouteGuard>
  );
};

export default DashboardLayout;
