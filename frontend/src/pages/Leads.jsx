import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

// 🌟 Styled dynamically for the premium OmniDim clean light aesthetic
const statusStyles = {
  new: "bg-blue-50 text-blue-600 border border-blue-100 shadow-[0_2px_8px_rgba(59,130,246,0.02)]",
  contacted:
    "bg-amber-50 text-amber-600 border border-amber-100 shadow-[0_2px_8px_rgba(245,158,11,0.02)]",
  converted:
    "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-[0_2px_8px_rgba(16,185,129,0.02)]",
};

function Leads() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/leads")
      .then((res) => setLeads(res.data))
      .catch((err) => console.log("Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = leads.filter(
    (l) =>
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.includes(search) ||
      l.industry?.toLowerCase().includes(search.toLowerCase()) ||
      l.lead_score?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200/60 pb-5">
        <h1
          className="text-2xl font-extrabold text-slate-900 tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          All Captured Leads
        </h1>
        <p
          className="text-sm font-medium text-slate-500 mt-1"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {filtered.length} {filtered.length === 1 ? "lead" : "leads"} extracted
          through AI
        </p>
      </div>

      {/* Search Bar Container */}
      <div
        className="rounded-2xl bg-white/70 backdrop-blur-xl p-4"
        style={{
          border: "1px solid rgba(226, 232, 240, 0.8)",
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.01)",
        }}
      >
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by name, phone, industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-500/5 transition-all shadow-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>
      </div>

      {/* Table Main Grid Container */}
      <div
        className="rounded-2xl bg-white/40 backdrop-blur-xl overflow-hidden"
        style={{
          border: "1px solid rgba(226, 232, 240, 0.6)",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.02)",
        }}
      >
        {loading ? (
          <div className="text-center py-20 text-slate-400">
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
              Loading leads matrices...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50/80 border-b border-slate-200/60 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                <tr>
                  {[
                    "Name",
                    "Phone",
                    "Requirement",
                    "Budget",
                    "Industry",
                    "Lead Score",
                    "Status",
                    "Date",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70 bg-white/40">
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-white/80 transition-all duration-200 group"
                  >
                    <td
                      className="px-6 py-4.5 font-extrabold text-slate-900 tracking-tight text-[14px]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {lead.name || "—"}
                    </td>
                    <td className="px-6 py-4.5 text-slate-600 font-mono text-xs font-semibold">
                      {lead.phone || "—"}
                    </td>
                    <td
                      className="px-6 py-4.5 text-slate-500 font-medium max-w-xs truncate"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {lead.requirement || "—"}
                    </td>
                    <td
                      className="px-6 py-4.5 text-slate-900 font-extrabold text-[14px]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {lead.budget ? `₹${lead.budget}` : "—"}
                    </td>
                    <td
                      className="px-6 py-4.5 text-slate-500 font-bold text-xs"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {lead.industry || "—"}
                    </td>
                    <td className="px-6 py-4.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                          lead.lead_score?.toLowerCase() === "hot lead" ||
                          lead.lead_score?.toLowerCase() === "hot"
                            ? "bg-rose-50 text-rose-600 border border-rose-100/80 shadow-[0_2px_8px_rgba(244,63,94,0.02)]"
                            : "bg-slate-50 text-slate-500 border border-slate-200"
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {lead.lead_score || "Cold"}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase inline-block border ${
                          statusStyles[lead.status] ||
                          "bg-slate-50 text-slate-400 border-slate-200"
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4.5 text-slate-400 font-medium text-xs"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {lead.created_at
                        ? new Date(lead.created_at).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </td>
                    <td className="px-6 py-4.5">
                      <Link
                        to={`/conversations`}
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
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty Exception State Component */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 bg-slate-50/20">
            <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sm mx-auto mb-4 shadow-sm">
              👥
            </div>
            <h3
              className="text-sm font-bold text-slate-800"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              No leads found
            </h3>
            <p
              className="text-xs font-medium text-slate-400 max-w-xs mx-auto mt-1.5 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Upload audio to system overview to process and generate new logs
              automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leads;
