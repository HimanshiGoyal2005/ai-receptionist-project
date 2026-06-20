import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

// 🌟 Styled dynamically for the premium OmniDim clean light aesthetic
const intentStyles = {
  lead: "bg-purple-50 text-purple-600 border border-purple-100 shadow-[0_2px_8px_rgba(124,58,237,0.02)]",
  appointment:
    "bg-cyan-50 text-cyan-600 border border-cyan-100 shadow-[0_2px_8px_rgba(6,182,212,0.02)]",
  faq: "bg-slate-50 text-slate-500 border border-slate-200",
};

const sentimentStyles = {
  positive:
    "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-[0_2px_8px_rgba(16,185,129,0.02)]",
  neutral:
    "bg-amber-50 text-amber-600 border border-amber-100 shadow-[0_2px_8px_rgba(245,158,11,0.02)]",
  negative:
    "bg-rose-50 text-rose-600 border border-rose-100 shadow-[0_2px_8px_rgba(244,63,94,0.02)]",
};

// Fallback dummy data structure if backend endpoint returns empty
const backupConversations = [
  {
    id: 1,
    lead: "Rahul Sharma",
    phone: "9876543210",
    intent: "lead",
    sentiment: "positive",
    date: "2026-06-05 10:30 AM",
    transcript:
      "Hello, I am looking for a CRM software solution for my business. My team has 20 people and we need something affordable. My budget is around 50,000 rupees.",
    ai_summary:
      "Customer is interested in CRM software for a 20-person team. Budget: ₹50k. High buying intent.",
  },
  {
    id: 2,
    lead: "Priya Singh",
    phone: "9812345678",
    intent: "appointment",
    sentiment: "neutral",
    date: "2026-06-04 02:15 PM",
    transcript:
      "I need a new website for my boutique. Can we schedule a meeting to discuss the design requirements? I am free tomorrow at 3pm.",
    ai_summary:
      "Customer wants website design for boutique. Requested appointment for tomorrow 3PM. Budget: ₹30k.",
  },
];

function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic API parsing integration
  useEffect(() => {
    API.get("/api/conversations")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setConversations(res.data);
        } else {
          setConversations(backupConversations);
        }
      })
      .catch((err) => {
        console.log(
          "Backend offline, deploying local pipeline state metrics:",
          err,
        );
        setConversations(backupConversations);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-5">
        <div>
          <h2
            className="text-2xl font-extrabold text-slate-900 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Conversations Log
          </h2>
          <p
            className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {loading
              ? "Syncing operational matrix..."
              : `${conversations.length} total active dialog matrices`}
          </p>
        </div>
      </div>

      {/* Main List Shell */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 text-slate-400 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex justify-center mb-4">
              <svg
                className="animate-spin h-8 w-8 text-purple-600"
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
            </div>
            <p
              className="text-sm font-semibold tracking-wide text-slate-500"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Decompressing operational logs...
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className="backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                border:
                  expanded === conv.id
                    ? "1px solid rgba(124, 58, 237, 0.25)"
                    : "1px solid rgba(226, 232, 240, 0.6)",
                background:
                  expanded === conv.id ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
                boxShadow:
                  expanded === conv.id
                    ? "0 12px 30px rgba(124, 58, 237, 0.04), 0 4px 12px rgba(15, 23, 42, 0.01)"
                    : "0 4px 20px rgba(15, 23, 42, 0.01)",
              }}
            >
              {/* Row Header Trigger */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 cursor-pointer gap-4"
                onClick={() =>
                  setExpanded(expanded === conv.id ? null : conv.id)
                }
                onMouseEnter={(e) => {
                  if (expanded !== conv.id) {
                    e.currentTarget.parentElement.style.borderColor =
                      "rgba(124, 58, 237, 0.2)";
                    e.currentTarget.parentElement.style.background = "#FFFFFF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (expanded !== conv.id) {
                    e.currentTarget.parentElement.style.borderColor =
                      "rgba(226, 232, 240, 0.6)";
                    e.currentTarget.parentElement.style.background =
                      "rgba(255, 255, 255, 0.7)";
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Dynamic Letter Badge with premium look */}
                  <div
                    className="w-11 h-11 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-200/50 rounded-xl flex items-center justify-center text-purple-600 font-extrabold tracking-wide shadow-sm"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {(conv.lead || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p
                      className="font-extrabold text-slate-900 tracking-tight text-[15px]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {conv.lead || "Unknown Client"}
                    </p>
                    <p
                      className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-2"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <span className="font-mono text-slate-600 font-semibold bg-slate-50/80 border border-slate-100 px-1.5 py-0.5 rounded">
                        {conv.phone || "—"}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="font-medium text-slate-500">
                        {conv.date
                          ? new Date(conv.date).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Badges Layout Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t border-slate-100 pt-3 sm:pt-0 sm:border-none">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${intentStyles[conv.intent] || intentStyles.faq}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {conv.intent}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${sentimentStyles[conv.sentiment] || sentimentStyles.neutral}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {conv.sentiment}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {conv.lead_id ? (
                      <Link
                        to={`/conversations/${conv.lead_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex px-3 py-1.5 rounded-xl font-bold text-white text-xs tracking-wide transition-all duration-200 shadow-sm"
                        style={{
                          background:
                            "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = "0.9")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = "1")
                        }
                      >
                        View Thread
                      </Link>
                    ) : null}
                    <span
                      className={`text-slate-400 pl-1`}
                      style={{
                        transition:
                          "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        transform:
                          expanded === conv.id
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        color: expanded === conv.id ? "#7C3AED" : "inherit",
                      }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Collapsible Expanded Panel */}
              {expanded === conv.id && (
                <div className="border-t border-slate-100 px-6 py-6 bg-slate-50/30 space-y-5">
                  {conv.lead_id ? (
                    <div className="flex justify-end">
                      <Link
                        to={`/conversations/${conv.lead_id}`}
                        className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border border-purple-200 text-purple-600 bg-white shadow-sm hover:bg-purple-50 transition-all duration-200"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        Open Client Thread
                      </Link>
                    </div>
                  ) : null}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <p
                        className="text-[11px] font-bold text-slate-400 tracking-widest uppercase"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        🎙️ Voice Core Transcript
                      </p>
                    </div>
                    <p
                      className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-100 rounded-xl p-4 font-medium shadow-sm"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {conv.transcript || "No dialogue captured."}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <p
                        className="text-[11px] font-bold text-purple-600 tracking-widest uppercase"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        🤖 Structural AI Synthesis Summary
                      </p>
                    </div>
                    <p
                      className="text-sm text-purple-700 leading-relaxed bg-purple-50/40 border border-purple-100 rounded-xl p-4 font-medium shadow-sm"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {conv.ai_summary ||
                        "Awaiting extraction execution parameters."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Conversations;
