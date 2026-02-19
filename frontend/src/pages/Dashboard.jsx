import { useEffect, useState } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      const res = await api.get("/api/requests/my");
      const data = res.data;

      const total = data.length;
      const submitted = data.filter((r) => r.status === "SUBMITTED").length;
      const approved = data.filter((r) => r.status === "APPROVED").length;
      const rejected = data.filter((r) => r.status === "REJECTED").length;

      setStats({ total, submitted, approved, rejected });
    }

    fetchStats();
  }, []);

  if (!stats) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>

      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Total Requests" value={stats.total} />
        <StatCard title="Submitted" value={stats.submitted} />
        <StatCard title="Approved" value={stats.approved} />
        <StatCard title="Rejected" value={stats.rejected} />
      </div>
    </div>
  );
}
