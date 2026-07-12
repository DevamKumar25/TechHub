import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, deleteProject } from "../services/projectService";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [type, setType] = useState("All Types");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Active action dropdown tracking
  const [activeDropdown, setActiveDropdown] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getProjects({
        search,
        status,
        type,
        page,
        limit,
      });
      setProjects(res.data.data || []);
      setTotalPages(res.data.pages || 1);
      setTotalCount(res.data.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, status, type, page, limit]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        toast.success("Project deleted successfully.");
        fetchProjects();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete project.");
      }
    }
    setActiveDropdown(null);
  };

  const getStatusClass = (statusStr) => {
    switch (statusStr) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Completed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "On Hold":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters panel */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
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
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by project ID, name, client, type..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status */}
          <div className="relative">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            >
              <option value="All Status">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>

          {/* Project Type */}
          <div className="relative">
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            >
              <option value="All Types">All Types</option>
              <option value="Web App">Web App</option>
              <option value="Mobile App">Mobile App</option>
              <option value="API Service">API Service</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Cloud Migration">Cloud Migration</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>

          {/* Add Project Button */}
          <Link
            to="/projects/add"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add Project
          </Link>
        </div>
      </div>

      {/* Projects Table Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left text-sm text-slate-700">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th scope="col" className="px-6 py-4">Project Name</th>
                <th scope="col" className="px-6 py-4">Project ID</th>
                <th scope="col" className="px-6 py-4">Client</th>
                <th scope="col" className="px-6 py-4">Type</th>
                <th scope="col" className="px-6 py-4">Total Cost</th>
                <th scope="col" className="px-6 py-4">Pending Amount</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-500 font-medium">
                    Loading projects...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-500 font-medium">
                    No projects found matching the filters.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj._id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Project Name */}
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {proj.projectName}
                    </td>

                    {/* Project ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {proj.projectId}
                      </span>
                    </td>

                    {/* Client Name */}
                    <td className="px-6 py-4 font-semibold text-slate-600">
                      {proj.clientName}
                    </td>

                    {/* Project Type */}
                    <td className="px-6 py-4 font-medium text-slate-500">
                      {proj.projectType}
                    </td>

                    {/* Total Cost */}
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      ₹{proj.totalCost?.toLocaleString() || "0"}
                    </td>

                    {/* Pending Amount */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold ${
                        proj.pendingAmount > 0
                          ? "bg-rose-50 text-rose-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}>
                        ₹{proj.pendingAmount?.toLocaleString() || "0"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-5 ${getStatusClass(proj.status)}`}>
                        {proj.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right relative whitespace-nowrap">
                      <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === proj._id ? null : proj._id)
                        }
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-5 w-5"
                        >
                          <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {activeDropdown === proj._id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          ></div>
                          <div className="absolute right-6 top-12 z-20 w-32 rounded-xl border border-slate-100 bg-white py-1 shadow-lg ring-1 ring-black/5">
                            <button
                              onClick={() => navigate(`/projects/edit/${proj._id}`)}
                              className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(proj._id)}
                              className="flex w-full items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Rows per page:</span>
            <div className="relative">
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="appearance-none rounded-lg border border-slate-200 bg-white py-1 pl-3 pr-8 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              {totalCount === 0
                ? "0-0"
                : `${(page - 1) * limit + 1}-${Math.min(page * limit, totalCount)}`}{" "}
              of {totalCount}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
