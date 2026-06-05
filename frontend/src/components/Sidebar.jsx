import { NavLink } from "react-router-dom";

const links = [
  { path: "/", label: "🏠 Dashboard" },
  { path: "/leads", label: "👥 Leads" },
  { path: "/conversations", label: "💬 Conversations" },
  { path: "/appointments", label: "📅 Appointments" },
];

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-blue-400">🤖 AI Receptionist</h1>
        <p className="text-xs text-gray-400 mt-1">Voice Dashboard</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/"}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">Logged in as Himanshi</p>
      </div>
    </div>
  );
}

export default Sidebar;
