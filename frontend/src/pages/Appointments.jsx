import { useState, useEffect } from "react";
import API from "../services/api";

// 🌟 Aligned status badges with the premium light minimal OmniDim style
const statusStyles = {
  confirmed:
    "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-[0_2px_8px_rgba(16,185,129,0.02)]",
  pending:
    "bg-amber-50 text-amber-600 border border-amber-100 shadow-[0_2px_8px_rgba(245,158,11,0.02)]",
  cancelled:
    "bg-rose-50 text-rose-600 border border-rose-100 shadow-[0_2px_8px_rgba(244,63,94,0.02)]",
};

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/appointments")
      .then((res) => setAppointments(res.data))
      .catch((err) => console.log("Error fetching appointments:", err))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(`/api/appointments/${id}`, { status: newStatus });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
      );
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  const counts = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    pending: appointments.filter((a) => a.status === "pending").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  const miniStats = [
    {
      label: "Total Matrix",
      value: counts.total,
      borderColor: "border-l-purple-500",
    },
    {
      label: "Confirmed Slots",
      value: counts.confirmed,
      borderColor: "border-l-emerald-500",
    },
    {
      label: "Pending Verification",
      value: counts.pending,
      borderColor: "border-l-amber-500",
    },
    {
      label: "Cancelled Calls",
      value: counts.cancelled,
      borderColor: "border-l-rose-500",
    },
  ];

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      {/* Header section matching previous styles */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-5">
        <div>
          <h2
            className="text-2xl font-extrabold text-slate-900 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Appointments Ledger
          </h2>
          <p
            className="text-sm font-medium text-slate-500 mt-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Manage scheduled customer call routing and operational booking slots
          </p>
        </div>
      </div>

      {/* Mini Technical Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {miniStats.map((s) => (
          <div
            key={s.label}
            className={`bg-white/70 backdrop-blur-xl rounded-2xl border-y border-r border-slate-200/80 border-l-4 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.01)] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.02)] ${s.borderColor}`}
          >
            <h3
              className="text-3xl font-extrabold text-slate-900 tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {s.value}
            </h3>
            <p
              className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid Table Box */}
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
              Syncing database cron intervals...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50/80 border-b border-slate-200/60 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                <tr>
                  {[
                    "Lead",
                    "Contact Info",
                    "Date",
                    "Time",
                    "Status",
                    "Actions",
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
                {appointments.map((apt) => (
                  <tr
                    key={apt.id}
                    className="hover:bg-white/80 transition-all duration-200 group"
                  >
                    <td className="px-6 py-4.5 font-bold text-slate-500 font-mono text-xs group-hover:text-purple-600 transition-colors">
                      ID-{apt.lead_id || "Unregistered"}
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm max-w-xs">
                        <div
                          className="text-sm font-bold text-slate-900"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {apt.lead_name || "Unknown Lead"}
                        </div>
                        <div className="text-xs font-mono text-slate-500 font-semibold mt-1">
                          {apt.lead_phone || "No number available"}
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4.5 text-slate-700 font-semibold text-[14px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {apt.appointment_date || "—"}
                    </td>
                    <td
                      className="px-6 py-4.5 text-slate-700 font-semibold text-[14px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {apt.appointment_time || "—"}
                    </td>
                    <td className="px-6 py-4.5">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1.5 border ${
                          statusStyles[apt.status] ||
                          "bg-slate-50 text-slate-400 border-slate-200"
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            apt.status === "confirmed"
                              ? "bg-emerald-500"
                              : apt.status === "pending"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          }`}
                        />
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="relative inline-block text-left">
                        <select
                          value={apt.status}
                          onChange={(e) => updateStatus(apt.id, e.target.value)}
                          className="text-xs font-bold bg-white border border-slate-200 hover:border-purple-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-4 focus:ring-purple-500/5 cursor-pointer transition-all appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.6rem_auto] bg-[right_0.75rem_center] bg-no-repeat shadow-sm"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State Component */}
        {!loading && appointments.length === 0 && (
          <div className="text-center py-20 bg-slate-50/20">
            <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sm mx-auto mb-4 shadow-sm">
              📅
            </div>
            <h3
              className="text-sm font-bold text-slate-800"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              No scheduled blocks discovered
            </h3>
            <p
              className="text-xs font-medium text-slate-400 max-w-xs mx-auto mt-1.5 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Data pipelines will map incoming conversational triggers directly
              into active arrays.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;
