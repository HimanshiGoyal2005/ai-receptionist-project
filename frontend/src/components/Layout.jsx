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
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title={title} />
        <main className="mt-16 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
