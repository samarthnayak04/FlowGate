const colorMap = {
  indigo: "border-indigo-500/30 text-indigo-400",
  blue: "border-blue-500/30 text-blue-400",
  green: "border-green-500/30 text-green-400",
  red: "border-red-500/30 text-red-400",
};

export default function StatCard({ title, value, color = "indigo" }) {
  return (
    <div
      className={`bg-slate-900/60 border ${colorMap[color]} p-6 rounded-2xl hover:border-opacity-60 transition`}
    >
      <h3 className="text-sm text-slate-400">{title}</h3>
      <p className={`text-4xl font-bold mt-3 ${colorMap[color].split(" ")[1]}`}>
        {value}
      </p>
    </div>
  );
}
