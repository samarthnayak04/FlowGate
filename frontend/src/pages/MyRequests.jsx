import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";
import CreateRequestModal from "../components/CreateRequestModal";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const navigate = useNavigate();

  async function fetchRequests() {
    try {
      const res = await api.get("/api/requests/my", {
        params: statusFilter ? { status: statusFilter } : {},
      });
      setRequests(res.data);
    } catch (err) {
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleSubmit = async (id) => {
    setActionLoading(id);
    try {
      await api.post(`/api/requests/${id}/submit`);
      toast.success("Request submitted successfully!");
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">My Requests</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage your workflow requests
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          + New Request
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["", "DRAFT", "SUBMITTED", "APPROVED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              statusFilter === s
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {s === "" ? "All" : s}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
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
          <p className="text-sm mt-1">
            {statusFilter
              ? `No ${statusFilter.toLowerCase()} requests`
              : "Create your first request to get started"}
          </p>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-left">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {requests.map((r) => (
                <tr
                  key={r._id}
                  onClick={() => navigate(`/app/requests/${r._id}`)}
                  className="hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <td className="px-6 py-4 text-slate-200 font-medium">
                    {r.title}
                  </td>
                  <td className="px-6 py-4 text-slate-400">{r.type}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {r.status === "DRAFT" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubmit(r._id);
                        }}
                        disabled={actionLoading === r._id}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                      >
                        {actionLoading === r._id ? "Submitting..." : "Submit"}
                      </button>
                    )}
                    {r.status === "SUBMITTED" && (
                      <span className="text-xs text-slate-500">
                        Awaiting approval
                      </span>
                    )}
                    {r.status === "APPROVED" && (
                      <span className="text-xs text-green-500">Completed</span>
                    )}
                    {r.status === "REJECTED" && (
                      <span className="text-xs text-red-500">Rejected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <CreateRequestModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            toast.success("Request created as draft!");
            fetchRequests();
          }}
        />
      )}
    </div>
  );
}
