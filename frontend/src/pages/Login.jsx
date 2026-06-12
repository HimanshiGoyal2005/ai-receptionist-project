import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

/* ── 🌊 3D Cyber Mesh Wave Canvas Background ── */
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

    // Wave Configurations (Amplitudes, frequencies, speeds, colors)
    const waves = [
      {
        amplitude: 45,
        frequency: 0.004,
        speed: 0.02,
        color: "rgba(99, 102, 241, 0.15)",
        lineWidth: 2,
      },
      {
        amplitude: 30,
        frequency: 0.007,
        speed: 0.03,
        color: "rgba(6, 182, 212, 0.12)",
        lineWidth: 1.5,
      },
      {
        amplitude: 20,
        frequency: 0.012,
        speed: 0.015,
        color: "rgba(139, 92, 246, 0.08)",
        lineWidth: 1,
      },
    ];

    let phase = 0;

    const draw = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      // Deep Space vignette layer
      const bgGlow = ctx.createRadialGradient(
        W / 2,
        H / 2,
        10,
        W / 2,
        H / 2,
        W,
      );
      bgGlow.addColorStop(0, "#070a15");
      bgGlow.addColorStop(1, "#02040a");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, W, H);

      phase += 0.5; // Controls flow velocity over ticks

      // Render Each Layer of 3D Sine Waves
      waves.forEach((w) => {
        ctx.beginPath();
        ctx.strokeStyle = w.color;
        ctx.lineWidth = w.lineWidth;

        // Draw horizontal wave streams
        for (let x = 0; x < W; x += 2) {
          // Trigonometric sine-wave interpolation equations
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

        // Optional Vertical Mesh Lines Effect (Creates the 3D grid alignment layout)
        ctx.beginPath();
        ctx.strokeStyle = w.color.replace(/[\d.]+\)$/, "0.02)"); // Super faint lines
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
        padding: "15px 20px",
        borderRadius: 16,
        border: hov
          ? "1px solid rgba(139,92,246,0.25)"
          : "1px solid rgba(255,255,255,0.05)",
        background: hov ? "rgba(139,92,246,0.06)" : "rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px)",
        transform: hov ? "translateX(6px)" : "translateX(0)",
        transition: "all 0.28s ease",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 13,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          background: grad,
          boxShadow: hov ? "0 0 20px rgba(139,92,246,0.3)" : "none",
          transition: "box-shadow 0.28s ease",
        }}
      >
        {emoji}
      </div>
      <div>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#f1f5f9",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: 11,
            color: "#475569",
            margin: "2px 0 0",
            lineHeight: 1.5,
          }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

