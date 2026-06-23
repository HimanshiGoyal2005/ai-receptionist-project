import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import { FiEye, FiEyeOff } from "react-icons/fi";
/* ── 🌊 Reengineered 3D Light Mesh Wave Canvas Background ── */
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

    const waves = [
      {
        amplitude: 45,
        frequency: 0.004,
        speed: 0.02,
        color: "rgba(124, 58, 237, 0.06)",
        lineWidth: 2,
      },
      {
        amplitude: 30,
        frequency: 0.007,
        speed: 0.03,
        color: "rgba(6, 182, 212, 0.09)",
        lineWidth: 1.5,
      },
      {
        amplitude: 20,
        frequency: 0.012,
        speed: 0.015,
        color: "rgba(124, 58, 237, 0.03)",
        lineWidth: 1,
      },
    ];

    let phase = 0;

    const draw = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      const bgGlow = ctx.createRadialGradient(
        W * 0.3,
        H * 0.3,
        50,
        W / 2,
        H / 2,
        W * 1.2,
      );
      bgGlow.addColorStop(0, "#FFFFFF");
      bgGlow.addColorStop(0.5, "#F4F7FA");
      bgGlow.addColorStop(1, "#E2E8F0");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(6, 182, 212, 0.07)";
      ctx.lineWidth = 1;
      const gridSize = 45;
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
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = w.color.replace(/[\d.]+\)$/, "0.02)");
        for (let x = 0; x < W; x += 60) {
          const y =
            H * 0.65 +
            Math.sin(x * w.frequency + phase * w.speed) *
              w.amplitude *
              Math.cos(x * 0.001);
          ctx.moveTo(x, H);
          ctx.lineTo(x, y);
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

/* ── Feature pill ── */
function Feat({ grad, emoji, title, sub }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 24px",
        borderRadius: 16,
        border: hov
          ? "1px solid rgba(124, 58, 237, 0.25)"
          : "1px solid rgba(226, 232, 240, 0.6)",
        background: hov
          ? "linear-gradient(135deg, rgba(124, 58, 237, 0.04) 0%, rgba(6, 182, 212, 0.04) 100%)"
          : "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(8px)",
        boxShadow: hov
          ? "0 12px 30px rgba(124, 58, 237, 0.04), 0 4px 12px rgba(6, 182, 212, 0.02)"
          : "0 4px 12px rgba(15, 23, 42, 0.01)",
        transform: hov ? "translateX(4px)" : "translateX(0)",
        transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          background: grad,
          boxShadow: hov
            ? "0 6px 16px rgba(124, 58, 237, 0.25)"
            : "0 4px 12px rgba(124, 58, 237, 0.15)",
          transition: "transform 0.3s ease",
          transform: hov ? "scale(1.05)" : "scale(1)",
        }}
      >
        {emoji}
      </div>
      <div>
        <p
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#0F172A",
            margin: 0,
            letterSpacing: "-0.01em",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: 12,
            color: "#475569",
            margin: "3px 0 0",
            lineHeight: 1.5,
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

