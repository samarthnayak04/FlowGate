import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function PendingApprovals() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  async function fetchPending() {
    try {
      const res = await api.get("/api/requests/pending");
      setRequests(res.data);
    } catch (err) {
      setError("Failed to load pending approvals");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      await api.post(`/api/requests/${id}/${action}`);
      if (action === "approve") {
        toast.success("Request approved successfully");
      } else {
        toast.error("Request rejected");
      }
      fetchPending();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">
          Pending Approvals
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Requests waiting for your decision
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-pulse h-20"
            />
          ))}
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg">No pending approvals</p>
          <p className="text-sm mt-1">You're all caught up!</p>
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
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
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
                  <td className="px-6 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(r._id, "approve")}
                        disabled={!!actionLoading}
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-medium px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                      >
                        {actionLoading === r._id + "approve"
                          ? "..."
                          : "Approve"}
                      </button>
                      <button
                        onClick={() => handleAction(r._id, "reject")}
                        disabled={!!actionLoading}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                      >
                        {actionLoading === r._id + "reject" ? "..." : "Reject"}
                      </button>
                    </div>
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
