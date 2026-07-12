import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjects, getProjectById, updateProject } from "../services/projectService";
import { toast } from "react-hot-toast";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  // List of all projects for picker if no ID is present
  const [projectList, setProjectList] = useState([]);
  const [selectedId, setSelectedId] = useState(id || "");

  // Form state
  const [form, setForm] = useState({
    projectName: "",
    projectType: "Web App",
    status: "Active",
    totalCost: 0,
    pendingAmount: 0,
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingList, setFetchingList] = useState(false);

  useEffect(() => {
    if (!id) {
      async function loadList() {
        setFetchingList(true);
        try {
          const res = await getProjects({ limit: 100 });
          setProjectList(res.data.data || []);
        } catch (err) {
          console.error(err);
          toast.error("Failed to load projects list for selector.");
        } finally {
          setFetchingList(false);
        }
      }
      loadList();
    } else {
      setSelectedId(id);
    }
  }, [id]);

  useEffect(() => {
    if (selectedId) {
      async function loadDetails() {
        setLoading(true);
        try {
          const res = await getProjectById(selectedId);
          const data = res.data.data;
          
          setForm({
            projectName: data.projectName || "",
            projectType: data.projectType || "Web App",
            status: data.status || "Active",
            totalCost: data.totalCost || 0,
            pendingAmount: data.pendingAmount || 0,
            startDate: data.startDate ? data.startDate.split("T")[0] : "",
            endDate: data.endDate ? data.endDate.split("T")[0] : "",
          });
        } catch (err) {
          console.error(err);
          toast.error("Failed to load project details.");
        } finally {
          setLoading(false);
        }
      }
      loadDetails();
    }
  }, [selectedId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) {
      toast.error("Please select a project first.");
      return;
    }

    try {
      await updateProject(selectedId, form);
      toast.success("Project updated successfully!");
      navigate("/projects");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update project details.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Edit Project File</h1>
        <button
          onClick={() => navigate("/projects")}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
        >
          Back to List
        </button>
      </div>

      {/* Select Project Dropdown (if no route ID) */}
      {!id && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <label className="block text-sm font-semibold text-slate-600">
            Select Project to Edit
          </label>
          <div className="relative mt-2">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-blue-400"
            >
              <option value="">-- Choose Project --</option>
              {fetchingList ? (
                <option disabled>Loading list...</option>
              ) : (
                projectList.map((proj) => (
                  <option key={proj._id} value={proj._id}>
                    {proj.projectName} ({proj.projectId} - {proj.clientName})
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
      )}

      {/* Edit Form */}
      {(selectedId || loading) && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6"
        >
          {loading ? (
            <p className="text-center text-slate-500 font-medium py-10">
              Loading project details...
            </p>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Project Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
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
                  onClick={() => navigate("/projects")}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
}
