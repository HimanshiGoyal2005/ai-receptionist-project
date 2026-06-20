import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
    <div className="space-y-6 text-slate-800 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/60 pb-5 gap-4">
        <div>
          <div className="flex flex-wrap gap-4 mb-3">
            <Link
              to="/conversations"
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-cyan-600 transition-colors uppercase tracking-wider"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ← Back to conversations
            </Link>
            <Link
              to="/leads"
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-cyan-600 transition-colors uppercase tracking-wider"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ← Back to leads
            </Link>
          </div>
          <h2
            className="text-2xl font-extrabold text-slate-900 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {lead
              ? `${lead.name}'s Conversation Thread`
              : "Conversation Thread"}
          </h2>
          <p
            className="text-sm font-medium text-slate-500 mt-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {lead
              ? `All conversations recorded for ${lead.name} (${lead.phone || "no phone"}).`
              : "Loading client details..."}
          </p>
          {lead && (lead.industry || lead.team_size || lead.lead_score) ? (
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {lead.industry && (
                <span
                  className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 font-semibold"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Industry: {lead.industry}
                </span>
              )}
              {lead.team_size && (
                <span
                  className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 font-semibold"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Team size: {lead.team_size}
                </span>
              )}
              {lead.lead_score && (
                <span
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold uppercase tracking-wide"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Score: {lead.lead_score}
                </span>
              )}
            </div>
          ) : null}
        </div>
        <div
          className="rounded-xl bg-white/60 backdrop-blur-md px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 self-start sm:self-center"
          style={{
            border: "1px solid rgba(226, 232, 240, 0.8)",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.02)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {loading
            ? "Fetching matrices..."
            : `${conversations.length} saved conversation${conversations.length === 1 ? "" : "s"}`}
        </div>
      </div>

      {error ? (
        <div
          className="rounded-xl border border-rose-100 bg-rose-50/60 text-sm font-semibold text-rose-500 p-5 shadow-sm"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          ⚠️ {error}
        </div>
      ) : loading ? (
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
            Loading conversation thread...
          </p>
        </div>
      ) : conversations.length === 0 ? (
        <div
          className="rounded-2xl bg-white/60 backdrop-blur-md p-10 text-center shadow-sm"
          style={{ border: "1px solid rgba(226, 232, 240, 0.6)" }}
        >
          <p
            className="text-sm font-bold text-slate-800 mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            No conversations found for this client yet.
          </p>
          <p
            className="text-xs font-medium text-slate-400"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            New call transcripts will show here automatically when the same
            client is recognized.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.01)] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(124,58,237,0.03)]"
              style={{ border: "1px solid rgba(226, 232, 240, 0.6)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(226, 232, 240, 0.6)")
              }
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <p
                    className="text-[15px] font-extrabold text-slate-900 tracking-tight"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Conversation #{conv.id}
                  </p>
                  <p
                    className="text-xs font-medium text-slate-400 mt-1"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {conv.date || "Unknown date"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${intentStyles[conv.intent] || intentStyles.faq}`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {conv.intent || "general"}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${sentimentStyles[conv.sentiment] || sentimentStyles.neutral}`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {conv.sentiment || "neutral"}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-white/50 border border-slate-100 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <p
                      className="text-[11px] font-bold text-slate-400 tracking-widest uppercase"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      🎙️ Customer transcript
                    </p>
                  </div>
                  <p
                    className="text-sm leading-relaxed text-slate-700 font-medium whitespace-pre-wrap"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {conv.transcript || "No transcript available."}
                  </p>
                </div>
                <div className="rounded-xl bg-purple-50/20 border border-purple-100/60 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <p
                      className="text-[11px] font-bold text-purple-600 tracking-widest uppercase"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      🤖 AI summary
                    </p>
                  </div>
                  <p
                    className="text-sm leading-relaxed text-purple-700 font-medium whitespace-pre-wrap"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
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
