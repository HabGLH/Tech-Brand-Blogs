"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

const resolveInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme());

  const applyTheme = (nextTheme: Theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", nextTheme === "dark");
    root.classList.toggle("light", nextTheme === "light");
    root.style.colorScheme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setThemeValue = (nextTheme: Theme) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const toggleTheme = () => {
    setThemeValue(theme === "dark" ? "light" : "dark");
  };

  return {
    theme,
    isDark: theme === "dark",
    setTheme: setThemeValue,
    toggleTheme,
  };
};
