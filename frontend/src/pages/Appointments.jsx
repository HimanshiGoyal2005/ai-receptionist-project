import { useState, useEffect } from "react";
import API from "../services/api";

const statusStyles = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusIcons = {
  confirmed: "✅",
  pending: "⏳",
  cancelled: "❌",
};

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/appointments")
      .then((res) => setAppointments(res.data))
      .catch((err) => console.log("Error:", err))
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

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Appointments</h2>
        <p className="text-sm text-gray-500">
          Manage all scheduled appointments
        </p>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: counts.total, color: "border-blue-400" },
          {
            label: "Confirmed",
            value: counts.confirmed,
            color: "border-green-400",
          },
          {
            label: "Pending",
            value: counts.pending,
            color: "border-yellow-400",
          },
          {
            label: "Cancelled",
            value: counts.cancelled,
            color: "border-red-400",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${s.color}`}
          >
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">⏳</p>
            <p>Loading appointments...</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Lead", "Phone", "Date", "Time", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {apt.lead_id}
                  </td>
                  <td className="px-6 py-4 text-gray-600">-</td>
                  <td className="px-6 py-4 text-gray-600">
                    {apt.appointment_date}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {apt.appointment_time}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[apt.status] || "bg-gray-100 text-gray-700"}`}
                    >
                      {statusIcons[apt.status]} {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={apt.status}
                      onChange={(e) => updateStatus(apt.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && appointments.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📅</p>
            <p>No appointments yet!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;
