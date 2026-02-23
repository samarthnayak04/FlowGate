import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { ArrowLeft } from "lucide-react";

// ─── Audit log action colors ──────────────────────────────────
// Concept: each action type gets a distinct color so the
// timeline is easy to scan at a glance
const actionColors = {
  CREATE: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
  UPDATE: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  SUBMIT: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  APPROVE: "text-green-400 bg-green-500/10 border-green-500/30",
  REJECT: "text-red-400 bg-red-500/10 border-red-500/30",
};

export default function RequestDetail() {
  const { id } = useParams(); // ✅ get request ID from URL
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // Concept: parallel requests with Promise.all —
        // fetch request details AND logs at the same time
        // instead of waiting for one then the other
        const [requestRes, logsRes] = await Promise.all([
          api.get(`/api/requests/${id}`),
          api.get(`/api/requests/${id}/logs`),
        ]);
        setRequest(requestRes.data);
        setLogs(logsRes.data);
      } catch (err) {
        setError("Failed to load request details");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse h-40" />
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse h-64" />
      </div>
    );

  if (error)
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
        {error}
      </div>
    );

  if (!request) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* ── Back button ── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* ── Request details card ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-100">
              {request.title}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{request.type}</p>
          </div>
          <StatusBadge status={request.status} />
        </div>

        {request.description && (
          <p className="text-sm text-slate-400 border-t border-slate-800 pt-4">
            {request.description}
          </p>
        )}

        {/* ── Meta info ── */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4 text-sm">
          <div>
            <p className="text-slate-500">Requested by</p>
            <p className="text-slate-200 mt-1">{request.createdBy?.name}</p>
          </div>
          <div>
            <p className="text-slate-500">Assigned approver</p>
            <p className="text-slate-200 mt-1">
              {request.assignedApprover?.name}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Created</p>
            <p className="text-slate-200 mt-1">
              {new Date(request.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Last updated</p>
            <p className="text-slate-200 mt-1">
              {new Date(request.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* ── Audit log timeline ── */}
      {/* Concept: timeline UI — each log entry is a step in the
          request's lifecycle. Sorted newest first from backend. */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-slate-100">Audit Trail</h2>

        {logs.length === 0 && (
          <p className="text-sm text-slate-500">No activity yet</p>
        )}

        <div className="space-y-3">
          {logs.map((log, index) => (
            <div key={log._id} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 border ${actionColors[log.action]?.split(" ")[2]} bg-current`}
                />
                {index !== logs.length - 1 && (
                  <div className="w-px flex-1 bg-slate-800 mt-1" />
                )}
              </div>

              {/* Log content */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Action badge */}
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded border ${actionColors[log.action]}`}
                  >
                    {log.action}
                  </span>

                  {/* Status transition */}
                  {log.fromStatus && (
                    <span className="text-xs text-slate-500">
                      {log.fromStatus} → {log.toStatus}
                    </span>
                  )}
                  {!log.fromStatus && (
                    <span className="text-xs text-slate-500">
                      Created as {log.toStatus}
                    </span>
                  )}
                </div>

                {/* Who did it + when */}
                <p className="text-xs text-slate-500 mt-1">
                  by{" "}
                  <span className="text-slate-400">
                    {log.performedBy?.name}
                  </span>
                  {" · "}
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
