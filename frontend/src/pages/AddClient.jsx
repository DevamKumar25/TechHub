import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "../services/clientService";
import { toast } from "react-hot-toast";

export default function AddClient() {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    clientName: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    alternativePhoneNumber: "",
    pocSameAsClient: false,
    poc: {
      name: "",
      mobileNumber: "",
    },
    address: "",
    location: "N/A",
    status: "Active",
    totalServices: 0,
    pendingAmount: 0,
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createClient(form);
      toast.success("Client added successfully!");
      navigate("/clients");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to create client details."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePocCheckbox = (checked) => {
    setForm((prev) => ({
      ...prev,
      pocSameAsClient: checked,
      poc: checked
        ? { name: prev.clientName, mobileNumber: prev.phoneNumber }
        : { name: "", mobileNumber: "" },
    }));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Add New Client</h1>
        <button
          onClick={() => navigate("/clients")}
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
          {/* Client Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Client Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jane Doe"
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Company Name
            </label>
            <input
              type="text"
              placeholder="e.g. Google LLC"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
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
              placeholder="e.g. contact@google.com"
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
              required
              placeholder="e.g. +91 9988776655"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Alt Phone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Alternative Phone
            </label>
            <input
              type="text"
              placeholder="Alternative phone contact..."
              value={form.alternativePhoneNumber}
              onChange={(e) =>
                setForm({ ...form, alternativePhoneNumber: e.target.value })
              }
              className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. California, USA"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Client Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm outline-none focus:border-blue-400"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Full Address Detils
            </label>
            <textarea
              rows={2}
              placeholder="City state Country..."
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* POC Same as Client */}
          <div className="md:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="pocSameAsClient"
              checked={form.pocSameAsClient}
              onChange={(e) => handlePocCheckbox(e.target.checked)}
              className="h-4 w-4 rounded-sm border-slate-200 text-blue-600 outline-none focus:ring-0"
            />
            <label
              htmlFor="pocSameAsClient"
              className="text-sm font-semibold text-slate-600"
            >
              Point of Contact (POC) details same as Client
            </label>
          </div>

          {/* POC Header */}
          <div className="md:col-span-2 border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-800">
              Point of Contact (POC) Details
            </h3>
          </div>

          {/* POC Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              POC Name
            </label>
            <input
              type="text"
              disabled={form.pocSameAsClient}
              placeholder="POC Full Name"
              value={form.poc.name}
              onChange={(e) =>
                setForm({ ...form, poc: { ...form.poc, name: e.target.value } })
              }
              className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400 disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          {/* POC Mobile */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              POC Mobile Number
            </label>
            <input
              type="text"
              disabled={form.pocSameAsClient}
              placeholder="POC phone number"
              value={form.poc.mobileNumber}
              onChange={(e) =>
                setForm({
                  ...form,
                  poc: { ...form.poc, mobileNumber: e.target.value },
                })
              }
              className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-blue-400 disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          {/* Financial Headers */}
          <div className="md:col-span-2 border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-800">
              Financial Summary
            </h3>
          </div>

          {/* Total Services */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Services / Contracts
            </label>
            <input
              type="number"
              value={form.totalServices}
              onChange={(e) =>
                setForm({ ...form, totalServices: Number(e.target.value) })
              }
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
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <button
            type="button"
            disabled={saving}
            onClick={() => navigate("/clients")}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving..." : "Add Client"}
          </button>
        </div>
      </form>
    </div>
  );
}
