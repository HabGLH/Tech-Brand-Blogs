"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  UserCircle,
  Shield,
  Tags,
  FolderTree,
  Users,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import RouteGuard from "@/components/auth/RouteGuard";
import { useAuthStore } from "@/store/auth-store";
interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { user } = useAuthStore();
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
  return (
    <RouteGuard>
      {" "}
      <div className="flex min-h-screen bg-[rgb(var(--background))] pt-20">
        {" "}
        {/* Sidebar */}{" "}
        <aside className="fixed left-0 w-64 h-[calc(100vh-80px)] border-r border-[rgb(var(--border))] bg-[rgb(var(--surface))] hidden lg:block overflow-y-auto">
          {" "}
          <div className="p-6">
            {" "}
            <p className="text-[10px] font-black uppercase tracking-widest text-[rgb(var(--text-muted))] mb-6">
              Main Menu
            </p>{" "}
            <nav className="space-y-1.5">
              {" "}
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={` flex items-center justify-between group px-4 py-3 rounded-xl transition-all ${pathname === link.href ? "bg-[rgb(var(--accent))] text-[rgb(var(--on-primary))] shadow-lg shadow-[rgb(var(--accent)/0.2)]" : "text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--surface-elevated))] hover:text-[rgb(var(--secondary))]"} `}
                >
                  {" "}
                  <div className="flex items-center gap-3">
                    {" "}
                    <link.icon
                      className={`w-5 h-5 ${pathname === link.href ? "text-[rgb(var(--on-primary))]" : "group-hover:text-[rgb(var(--secondary))]"}`}
                    />{" "}
                    <span className="text-sm font-bold">{link.name}</span>{" "}
                  </div>{" "}
                  {pathname === link.href && (
                    <ChevronRight className="w-4 h-4" />
                  )}{" "}
                </Link>
              ))}{" "}
            </nav>{" "}
            {isAdmin && (
              <div className="mt-8 rounded-xl border border-[rgb(var(--accent-soft)/0.6)] bg-[rgb(var(--accent-soft)/0.15)] p-3 text-xs font-semibold text-[rgb(var(--accent))]">
                {" "}
                <div className="mb-1 flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
                  {" "}
                  <Shield className="h-3.5 w-3.5" /> Admin Access{" "}
                </div>{" "}
                You can manage users, block/unblock accounts, and moderate all
                posts.{" "}
              </div>
            )}{" "}
          </div>{" "}
        </aside>{" "}
        {/* Main Content */}{" "}
        <main className="flex-1 lg:ml-64">
          {" "}
          <div className="p-8"> {children} </div>{" "}
        </main>{" "}
      </div>{" "}
    </RouteGuard>
  );
};
export default DashboardLayout;
