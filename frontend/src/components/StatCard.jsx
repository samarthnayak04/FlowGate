export default function StatCard({ title, value }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition">
      <h3 className="text-sm text-slate-400">{title}</h3>
      <p className="text-3xl font-semibold mt-3">{value}</p>
    </div>
  );
}
