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

const roleBadgeColors = {
  USER: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  APPROVER: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  ADMIN: "bg-rose-500/15 text-rose-400 border-rose-500/30",
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
    `relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
      isActive
        ? "bg-indigo-600/90 text-white shadow-md shadow-indigo-500/20"
        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
    }`;

  const currentTitle =
    pageTitles[location.pathname] ||
    (location.pathname.includes("/app/requests/")
      ? "Request Detail"
      : "FlowGate");

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/60">
        <button
          onClick={() => navigate("/")}
          className="text-lg font-bold tracking-tight text-white hover:opacity-80 transition cursor-pointer"
        >
          Flow<span className="text-indigo-400">Gate</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {(user?.role === "USER" ||
          user?.role === "APPROVER" ||
          user?.role === "ADMIN") && (
          <NavLink
            to="/app/dashboard"
            className={navClass}
            onClick={() => setSidebarOpen(false)}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-indigo-400 rounded-r-full" />
                )}
                <LayoutDashboard size={17} />
                Dashboard
              </>
            )}
          </NavLink>
        )}

        {user?.role === "USER" && (
          <NavLink
            to="/app/requests"
            className={navClass}
            onClick={() => setSidebarOpen(false)}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-indigo-400 rounded-r-full" />
                )}
                <FileText size={17} />
                My Requests
              </>
            )}
          </NavLink>
        )}

        {user?.role === "APPROVER" && (
          <NavLink
            to="/app/approvals"
            className={navClass}
            onClick={() => setSidebarOpen(false)}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-indigo-400 rounded-r-full" />
                )}
                <ClipboardCheck size={17} />
                Pending Approvals
              </>
            )}
          </NavLink>
        )}

        {user?.role === "ADMIN" && (
          <NavLink
            to="/app/admin/requests"
            className={navClass}
            onClick={() => setSidebarOpen(false)}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-indigo-400 rounded-r-full" />
                )}
                <Shield size={17} />
                All Requests
              </>
            )}
          </NavLink>
        )}
      </nav>

      {/* User Card */}
      <div className="p-4 border-t border-slate-800/60">
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/40 rounded-xl p-3 space-y-3 hover:border-slate-600 transition-all duration-200">
          <div className="flex items-center gap-3">
            <UserAvatar name={user?.name} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-100 font-semibold truncate">
                {user?.name}
              </p>
              <span
                className={`text-[10px] tracking-wide font-semibold px-2.5 py-0.5 rounded-full border mt-1 inline-block ${roleBadgeColors[user?.role]}`}
              >
                {user?.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/10 py-1.5 rounded-lg transition-all duration-150"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-slate-950 text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900/95 backdrop-blur-sm border-r border-slate-800/60 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col transform transition-transform duration-200 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
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
        <header className="h-16 bg-slate-950 border-b border-slate-800/60 flex items-center px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-slate-400 hover:text-slate-200 mr-4"
          >
            <Menu size={20} />
          </button>

          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-100">
              {currentTitle}
            </h2>
            <p className="text-xs text-slate-500">
              Welcome back,{" "}
              <span className="text-slate-300 font-medium">{user?.name}</span>
            </p>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-950 relative">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/40" />
          <div className="relative">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
