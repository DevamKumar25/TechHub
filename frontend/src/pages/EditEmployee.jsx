import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployees, getEmployeeById, updateEmployee } from "../services/employeeService";
import { toast } from "react-hot-toast";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  // List of all employees (if no ID is provided, user must select one)
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedId, setSelectedId] = useState(id || "");

  // Form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    profilePhoto: "",
    designation: "",
    department: "",
    branch: "",
    role: "Employee",
    status: "Active",
    profileCompletion: 0,
    address: "",
    bankDetails: {
      accountNumber: "",
      ifsc: "",
      bankName: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [fetchingList, setFetchingList] = useState(false);

  // If no ID in url, fetch list of employees for selection dropdown
  useEffect(() => {
    if (!id) {
      async function loadList() {
        setFetchingList(true);
        try {
          const res = await getEmployees({ limit: 100 });
          setEmployeeList(res.data.data || []);
        } catch (err) {
          console.error(err);
          toast.error("Failed to load employee list for selection.");
        } finally {
          setFetchingList(false);
        }
      }
      loadList();
    } else {
      setSelectedId(id);
    }
  }, [id]);

  // Load selected employee's current details
  useEffect(() => {
    if (selectedId) {
      async function loadDetails() {
        setLoading(true);
        try {
          const res = await getEmployeeById(selectedId);
          const data = res.data.data;
          
          setForm({
            name: data.name || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            profilePhoto: data.profilePhoto || "",
            designation: data.designation || "",
            department: data.department || "",
            branch: data.branch || "",
            role: data.role || "Employee",
            status: data.status || "Active",
            profileCompletion: data.profileCompletion || 0,
            address: data.address || "",
            bankDetails: {
              accountNumber: data.bankDetails?.accountNumber || "",
              ifsc: data.bankDetails?.ifsc || "",
              bankName: data.bankDetails?.bankName || "",
            },
          });
        } catch (err) {
          console.error(err);
          toast.error("Failed to load employee details.");
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
      toast.error("Please select an employee first.");
      return;
    }

    try {
      await updateEmployee(selectedId, form);
      toast.success("Employee updated successfully!");
      navigate("/employees");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update employee details.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back button and title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Edit Employee File</h1>
        <button
          onClick={() => navigate("/employees")}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
        >
          Back to List
        </button>
      </div>

      {/* Select Employee Dropdown (if no route ID) */}
      {!id && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <label className="block text-sm font-semibold text-slate-600">
            Select Employee to Edit
          </label>
          <div className="relative mt-2">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-blue-400"
            >
              <option value="">-- Choose Employee --</option>
              {fetchingList ? (
                <option disabled>Loading list...</option>
              ) : (
                employeeList.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.employeeId} - {emp.designation})
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
              Loading employee details...
            </p>
          ) : (
            <>
              {/* Profile Completion indicator */}
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Profile Completion Progress
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Calculated automatically on backend based on completed fields.
                  </p>
                </div>
                <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-600">
                  {form.profileCompletion}%
                </span>
              </div>

              {/* Grid Inputs */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* Profile Photo URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Profile Photo URL
                  </label>
                  <input
                    type="text"
                    value={form.profilePhoto}
                    onChange={(e) => setForm({ ...form, profilePhoto: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Designation
                  </label>
                  <input
                    type="text"
                    required
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Branch
                  </label>
                  <input
                    type="text"
                    required
                    value={form.branch}
                    onChange={(e) => setForm({ ...form, branch: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Role Privilege
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm outline-none focus:border-blue-400"
                  >
                    <option>Employee</option>
                    <option>Team Lead</option>
                    <option>Manager</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Employee Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm outline-none focus:border-blue-400"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>On Leave</option>
                    <option>Terminated</option>
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Residential Address
                  </label>
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* Sub-Header: Bank Details */}
                <div className="md:col-span-2 border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-bold text-slate-800">Bank Details</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Optional salary account details.
                  </p>
                </div>

                {/* Bank Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={form.bankDetails.bankName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankDetails: { ...form.bankDetails, bankName: e.target.value },
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={form.bankDetails.accountNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankDetails: { ...form.bankDetails, accountNumber: e.target.value },
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* IFSC Code */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={form.bankDetails.ifsc}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankDetails: { ...form.bankDetails, ifsc: e.target.value },
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate("/employees")}
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