/* ── Animated input ── */
function Field({ label, type, value, onChange, placeholder }) {
  const [foc, setFoc] = useState(false);
  const icons = { text: "👤", email: "✉️", password: "🔒" };
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: foc ? "#818cf8" : "#3f4e63",
          marginBottom: 7,
          transition: "color 0.2s",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 13,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 13,
            pointerEvents: "none",
            zIndex: 2,
            opacity: foc ? 1 : 0.35,
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
          style={{
            width: "100%",
            padding: "12px 14px 12px 38px",
            borderRadius: 12,
            border: foc
              ? "1px solid rgba(129,140,248,0.5)"
              : "1px solid rgba(255,255,255,0.07)",
            background: foc
              ? "rgba(129,140,248,0.05)"
              : "rgba(255,255,255,0.03)",
            boxShadow: foc ? "0 0 0 3px rgba(129,140,248,0.1)" : "none",
            color: "#f1f5f9",
            fontSize: 13,
            outline: "none",
            transition: "all 0.22s ease",
            fontFamily: "inherit",
          }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ MAIN ══════════════════════════════════════════ */
export default function Login() {
  const [isReg, setIsReg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
          navigate("/", { replace: true });
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
          navigate("/", { replace: true });
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:#04060f; overflow-x: hidden; }
        input::placeholder { color:#2d3a4d; }
        @keyframes shimmer { 0%{transform:translateX(-120%)} 100%{transform:translateX(220%)} }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(0.65)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .login-left  { display:flex; }
        .feat-section { display:flex; }
        @media(max-width:860px){ .login-left{display:none!important;} }
      `}</style>

      {/* 🌊 Replaced OrbCanvas with 3D Flowing WaveMeshCanvas */}
      <WaveMeshCanvas />

      {/* ── Outer shell: true 50/50 split ── */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
          color: "#e2e8f0",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ══ LEFT 50% ══ */}
        <div
          className="login-left"
          style={{
            width: "50%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 56px",
            borderRight: "1px solid rgba(255,255,255,0.04)",
            position: "relative",
            zIndex: 1,
            animation: "fadeUp 0.6s ease both",
          }}
        >
          <div style={{ maxWidth: 480, width: "100%" }}>
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "5px 16px",
                borderRadius: 100,
                border: "1px solid rgba(139,92,246,0.28)",
                background: "rgba(139,92,246,0.07)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color: "#a78bfa",
                marginBottom: 32,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#a78bfa",
                  animation: "pulseDot 2s ease-in-out infinite",
                  display: "inline-block",
                }}
              />
              Next-Gen Cognitive Architecture
            </div>

            {/* Hero headline */}
            <h1
              style={{
                fontSize: "clamp(40px,3.6vw,60px)",
                fontWeight: 800,
                lineHeight: 1.06,
                letterSpacing: "-0.035em",
                color: "#f8fafc",
                marginBottom: 18,
              }}
            >
              AI VOICE
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(130deg,#818cf8 0%,#c084fc 45%,#22d3ee 100%)",
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
                color: "#4b5a70",
                lineHeight: 1.75,
                fontWeight: 400,
                maxWidth: 400,
                marginBottom: 52,
                fontFamily: "'Inter',sans-serif",
              }}
            >
              Automate customer operations with intelligent voice pipelines,
              real-time intent extraction, and automated lead management.
            </p>

            {/* Feature cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Feat
                grad="linear-gradient(135deg,#4f46e5,#7c3aed)"
                emoji="🎙️"
                title="Ultra-Low Latency STT Pipeline"
                sub="Whisper-backed contextual speech processing."
              />
              <Feat
                grad="linear-gradient(135deg,#7c3aed,#c026d3)"
                emoji="🧠"
                title="Cognitive Intent Detection"
                sub="Extract leads, budgets, and structure records dynamically."
              />
              <Feat
                grad="linear-gradient(135deg,#0891b2,#0e7490)"
                emoji="📊"
                title="Automated Lead Management"
                sub="CRM-ready pipeline with zero manual touchpoints."
              />
            </div>
          </div>
        </div>

        {/* ══ RIGHT 50% ══ */}
        <div
          style={{
            width: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 40px",
            position: "relative",
            zIndex: 1,
            animation: "fadeUp 0.6s 0.1s ease both",
          }}
          className="login-right"
        >
          <div style={{ width: "100%", maxWidth: 440 }}>
            {/* ── Glass form card ── */}
            <div
              style={{
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(10,14,26,0.78)",
                backdropFilter: "blur(50px)",
                WebkitBackdropFilter: "blur(50px)",
                padding: "40px 40px 36px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              }}
            >
              {/* Top glow bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background:
                    "linear-gradient(90deg,transparent 0%,rgba(139,92,246,0.55) 50%,transparent 100%)",
                }}
              />

              {/* Corner bloom */}
              <div
                style={{
                  position: "absolute",
                  top: -100,
                  right: -100,
                  width: 240,
                  height: 240,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle,rgba(6,182,212,0.12) 0%,transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              {/* Heading */}
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#f8fafc",
                  letterSpacing: "-0.025em",
                }}
              >
                {isReg ? "Create Account" : "Welcome Back"}
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: "#3f4e63",
                  marginTop: 5,
                  marginBottom: 28,
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                {isReg
                  ? "Initialize a new administrative node"
                  : "Enter your credentials to continue"}
              </p>

              {/* Tab switcher */}
              <div
                style={{
                  display: "flex",
                  gap: 3,
                  padding: 3,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  marginBottom: 28,
                }}
              >
                {["Sign In", "Create Account"].map((lbl, i) => {
                  const active = i === 0 ? !isReg : isReg;
                  return (
                    <button
                      key={lbl}
                      onClick={() => switchMode(i === 1)}
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        borderRadius: 9,
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "inherit",
                        cursor: "pointer",
                        border: active
                          ? "1px solid rgba(139,92,246,0.3)"
                          : "none",
                        background: active
                          ? "rgba(139,92,246,0.14)"
                          : "transparent",
                        color: active ? "#a78bfa" : "#3f4e63",
                        transition: "all 0.22s ease",
                      }}
                    >
                      {lbl}
                    </button>
                  );
                })}
              </div>

              {/* Form */}
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
                      padding: "10px 14px",
                      borderRadius: 10,
                      marginBottom: 16,
                      border: "1px solid rgba(239,68,68,0.2)",
                      background: "rgba(239,68,68,0.06)",
                      color: "#f87171",
                      fontSize: 12,
                      fontFamily: "'Inter',sans-serif",
                    }}
                  >
                    ⚠️ {error}
                  </div>
                )}

                {/* CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginTop: 4,
                    borderRadius: 13,
                    border: "none",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    letterSpacing: "0.025em",
                    color: "#fff",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.55 : 1,
                    background:
                      "linear-gradient(130deg,#6366f1 0%,#8b5cf6 55%,#0ea5e9 100%)",
                    boxShadow: "0 6px 24px rgba(99,102,241,0.28)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 36px rgba(99,102,241,0.38)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 24px rgba(99,102,241,0.28)";
                  }}
                >
                  {/* shimmer sweep */}
                  {!loading && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background:
                          "linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.13) 50%,transparent 65%)",
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
                        {isReg ? "Assembling Node..." : "Verifying Token..."}
                      </>
                    ) : isReg ? (
                      "Instantiate Account →"
                    ) : (
                      "Initialize Session →"
                    )}
                  </span>
                </button>
              </form>

              {/* Toggle */}
              <p
                style={{
                  marginTop: 20,
                  textAlign: "center",
                  fontSize: 12,
                  color: "#3f4e63",
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                {isReg
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <button
                  onClick={() => switchMode(!isReg)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: "#818cf8",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#a78bfa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#818cf8")
                  }
                >
                  {isReg ? "Sign in" : "Create one"}
                </button>
              </p>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  margin: "22px 0 0",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "rgba(255,255,255,0.05)",
                  }}
                />
                <span
                  style={{
                    fontSize: 9,
                    color: "#1e2a3a",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  Secured Console
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "rgba(255,255,255,0.05)",
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <p
              style={{
                marginTop: 24,
                textAlign: "center",
                fontSize: 9,
                color: "#1a2333",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Secured Hypertext Console System Engine
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
