import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

function ConversationThread() {
  const { leadId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!leadId) return;

    const fetchThread = async () => {
      setLoading(true);
      setError("");
      try {
        const [convRes, leadRes] = await Promise.all([
          API.get(`/api/conversations?lead_id=${leadId}`),
          API.get(`/api/leads/${leadId}`),
        ]);

        setConversations(convRes.data || []);
        setLead(leadRes.data || null);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load the client conversation thread. Please check the lead ID or backend connection.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [leadId]);

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800/60 pb-5 gap-4">
        <div>
          <div className="flex flex-wrap gap-3 mb-3">
            <Link
              to="/conversations"
              className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-white"
            >
              ← Back to conversations
            </Link>
            <Link
              to="/leads"
              className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-white"
            >
              ← Back to leads
            </Link>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {lead
              ? `${lead.name}'s Conversation Thread`
              : "Conversation Thread"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {lead
              ? `All conversations recorded for ${lead.name} (${lead.phone || "no phone"}).`
              : "Loading client details..."}
          </p>
          {lead && (lead.industry || lead.team_size || lead.lead_score) ? (
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
              {lead.industry && (
                <span className="px-2 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200">
                  Industry: {lead.industry}
                </span>
              )}
              {lead.team_size && (
                <span className="px-2 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200">
                  Team size: {lead.team_size}
                </span>
              )}
              {lead.lead_score && (
                <span className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  Score: {lead.lead_score}
                </span>
              )}
            </div>
          ) : null}
        </div>
        <div className="rounded-2xl border border-gray-800/70 bg-[#0F1420]/70 px-4 py-3 text-sm text-gray-300">
          {loading
            ? "Fetching saved conversations..."
            : `${conversations.length} saved conversation${conversations.length === 1 ? "" : "s"}`}
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">
          {error}
        </div>
      ) : loading ? (
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
            Loading conversation thread...
          </p>
        </div>
      ) : conversations.length === 0 ? (
        <div className="rounded-2xl border border-gray-800/60 bg-[#070A10]/70 p-8 text-center text-gray-400">
          <p className="text-sm font-medium text-gray-200 mb-2">
            No conversations found for this client yet.
          </p>
          <p className="text-xs text-gray-500">
            New call transcripts will show here automatically when the same
            client is recognized.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="rounded-3xl border border-gray-800/70 bg-[#0D111B]/80 p-5 shadow-[0_0_20px_rgba(0,0,0,0.15)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Conversation #{conv.id}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {conv.date || "Unknown date"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase ${intentStyles[conv.intent] || intentStyles.faq}`}
                  >
                    {conv.intent || "general"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase ${sentimentStyles[conv.sentiment] || sentimentStyles.neutral}`}
                  >
                    {conv.sentiment || "neutral"}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-[#0B1220]/80 border border-gray-800/60 p-4">
                  <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-2">
                    Customer transcript
                  </p>
                  <p className="text-sm leading-6 text-gray-200 whitespace-pre-wrap">
                    {conv.transcript || "No transcript available."}
                  </p>
                </div>
                <div className="rounded-3xl bg-[#080C16]/80 border border-gray-800/60 p-4">
                  <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-2">
                    AI summary
                  </p>
                  <p className="text-sm leading-6 text-sky-200 whitespace-pre-wrap">
                    {conv.ai_summary || "No summary available."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ConversationThread;
