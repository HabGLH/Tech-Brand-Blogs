"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  FileText,
  Home,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  Moon,
  PlusCircle,
  Sun,
  UserCircle2,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth-service";
import { useTheme } from "@/hooks/use-theme";
import Button from "@/components/ui/Button";

const Navbar = () => {
  const pathname = usePathname();
  const { isAuthenticated, isHydrated, logout, user } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore request errors and continue local logout.
    } finally {
      logout();
      setIsMobileMenuOpen(false);
      setIsProfileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Posts", href: "/posts", icon: FileText },
    { name: "Links", href: "/links", icon: Link2 },
    ...(isAuthenticated
      ? [{ name: "Create Post", href: "/create-post", icon: PlusCircle }]
      : []),
  ];

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))/0.94] py-3 backdrop-blur-lg"
            : "bg-transparent py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-xl p-2 text-[rgb(var(--text-muted))] transition-colors hover:bg-[rgb(var(--surface-elevated))]"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <Link href="/" className="group flex min-w-0 items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] shadow-lg shadow-[rgb(var(--primary)/0.3)]">
              <span className="text-xl font-bold">B</span>
            </div>
            <span className="hidden bg-linear-to-r from-[rgb(var(--text-primary))] to-[rgb(var(--text-muted))] bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:block">
              Blogly
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  pathname === link.href
                    ? "text-[rgb(var(--accent))]"
                    : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--secondary))]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="relative" ref={profileRef}>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-2.5 py-1.5 text-sm font-semibold text-[rgb(var(--text-primary))] transition-colors hover:border-[rgb(var(--accent-soft))] hover:text-[rgb(var(--accent))] sm:px-3"
              >
                <UserCircle2 className="h-4 w-4" />
                <span className="hidden max-w-24 truncate sm:block">
                  {user?.name ?? "Profile"}
                </span>
                <ChevronDown className="hidden h-3.5 w-3.5 sm:block" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-2 text-[rgb(var(--text-primary))] hover:text-[rgb(var(--secondary))]"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/register" className="hidden sm:block">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}

            {isAuthenticated && isProfileMenuOpen && (
              <div className="absolute right-0 top-12 w-[min(18rem,calc(100vw-1rem))] rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-3 shadow-xl">
                <div className="mb-2 rounded-xl bg-[rgb(var(--surface-elevated))] p-3">
                  <p className="font-bold text-[rgb(var(--text-primary))]">
                    {user?.name}
                  </p>
                  <p className="text-xs capitalize text-[rgb(var(--text-muted))]">
                    {user?.role}
                  </p>
                  {user?.bio && (
                    <p className="mt-2 line-clamp-2 text-xs text-[rgb(var(--text-muted))]">
                      {user.bio}
                    </p>
                  )}
                </div>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--surface-elevated))] hover:text-[rgb(var(--secondary))]"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  href={`/users/${user?._id}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--surface-elevated))] hover:text-[rgb(var(--secondary))]"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <UserCircle2 className="h-4 w-4" />
                  Public Profile
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--surface-elevated))] hover:text-[rgb(var(--secondary))]"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <UserCircle2 className="h-4 w-4" />
                  Edit Profile
                </Link>

                <Link
                  href="/my-posts"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--surface-elevated))] hover:text-[rgb(var(--secondary))]"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  My Posts
                </Link>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--surface-elevated))] hover:text-[rgb(var(--secondary))]"
                >
                  {isDark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  {isDark ? "Light Mode" : "Dark Mode"}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[rgb(var(--secondary))] hover:bg-[rgb(var(--secondary-soft)/0.18)]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-[rgb(var(--text-primary)/0.35)] backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <aside className="absolute left-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto border-r border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 shadow-2xl sm:p-5">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgb(var(--primary))] font-bold text-[rgb(var(--on-primary))]">
                  B
                </div>
                <span className="text-xl font-bold text-[rgb(var(--text-primary))]">
                  Menu
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-2 text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--surface-elevated))]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isAuthenticated && (
              <div className="mb-6 rounded-xl bg-[rgb(var(--surface-elevated))] p-3">
                <p className="font-bold text-[rgb(var(--text-primary))]">
                  {user?.name}
                </p>
                <p className="text-xs capitalize text-[rgb(var(--text-muted))]">
                  {user?.role}
                </p>
                {user?.bio && (
                  <p className="mt-1 line-clamp-2 text-xs text-[rgb(var(--text-muted))]">
                    {user.bio}
                  </p>
                )}
              </div>
            )}

            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                    pathname === link.href
                      ? "bg-[rgb(var(--accent))] text-[rgb(var(--on-primary))]"
                      : "text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--surface-elevated))] hover:text-[rgb(var(--secondary))]"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="mt-6 space-y-2 border-t border-[rgb(var(--border))] pt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href={`/users/${user?._id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="w-full"
                      leftIcon={<UserCircle2 className="h-4 w-4" />}
                    >
                      Public Profile
                    </Button>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="w-full"
                      leftIcon={<UserCircle2 className="h-4 w-4" />}
                    >
                      Edit Profile
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full"
                        leftIcon={<LayoutDashboard className="h-4 w-4" />}
                      >
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={toggleTheme}
                    leftIcon={
                      isDark ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )
                    }
                  >
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-[rgb(var(--secondary))]"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={toggleTheme}
                    leftIcon={
                      isDark ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )
                    }
                  >
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </Button>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Navbar;

