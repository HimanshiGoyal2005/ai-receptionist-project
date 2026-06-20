import { useNavigate } from "react-router-dom";

function Navbar({ title }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className="h-16 backdrop-blur-xl flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-10 transition-all"
      style={{
        background: "rgba(255, 255, 255, 0.75)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
        boxShadow: "0 4px 30px rgba(15, 23, 42, 0.01)",
      }}
    >
      {/* Left: Title with space grotesk font style */}
      <div className="flex items-center gap-3">
        <h2
          className="text-xl font-extrabold text-slate-900 tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {title}
        </h2>
      </div>

      {/* Right: Profile & Actions */}
      <div className="flex items-center gap-4">
        {/* Status Badge */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-purple-100"
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.02)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse"
            style={{ boxShadow: "0 0 6px rgba(124, 58, 237, 0.4)" }}
          />
          <span
            className="text-[10px] font-bold uppercase tracking-wider text-purple-600"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Active
          </span>
        </div>

        <div className="h-5 w-px bg-slate-200" />

        {/* Profile Section */}
        <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-right">
            <p
              className="text-xs font-bold text-slate-800 tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Himanshi
            </p>
            <p
              className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Admin
            </p>
          </div>
          <div
            className="w-7 h-7 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xs font-extrabold"
            style={{
              boxShadow: "0 2px 8px rgba(124, 58, 237, 0.25)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            H
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-2.5 py-2 rounded-xl text-xs bg-white border border-slate-200 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 shadow-sm"
          title="Logout"
        >
          🚪
        </button>
      </div>
    </div>
  );
}

export default Navbar;
