import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        // Register Pipeline Action
        const payload = { name, email, password };
        const res = await API.post("/api/auth/register", payload, {
          headers: { "Content-Type": "application/json" },
        });

        if (res.data && res.data.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem(
            "user",
            JSON.stringify(res.data.user || { name, email }),
          );
          API.defaults.headers.common["Authorization"] =
            `Bearer ${res.data.token}`;
          navigate("/", { replace: true });
        } else {
          setIsRegistering(false);
          setError(
            "Account provisioned successfully! Please initialize session.",
          );
        }
      } else {
        // Login Pipeline Action
        const payload = { email, password };
        const res = await API.post("/api/auth/login", payload, {
          headers: { "Content-Type": "application/json" },
        });

        if (res.data && res.data.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem(
            "user",
            JSON.stringify(res.data.user || { email }),
          );
          API.defaults.headers.common["Authorization"] =
            `Bearer ${res.data.token}`;
          navigate("/", { replace: true });
        } else {
          setError("Something went wrong. Token not found!");
        }
      }
    } catch (err) {
      console.error("Auth Error details:", err.response?.data || err.message);
      const backendMessage = err.response?.data?.detail;
      setError(
        backendMessage || "Operation rejected. Please check credentials again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStateToggle = () => {
    setIsRegistering(!isRegistering);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div
      className="min-h-screen flex font-sans antialiased text-slate-200"
      style={{ backgroundColor: "#070A13" }}
    >
      {/* LEFT SECTION: Premium Branding & Dynamic 3D Glow Concept */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden border-r border-slate-900/50">
        <div
          className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-10 blur-[80px]"
          style={{
            background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 max-w-lg w-full space-y-8">
          <div className="space-y-3">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full inline-block backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              Next-Gen Cognitive Architecture
            </span>
            <h1 className="text-5xl font-black tracking-tight text-white leading-tight">
              AI VOICE <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(6,182,212,0.15)]">
                RECEPTIONIST
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed font-light">
              Automate customer operations with intelligent voice pipelines,
              real-time intent extraction, and automated lead management.
            </p>
          </div>

          <div className="grid gap-4 mt-12">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-800/40 bg-white/[0.02] backdrop-blur-md transition-all duration-300 hover:border-slate-700/60 hover:bg-white/[0.02]">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                🎙️
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">
                  Ultra-Low Latency STT Pipeline
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Whisper-backed contextual speech processing.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-800/40 bg-white/[0.02] backdrop-blur-md transition-all duration-300 hover:border-slate-700/60 hover:bg-white/[0.02]">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                🧠
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">
                  Cognitive Intent Detection
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Extract leads, budgets, and structure records dynamically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Form Control Dashboard Wrapper */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="lg:hidden absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full opacity-10 blur-3xl bg-indigo-500" />

        <div className="w-full max-w-md relative">
          <div className="rounded-2xl p-8 md:p-10 border border-slate-800/60 bg-white/[0.02] backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
            {/* Switchable Headings */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {isRegistering ? "Provision Terminal Asset" : "Welcome Back"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isRegistering
                  ? "Initialize a new administrative node structure"
                  : "Enter your terminal credentials below"}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              {/* Conditional Name Input Render */}
              {isRegistering && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    Full Node Identity (Name)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-700 outline-none transition-all border border-slate-800/80 bg-slate-950/40 focus:border-indigo-500/60 focus:bg-slate-950/80 focus:ring-4 focus:ring-indigo-500/10"
                    required
                  />
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                  Email Terminal
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-700 outline-none transition-all border border-slate-800/80 bg-slate-950/40 focus:border-indigo-500/60 focus:bg-slate-950/80 focus:ring-4 focus:ring-indigo-500/10"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                  Security Passphrase
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-700 outline-none transition-all border border-slate-800/80 bg-slate-950/40 focus:border-indigo-500/60 focus:bg-slate-950/80 focus:ring-4 focus:ring-indigo-500/10"
                  required
                />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl text-xs flex items-center gap-2 border border-red-500/20 bg-red-500/10 text-red-400 backdrop-blur-sm">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Action Trigger Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white tracking-wide transition-all duration-300 transform active:scale-[0.98] relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group"
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)",
                  boxShadow:
                    "0 4px 20px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] transition-all duration-1000 -translate-x-full group-hover:translate-x-[300%]" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {isRegistering
                        ? "Assembling Node Structure..."
                        : "Verifying Token Core..."}
                    </>
                  ) : isRegistering ? (
                    "Instantiate Account →"
                  ) : (
                    "Initialize Session →"
                  )}
                </span>
              </button>
            </form>

            {/* View Switching Anchor Toggle */}
            <div className="mt-5 text-center">
              <p className="text-xs text-slate-500">
                {isRegistering
                  ? "Already possess core terminal parameters?"
                  : "Fresh system instance configuration required?"}{" "}
                <button
                  type="button"
                  onClick={handleStateToggle}
                  className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition-all outline-none bg-transparent border-none p-0 cursor-pointer"
                >
                  {isRegistering ? "Access Session" : "Provision Sub-Node"}
                </button>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-600">
              Secured Hypertext Console System Engine
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
