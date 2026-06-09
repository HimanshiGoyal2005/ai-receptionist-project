import { useState, useEffect } from "react";
import API from "../services/api";

// Modern glowing tags based on status
const statusStyles = {
  new: "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
  contacted:
    "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
  converted:
    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
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
      l.phone?.includes(search),
  );

  return (
    <div className="space-y-6 text-gray-100">
      {/* Page Context Description */}
      <div className="flex items-center justify-between border-b border-gray-800/60 pb-5">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            All Captured Leads
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} {filtered.length === 1 ? "lead" : "leads"}{" "}
            extracted through intelligence models
          </p>
        </div>
      </div>

      {/* Premium Dark Search Input Wrapper */}
      <div className="bg-[#0F1420]/40 backdrop-blur-md rounded-xl border border-gray-800/80 p-4 shadow-xl">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-gray-500 pointer-events-none">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by client name, query scope or contact metadata..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#070A10]/60 border border-gray-800 rounded-lg pl-11 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
          />
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="bg-[#0F1420]/30 backdrop-blur-md rounded-xl border border-gray-800/80 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            <div className="flex justify-center mb-4">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
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
            <p className="text-sm tracking-wide font-medium">
              Fetching sync architecture leads...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#0A0E17]/80 border-b border-gray-800/60 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                <tr>
                  {[
                    "Name",
                    "Phone",
                    "Requirement",
                    "Budget",
                    "Status",
                    "Date",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 font-semibold tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-800/20 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-4 font-medium text-white group-hover:text-blue-400 transition-colors">
                      {lead.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono tracking-wide">
                      {lead.phone || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-300 max-w-xs truncate">
                      {lead.requirement || "No data shared"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-200">
                      {lead.budget ? `₹${lead.budget}` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${statusStyles[lead.status] || "bg-gray-800 text-gray-400"}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs font-medium">
                      {lead.created_at
                        ? new Date(lead.created_at).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State Exception */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 border-t border-gray-800/40 bg-[#070A10]/20">
            <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 mx-auto mb-4">
              👥
            </div>
            <h3 className="text-sm font-semibold text-gray-300">
              No pipelines synced yet
            </h3>
            <p className="text-xs text-gray-600 max-w-xs mx-auto mt-1">
              Upload core audio assets inside the main workspace to populate
              automated system leads.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leads;
