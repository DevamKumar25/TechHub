import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getClients } from "../services/clientService";
import { getEmployees } from "../services/employeeService";
import { getProjects } from "../services/projectService";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    clients: 0,
    employees: 0,
    projects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [clientsRes, employeesRes, projectsRes] = await Promise.all([
          getClients({ limit: 1 }),
          getEmployees({ limit: 1 }),
          getProjects({ limit: 1 }),
        ]);

        setStats({
          clients: clientsRes.data.total || 0,
          employees: employeesRes.data.total || 0,
          projects: projectsRes.data.total || 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        toast.error("Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Overview Panel
        </span>
        <h1 className="mt-1 text-2xl font-bold text-slate-800 md:text-3xl">
          Welcome back, {user?.name || "Admin"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here is a summary of the resource statistics for your organization today.
        </p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Clients Card */}
        <Link
          to="/clients"
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-sky-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-slate-500">
                Total Clients
              </span>
              <p className="mt-2 text-4xl font-bold text-slate-800">
                {loading ? "..." : stats.clients}
              </p>
            </div>
            <div className="rounded-xl bg-sky-50 p-3 text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0112.75 20c-1.077 0-2.109-.15-3.078-.432a8.07 8.07 0 01-.787-3.097c0-1.113.285-2.16.786-3.07M9 10.41a3 3 0 113-2.99 3 3 0 01-3 2.99m6 1.49a2.993 2.993 0 11-3-3 2.993 2.993 0 013 3m-6.75 3.375c-.015-.003-.03-.005-.045-.008A2.993 2.993 0 0112 12.75c.896 0 1.7.393 2.25 1.016"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-medium text-sky-600">
            <span>View all clients</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.63l-3.057-3.057a.75.75 0 111.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06l3.057-3.057H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </Link>

        {/* Projects Card */}
        <Link
          to="/projects"
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-violet-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-slate-500">
                Active Projects
              </span>
              <p className="mt-2 text-4xl font-bold text-slate-800">
                {loading ? "..." : stats.projects}
              </p>
            </div>
            <div className="rounded-xl bg-violet-50 p-3 text-violet-500 group-hover:bg-violet-500 group-hover:text-white transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18M2.25 9l.377-3.398A2.25 2.25 0 014.864 3.75h14.272a2.25 2.25 0 012.237 1.852L21.75 9M2.25 9v9a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V9m-18 0h18"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-medium text-violet-600">
            <span>View all projects</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.63l-3.057-3.057a.75.75 0 111.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06l3.057-3.057H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </Link>

        {/* Employees Card */}
        <Link
          to="/employees"
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-slate-500">
                Active Employees
              </span>
              <p className="mt-2 text-4xl font-bold text-slate-800">
                {loading ? "..." : stats.employees}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-medium text-amber-600">
            <span>View all employees</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.63l-3.057-3.057a.75.75 0 111.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06l3.057-3.057H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}