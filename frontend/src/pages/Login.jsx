import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // FastAPI login endpoint expects a JSON body with email and password.
      const payload = {
        email,
        password,
      };

      const res = await API.post("/api/auth/login", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Backend returns { token, user }
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user || { email }),
        );

        // Axios ke common headers set karo taaki agli saari API requests mein token automatic jaye
        API.defaults.headers.common["Authorization"] =
          `Bearer ${res.data.token}`;

        // Redirect to Dashboard
        navigate("/dashboard", { replace: true });
      } else {
        setError("Something went wrong. Token not found!");
      }
    } catch (err) {
      console.error("Login Error details:", err.response?.data || err.message);

      // Agar backend ne koi specific detail error bheja hai toh wo dikhao, nahi toh default message
      const backendMessage = err.response?.data?.detail;
      setError(
        backendMessage || "Invalid email or password! Please check again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🤖</div>
          <h1 className="text-3xl font-bold text-gray-800">AI Receptionist</h1>
          <p className="text-gray-500 text-sm mt-1">Voice Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="himanshi@gmail.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 rounded-lg transition-all"
          >
            {loading ? "⏳ Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
