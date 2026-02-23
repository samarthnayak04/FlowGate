import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import UserAvatar from "../components/UserAvatar";
import StatusBadge from "../components/StatusBadge";

// ✅ Stat card with icon and color accent
function StatCard({ title, value, color, subtitle }) {
  const colors = {
    indigo: "border-indigo-500/30 bg-indigo-500/5 text-indigo-400",
    blue: "border-blue-500/30 bg-blue-500/5 text-blue-400",
    green: "border-green-500/30 bg-green-500/5 text-green-400",
    red: "border-red-500/30 bg-red-500/5 text-red-400",
    slate: "border-slate-700 bg-slate-800/50 text-slate-400",
  };

  return (
    <div className={`border rounded-2xl p-6 space-y-3 ${colors[color]}`}>
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`text-4xl font-bold ${colors[color].split(" ")[2]}`}>
        {value}
      </p>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (user?.role === "USER") {
          const res = await api.get("/api/requests/my");
          const data = res.data;
          setStats({
            total: data.length,
            draft: data.filter((r) => r.status === "DRAFT").length,
            submitted: data.filter((r) => r.status === "SUBMITTED").length,
            approved: data.filter((r) => r.status === "APPROVED").length,
            rejected: data.filter((r) => r.status === "REJECTED").length,
          });
          setRecent(data.slice(0, 5)); // last 5 requests
        } else if (user?.role === "APPROVER") {
          const res = await api.get("/api/requests/pending");
          setStats({ pending: res.data.length });
          setRecent(res.data.slice(0, 5));
        } else if (user?.role === "ADMIN") {
          const res = await api.get("/api/requests/all");
          const data = res.data;
          setStats({
            total: data.length,
            submitted: data.filter((r) => r.status === "SUBMITTED").length,
            approved: data.filter((r) => r.status === "APPROVED").length,
            rejected: data.filter((r) => r.status === "REJECTED").length,
          });
          setRecent(data.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (loading)
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse h-32"
            />
          ))}
        </div>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* ── Welcome banner ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
        <UserAvatar name={user?.name} size="lg" />
        <div>
          <h1 className="text-xl font-semibold text-slate-100">
            Good {getGreeting()}, {user?.name}!
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {user?.role === "USER" &&
              "Track and manage your workflow requests below."}
            {user?.role === "APPROVER" &&
              "You have requests waiting for your review."}
            {user?.role === "ADMIN" &&
              "Here's a system-wide overview of all activity."}
          </p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      {user?.role === "USER" && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total"
            value={stats.total}
            color="slate"
            subtitle="All requests"
          />
          <StatCard
            title="Submitted"
            value={stats.submitted}
            color="blue"
            subtitle="Awaiting review"
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            color="green"
            subtitle="Completed"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            color="red"
            subtitle="Declined"
          />
        </div>
      )}

      {user?.role === "APPROVER" && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Pending"
            value={stats.pending}
            color="blue"
            subtitle="Need your action"
          />
        </div>
      )}

      {user?.role === "ADMIN" && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total"
            value={stats.total}
            color="slate"
            subtitle="All requests"
          />
          <StatCard
            title="Pending"
            value={stats.submitted}
            color="blue"
            subtitle="Awaiting review"
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            color="green"
            subtitle="Completed"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            color="red"
            subtitle="Declined"
          />
        </div>
      )}

      {/* ── Recent activity ── */}
      {recent.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">
              Recent Activity
            </h2>
            <button
              onClick={() => {
                if (user?.role === "USER") navigate("/app/requests");
                else if (user?.role === "APPROVER") navigate("/app/approvals");
                else navigate("/app/admin/requests");
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition"
            >
              View all →
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {recent.map((r) => (
              <div
                key={r._id}
                onClick={() => navigate(`/app/requests/${r._id}`)}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {/* ✅ Show creator avatar for admin/approver view */}
                  {(user?.role === "ADMIN" || user?.role === "APPROVER") && (
                    <UserAvatar name={r.createdBy?.name} size="sm" />
                  )}
                  <div>
                    <p className="text-sm text-slate-200 font-medium">
                      {r.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {r.type}
                      {user?.role !== "USER" && ` · ${r.createdBy?.name}`}
                      {" · "}
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {recent.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-500 text-sm">No activity yet</p>
          {user?.role === "USER" && (
            <button
              onClick={() => navigate("/app/requests")}
              className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Create your first request
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ✅ Time-based greeting
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
