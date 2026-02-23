import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyRequests from "./pages/MyRequests";
import PendingApprovals from "./pages/PendingApprovals";
import AllRequests from "./pages/AllRequests";
import RequestDetail from "./pages/RequestDetail";
import Unauthorized from "./pages/Unauthorized";

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid #334155",
            fontSize: "14px",
          },
        }}
      />
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ── Protected ── */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* ✅ Role-based default redirect */}
          <Route index element={<RoleRedirect />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* USER */}
          <Route
            path="requests"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <MyRequests />
              </ProtectedRoute>
            }
          />
          <Route path="requests/:id" element={<RequestDetail />} />

          {/* APPROVER */}
          <Route
            path="approvals"
            element={
              <ProtectedRoute allowedRoles={["APPROVER"]}>
                <PendingApprovals />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="admin/requests"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AllRequests />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

// ✅ Redirects to correct page based on role
// Concept: instead of hardcoding a single redirect,
// we check the user's role and send them to the right place
function RoleRedirect() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "ADMIN")
    return <Navigate to="/app/admin/requests" replace />;
  if (user.role === "APPROVER") return <Navigate to="/app/approvals" replace />;
  return <Navigate to="/app/requests" replace />;
}
