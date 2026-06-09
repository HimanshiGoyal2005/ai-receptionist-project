import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const pageTitles = {
  "/": "Dashboard",
  "/leads": "Leads",
  "/conversations": "Conversations",
  "/appointments": "Appointments",
};

function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="flex bg-[#080B11] min-h-screen antialiased text-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title={title} />
        {/* Adjusted spacing to blend nicely under the fixed glass navbar */}
        <main className="mt-16 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
