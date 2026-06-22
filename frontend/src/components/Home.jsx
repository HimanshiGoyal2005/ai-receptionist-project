import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

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

export default function Home() {
  const [activeTab, setActiveTab] = useState("leads");
  const navigate = useNavigate();

  const useCases = {
    leads: {
      icon: "👥",
      title: "Smart Lead Capture",
      desc: "Transform voice conversations into qualified leads instantly. Our AI extracts names, contact info, requirements, and budgets—all automatically indexed in your CRM.",
      benefits: ["99.4% accuracy", "Zero manual data entry", "Real-time sync"],
      metric: "10x faster than manual",
    },
    appointments: {
      icon: "📅",
      title: "Calendar Integration",
      desc: "Customers book appointments naturally through conversation. No forms, no friction. Syncs directly with your calendar, handles timezones and rescheduling.",
      benefits: ["Instant confirmation", "Auto reminders", "Timezone aware"],
      metric: "500ms response time",
    },
    support: {
      icon: "💬",
      title: "24/7 Support Bot",
      desc: "Train once on your FAQs. Answer customer questions anytime. Handles complex queries with human-like empathy and escalates when needed.",
      benefits: ["24/7 availability", "Instant responses", "Smart escalation"],
      metric: "Zero manual tickets",
    },
  };

  const stats = [
    { label: "Conversations", value: "50K+", icon: "💬" },
    { label: "Accuracy Rate", value: "99.4%", icon: "✅" },
    { label: "Response Time", value: "480ms", icon: "⚡" },
    { label: "Customer Satisfaction", value: "98%", icon: "😊" },
  ];

  const features = [
    {
      icon: "🎙️",
      title: "Ultra-Low Latency",
      desc: "Whisper-powered STT with sub-500ms response times",
    },
    {
      icon: "🧠",
      title: "Intent Detection",
      desc: "AI understands context and extracts structured data",
    },
    {
      icon: "🔗",
      title: "CRM Ready",
      desc: "Integrates with your existing tools seamlessly",
    },
    {
      icon: "🌐",
      title: "Multi-Language",
      desc: "Supports 6+ languages with native fluency",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <WaveMeshCanvas />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Navbar */}
        <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/80 border-b border-purple-200/30">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition"
            >
              <div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xl font-bold text-white"
                style={{ boxShadow: "0 0 20px rgba(124, 58, 237, 0.4)" }}
              >
                🤖
              </div>
              <span className="text-sm font-black tracking-tight text-gray-900 uppercase">
                AI Receptionist
              </span>
            </Link>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
              }}
              onMouseEnter={(e) =>
                (e.target.style.boxShadow =
                  "0 8px 25px rgba(124, 58, 237, 0.4)")
              }
              onMouseLeave={(e) =>
                (e.target.style.boxShadow =
                  "0 4px 15px rgba(124, 58, 237, 0.3)")
              }
            >
              Sign In
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-32 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200/50 bg-purple-50/50">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700">
              Enterprise-Grade Voice AI
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1]">
            Your Business,
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Voice-Activated.
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Deploy AI receptionists that answer calls, capture leads, and book
            appointments—all in real-time.
          </p>

          {/* CTA Input */}
          <div className="max-w-2xl mx-auto mt-12">
            <div
              className="flex gap-2 p-2 rounded-2xl bg-white border border-purple-200/50"
              style={{ boxShadow: "0 8px 32px rgba(124, 58, 237, 0.1)" }}
            >
              <input
                type="text"
                placeholder="Describe your use case... (e.g., Book appointments for my clinic)"
                className="flex-1 px-6 py-4 rounded-xl outline-none text-gray-900 placeholder:text-gray-400 text-sm"
              />
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 rounded-xl text-sm font-bold text-white transition-all flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                  boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
                }}
              >
                Get Started <span>→</span>
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-6 rounded-2xl bg-white border border-purple-200/50 text-center"
              style={{ boxShadow: "0 4px 15px rgba(124, 58, 237, 0.05)" }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 font-semibold mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* Features Grid */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-4xl font-black text-gray-900 text-center mb-4">
            Built for Real-World Operations
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Enterprise-grade infrastructure with the simplicity of a chatbot
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-2xl bg-white border border-purple-200/50"
                style={{ boxShadow: "0 4px 20px rgba(124, 58, 237, 0.08)" }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases Tabs */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-4xl font-black text-gray-900 text-center mb-16">
            Solve Your Business Challenges
          </h2>

          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {Object.keys(useCases).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all"
                style={{
                  background:
                    activeTab === tab
                      ? "linear-gradient(135deg, #7C3AED, #06B6D4)"
                      : "rgba(124, 58, 237, 0.1)",
                  color: activeTab === tab ? "white" : "#7C3AED",
                  border:
                    activeTab === tab
                      ? "none"
                      : "1px solid rgba(124, 58, 237, 0.2)",
                }}
              >
                {useCases[tab].icon} {tab}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div
              className="md:col-span-2 p-10 rounded-2xl bg-white border border-purple-200/50"
              style={{ boxShadow: "0 8px 32px rgba(124, 58, 237, 0.1)" }}
            >
              <div className="text-5xl mb-6">{useCases[activeTab].icon}</div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">
                {useCases[activeTab].title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {useCases[activeTab].desc}
              </p>
              <div className="flex flex-wrap gap-3">
                {useCases[activeTab].benefits.map((benefit) => (
                  <span
                    key={benefit}
                    className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 text-sm font-semibold"
                  >
                    ✓ {benefit}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-100 to-cyan-100 border border-purple-200/50 flex flex-col justify-center text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {useCases[activeTab].metric}
              </div>
              <p className="text-gray-700 font-semibold text-sm">
                Real-world performance
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div
            className="p-16 rounded-3xl bg-gradient-to-r from-purple-600 to-cyan-600 text-center text-white"
            style={{ boxShadow: "0 20px 60px rgba(124, 58, 237, 0.3)" }}
          >
            <h2 className="text-4xl font-black mb-4">
              Ready to Automate Your Reception?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Join 500+ businesses using AI Receptionist to handle customer
              interactions 24/7
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-10 py-4 rounded-lg text-lg font-bold bg-white text-purple-600 hover:shadow-lg transition-all"
            >
              Start Free Trial →
            </button>
            <p className="text-sm text-white/70 mt-4">
              No credit card required • Deploy in 5 minutes
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-purple-200/30 text-center text-gray-600 text-sm">
          <p>© 2026 AI Receptionist. Built with ❤️ for businesses.</p>
        </footer>
      </div>
    </div>
  );
}
