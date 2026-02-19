import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, Settings } from "lucide-react";

export default function DashboardLayout() {
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
    }`;

  return (
    <div className="h-screen flex bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <h1 className="text-lg font-semibold tracking-wide">FlowGate</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 text-sm">
          <NavLink to="/app" end className={navClass}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/app/requests" className={navClass}>
            <FileText size={18} />
            Requests
          </NavLink>

          <NavLink to="/app/settings" className={navClass}>
            <Settings size={18} />
            Settings
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800 text-sm text-slate-500">
          Logged in
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-8">
          <div>
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <p className="text-xs text-slate-500">Monitor workflow activity</p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
