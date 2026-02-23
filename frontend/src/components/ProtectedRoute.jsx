import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  // ✅ Fix loading flash
  // Concept: when the app first loads, AuthContext checks
  // localStorage for a saved user. This takes a moment.
  // Without this check, ProtectedRoute sees user=null and
  // immediately redirects to login — even if you ARE logged in.
  // Showing a spinner while loading=true fixes this flash.
  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but wrong role → go to unauthorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // All good → render the page
  return children;
}
