import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";

    const savedTheme = localStorage.getItem("abc-theme");
    if (savedTheme) return savedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("abc-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <nav className="flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-4 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-sm font-semibold text-white">
          AT
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">ABC Tech</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 md:mt-1">
            Logged in as {user?.name || "Admin"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button
          onClick={logout}
          className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}