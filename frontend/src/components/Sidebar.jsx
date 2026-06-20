import { NavLink } from "react-router-dom";

// 🌟 Sabhi links ke paths ko secure route ke sath sync kiya hai
const links = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
        />
      </svg>
    ),
  },
  {
    path: "/dashboard/leads",
    label: "Leads",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    path: "/dashboard/conversations",
    label: "Conversations",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    path: "/dashboard/appointments",
    label: "Appointments",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    path: "/dashboard/sales",
    label: "Sales Agent",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
];

function Sidebar() {
  return (
    <div
      className="w-64 h-screen bg-white text-slate-800 flex flex-col fixed left-0 top-0 z-20"
      style={{
        borderRight: "1px solid rgba(226, 232, 240, 0.6)",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
        boxShadow: "0 4px 30px rgba(15, 23, 42, 0.01)",
      }}
    >
      {/* Branding Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-base text-white"
            style={{ boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)" }}
          >
            🤖
          </div>
          <div>
            <h1
              className="text-xs font-black tracking-wider bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              AI RECEPTIONIST
            </h1>
            <p
              className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Voice Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            // 🌟 Strict exact link match check for the main dashboard dashboard view node
            end={link.path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all relative group overflow-hidden ${
                isActive
                  ? "bg-purple-50/50 text-purple-600 border border-purple-100 shadow-[0_2px_8px_rgba(124,58,237,0.02)]"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-800 border border-transparent"
              }`
            }
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {({ isActive }) => (
              <>
                {/* Clean Indicator Light */}
                {isActive && (
                  <div
                    className="absolute left-0 top-3 bottom-3 w-0.5 bg-purple-500 rounded-r"
                    style={{ boxShadow: "0 0 6px rgba(124, 58, 237, 0.6)" }}
                  />
                )}

                <div
                  className={`transition-transform duration-200 ${isActive ? "text-purple-600" : "text-slate-400"}`}
                >
                  {link.icon}
                </div>
                <span className="flex-1">{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Status */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/40">
        <div className="flex items-center gap-2 px-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)] animate-pulse" />
          <p
            className="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            System Active
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
