import { useState, useEffect } from "react";
import api from "../services/api";
import { X } from "lucide-react";

export default function CreateRequestModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    type: "LEAVE",
    description: "",
    assignedApprover: "",
  });
  const [approvers, setApprovers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch approvers list
  useEffect(() => {
    async function fetchApprovers() {
      try {
        const res = await api.get("/api/users/approvers");
        setApprovers(res.data);
      } catch {
        // silently fail — user can paste ID manually
      }
    }
    fetchApprovers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/requests", form);
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">New Request</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-slate-400">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
              placeholder="e.g. Leave Request for 5 days"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-400">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="LEAVE">Leave</option>
              <option value="EXPENSE">Expense</option>
              <option value="ACCESS">Access</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-400">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
              placeholder="Describe your request..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-400">Assigned Approver</label>
            {approvers.length > 0 ? (
              <select
                name="assignedApprover"
                value={form.assignedApprover}
                onChange={handleChange}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="">Select approver</option>
                {approvers.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="assignedApprover"
                value={form.assignedApprover}
                onChange={handleChange}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
                placeholder="Paste approver user ID"
              />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium py-2.5 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition"
            >
              {loading ? "Creating..." : "Create Draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
