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
} from "lucide-react";

// ── Intersection observer hook ─────────────────────────────────
function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

export default function Landing() {
  const navigate = useNavigate();
  const [rolesRef, rolesInView] = useInView();

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 overflow-x-hidden">
      {/* ── Radial glow background ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] right-[-5%] w-[300px] h-[300px] bg-cyan-600/6 rounded-full blur-[80px]" />
      </div>

      {/* ── Grid pattern ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── Navbar ── */}
      <nav
        className="relative z-10 px-8 h-16 flex items-center justify-between max-w-6xl mx-auto"
        style={{ animation: "fadeDown 0.6s ease forwards" }}
      >
        <button
          onClick={() => navigate("/")}
          className="text-lg font-bold tracking-tight text-white hover:text-indigo-300 transition"
        >
          Flow<span className="text-indigo-400">Gate</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-slate-400 hover:text-slate-200 transition px-4 py-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-slate-700"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="relative bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Get Started <ArrowRight size={14} />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </nav>

      <div className="relative z-10 border-b border-slate-800/40" />

      {/* ── Hero ── */}
      <section
        className="relative z-10 max-w-4xl mx-auto px-8 pt-28 pb-20 text-center"
        style={{ animation: "fadeUp 0.8s ease 0.2s both" }}
      >
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium px-4 py-2 rounded-full mb-10">
          <Zap size={12} className="fill-current" />
          Enterprise Workflow Management
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
        </div>

        <h1 className="text-6xl md:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
          Approvals without
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #38bdf8 100%)",
            }}
          >
            the chaos
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          FlowGate replaces scattered emails and spreadsheets with a structured,
          secure approval system.{" "}
          <span className="text-slate-300">Every request tracked.</span>{" "}
          <span className="text-slate-300">Every action logged.</span>
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate("/register")}
            className="relative flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-xl transition overflow-hidden group"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Start for free <ArrowRight size={16} />
            </span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-slate-500 hover:text-slate-300 transition flex items-center gap-1"
          >
            Already have an account <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* ── Who it's for (replaces stats) ── */}
      <section
        ref={rolesRef}
        className="relative z-10 max-w-5xl mx-auto px-8 pb-20"
      >
        <p className="text-xs text-slate-600 uppercase tracking-[0.2em] text-center mb-10 font-semibold">
          Built for every role
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: <User size={20} />,
              iconColor: "text-indigo-400",
              iconBg: "bg-indigo-500/10 border-indigo-500/20",
              role: "User",
              tagline: "Submit & track requests",
              points: [
                "Create draft requests",
                "Submit for approval",
                "Track status in real-time",
                "View full audit history",
              ],
              delay: "0s",
            },
            {
              icon: <CheckCircle size={20} />,
              iconColor: "text-emerald-400",
              iconBg: "bg-emerald-500/10 border-emerald-500/20",
              role: "Approver",
              tagline: "Review & decide",
              points: [
                "See assigned requests",
                "Approve or reject instantly",
                "Access request details",
                "Full decision history",
              ],
              delay: "0.1s",
              highlight: true,
            },
            {
              icon: <BarChart3 size={20} />,
              iconColor: "text-cyan-400",
              iconBg: "bg-cyan-500/10 border-cyan-500/20",
              role: "Admin",
              tagline: "Oversee everything",
              points: [
                "System-wide visibility",
                "Filter by status & type",
                "Monitor all activity",
                "Compliance ready",
              ],
              delay: "0.2s",
            },
          ].map((r, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-6 space-y-4 border transition-all duration-300 ${
                r.highlight
                  ? "bg-indigo-950/40 border-indigo-500/40 hover:border-indigo-500/70"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
              style={{
                animation: rolesInView
                  ? `fadeUp 0.6s ease ${r.delay} both`
                  : "none",
                opacity: rolesInView ? undefined : 0,
              }}
            >
              {r.highlight && (
                <div className="absolute top-4 right-4 text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">
                  Most active
                </div>
              )}
              <div
                className={`w-10 h-10 border rounded-xl flex items-center justify-center ${r.iconBg} ${r.iconColor}`}
              >
                {r.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">{r.role}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{r.tagline}</p>
              </div>
              <ul className="space-y-2">
                {r.points.map((p, j) => (
                  <li
                    key={j}
                    className="flex items-center gap-2 text-sm text-slate-400"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        r.highlight ? "bg-indigo-400" : "bg-slate-600"
                      }`}
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 pb-24">
        <p className="text-xs text-slate-600 uppercase tracking-[0.2em] text-center mb-10 font-semibold">
          Why FlowGate
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: <GitBranch size={22} />,
              iconBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
              border: "hover:border-indigo-500/50",
              glow: "group-hover:bg-indigo-500/5",
              title: "State Machine Lifecycle",
              desc: "Requests follow a strict DRAFT → SUBMITTED → APPROVED flow. No skipping steps, no invalid transitions.",
            },
            {
              icon: <Shield size={22} />,
              iconBg:
                "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
              border: "hover:border-emerald-500/50",
              glow: "group-hover:bg-emerald-500/5",
              title: "Role-Based Access",
              desc: "Users, Approvers, and Admins each see only what they need. Enforced at the backend, not just the UI.",
            },
            {
              icon: <ClipboardList size={22} />,
              iconBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
              border: "hover:border-cyan-500/50",
              glow: "group-hover:bg-cyan-500/5",
              title: "Immutable Audit Logs",
              desc: "Every action is recorded — who did it, when, and what changed. Append-only for full compliance.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className={`group relative bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 transition-all duration-300 ${f.border} cursor-default`}
              style={{ animation: `fadeUp 0.6s ease ${0.1 * i + 0.5}s both` }}
            >
              <div
                className={`absolute inset-0 rounded-2xl transition-colors duration-300 ${f.glow}`}
              />
              <div
                className={`relative w-11 h-11 border rounded-xl flex items-center justify-center ${f.iconBg}`}
              >
                {f.icon}
              </div>
              <h3 className="relative text-base font-bold text-slate-100">
                {f.title}
              </h3>
              <p className="relative text-sm text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Lifecycle visual ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-8 pb-24 text-center">
        <p className="text-xs text-slate-600 uppercase tracking-[0.2em] mb-8 font-semibold">
          Request Lifecycle
        </p>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-10 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
            {[
              {
                label: "Draft",
                color: "bg-slate-800 text-slate-300 border-slate-700",
              },
              { label: "→", plain: true },
              {
                label: "Submitted",
                color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
              },
              { label: "→", plain: true },
              {
                label: "Approved",
                color:
                  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
              },
              { label: "/", plain: true },
              {
                label: "Rejected",
                color: "bg-red-500/15 text-red-400 border-red-500/30",
              },
            ].map((item, i) =>
              item.plain ? (
                <span key={i} className="text-slate-700 font-light text-lg">
                  {item.label}
                </span>
              ) : (
                <span
                  key={i}
                  className={`text-xs font-semibold px-4 py-2 rounded-full border tracking-wide ${item.color}`}
                >
                  {item.label}
                </span>
              ),
            )}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every transition enforced server-side. No invalid states. No
            skipping steps. No going back.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 pb-28">
        <div
          className="relative rounded-3xl p-12 text-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(79,70,229,0.15) 0%, rgba(124,58,237,0.15) 100%)",
          }}
        >
          <div className="absolute inset-0 border border-indigo-500/20 rounded-3xl" />
          <div className="absolute top-0 left-[50%] translate-x-[-50%] w-64 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <h2 className="relative text-3xl font-black text-white mb-3">
            Ready to bring order
            <br />
            to your approvals?
          </h2>
          <p className="relative text-sm text-slate-400 mb-8">
            Get started in seconds. No credit card required.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="relative inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-8 py-3.5 rounded-xl hover:bg-slate-100 transition"
          >
            Create free account <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-slate-800/40 px-8 py-6 max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-700">
        <span className="font-semibold">
          Flow<span className="text-indigo-500">Gate</span>
        </span>
        <span>Built with Node.js · React · MongoDB</span>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
