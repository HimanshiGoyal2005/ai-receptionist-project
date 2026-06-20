import { useState, useRef, useEffect } from "react";
import API from "../services/api";

const STAGE_INFO = {
  QUALIFICATION: { label: "Qualifying", color: "#7C3AED", icon: "🔍" },
  BUDGET: { label: "Budget", color: "#F59E0B", icon: "💰" },
  PROPOSAL: { label: "Proposal", color: "#06B6D4", icon: "📋" },
  MEETING: { label: "Meeting", color: "#6366F1", icon: "📅" },
  CLOSING: { label: "Closing", color: "#10B981", icon: "🎯" },
};

const PLANS = [
  {
    name: "Basic",
    price: "₹20,000",
    desc: "Small teams & individuals",
    color: "#7C3AED",
  },
  {
    name: "Professional",
    price: "₹50,000",
    desc: "Growing businesses",
    color: "#06B6D4",
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Large organizations",
    color: "#10B981",
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
  const [humanHandoffActive, setHumanHandoffActive] = useState(false);

  const bottomRef = useRef(null);
  const socketRef = useRef(null);

  // 📡 BI-DIRECTIONAL WEBSOCKET CLEAN CHANNEL LISTENER
  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8000/ws/handoff");

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "HANDOFF_ALERT") {
          setHumanHandoffActive(true);
        }
      } catch (err) {
        // 🚨 TO STOP DOUBLE MESSAGES: Check if message is already mapped locally
        const incomingText = event.data;

        setMessages((prev) => {
          // Find if the exact message text was already pushed by client or rendering engine
          const messageExists = prev.some(
            (m) =>
              m.text === incomingText ||
              m.text === `👨‍💼 [Live Agent]: ${incomingText}`,
          );
          if (messageExists) {
            return prev;
          }

          return [
            ...prev,
            {
              role: "ai",
              text: incomingText.startsWith("👨‍💼")
                ? incomingText
                : `👨‍💼 [Live Agent]: ${incomingText}`,
            },
          ];
        });
      }
    };

    return () => socketRef.current?.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const currentInput = input.trim();
    const userMsg = { role: "user", text: currentInput };

    // Explicit array update before backend serialization loop
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // 📡 Live WebSocket Transmission Route
    if (humanHandoffActive) {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(currentInput);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "[System]: Live agent connection not ready. Message dropped.",
          },
        ]);
      }
      return;
    }

    setLoading(true);
    const conversationHistory = messages.map((m) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.text,
    }));

    try {
      const res = await API.post("/api/sales/chat", {
        message: currentInput,
        history: conversationHistory,
      });

      const data = res.data;

      if (data.handoff_triggered === true) {
        setHumanHandoffActive(true);
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: data.reply },
          {
            role: "ai",
            text: "🚨 [SYSTEM ALERT]: Connecting you to a human representative. A human agent has taken over this workspace stream live.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: data.reply, stage: data.stage },
        ]);
      }

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
      className="flex gap-6 h-full text-slate-800 font-sans"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      {/* ── LEFT SIDE: Chat Interface ── */}
      <div
        className="flex-1 flex flex-col rounded-2xl overflow-hidden relative bg-white/70 backdrop-blur-xl"
        style={{
          border: "1px solid rgba(226, 232, 240, 0.6)",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.02)",
        }}
      >
        {/* Red Glow Banner overlay for Human Handoff Takeover */}
        {humanHandoffActive && (
          <div
            className="absolute left-0 right-0 z-10 flex items-center justify-between px-6 py-3 border-y animate-pulse bg-rose-50 border-rose-200"
            style={{ top: "77px" }}
          >
            <span
              className="text-xs font-bold text-rose-600 tracking-wide uppercase"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              🚨 Human Representative Secured — Agent Override Active
            </span>
            <button
              onClick={() => setHumanHandoffActive(false)}
              className="text-[10px] font-bold px-3 py-1 rounded-md transition-all text-white bg-rose-600 hover:opacity-90 shadow-sm uppercase tracking-wider"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Reset to AI
            </button>
          </div>
        )}

        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-white/40">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-200/50 text-purple-600 shadow-sm"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              🤖
            </div>
            <div>
              <p
                className="font-extrabold text-slate-900 text-sm tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                AI Sales Assistant
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
                <p
                  className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Active Pipeline Session
                </p>
              </div>
            </div>
          </div>

          {/* Badge Rows */}
          <div className="flex items-center gap-2">
            {detectedLang && (
              <div
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/60 text-emerald-600 shadow-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span>🌐</span> {detectedLang}
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 shadow-sm">
              <span className="text-xs">{currentStage.icon}</span>
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{
                  color: currentStage.color,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {currentStage.label}
              </span>
            </div>
          </div>
        </div>

        {/* Chat Stream Window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs mr-2 mt-1 flex-shrink-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-200/50 text-purple-600 shadow-sm"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  🤖
                </div>
              )}
              <div className="max-w-xs lg:max-w-md">
                <div
                  className="px-4 py-3 rounded-2xl text-[14px] font-medium leading-relaxed shadow-sm"
                  style={
                    msg.role === "user"
                      ? {
                          background:
                            "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                          color: "white",
                          borderBottomRightRadius: "4px",
                          boxShadow: "0 4px 14px rgba(124, 58, 237, 0.15)",
                          fontFamily: "'Inter', sans-serif",
                        }
                      : {
                          backgroundColor: "#FFFFFF",
                          border: "1px solid rgba(226, 232, 240, 0.8)",
                          color: "#334155",
                          borderBottomLeftRadius: "4px",
                          fontFamily: "'Inter', sans-serif",
                        }
                  }
                >
                  {msg.text}
                </div>
                {msg.stage && msg.role === "ai" && (
                  <p
                    className="text-[10px] mt-1.5 ml-1 text-slate-400 font-bold uppercase tracking-wider"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
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
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs mr-2 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-200/50 text-purple-600 shadow-sm"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                🤖
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: "#7C3AED",
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
        <div className="p-4 border-t border-slate-100 bg-white/40">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={
                humanHandoffActive
                  ? "Type directly to chat with live representative..."
                  : "Type your message here... (e.g., 'Price kya hai?')"
              }
              className="flex-1 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder-slate-400 bg-white border shadow-sm"
              style={{
                borderColor: humanHandoffActive ? "#F43F5E" : "#E2E8F0",
                boxShadow: humanHandoffActive
                  ? "0 0 0 4px rgba(244, 63, 94, 0.05)"
                  : "none",
                fontFamily: "'Inter', sans-serif",
              }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-md"
              style={{
                background:
                  loading || !input.trim()
                    ? "#CBD5E1"
                    : "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                boxShadow:
                  loading || !input.trim()
                    ? "none"
                    : "0 4px 14px rgba(124, 58, 237, 0.2)",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Send →
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE ── */}
      <div className="w-72 flex flex-col gap-4">
        {/* Pipeline Tracking */}
        <div
          className="rounded-2xl p-5 bg-white/70 backdrop-blur-xl"
          style={{
            border: "1px solid rgba(226, 232, 240, 0.6)",
            boxShadow: "0 4px 20px rgba(15, 23, 42, 0.01)",
          }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-4 text-slate-400"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Pipeline Tracking
          </p>
          <div className="space-y-1.5">
            {Object.entries(STAGE_INFO).map(([key, val]) => (
              <div
                key={key}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                style={{
                  backgroundColor:
                    stage === key ? `${val.color}08` : "transparent",
                  border:
                    stage === key
                      ? `1px solid ${val.color}30`
                      : "1px solid transparent",
                }}
              >
                <span className="text-sm">{val.icon}</span>
                <span
                  className="text-sm font-bold tracking-tight"
                  style={{
                    color: stage === key ? val.color : "#64748B",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
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

        {/* Catalog Mapping */}
        <div
          className="rounded-2xl p-5 bg-white/70 backdrop-blur-xl"
          style={{
            border: "1px solid rgba(226, 232, 240, 0.6)",
            boxShadow: "0 4px 20px rgba(15, 23, 42, 0.01)",
          }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-4 text-slate-400"
            style={{ fontFamily: "'Inter', sans-serif" }}
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
                  className="p-3.5 rounded-xl transition-all border bg-white/80 shadow-sm"
                  style={{
                    borderColor: isRecommended
                      ? plan.color
                      : "rgba(226, 232, 240, 0.8)",
                    background: isRecommended ? `${plan.color}04` : "#FFFFFF",
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-sm font-bold text-slate-900 tracking-tight"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {plan.name}
                    </span>
                    <span
                      className="text-sm font-extrabold"
                      style={{
                        color: plan.color,
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {plan.price}
                    </span>
                  </div>
                  <p
                    className="text-xs font-medium text-slate-400 leading-normal"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {plan.desc}
                  </p>
                  {isRecommended && (
                    <div
                      className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-md inline-block uppercase tracking-wider"
                      style={{
                        backgroundColor: `${plan.color}10`,
                        color: plan.color,
                        fontFamily: "'Inter', sans-serif",
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

        {/* Real-time Intent Box */}
        {Object.keys(leadData).some((k) => leadData[k]) && (
          <div
            className="rounded-2xl p-5 bg-emerald-50/40 backdrop-blur-xl shadow-sm animate-fade-in"
            style={{ border: "1px solid rgba(16, 185, 129, 0.25)" }}
          >
            <p
              className="text-[11px] font-bold uppercase tracking-widest mb-4 text-emerald-600"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              📊 Captured Context
            </p>
            <div className="space-y-2.5">
              {Object.entries(leadData).map(([key, val]) =>
                val ? (
                  <div
                    key={key}
                    className="flex justify-between items-start gap-3 border-b border-slate-200/30 pb-2 last:border-0 last:pb-0"
                  >
                    <span
                      className="text-xs font-bold capitalize text-slate-400 flex-shrink-0"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {key}:
                    </span>
                    <span
                      className="text-xs text-slate-700 font-semibold text-right break-words max-w-[150px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
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
