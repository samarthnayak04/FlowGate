import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import UserAvatar from "../components/UserAvatar";

const pageTitles = {
  "/app/dashboard": "Dashboard",
  "/app/requests": "My Requests",
  "/app/approvals": "Pending Approvals",
  "/app/admin/requests": "All Requests",
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed. Please try again");
    }
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
    }`;

  const currentTitle =
    pageTitles[location.pathname] ||
    (location.pathname.includes("/app/requests/")
      ? "Request Detail"
      : "FlowGate");

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <h1 className="text-lg font-semibold tracking-wide text-slate-100">
          FlowGate
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {user?.role === "USER" && (
          <>
            <NavLink
              to="/app/dashboard"
              className={navClass}
              onClick={() => setSidebarOpen(false)}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            <NavLink
              to="/app/requests"
              className={navClass}
              onClick={() => setSidebarOpen(false)}
            >
              <FileText size={18} />
              My Requests
            </NavLink>
          </>
        )}
        {user?.role === "APPROVER" && (
          <>
            <NavLink
              to="/app/dashboard"
              className={navClass}
              onClick={() => setSidebarOpen(false)}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            <NavLink
              to="/app/approvals"
              className={navClass}
              onClick={() => setSidebarOpen(false)}
            >
              <ClipboardCheck size={18} />
              Pending Approvals
            </NavLink>
          </>
        )}
        {user?.role === "ADMIN" && (
          <>
            <NavLink
              to="/app/dashboard"
              className={navClass}
              onClick={() => setSidebarOpen(false)}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            <NavLink
              to="/app/admin/requests"
              className={navClass}
              onClick={() => setSidebarOpen(false)}
            >
              <Shield size={18} />
              All Requests
            </NavLink>
          </>
        )}
      </nav>

      {/* ✅ User info with avatar + logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <UserAvatar name={user?.name} size="md" />
          <div className="min-w-0">
            <p className="text-sm text-slate-200 font-medium truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition w-full"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="h-screen flex bg-slate-950 text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col transform transition-transform duration-200 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-slate-400 hover:text-slate-200"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                {currentTitle}
              </h2>
              <p className="text-xs text-slate-500">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>

          {/* ✅ Avatar in topbar too */}
          <UserAvatar name={user?.name} size="sm" />
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
