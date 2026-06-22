import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Conversations from "./pages/Conversations";
import ConversationThread from "./pages/ConversationThread";
import Appointments from "./pages/Appointments";
import Layout from "./components/Layout";
import SalesAgent from "./pages/SalesAgent";
import Home from "./components/Home";
import { useState, useEffect } from "react";
// 🔒 Premium Authentication Gate Component
function ProtectedRoute({ children }) {
  // Use a small effect to check if we are truly unauthenticated
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>; // Prevent flickering
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Public Route: Premium OmniDim Landing Page (Koi bhi dekh sakta hai) */}
        <Route path="/" element={<Home />} />

        {/* 🔑 Public Route: Secure Login Portal */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 Shielded Core Workspace: Access strictly denied without Token */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Layout viewport components mapping nested indices */}
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="conversations" element={<Conversations />} />
          <Route
            path="conversations/:leadId"
            element={<ConversationThread />}
          />
          <Route path="sales" element={<SalesAgent />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>

        {/* Fallback Security Check: Destroy dead URL strings */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
