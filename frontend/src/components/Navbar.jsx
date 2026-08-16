import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "./ToastProvider";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/palm", label: "Palm Analysis" },
  { to: "/history", label: "History" },
  { to: "/profile", label: "Profile" },
  { to: "/tarot", label: "Tarot" },
];

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const toast = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.notify("Logged out successfully.", "success");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-violet-500/10 bg-white/70 text-slate-800 shadow-[0_10px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85 dark:text-slate-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-semibold tracking-[0.22em] uppercase text-violet-600 transition hover:text-violet-500 dark:text-violet-300">
          Palmistry Studio
        </Link>

        <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 transition ${
                  isActive
                    ? "bg-violet-500/10 text-violet-700 shadow-sm dark:bg-violet-500/20 dark:text-violet-200"
                    : "text-slate-600 hover:bg-violet-500/10 hover:text-violet-700 dark:text-slate-300 dark:hover:text-violet-200"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-violet-300/60 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-violet-400 hover:text-violet-700 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "☀ Light" : "🌙 Dark"}
          </button>

          {user ? (
            <>
              <span className="hidden text-sm text-slate-500 md:block dark:text-slate-400">{user.full_name || user.email}</span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full border border-violet-500/40 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-500/10 dark:text-violet-200">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500">
                Register
              </Link>
            </>
          )}

          <button
            type="button"
            className="rounded-full border border-violet-300/50 p-2 text-lg md:hidden dark:border-white/10"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((current) => !current)}
          >
            ☰
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-violet-500/10 bg-white/95 p-4 shadow-lg backdrop-blur md:hidden dark:border-white/10 dark:bg-slate-950/95">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-violet-500/10 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200"
                      : "text-slate-700 hover:bg-violet-500/10 dark:text-slate-200"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
