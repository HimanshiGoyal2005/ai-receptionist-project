import { useState, useEffect } from "react";
import API from "../services/api";

const statusStyles = {
  confirmed:
    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]",
  pending:
    "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]",
  cancelled:
    "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]",
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
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
    },
    {
      label: "Confirmed Slots",
      value: counts.confirmed,
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
    },
    {
      label: "Pending Verification",
      value: counts.pending,
      borderColor: "border-amber-500/30",
      textColor: "text-amber-400",
    },
    {
      label: "Cancelled Calls",
      value: counts.cancelled,
      borderColor: "border-red-500/30",
      textColor: "text-red-400",
    },
  ];

  return (
    <div className="space-y-6 text-gray-100">
      {/* Header section matching previous styles */}
      <div className="flex items-center justify-between border-b border-gray-800/60 pb-5">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Appointments Ledger
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage scheduled customer call routing and operational booking slots
          </p>
        </div>
      </div>

      {/* Mini Technical Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {miniStats.map((s) => (
          <div
            key={s.label}
            className={`bg-[#0F1420]/30 backdrop-blur-md rounded-xl border-l-4 p-5 shadow-lg border-y border-r border-gray-800/60 ${s.borderColor}`}
          >
            <h3 className="text-3xl font-bold text-white tracking-tight">
              {s.value}
            </h3>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid Table Box */}
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
              Syncing database cron intervals...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#0A0E17]/80 border-b border-gray-800/60 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
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
                      className="px-6 py-4 font-semibold tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {appointments.map((apt) => (
                  <tr
                    key={apt.id}
                    className="hover:bg-gray-800/20 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-4 font-medium text-white group-hover:text-blue-400 transition-colors">
                      {apt.lead_id || "Unregistered"}
                    </td>
                    <td className="px-6 py-4 py-4 text-sm">
                      <div className="rounded-xl border border-gray-800/80 bg-[#111827] p-3 shadow-sm">
                        <div className="text-sm font-semibold text-white">
                          {apt.lead_name || "Unknown Lead"}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {apt.lead_phone || "No number available"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-medium">
                      {apt.appointment_date || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-medium">
                      {apt.appointment_time || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1.5 ${
                          statusStyles[apt.status] ||
                          "bg-gray-800 text-gray-400"
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${
                            apt.status === "confirmed"
                              ? "bg-emerald-400"
                              : apt.status === "pending"
                                ? "bg-amber-400"
                                : "bg-red-400"
                          }`}
                        />
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block text-left">
                        <select
                          value={apt.status}
                          onChange={(e) => updateStatus(apt.id, e.target.value)}
                          className="text-xs font-semibold bg-[#070A10] border border-gray-800 hover:border-gray-700 rounded-lg px-3 py-1.5 text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500/30 cursor-pointer transition-all appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_0.75rem_center] bg-no-repeat"
                        >
                          <option value="pending" className="bg-[#0A0E17]">
                            Pending
                          </option>
                          <option value="confirmed" className="bg-[#0A0E17]">
                            Confirmed
                          </option>
                          <option value="cancelled" className="bg-[#0A0E17]">
                            Cancelled
                          </option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State Exception component if list parses empty array */}
        {!loading && appointments.length === 0 && (
          <div className="text-center py-20 border-t border-gray-800/40 bg-[#070A10]/20">
            <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 mx-auto mb-4">
              📅
            </div>
            <h3 className="text-sm font-semibold text-gray-300">
              No scheduled blocks discovered
            </h3>
            <p className="text-xs text-gray-600 max-w-xs mx-auto mt-1">
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