/* ── Animated Input ── */
function Field({ label, type, value, onChange, placeholder }) {
  const [foc, setFoc] = useState(false);
  const icons = { text: "👤", email: "✉️", password: "🔒" };
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: foc ? "#7C3AED" : "#64748B",
          marginBottom: 7,
          transition: "color 0.2s ease",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 14,
            pointerEvents: "none",
            zIndex: 2,
            opacity: foc ? 1 : 0.4,
            transition: "all 0.2s ease",
          }}
        >
          {icons[type] || "📝"}
        </span>
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFoc(true)}
          onBlur={() => setFoc(false)}
          required
          style={{
            width: "100%",
            padding: "13px 50px 13px 44px",
            borderRadius: 12,
            border: foc
              ? "1px solid #7C3AED"
              : "1px solid rgba(226, 232, 240, 0.8)",
            background: foc ? "#FFFFFF" : "rgba(248, 250, 252, 0.6)",
            boxShadow: foc
              ? "0 0 0 4px rgba(124, 58, 237, 0.06), 0 4px 12px rgba(0,0,0,0.01)"
              : "none",
            color: "#0F172A",
            fontSize: 14,
            fontWeight: "500",
            outline: "none",
            transition: "all 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
            fontFamily: "'Inter', sans-serif",
          }}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#64748B",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
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
  const [searchParams] = useSearchParams();

  // 1. Add this inside your Login function, before the useEffect
  const isProcessing = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");

    // 2. Add the lock check here
    if (!code || isProcessing.current) return;

    const handleGoogleCallback = async (authCode) => {
      isProcessing.current = true;
      setLoading(true);
      setError("");

      try {
        console.log("Sending token:", code);
        const res = await API.post("/api/auth/google", { token: code });
        console.log("Google Response:", res.data);
        if (res.data?.token) {
          // 1. Token aur User data save karein
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));

          // 2. API header set karein
          API.defaults.headers.common["Authorization"] =
            `Bearer ${res.data.token}`;

          // 3. Clear URL (Google code hata dein)
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );

          console.log("Login successful, redirecting...");

          // 4. IMPORTANT: Tiny delay taaki localStorage sahi se update ho jaye
          // Isse ProtectedRoute ko token turant mil jayega
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 100);
        }
      } catch (err) {
        console.error("Auth Error:", err);
        console.log("Google Error:", err.response?.data);
        console.log("Status:", err.response?.status);
        setError("Google login failed");
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
        isProcessing.current = false;
      } finally {
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate]); // Removed 'code' from dependency to rely on searchParams
  const switchMode = (reg) => {
    setIsReg(reg);
    setError("");
    setName("");
    setEmail("");
    setPass("");
  };

  const handleAuth = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isReg) {
        const res = await API.post(
          "/api/auth/register",
          { name, email, password: pass },
          { headers: { "Content-Type": "application/json" } },
        );
        if (res.data?.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem(
            "user",
            JSON.stringify(res.data.user || { name, email }),
          );
          API.defaults.headers.common["Authorization"] =
            `Bearer ${res.data.token}`;

          // 🌟 Fixed: Point directly to the secure route grid workspace
          navigate("/dashboard", { replace: true });
        } else {
          switchMode(false);
          setError("Account provisioned! Please initialize session.");
        }
      } else {
        const res = await API.post(
          "/api/auth/login",
          { email, password: pass },
          { headers: { "Content-Type": "application/json" } },
        );
        if (res.data?.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem(
            "user",
            JSON.stringify(res.data.user || { email }),
          );
          API.defaults.headers.common["Authorization"] =
            `Bearer ${res.data.token}`;

          console.log("Token from Google API:", res.data.token);
          localStorage.setItem("token", res.data.token);
          // 🌟 Fixed: Point directly to the secure route grid workspace
          navigate("/dashboard", { replace: true });
        } else {
          setError("Something went wrong. Token not found!");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || "Operation rejected. Check credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const redirectUri =
      window.location.hostname === "localhost"
        ? "http://localhost:5173/login"
        : "https://ai-receptionist-project.vercel.app/login";

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=openid email profile` +
      `&access_type=offline` +
      `&prompt=consent`;

    window.location.href = authUrl;
  };
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #F8FAFC; overflow-x: hidden; font-family: 'Space Grotesk', sans-serif; width: 100%; }
        input::placeholder { color: #94A3B8; }
        @keyframes shimmer { 0%{transform:translateX(-120%)} 100%{transform:translateX(220%)} }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }

        .login-wrapper { min-height: 100vh; display: flex; font-family: 'Space Grotesk', sans-serif; color: #0F172A; position: relative; z-index: 1; }
        .login-left { display: flex; width: 50%; }
        .login-right-panel { width: 50%; display: flex; align-items: center; justify-content: center; padding: 48px 40px; position: relative; z-index: 1; }
        .login-card { width: 100%; max-width: 460px; }
        .login-card-inner { border-radius: 24px; padding: 44px 40px; }
        .login-heading { font-size: clamp(38px, 3.8vw, 56px); }

        /* ── Tablets / small laptops ── */
        @media (max-width: 960px) {
          .login-left { display: none !important; }
          .login-right-panel { width: 100% !important; padding: 32px 24px; }
        }

        /* ── Small tablets / large phones ── */
        @media (max-width: 600px) {
          .login-right-panel { padding: 20px 14px; align-items: flex-start; padding-top: 32px; }
          .login-card-inner { padding: 32px 22px; border-radius: 18px; }
          .login-card { max-width: 100%; }
        }

        /* ── Phones ── */
        @media (max-width: 420px) {
          .login-right-panel { padding: 16px 10px; padding-top: 24px; }
          .login-card-inner { padding: 26px 16px; border-radius: 16px; }
        }
      `}</style>

      <WaveMeshCanvas />

      <div className="login-wrapper">
        <div
          className="login-left"
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 60px",
            borderRight: "1px solid rgba(226, 232, 240, 0.6)",
            position: "relative",
            zIndex: 1,
            animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <div style={{ maxWidth: 480, width: "100%" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 100,
                border: "1px solid rgba(124, 58, 237, 0.15)",
                background: "rgba(124, 58, 237, 0.04)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#7C3AED",
                marginBottom: 36,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#7C3AED",
                  animation: "pulseDot 2s ease-in-out infinite",
                  display: "inline-block",
                }}
              />
              AI-Powered Business Assistant
            </div>

            <h1
              className="login-heading"
              style={{
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "#0F172A",
                marginBottom: 20,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              AI VOICE
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
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
                fontSize: 16,
                color: "#475569",
                lineHeight: 1.6,
                fontWeight: 500,
                maxWidth: 420,
                marginBottom: 48,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Never miss a customer call. Capture leads, answer inquiries, and
              manage conversations automatically with AI.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Feat
                grad="linear-gradient(135deg, #7C3AED, #6D28D9)"
                emoji="🎙️"
                title="Ultra-Low Latency STT Pipeline"
                sub="Whisper-backed contextual speech processing."
              />
              <Feat
                grad="linear-gradient(135deg, #7C3AED, #06B6D4)"
                emoji="🧠"
                title="Cognitive Intent Detection"
                sub="Extract leads, budgets, and structure records dynamically."
              />
              <Feat
                grad="linear-gradient(135deg, #06B6D4, #0891b2)"
                emoji="📊"
                title="Automated Lead Management"
                sub="CRM-ready pipeline with zero manual touchpoints."
              />
            </div>
          </div>
        </div>

        <div
          className="login-right-panel"
          style={{
            animation: "fadeUp 0.6s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <div className="login-card">
            <div
              className="login-card-inner"
              style={{
                border: "1px solid rgba(226, 232, 240, 0.6)",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                position: "relative",
                overflow: "hidden",
                boxShadow:
                  "0 0 40px rgba(6, 182, 212, 0.02), 0 0 40px rgba(124, 58, 237, 0.02), 0 20px 50px rgba(15, 23, 42, 0.04)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(124, 58, 237, 0.25) 50%, transparent 100%)",
                }}
              />

              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#0F172A",
                  letterSpacing: "-0.02em",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {isReg ? "Create Account" : "Welcome Back"}
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "#475569",
                  marginTop: 6,
                  marginBottom: 32,
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {isReg
                  ? "Create your account to get started"
                  : "Sign in to access your dashboard"}
              </p>

              <div
                style={{
                  display: "flex",
                  position: "relative",
                  padding: 4,
                  background: "#F1F5F9",
                  borderRadius: 12,
                  marginBottom: 32,
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    bottom: 4,
                    left: isReg ? "calc(50% - 2px)" : 4,
                    width: "calc(50% - 2px)",
                    background: "#FFFFFF",
                    borderRadius: 8,
                    boxShadow:
                      "0 2px 8px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.02)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    zIndex: 1,
                  }}
                />

                {["Sign In", "Create Account"].map((lbl, i) => {
                  const active = i === 0 ? !isReg : isReg;
                  return (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => switchMode(i === 1)}
                      style={{
                        flex: 1,
                        padding: "10px 0",
                        position: "relative",
                        zIndex: 2,
                        fontSize: 13,
                        fontWeight: 650,
                        fontFamily: "'Space Grotesk', sans-serif",
                        cursor: "pointer",
                        border: "none",
                        background: "transparent",
                        color: active ? "#7C3AED" : "#64748B",
                        transition: "color 0.25s ease",
                      }}
                    >
                      {lbl}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleAuth}>
                {isReg && (
                  <Field
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                )}
                <Field
                  label="Email Address"
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
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "12px 16px",
                      borderRadius: 10,
                      marginBottom: 20,
                      border: "1px solid rgba(239, 68, 68, 0.15)",
                      background: "rgba(239, 68, 68, 0.03)",
                      color: "#EF4444",
                      fontSize: 13,
                      fontWeight: "600",
                      fontFamily: "'Inter', sans-serif",
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
                    padding: "14px",
                    marginTop: 8,
                    borderRadius: 12,
                    border: "none",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: "0.01em",
                    color: "#fff",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    background:
                      "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                    boxShadow: "0 4px 14px rgba(124, 58, 237, 0.2)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 22px rgba(124, 58, 237, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 14px rgba(124, 58, 237, 0.2)";
                  }}
                >
                  {!loading && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background:
                          "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.2) 50%, transparent 65%)",
                        animation: "shimmer 2.8s ease-in-out infinite",
                      }}
                    />
                  )}
                  <span
                    style={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    {loading ? (
                      <>
                        <span
                          style={{
                            width: 14,
                            height: 14,
                            border: "2px solid rgba(255,255,255,0.25)",
                            borderTopColor: "#fff",
                            borderRadius: "50%",
                            animation: "spin 0.65s linear infinite",
                            display: "inline-block",
                          }}
                        />
                        {isReg ? "Creating Account..." : "Signing In..."}
                      </>
                    ) : isReg ? (
                      "Create Account →"
                    ) : (
                      "Sign In →"
                    )}
                  </span>
                </button>
              </form>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  margin: "20px 0",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "#E2E8F0",
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    color: "#94A3B8",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  OR
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "#E2E8F0",
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 12,
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  background: "rgba(248, 250, 252, 0.6)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0F172A",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  transition: "all 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  marginBottom: 20,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(124, 58, 237, 0.06)";
                  e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(248, 250, 252, 0.6)";
                  e.currentTarget.style.borderColor =
                    "rgba(226, 232, 240, 0.8)";
                }}
              >
                <span style={{ fontSize: 16 }}>🔵</span>
                Continue with Google
              </button>

              <p
                style={{
                  marginTop: 16,
                  textAlign: "center",
                  fontSize: 13,
                  color: "#475569",
                  fontWeight: "500",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {isReg
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => switchMode(!isReg)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: "#7C3AED",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "inherit",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#06B6D4")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#7C3AED")
                  }
                >
                  {isReg ? "Sign in" : "Create one"}
                </button>
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  margin: "24px 0 0",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "#E2E8F0",
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    color: "#94A3B8",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Secure Access
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "#E2E8F0",
                  }}
                />
              </div>
            </div>

            <p
              style={{
                marginTop: 24,
                textAlign: "center",
                fontSize: 10,
                color: "#94A3B8",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Secure AI Voice Receptionist Platform
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
