"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  BarChart2, 
  Settings, 
  Users, 
  ChevronRight
} from "lucide-react";
import RouteGuard from "@/components/auth/RouteGuard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const sidebarLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "My Posts", href: "/admin/posts", icon: FileText },
    { name: "New Post", href: "/admin/posts/new", icon: PlusCircle },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
    { name: "Users", href: "/admin/users", icon: Users, role: "admin" },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <RouteGuard>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
        {/* Sidebar */}
        <aside className="fixed left-0 w-64 h-[calc(100vh-80px)] border-r border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 hidden lg:block overflow-y-auto">
          <div className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Main Menu</p>
            <nav className="space-y-1.5">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center justify-between group px-4 py-3 rounded-xl transition-all
                    ${pathname === link.href 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-gray-400"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <link.icon className={`w-5 h-5 ${pathname === link.href ? "text-white" : "group-hover:text-blue-600"}`} />
                    <span className="text-sm font-bold">{link.name}</span>
                  </div>
                  {pathname === link.href && <ChevronRight className="w-4 h-4" />}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </RouteGuard>
  );
};

export default DashboardLayout;
