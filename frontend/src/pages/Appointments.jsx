import { useState } from "react";

const dummyAppointments = [
  {
    id: 1,
    lead: "Priya Singh",
    phone: "9812345678",
    date: "2026-06-06",
    time: "03:00 PM",
    status: "confirmed",
    requirement: "Website Design",
  },
  {
    id: 2,
    lead: "Rahul Sharma",
    phone: "9876543210",
    date: "2026-06-07",
    time: "11:00 AM",
    status: "pending",
    requirement: "CRM Software",
  },
  {
    id: 3,
    lead: "Amit Verma",
    phone: "9898989898",
    date: "2026-06-05",
    time: "02:00 PM",
    status: "confirmed",
    requirement: "Mobile App",
  },
  {
    id: 4,
    lead: "Neha Gupta",
    phone: "9765432109",
    date: "2026-06-04",
    time: "10:00 AM",
    status: "cancelled",
    requirement: "SEO Services",
  },
  {
    id: 5,
    lead: "Vikram Patel",
    phone: "9654321098",
    date: "2026-06-08",
    time: "04:00 PM",
    status: "pending",
    requirement: "Cloud Setup",
  },
];

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
  const [appointments, setAppointments] = useState(dummyAppointments);

  const updateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );
  };

  const counts = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    pending: appointments.filter((a) => a.status === "pending").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
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
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {[
                "Lead",
                "Phone",
                "Requirement",
                "Date",
                "Time",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">
                  {apt.lead}
                </td>
                <td className="px-6 py-4 text-gray-600">{apt.phone}</td>
                <td className="px-6 py-4 text-gray-600">{apt.requirement}</td>
                <td className="px-6 py-4 text-gray-600">{apt.date}</td>
                <td className="px-6 py-4 text-gray-600">{apt.time}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[apt.status]}`}
                  >
                    {statusIcons[apt.status]}{" "}
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
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
      </div>
    </div>
  );
}

export default Appointments;
