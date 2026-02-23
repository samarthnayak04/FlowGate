import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <p className="text-6xl">🚫</p>
        <h1 className="text-2xl font-semibold text-slate-100">Access Denied</h1>
        <p className="text-sm text-slate-500">
          You don't have permission to view this page.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
