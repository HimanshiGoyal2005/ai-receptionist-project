import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function WaveMeshCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let phase = 0;

    const draw = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      // Light gradient background
      const bgGlow = ctx.createRadialGradient(
        W * 0.3,
        H * 0.3,
        50,
        W / 2,
        H / 2,
        W * 1.2,
      );
      bgGlow.addColorStop(0, "#FFFFFF");
      bgGlow.addColorStop(0.5, "#F8FAFC");
      bgGlow.addColorStop(1, "#EFF6FF");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, W, H);

      // Light grid
      ctx.strokeStyle = "rgba(124, 58, 237, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      phase += 0.5;

      // Waves
      const waves = [
        {
          amplitude: 40,
          frequency: 0.004,
          speed: 0.02,
          color: "rgba(124, 58, 237, 0.08)",
          lineWidth: 2,
        },
        {
          amplitude: 25,
          frequency: 0.007,
          speed: 0.03,
          color: "rgba(6, 182, 212, 0.06)",
          lineWidth: 1.5,
        },
      ];

      waves.forEach((w) => {
        ctx.beginPath();
        ctx.strokeStyle = w.color;
        ctx.lineWidth = w.lineWidth;

        for (let x = 0; x < W; x += 2) {
          const y =
            H * 0.65 +
            Math.sin(x * w.frequency + phase * w.speed) *
              w.amplitude *
              Math.cos(x * 0.001);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

function Feat({ emoji, title, sub }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 20px",
        borderRadius: 14,
        border: hov
          ? "1px solid rgba(124, 58, 237, 0.3)"
          : "1px solid rgba(124, 58, 237, 0.15)",
        background: hov
          ? "rgba(124, 58, 237, 0.08)"
          : "rgba(124, 58, 237, 0.04)",
        transition: "all 0.3s ease",
        cursor: "default",
      }}
    >
      <div style={{ fontSize: 20 }}>{emoji}</div>
      <div>
        <p
          style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", margin: 0 }}
        >
          {title}
        </p>
        <p style={{ fontSize: 11, color: "#6B7280", margin: "2px 0 0" }}>
          {sub}
        </p>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }) {
  const [foc, setFoc] = useState(false);
  const icons = { text: "👤", email: "✉️", password: "🔒" };
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          fontSize: "11px",
          fontWeight: 700,
          color: foc ? "#7C3AED" : "#6B7280",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 13,
            opacity: foc ? 1 : 0.5,
            transition: "opacity 0.2s",
          }}
        >
          {icons[type] || "📝"}
        </span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFoc(true)}
          onBlur={() => setFoc(false)}
          required
          style={{
            width: "100%",
            padding: "12px 14px 12px 40px",
            borderRadius: 10,
            border: foc
              ? "1px solid #7C3AED"
              : "1px solid rgba(124, 58, 237, 0.2)",
            background: foc ? "#FFFFFF" : "rgba(248, 250, 252, 0.6)",
            boxShadow: foc ? "0 0 0 3px rgba(124, 58, 237, 0.1)" : "none",
            color: "#1F2937",
            fontSize: 13,
            outline: "none",
            transition: "all 0.2s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function Login() {
  const [isReg, setIsReg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isReg) {
        const res = await API.post("/api/auth/register", {
          name,
          email,
          password: pass,
        });
        if (res.data?.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem(
            "user",
            JSON.stringify(res.data.user || { name, email }),
          );
          API.defaults.headers.common["Authorization"] =
            `Bearer ${res.data.token}`;
          navigate("/", { replace: true });
        }
      } else {
        const res = await API.post("/api/auth/login", {
          email,
          password: pass,
        });
        if (res.data?.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem(
            "user",
            JSON.stringify(res.data.user || { email }),
          );
          API.defaults.headers.common["Authorization"] =
            `Bearer ${res.data.token}`;
          navigate("/", { replace: true });
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; overflow-x: hidden; }
        input::placeholder { color: #9CA3AF; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-left { display: flex; }
        @media(max-width: 960px) { .login-left { display: none !important; } }
      `}</style>

      <WaveMeshCanvas />

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left */}
        <div
          className="login-left"
          style={{
            width: "50%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 60px",
            borderRight: "1px solid rgba(124, 58, 237, 0.1)",
            animation: "fadeUp 0.6s ease-out both",
          }}
        >
          <div style={{ maxWidth: 480, width: "100%" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 100,
                border: "1px solid rgba(124, 58, 237, 0.2)",
                background: "rgba(124, 58, 237, 0.06)",
                fontSize: 10,
                fontWeight: 700,
                color: "#7C3AED",
                marginBottom: 32,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "#7C3AED",
                }}
              />
              Premium Voice AI
            </div>

            <h1
              style={{
                fontSize: "clamp(36px, 4vw, 54px)",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#0F172A",
                marginBottom: 18,
              }}
            >
              AI VOICE
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                RECEPTIONIST
              </span>
            </h1>

            <p
              style={{
                fontSize: 15,
                color: "#4B5563",
                lineHeight: 1.6,
                maxWidth: 420,
                marginBottom: 44,
              }}
            >
              Automate customer calls, capture leads, and book appointments with
              AI that sounds human.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Feat
                emoji="🎙️"
                title="Ultra-Low Latency"
                sub="Sub-500ms voice processing"
              />
              <Feat
                emoji="🧠"
                title="Smart Intent"
                sub="Extracts leads automatically"
              />
              <Feat
                emoji="📊"
                title="Real-time CRM Sync"
                sub="Instant data integration"
              />
            </div>
          </div>
        </div>

        {/* Right */}
        <div
          style={{
            width: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            animation: "fadeUp 0.6s 0.1s ease-out both",
          }}
        >
          <div style={{ width: "100%", maxWidth: 420 }}>
            <div
              style={{
                borderRadius: 20,
                border: "1px solid rgba(124, 58, 237, 0.2)",
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(20px)",
                padding: "40px",
                boxShadow: "0 8px 32px rgba(124, 58, 237, 0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#0F172A",
                  marginBottom: 6,
                }}
              >
                {isReg ? "Create Account" : "Welcome Back"}
              </h2>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 28 }}>
                {isReg ? "Get started in seconds" : "Enter your credentials"}
              </p>

              {/* Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: 2,
                  marginBottom: 28,
                  background: "#F3F4F6",
                  padding: 2,
                  borderRadius: 10,
                }}
              >
                {["Sign In", "Sign Up"].map((lbl, i) => {
                  const active = i === 0 ? !isReg : isReg;
                  return (
                    <button
                      key={lbl}
                      onClick={() => {
                        setIsReg(i === 1);
                        setError("");
                      }}
                      style={{
                        flex: 1,
                        padding: "10px 0",
                        borderRadius: 8,
                        border: "none",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        background: active ? "white" : "transparent",
                        color: active ? "#7C3AED" : "#9CA3AF",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {lbl}
                    </button>
                  );
                })}
              </div>

              <form
                onSubmit={handleAuth}
                style={{ display: "flex", flexDirection: "column", gap: 0 }}
              >
                {isReg && (
                  <Field
                    label="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                )}
                <Field
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                />
                <Field
                  label="Password"
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                />

                {error && (
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: 8,
                      marginBottom: 16,
                      background: "rgba(239, 68, 68, 0.06)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      color: "#DC2626",
                      fontSize: 12,
                    }}
                  >
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 10,
                    border: "none",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "white",
                    background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                    boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading)
                      e.target.style.boxShadow =
                        "0 8px 25px rgba(124, 58, 237, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    if (!loading)
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(124, 58, 237, 0.3)";
                  }}
                >
                  {loading ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <svg
                        style={{
                          width: 14,
                          height: 14,
                          animation: "spin 0.8s linear infinite",
                        }}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          opacity="0.25"
                        />
                        <path
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          opacity="0.75"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : isReg ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <p
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  color: "#6B7280",
                  marginTop: 20,
                }}
              >
                {isReg
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <button
                  onClick={() => {
                    setIsReg(!isReg);
                    setError("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#7C3AED",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "inherit",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#06B6D4")}
                  onMouseLeave={(e) => (e.target.style.color = "#7C3AED")}
                >
                  {isReg ? "Sign in" : "Sign up"}
                </button>
              </p>
            </div>

            <p
              style={{
                textAlign: "center",
                fontSize: 9,
                color: "#9CA3AF",
                marginTop: 20,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 600,
              }}
            >
              Secure • Enterprise-Ready
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
