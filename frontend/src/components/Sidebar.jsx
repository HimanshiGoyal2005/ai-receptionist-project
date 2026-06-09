import { NavLink } from "react-router-dom";

const links = [
  {
    path: "/",
    label: "Dashboard",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
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
    path: "/leads",
    label: "Leads",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
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
    path: "/conversations",
    label: "Conversations",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
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
    path: "/appointments",
    label: "Appointments",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
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
];

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#0A0E17] border-r border-gray-800/80 text-white flex flex-col fixed left-0 top-0 z-20">
      {/* Branding Header */}
      <div className="p-6 border-b border-gray-800/80 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center text-xs shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            🤖
          </div>
          <h1 className="text-md font-bold tracking-wider text-white">
            AI RECEPTIONIST
          </h1>
        </div>
        <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-widest pl-7">
          Voice Dashboard
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all relative group overflow-hidden ${
                isActive
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_12px_rgba(59,130,246,0.05)]"
                  : "text-gray-400 hover:bg-gray-800/40 hover:text-gray-200 border border-transparent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Visual Accent Glow on Left Side for Active Item */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500 rounded-r-sm shadow-[0_0_10px_rgba(59,130,246,1)]" />
                )}
                <div
                  className={`transition-transform duration-200 group-hover:scale-105 ${isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"}`}
                >
                  {link.icon}
                </div>
                <span>{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Meta Details */}
      <div className="p-4 border-t border-gray-800/80 bg-[#070A10]/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[11px] text-gray-500 font-medium">
            Session Core Connected
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
