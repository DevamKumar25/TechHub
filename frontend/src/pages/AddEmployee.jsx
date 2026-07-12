import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "../services/employeeService";
import { toast } from "react-hot-toast";

export default function AddEmployee() {
  const navigate = useNavigate();

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
    joiningDate: new Date().toISOString().split("T")[0],
    address: "",
    bankDetails: {
      accountNumber: "",
      ifsc: "",
      bankName: "",
    },
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createEmployee(form);
      toast.success("Employee added successfully!");
      navigate("/employees");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to create employee profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back button and title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Add New Employee</h1>
        <button
          onClick={() => navigate("/employees")}
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
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
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
              placeholder="e.g. john@cetech.com"
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
              placeholder="e.g. +91 9876543210"
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
              placeholder="https://images.unsplash.com/..."
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
              placeholder="e.g. Backend Developer"
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
              placeholder="e.g. Backend"
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
              placeholder="e.g. Hyderabad"
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Joining Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Joining Date
            </label>
            <input
              type="date"
              required
              value={form.joiningDate}
              onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
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
              placeholder="Full address..."
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
              placeholder="e.g. HDFC Bank"
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
              placeholder="12-digit account number"
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
              placeholder="e.g. HDFC0001234"
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
            disabled={saving}
            onClick={() => navigate("/employees")}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving..." : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
