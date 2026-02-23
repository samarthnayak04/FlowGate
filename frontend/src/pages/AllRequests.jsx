import { useEffect, useState } from "react";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function AllRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ status: "", type: "" });

  async function fetchAll() {
    try {
      const res = await api.get("/api/requests/all", {
        params: {
          ...(filters.status && { status: filters.status }),
          ...(filters.type && { type: filters.type }),
        },
      });
      setRequests(res.data);
    } catch (err) {
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, [filters]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">All Requests</h1>
        <p className="text-sm text-slate-500 mt-1">
          System-wide request overview
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition"
        >
          <option value="">All Types</option>
          <option value="LEAVE">Leave</option>
          <option value="EXPENSE">Expense</option>
          <option value="ACCESS">Access</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-pulse h-16"
            />
          ))}
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg">No requests found</p>
          <p className="text-sm mt-1">Try changing the filters</p>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-left">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Requested By</th>
                <th className="px-6 py-4 font-medium">Approver</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {requests.map((r) => (
                <tr key={r._id} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 text-slate-200 font-medium">
                    {r.title}
                  </td>
                  <td className="px-6 py-4 text-slate-400">{r.type}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {r.createdBy?.name}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {r.assignedApprover?.name}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
