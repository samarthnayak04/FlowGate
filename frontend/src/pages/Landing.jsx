import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Shield,
  GitBranch,
  ClipboardList,
  Zap,
  User,
  CheckCircle,
  BarChart3,
  Lock,
  Activity,
} from "lucide-react";

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

export default function Landing() {
  const navigate = useNavigate();
  const [rolesRef, rolesInView] = useInView();
  const [featuresRef, featuresInView] = useInView();

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 overflow-x-hidden">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-indigo-600/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-5%] w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-[100px]" />
      </div>

      {/* Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Navbar */}
      <nav className="relative z-10 px-8 h-16 flex items-center justify-between max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="text-lg font-bold tracking-tight text-white hover:text-indigo-300 transition"
        >
          Flow<span className="text-indigo-400">Gate</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-slate-400 hover:text-slate-200 transition px-4 py-2 rounded-lg hover:bg-white/5"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            Get Started
          </button>
        </div>
      </nav>
      <div className="relative z-10 border-b border-slate-800/40" />

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium px-4 py-2 rounded-full mb-8">
              <Zap size={12} className="fill-current" />
              Enterprise Workflow Engine
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-[1.08] mb-6 tracking-tight">
              Approvals
              <br />
              without
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                the chaos
              </span>
            </h1>

            <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg">
              Replace scattered emails with a structured, role-enforced approval
              workflow. Every request tracked. Every action logged.
            </p>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform"
              >
                Start for free <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-slate-500 hover:text-slate-300 transition flex items-center gap-2 px-4 py-3.5"
              >
                Sign in <ArrowRight size={14} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-800/60">
              {[
                { icon: <Lock size={14} />, text: "Encrypted Vault" },
                { icon: <Shield size={14} />, text: "Role-based access" },
                { icon: <Activity size={14} />, text: "Immutable audit logs" },
              ].map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-slate-500"
                >
                  <span className="text-indigo-500">{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right — product mockup */}
          <div className="relative">
            {/* Glow behind mockup */}
            <div className="absolute inset-0 bg-indigo-600/10 rounded-3xl blur-3xl scale-110" />

            <div className="relative bg-slate-900/80 border border-slate-700/60 rounded-3xl p-5 backdrop-blur-md shadow-2xl shadow-black/60">
              {/* Mac dots */}
              <div className="flex gap-1.5 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-auto text-xs text-slate-600">
                  FlowGate Dashboard
                </span>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <MockStatCard label="Total Requests" value="12" />
                <MockStatCard label="Submitted" value="4" color="blue" />
                <MockStatCard label="Approved" value="6" color="emerald" />
                <MockStatCard label="Rejected" value="2" color="red" />
              </div>

              {/* Mock recent activity */}
              {/* Updated Recent Activity */}
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/40 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Live Activity Feed
                  </p>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      title: "Annual Leave Request",
                      status: "APPROVED",
                      time: "2m ago",
                      icon: "🌴",
                      color:
                        "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                    },
                    {
                      title: "Laptop Expense Claim",
                      status: "SUBMITTED",
                      time: "1h ago",
                      icon: "💻",
                      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                    },
                    {
                      title: "VPN Access Request",
                      status: "DRAFT",
                      time: "3h ago",
                      icon: "🔒",
                      color:
                        "text-slate-400 bg-slate-700/60 border-slate-600/30",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/30 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-lg">{item.icon}</span>
                        <div className="truncate">
                          <p className="text-xs font-medium text-slate-200 truncate">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {item.time}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.color} transition-transform group-hover:scale-105`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section
        ref={rolesRef}
        className="relative z-10 max-w-7xl mx-auto px-8 py-20"
      >
        <p className="text-xs text-slate-600 uppercase tracking-[0.2em] text-center mb-4 font-semibold">
          Built for every role
        </p>
        <h2 className="text-3xl font-black text-center text-white mb-14">
          One system, three perspectives
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <User size={22} />,
              color: "indigo",
              title: "User",
              tagline: "Submit & track",
              points: [
                "Create draft requests",
                "Submit for approval",
                "Real-time status tracking",
                "Full audit history",
              ],
            },
            {
              icon: <CheckCircle size={22} />,
              color: "emerald",
              title: "Approver",
              tagline: "Review & decide",
              points: [
                "See assigned requests",
                "Approve or reject instantly",
                "Access request details",
                "Decision history",
              ],
              highlight: true,
            },
            {
              icon: <BarChart3 size={22} />,
              color: "cyan",
              title: "Admin",
              tagline: "Oversee everything",
              points: [
                "System-wide visibility",
                "Filter by status & type",
                "Monitor all activity",
                "Compliance ready",
              ],
            },
          ].map((r, i) => {
            const colors = {
              indigo: {
                bg: "bg-indigo-500/10",
                border: "border-indigo-500/20",
                text: "text-indigo-400",
                dot: "bg-indigo-400",
                card: "hover:border-indigo-500/40",
              },
              emerald: {
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20",
                text: "text-emerald-400",
                dot: "bg-emerald-400",
                card: "hover:border-emerald-500/40",
              },
              cyan: {
                bg: "bg-cyan-500/10",
                border: "border-cyan-500/20",
                text: "text-cyan-400",
                dot: "bg-cyan-400",
                card: "hover:border-cyan-500/40",
              },
            }[r.color];

            return (
              <div
                key={i}
                className={`relative rounded-2xl p-7 border transition-all duration-300 ${colors.card} ${
                  r.highlight
                    ? "bg-slate-800/60 border-slate-700"
                    : "bg-slate-900/40 border-slate-800"
                }`}
                style={{
                  animation: rolesInView
                    ? `fadeUp 0.6s ease ${0.12 * i}s both`
                    : "none",
                  opacity: rolesInView ? undefined : 0,
                }}
              >
                {r.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-emerald-500 text-white px-3 py-1 rounded-full font-semibold">
                    Most active
                  </div>
                )}
                <div
                  className={`w-11 h-11 border rounded-xl flex items-center justify-center mb-5 ${colors.bg} ${colors.border} ${colors.text}`}
                >
                  {r.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{r.title}</h3>
                <p className={`text-xs mb-4 ${colors.text}`}>{r.tagline}</p>
                <ul className="space-y-2.5">
                  {r.points.map((p, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2.5 text-sm text-slate-400"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Features ── */}
      <section
        ref={featuresRef}
        className="relative z-10 max-w-7xl mx-auto px-8 py-20 border-t border-slate-800/40"
      >
        <p className="text-xs text-slate-600 uppercase tracking-[0.2em] text-center mb-4 font-semibold">
          Why FlowGate
        </p>
        <h2 className="text-3xl font-black text-center text-white mb-14">
          Production-grade from day one
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <GitBranch size={22} />,
              color: "text-indigo-400",
              bg: "bg-indigo-500/10 border-indigo-500/20",
              title: "State Machine Lifecycle",
              desc: "Strict DRAFT → SUBMITTED → APPROVED flow enforced server-side. No invalid transitions, ever.",
            },
            {
              icon: <Shield size={22} />,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10 border-emerald-500/20",
              title: "Role-Based Access Control",
              desc: "Three roles, three views. Enforced at the middleware level — not just hidden in the UI.",
            },
            {
              icon: <ClipboardList size={22} />,
              color: "text-cyan-400",
              bg: "bg-cyan-500/10 border-cyan-500/20",
              title: "Immutable Audit Trail",
              desc: "Append-only logs for every state change. Who did it, when, and what changed — forever.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl p-7 hover:border-slate-700 transition-all duration-300"
              style={{
                animation: featuresInView
                  ? `fadeUp 0.6s ease ${0.12 * i}s both`
                  : "none",
                opacity: featuresInView ? undefined : 0,
              }}
            >
              <div
                className={`w-11 h-11 border rounded-xl flex items-center justify-center mb-5 ${f.bg} ${f.color}`}
              >
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-3">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Lifecycle ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-20 border-t border-slate-800/40">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-[0.2em] mb-4 font-semibold">
              Request Lifecycle
            </p>
            <h2 className="text-3xl font-black text-white mb-6">
              Every transition enforced
            </h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              No skipping steps. No going back. The state machine is enforced
              entirely on the backend — the frontend just reflects reality.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition"
            >
              See it in action <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                status: "DRAFT",
                desc: "Created by user, can be edited",
                color: "border-slate-700 bg-slate-800/60",
                badge: "bg-slate-700 text-slate-300",
              },
              {
                status: "SUBMITTED",
                desc: "Sent to approver, locked for editing",
                color: "border-blue-500/30 bg-blue-500/5",
                badge: "bg-blue-500/20 text-blue-400",
              },
              {
                status: "APPROVED",
                desc: "Approver accepted the request",
                color: "border-emerald-500/30 bg-emerald-500/5",
                badge: "bg-emerald-500/20 text-emerald-400",
              },
              {
                status: "REJECTED",
                desc: "Approver declined the request",
                color: "border-red-500/30 bg-red-500/5",
                badge: "bg-red-500/20 text-red-400",
              },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-xl border ${s.color}`}
              >
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${s.badge}`}
                >
                  {s.status}
                </span>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-20 border-t border-slate-800/40">
        <div className="rounded-3xl p-16 text-center bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-slate-900/0 border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
          <h2 className="text-4xl font-black mb-4 text-white">
            Ready to ship?
          </h2>
          <p className="text-slate-400 mb-10 text-lg max-w-lg mx-auto">
            A production-grade workflow engine. Secure, structured, and fully
            logged.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-slate-900 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-100 transition flex items-center gap-2"
            >
              Create free account <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-slate-700 text-slate-300 px-8 py-3.5 rounded-xl font-medium hover:bg-slate-800 transition"
            >
              Sign in
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/40 px-8 py-8 max-w-7xl mx-auto flex justify-between items-center text-xs text-slate-600">
        <span className="font-bold text-sm">
          Flow<span className="text-indigo-500">Gate</span>
        </span>
        <span>Built with Node.js · React · MongoDB · Docker</span>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function MockStatCard({ label, value, color }) {
  const colors = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    red: "text-red-400",
  };
  return (
    <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/40">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-black ${colors[color] || "text-slate-200"}`}>
        {value}
      </p>
    </div>
  );
}
