import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar({ onClose }) {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Collapsible menu states
  const [menus, setMenus] = useState({
    clients: location.pathname.startsWith("/clients"),
    projects: location.pathname.startsWith("/projects"),
    employees: location.pathname.startsWith("/employees"),
  });

  const toggleMenu = (menu) => {
    setMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="flex h-screen w-64 flex-col justify-between bg-slate-950 text-slate-200 border-r border-slate-900 shadow-xl">
      {/* Sidebar Top: Logo Section */}
      <div className="flex flex-col">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-sky-500 bg-slate-900 font-bold text-sky-400 shadow-md">
            AT
          </div>
          <div>
            <h1 className="text-md font-bold tracking-wide text-white leading-tight">
              ABC Tech
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Operations Hub
            </p>
          </div>
          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="ml-auto rounded-md p-1 text-slate-500 hover:bg-slate-900 hover:text-white md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Sidebar Nav Area */}
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto max-h-[calc(100vh-190px)]">
          {/* Dashboard General Link */}
          <Link
            to="/dashboard"
            onClick={onClose}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
              isActive("/dashboard")
                ? "bg-slate-900 text-sky-400 border-l-4 border-sky-400"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Dashboard
          </Link>

          {/* Section Divider */}
          <div className="pt-4 pb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
            Resource Management
          </div>

          {/* CLIENT Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => toggleMenu("clients")}
              className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
                <span>Clients</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                  menus.clients ? "rotate-180" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {menus.clients && (
              <div className="pl-8 space-y-1 transition-all duration-200">
                <Link
                  to="/clients"
                  onClick={onClose}
                  className={`block rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                    isActive("/clients")
                      ? "bg-slate-900 text-sky-400"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  All Clients
                </Link>
                <Link
                  to="/clients/add"
                  onClick={onClose}
                  className={`block rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                    isActive("/clients/add")
                      ? "bg-slate-900 text-sky-400"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  Add Client
                </Link>
              </div>
            )}
          </div>

          {/* PROJECT Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => toggleMenu("projects")}
              className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18M2.25 9l.377-3.398A2.25 2.25 0 014.864 3.75h14.272a2.25 2.25 0 012.237 1.852L21.75 9M2.25 9v9a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V9m-18 0h18"
                  />
                </svg>
                <span>Projects</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                  menus.projects ? "rotate-180" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {menus.projects && (
              <div className="pl-8 space-y-1 transition-all duration-200">
                <Link
                  to="/projects"
                  onClick={onClose}
                  className={`block rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                    isActive("/projects")
                      ? "bg-slate-900 text-sky-400"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  All Projects
                </Link>
                <Link
                  to="/projects/add"
                  onClick={onClose}
                  className={`block rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                    isActive("/projects/add")
                      ? "bg-slate-900 text-sky-400"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  Add Project
                </Link>
              </div>
            )}
          </div>

          {/* EMPLOYEE Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => toggleMenu("employees")}
              className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <span>Employees</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                  menus.employees ? "rotate-180" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {menus.employees && (
              <div className="pl-8 space-y-1 transition-all duration-200">
                <Link
                  to="/employees"
                  onClick={onClose}
                  className={`block rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                    isActive("/employees")
                      ? "bg-slate-900 text-sky-400"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  All Employees
                </Link>
                <Link
                  to="/employees/add"
                  onClick={onClose}
                  className={`block rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                    isActive("/employees/add")
                      ? "bg-slate-900 text-sky-400"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  Add Employee
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Sidebar Bottom: User Profile Section */}
      <div className="border-t border-slate-900 bg-slate-950/70 p-4">
        <div className="flex items-center gap-3">
          <img
            src={
              user?.profilePhoto ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
            }
            alt="Profile Avatar"
            className="h-10 w-10 rounded-full object-cover border border-slate-800"
          />
          <div className="flex-1 overflow-hidden">
            <h4 className="truncate text-sm font-semibold text-white leading-tight">
              {user?.name || "Bhavani Prasad Menda"}
            </h4>
            <p className="truncate text-xs text-slate-500 font-medium leading-normal mt-0.5">
              {user?.email || "admin@cetech.com"}
            </p>
          </div>
        </div>

        {/* Logout Action Button */}
        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 hover:border-red-800 px-4 py-2.5 text-sm font-semibold text-red-400 hover:text-red-300 transition-all cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
