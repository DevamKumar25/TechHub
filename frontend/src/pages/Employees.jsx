import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployees, deleteEmployee } from "../services/employeeService";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { Link } from "react-router-dom";

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("All Statuses");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Active action dropdown tracking
  const [activeDropdown, setActiveDropdown] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployees({
        search,
        department,
        status,
        page,
        limit,
      });
      setEmployees(res.data.data || []);
      setTotalPages(res.data.pages || 1);
      setTotalCount(res.data.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load employees list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, department, status, page, limit]);

  const handleExport = async () => {
    try {
      const res = await api.get("/employees/export", {
        params: { search, department, status },
        responseType: "blob",
      });
      
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "employees.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("CSV exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export employees.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id);
        toast.success("Employee deleted successfully.");
        fetchEmployees();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete employee.");
      }
    }
    setActiveDropdown(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (statusStr) => {
    switch (statusStr) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Inactive":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "On Leave":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Terminated":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getProgressColorClass = (percent) => {
    if (percent === 100) return "bg-emerald-500";
    if (percent >= 70) return "bg-amber-500";
    return "bg-rose-500";
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
            placeholder="Search by Employee ID, name, email, designation..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </div>

        {/* Filter Dropdowns & Export */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Department */}
          <div className="relative">
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setPage(1);
              }}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            >
              <option>All Departments</option>
              <option>Backend</option>
              <option>Frontend</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>HR</option>
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
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>On Leave</option>
              <option>Terminated</option>
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

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4 text-slate-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Export
          </button>

          {/* Add Employee Button */}
          <Link
            to="/employees/add"
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
            Add Employee
          </Link>
        </div>
      </div>

      {/* Employees Table Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left text-sm text-slate-700">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th scope="col" className="px-6 py-4">Employee Name</th>
                <th scope="col" className="px-6 py-4">Employee ID</th>
                <th scope="col" className="px-6 py-4">Designation</th>
                <th scope="col" className="px-6 py-4">Department</th>
                <th scope="col" className="px-6 py-4">Branch</th>
                <th scope="col" className="px-6 py-4">Joining Date</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Profile Completed</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-slate-500 font-medium">
                    Loading employees...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-slate-500 font-medium">
                    No employees found matching the filters.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Employee Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            emp.profilePhoto ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                          }
                          alt={emp.name}
                          className="h-10 w-10 rounded-full object-cover border border-slate-100"
                        />
                        <div>
                          <div className="font-semibold text-slate-800">{emp.name}</div>
                          <div className="text-xs text-slate-400 font-medium">{emp.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-3.5 w-3.5 text-slate-400"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.5 4A1.5 1.5 0 001 5.5V17a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5V5.5A1.5 1.5 0 0017.5 4H15V3a2 2 0 00-2-2H7a2 2 0 00-2 2v1H2.5zM5 5V3a1 1 0 011-1h8a1 1 0 011 1v2H5zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 3.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5H4zm6 .5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 0110 12.5zm.75 2.25a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {emp.employeeId}
                      </span>
                    </td>

                    {/* Designation */}
                    <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">
                      {emp.designation}
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4 font-semibold text-slate-500">
                      {emp.department}
                    </td>

                    {/* Branch */}
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {emp.branch}
                    </td>

                    {/* Joining Date */}
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {formatDate(emp.joiningDate)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-5 ${getStatusClass(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>

                    {/* Profile Completed */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColorClass(emp.profileCompletion)}`}
                            style={{ width: `${emp.profileCompletion}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                          {emp.profileCompletion}% Completed
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right relative whitespace-nowrap">
                      <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === emp._id ? null : emp._id)
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
                      {activeDropdown === emp._id && (
                        <>
                          {/* Close overlay */}
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          ></div>
                          <div className="absolute right-6 top-12 z-20 w-32 rounded-xl border border-slate-100 bg-white py-1 shadow-lg ring-1 ring-black/5">
                            <button
                              onClick={() => navigate(`/employees/edit/${emp._id}`)}
                              className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(emp._id)}
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
