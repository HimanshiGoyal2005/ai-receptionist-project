import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const intentStyles = {
  lead: "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]",
  appointment:
    "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]",
  faq: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
};

const sentimentStyles = {
  positive:
    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]",
  neutral:
    "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]",
  negative:
    "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]",
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
    <div className="space-y-6 text-gray-100">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between border-b border-gray-800/60 pb-5">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Conversations Log
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading
              ? "Syncing..."
              : `${conversations.length} total active dialog matrices`}
          </p>
        </div>
      </div>

      {/* Main List Shell */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="text-center py-20 text-gray-500 bg-[#0F1420]/20 rounded-xl border border-gray-800/40">
            <div className="flex justify-center mb-4">
              <svg
                className="animate-spin h-7 w-7 text-blue-500"
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
            <p className="text-sm font-medium tracking-wide">
              Decompressing operational logs...
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`bg-[#0F1420]/30 backdrop-blur-md rounded-xl border transition-all duration-300 overflow-hidden shadow-lg ${
                expanded === conv.id
                  ? "border-gray-700/80 bg-[#0F1420]/60"
                  : "border-gray-800/80 hover:border-gray-700/50"
              }`}
            >
              {/* Row Header Trigger */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4.5 cursor-pointer gap-4 transition-colors hover:bg-gray-800/10"
                onClick={() =>
                  setExpanded(expanded === conv.id ? null : conv.id)
                }
              >
                <div className="flex items-center gap-4">
                  {/* Dynamic Letter Badge with gradient tone */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400 font-bold tracking-wide">
                    {(conv.lead || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white tracking-wide group-hover:text-blue-400 transition-colors">
                      {conv.lead || "Unknown Client"}
                    </p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      <span className="font-mono text-gray-400 tracking-wider">
                        {conv.phone || "—"}
                      </span>
                      <span className="mx-2 text-gray-700">·</span>
                      <span className="text-gray-400">
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
                <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t border-gray-800/40 pt-3 sm:pt-0 sm:border-none">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${intentStyles[conv.intent] || intentStyles.faq}`}
                    >
                      {conv.intent}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${sentimentStyles[conv.sentiment] || sentimentStyles.neutral}`}
                    >
                      {conv.sentiment}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {conv.lead_id ? (
                      <Link
                        to={`/conversations/${conv.lead_id}`}
                        className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/15 transition-colors"
                      >
                        View Thread
                      </Link>
                    ) : null}
                    <span
                      className={`text-gray-500 text-xs transition-transform duration-200 pl-2 ${expanded === conv.id ? "rotate-180 text-blue-400" : ""}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
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
                <div className="border-t border-gray-800/60 px-6 py-5 bg-[#070A10]/50 space-y-4 animate-fade-in">
                  {conv.lead_id ? (
                    <div className="flex justify-end">
                      <Link
                        to={`/conversations/${conv.lead_id}`}
                        className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/15 transition-colors"
                      >
                        Open Client Thread
                      </Link>
                    </div>
                  ) : null}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-1 h-1 rounded-full bg-gray-500" />
                      <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                        📝 Voice Core Transcript
                      </p>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed bg-[#070A10]/80 border border-gray-900/60 rounded-xl p-3.5 font-medium">
                      {conv.transcript || "No dialogue captured."}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-1 h-1 rounded-full bg-blue-400" />
                      <p className="text-[10px] font-bold text-blue-400 tracking-widest uppercase">
                        🤖 Structural AI Synthesis Summary
                      </p>
                    </div>
                    <p className="text-sm text-blue-300 leading-relaxed bg-blue-950/20 border border-blue-900/30 rounded-xl p-3.5 font-medium">
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
