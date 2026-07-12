import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClients, getClientById, updateClient } from "../services/clientService";
import { toast } from "react-hot-toast";

export default function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  // List of all clients for picker if no ID is present
  const [clientList, setClientList] = useState([]);
  const [selectedId, setSelectedId] = useState(id || "");

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

  const [loading, setLoading] = useState(false);
  const [fetchingList, setFetchingList] = useState(false);

  useEffect(() => {
    if (!id) {
      async function loadList() {
        setFetchingList(true);
        try {
          const res = await getClients({ limit: 100 });
          setClientList(res.data.data || []);
        } catch (err) {
          console.error(err);
          toast.error("Failed to load clients list for selector.");
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
          const res = await getClientById(selectedId);
          const data = res.data.data;
          
          setForm({
            clientName: data.clientName || "",
            companyName: data.companyName || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            alternativePhoneNumber: data.alternativePhoneNumber || "",
            pocSameAsClient: data.pocSameAsClient || false,
            poc: {
              name: data.poc?.name || "",
              mobileNumber: data.poc?.mobileNumber || "",
            },
            address: data.address || "",
            location: data.location || "N/A",
            status: data.status || "Active",
            totalServices: data.totalServices || 0,
            pendingAmount: data.pendingAmount || 0,
          });
        } catch (err) {
          console.error(err);
          toast.error("Failed to load client details.");
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
      toast.error("Please select a client first.");
      return;
    }

    try {
      await updateClient(selectedId, form);
      toast.success("Client updated successfully!");
      navigate("/clients");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update client details.");
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
        <h1 className="text-2xl font-bold text-slate-800">Edit Client File</h1>
        <button
          onClick={() => navigate("/clients")}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
        >
          Back to List
        </button>
      </div>

      {/* Select Client Dropdown (if no route ID) */}
      {!id && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <label className="block text-sm font-semibold text-slate-600">
            Select Client to Edit
          </label>
          <div className="relative mt-2">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-blue-400"
            >
              <option value="">-- Choose Client --</option>
              {fetchingList ? (
                <option disabled>Loading list...</option>
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
      )}

      {/* Edit Form */}
      {(selectedId || loading) && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6"
        >
          {loading ? (
            <p className="text-center text-slate-500 font-medium py-10">
              Loading client details...
            </p>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Client Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Client Name
                  </label>
                  <input
                    type="text"
                    required
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
                    Billing / Physical Address
                  </label>
                  <textarea
                    rows={2}
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
                  onClick={() => navigate("/clients")}
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
