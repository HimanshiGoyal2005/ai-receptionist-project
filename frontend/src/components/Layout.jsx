import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

// 🌟 Base nested route tracking parameters update
const pageTitles = {
  "/dashboard": "Dashboard",
  "/dashboard/leads": "Leads",
  "/dashboard/conversations": "Conversations",
  "/dashboard/appointments": "Appointments",
  "/dashboard/sales": "Sales Agent",
};

function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <div
      className="flex min-h-screen antialiased text-slate-800 relative font-sans"
      style={{
        backgroundColor: "#F8FAFC",
        backgroundImage: `
          linear-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "45px 45px",
      }}
    >
      {/* Dynamic Visual Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-40 right-[10%] w-[500px] h-[500px] rounded-full opacity-20 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, #7C3AED 0%, rgba(6, 182, 212, 0.2) 100%)",
          }}
        />
        <div
          className="absolute top-[35%] -left-40 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, #06B6D4 0%, rgba(124, 58, 237, 0.1) 100%)",
          }}
        />
      </div>

      {/* Left Sidebar Fixed Navigation */}
      <Sidebar />

      {/* Main Content Workspace viewport */}
      <div className="flex-1 ml-64 flex flex-col relative z-10">
        <Navbar title={title} />

        {/* Main Content Area Box wrapper */}
        <main className="flex-1 mt-16 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
