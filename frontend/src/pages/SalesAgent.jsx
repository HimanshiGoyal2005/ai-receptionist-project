import { useState, useRef, useEffect } from "react";
import API from "../services/api";

const STAGE_INFO = {
  QUALIFICATION: { label: "Qualifying", color: "#6366f1", icon: "🔍" },
  BUDGET: { label: "Budget", color: "#f59e0b", icon: "💰" },
  PROPOSAL: { label: "Proposal", color: "#06b6d4", icon: "📋" },
  MEETING: { label: "Meeting", color: "#8b5cf6", icon: "📅" },
  CLOSING: { label: "Closing", color: "#10b981", icon: "🎯" },
};

// Keeps array structure for clean rendering but works smoothly with lookups
const PLANS = [
  {
    name: "Basic",
    price: "₹20,000",
    desc: "Small teams & individuals",
    color: "#6366f1",
  },
  {
    name: "Professional",
    price: "₹50,000",
    desc: "Growing businesses",
    color: "#06b6d4",
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Large organizations",
    color: "#10b981",
  },
];

function SalesAgent() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! 👋 I'm your AI Sales Assistant. I'm here to help you find the perfect solution for your business. Could you tell me a little about what you're looking for?",
      stage: "QUALIFICATION",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("QUALIFICATION");
  const [detectedLang, setDetectedLang] = useState(null);
  const [leadData, setLeadData] = useState({});
  const [suggestedPlan, setSuggestedPlan] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", text: input };
    const history = messages.map((m) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.text,
    }));

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/api/sales/chat", {
        message: currentInput,
        history,
      });

      const data = res.data;

      const aiMsg = {
        role: "ai",
        text: data.reply,
        stage: data.stage,
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (data.stage) setStage(data.stage);
      if (data.detected_language) setDetectedLang(data.detected_language);
      if (data.suggested_plan) setSuggestedPlan(data.suggested_plan);

      if (data.extracted_data) {
        setLeadData((prev) => ({
          ...prev,
          ...data.extracted_data,
        }));
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, I'm having a technical issue. Please try again!",
          stage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const currentStage = STAGE_INFO[stage] || STAGE_INFO.QUALIFICATION;

  return (
    <div
      className="flex gap-6 h-full"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      {/* ── LEFT SIDE: Chat Interface ── */}
      <div
        className="flex-1 flex flex-col rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#0d1117",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Chat Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                boxShadow: "0 0 20px rgba(99,102,241,0.4)",
              }}
            >
              🤖
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                AI Sales Assistant
              </p>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full bg-green-400"
                  style={{ boxShadow: "0 0 6px #4ade80" }}
                />
                <p className="text-xs" style={{ color: "#475569" }}>
                  Active Pipeline Session
                </p>
              </div>
            </div>
          </div>

          {/* Badge Rows */}
          <div className="flex items-center gap-2">
            {detectedLang && (
              <div
                className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1"
                style={{
                  backgroundColor: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  color: "#10b981",
                }}
              >
                <span>🌐</span> {detectedLang}
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span>{currentStage.icon}</span>
              <span
                className="text-xs font-semibold"
                style={{ color: currentStage.color }}
              >
                {currentStage.label}
              </span>
            </div>
          </div>
        </div>

        {/* Chat Stream Window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm mr-2 mt-1 flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                  }}
                >
                  🤖
                </div>
              )}
              <div className="max-w-xs lg:max-w-md">
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? {
                          background:
                            "linear-gradient(135deg, #6366f1, #4f46e5)",
                          color: "white",
                          borderBottomRightRadius: "4px",
                          boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                        }
                      : {
                          backgroundColor: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#cbd5e1",
                          borderBottomLeftRadius: "4px",
                        }
                  }
                >
                  {msg.text}
                </div>
                {msg.stage && msg.role === "ai" && (
                  <p className="text-[10px] mt-1 ml-1 text-gray-600 font-medium uppercase tracking-wider">
                    Funnel Shift: {STAGE_INFO[msg.stage]?.label || msg.stage}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Typing Animation */}
          {loading && (
            <div className="flex justify-start">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm mr-2"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                }}
              >
                🤖
              </div>
              <div
                className="px-4 py-3 rounded-2xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: "#6366f1",
                        animation: `bounce 1s infinite ${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar Layout */}
        <div
          className="p-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your message here... (e.g., 'Price kya hai?')"
              className="flex-1 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder-gray-600"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                caretColor: "#6366f1",
              }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background:
                  loading || !input.trim()
                    ? "rgba(99,102,241,0.3)"
                    : "linear-gradient(135deg, #6366f1, #06b6d4)",
                boxShadow:
                  loading || !input.trim()
                    ? "none"
                    : "0 0 20px rgba(99,102,241,0.4)",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              }}
            >
              Send →
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE: Pipeline Monitoring Panel ── */}
      <div className="w-72 flex flex-col gap-4">
        {/* Sales Funnel States */}
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: "#0d1117",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#475569" }}
          >
            Pipeline Tracking
          </p>
          <div className="space-y-2">
            {Object.entries(STAGE_INFO).map(([key, val]) => (
              <div
                key={key}
                className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all"
                style={{
                  backgroundColor:
                    stage === key ? `${val.color}15` : "transparent",
                  border:
                    stage === key
                      ? `1px solid ${val.color}40`
                      : "1px solid transparent",
                }}
              >
                <span>{val.icon}</span>
                <span
                  className="text-sm font-medium"
                  style={{ color: stage === key ? val.color : "#334155" }}
                >
                  {val.label}
                </span>
                {stage === key && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: val.color,
                      boxShadow: `0 0 6px ${val.color}`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Matrix Mapping */}
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: "#0d1117",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#475569" }}
          >
            Catalog Mapping
          </p>
          <div className="space-y-3">
            {PLANS.map((plan) => {
              const isRecommended =
                suggestedPlan?.toLowerCase() === plan.name.toLowerCase();
              return (
                <div
                  key={plan.name}
                  className="p-3 rounded-xl transition-all"
                  style={{
                    backgroundColor: isRecommended
                      ? `${plan.color}15`
                      : "rgba(255,255,255,0.02)",
                    border: isRecommended
                      ? `1px solid ${plan.color}50`
                      : "1px solid rgba(255,255,255,0.05)",
                    boxShadow: isRecommended
                      ? `0 0 15px ${plan.color}15`
                      : "none",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white">
                      {plan.name}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: plan.color }}
                    >
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{plan.desc}</p>
                  {isRecommended && (
                    <div
                      className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block"
                      style={{
                        backgroundColor: `${plan.color}20`,
                        color: plan.color,
                      }}
                    >
                      ✨ Recommended
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Intent & Context Captured Box */}
        {Object.keys(leadData).some((k) => leadData[k]) && (
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "#0d1117",
              border: "1px solid rgba(16,185,129,0.2)",
              boxShadow: "0 0 20px rgba(16,185,129,0.05)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#10b981" }}
            >
              📊 Captured Context
            </p>
            <div className="space-y-2">
              {Object.entries(leadData).map(([key, val]) =>
                val ? (
                  <div
                    key={key}
                    className="flex justify-between items-start gap-2 border-b border-white/[0.02] pb-1.5 last:border-0"
                  >
                    <span className="text-xs capitalize text-gray-500 flex-shrink-0">
                      {key}:
                    </span>
                    <span className="text-xs text-white font-medium text-right break-words max-w-[150px]">
                      {val}
                    </span>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

export default SalesAgent;
