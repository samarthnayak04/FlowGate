const badgeMap = {
  DRAFT: "bg-slate-700 text-slate-300",
  SUBMITTED: "bg-blue-500/20 text-blue-400",
  APPROVED: "bg-green-500/20 text-green-400",
  REJECTED: "bg-red-500/20 text-red-400",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeMap[status] || "bg-slate-700 text-slate-300"}`}
    >
      {status}
    </span>
  );
}
