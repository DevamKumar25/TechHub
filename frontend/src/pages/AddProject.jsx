import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getClients } from "../services/clientService";
import { getEmployees } from "../services/employeeService";
import { createProject } from "../services/projectService";
import { toast } from "react-hot-toast";

export default function AddProject() {
  const navigate = useNavigate();

  // List of clients and employees to choose from
  const [clientList, setClientList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [fetchingClients, setFetchingClients] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  // Form state
  const [form, setForm] = useState({
    client: "", // holds the _id of selected client
    projectName: "",
    projectType: "Web App",
    status: "Active",
    totalCost: 0,
    pendingAmount: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    team: [],
  });

  const [saving, setSaving] = useState(false);

  // Fetch clients and employees to populate the dropdown selection
  useEffect(() => {
    async function loadOptions() {
      setFetchingClients(true);
      setFetchingEmployees(true);
      try {
        const [clientsRes, employeesRes] = await Promise.all([
          getClients({ limit: 100 }),
          getEmployees({ limit: 100 }),
        ]);
        setClientList(clientsRes.data.data || []);
        setEmployeeList(employeesRes.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project form options.");
      } finally {
        setFetchingClients(false);
        setFetchingEmployees(false);
      }
    }
    loadOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.client) {
      toast.error("Please select a client for this project.");
      return;
    }

    if (!selectedEmployee) {
      toast.error("Please select an employee for this project.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        team: [{ employee: selectedEmployee }],
      };
      await createProject(payload);
      toast.success("Project added successfully!");
      navigate("/projects");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to create project."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Add New Project</h1>
        <button
          onClick={() => navigate("/projects")}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Creation Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Select Client Dropdown */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Client
            </label>
            <div className="relative mt-2">
              <select
                required
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              >
                <option value="">-- Choose Client --</option>
                {fetchingClients ? (
                  <option disabled>Loading clients...</option>
                ) : (
                  clientList.map((clt) => (
                    <option key={clt._id} value={clt._id}>
                      {clt.clientName} ({clt.clientId} - {clt.companyName})
                    </option>
                  ))
                )}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
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
          </div>

          {/* Assign Employee */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Employee
            </label>
            <div className="relative mt-2">
              <select
                required
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              >
                <option value="">-- Choose Employee --</option>
                {fetchingEmployees ? (
                  <option disabled>Loading employees...</option>
                ) : employeeList.length ? (
                  employeeList.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name} ({employee.employeeId}) - {employee.designation}
                    </option>
                  ))
                ) : (
                  <option disabled>No employees found</option>
                )}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
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
          </div>

          {/* Project Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Project Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Search Ads Integration"
              value={form.projectName}
              onChange={(e) => setForm({ ...form, projectName: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Project Type
            </label>
            <select
              value={form.projectType}
              onChange={(e) => setForm({ ...form, projectType: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm outline-none focus:border-blue-400"
            >
              <option>Web App</option>
              <option>Mobile App</option>
              <option>API Service</option>
              <option>UI/UX Design</option>
              <option>Cloud Migration</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Project Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm outline-none focus:border-blue-400"
            >
              <option>Active</option>
              <option>On Hold</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* Total Cost */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Cost (₹)
            </label>
            <input
              type="number"
              value={form.totalCost}
              onChange={(e) => setForm({ ...form, totalCost: Number(e.target.value) })}
              className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Pending Amount */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Amount (₹)
            </label>
            <input
              type="number"
              value={form.pendingAmount}
              onChange={(e) =>
                setForm({ ...form, pendingAmount: Number(e.target.value) })
              }
              className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Start Date
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              End Date
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <button
            type="button"
            disabled={saving}
            onClick={() => navigate("/projects")}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving..." : "Add Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
