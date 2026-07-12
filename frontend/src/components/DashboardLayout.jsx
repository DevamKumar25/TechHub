import { useState, useContext } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Helper to determine the section title based on the path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/employees/edit")) return "Edit Employee";
    if (path === "/employees/add") return "Add Employee";
    if (path === "/employees") return "Employees";
    if (path.startsWith("/clients/edit")) return "Edit Client";
    if (path === "/clients/add") return "Add Client";
    if (path === "/clients") return "Clients";
    if (path.startsWith("/projects/edit")) return "Edit Project";
    if (path === "/projects/add") return "Add Project";
    if (path === "/projects") return "Projects";
    return "Dashboard";
  };

  return (
    <div className="h-screen bg-slate-50 text-slate-800 flex overflow-hidden">
      {/* ── Sidebar: always fixed, never scrolls ── */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar user={user} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* ── Main Content: offset by sidebar width, scrolls independently ── */}
      <div
        className={`flex flex-col flex-1 h-screen overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "ml-0"
        }`}
      >
        {/* Top Navbar – sticky at top of scrollable area */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none"
              aria-label="Toggle Sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                />
              </svg>
            </button>

            {/* Page Title */}
            <h2 className="text-xl font-semibold text-slate-800">
              {getPageTitle()}
            </h2>
          </div>

          {/* Right Header Navigation Panel */}
          <div className="flex items-center gap-4">
            {/* Vertical Divider */}
            <div className="h-6 w-px bg-slate-200"></div>

            {/* User Profile Info Card */}
            <div className="flex items-center gap-3">
              <img
                src={
                  user?.profilePhoto ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                }
                alt="Profile"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100"
              />
              <div className="hidden text-left lg:block">
                <span className="block text-sm font-semibold text-slate-800">
                  {user?.name || "Bhavani Prasad Menda"}
                </span>
                <span className="block text-xs text-slate-500">
                  {user?.role === "admin" ? "Admin" : "Employee"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content – this area scrolls */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar overlay backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs md:hidden"
        ></div>
      )}
    </div>
  );
}
