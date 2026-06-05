import { useState } from "react";

const dummyLeads = [
  {
    id: 1,
    name: "Rahul Sharma",
    phone: "9876543210",
    requirement: "CRM Software",
    budget: "50k",
    status: "new",
    date: "2026-06-05",
  },
  {
    id: 2,
    name: "Priya Singh",
    phone: "9812345678",
    requirement: "Website Design",
    budget: "30k",
    status: "contacted",
    date: "2026-06-04",
  },
  {
    id: 3,
    name: "Amit Verma",
    phone: "9898989898",
    requirement: "Mobile App",
    budget: "1.5L",
    status: "converted",
    date: "2026-06-04",
  },
  {
    id: 4,
    name: "Neha Gupta",
    phone: "9765432109",
    requirement: "SEO Services",
    budget: "20k",
    status: "new",
    date: "2026-06-03",
  },
  {
    id: 5,
    name: "Vikram Patel",
    phone: "9654321098",
    requirement: "Cloud Setup",
    budget: "80k",
    status: "contacted",
    date: "2026-06-03",
  },
];

const statusStyles = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  converted: "bg-green-100 text-green-700",
};

function Leads() {
  const [search, setSearch] = useState("");
  const [leads] = useState(dummyLeads);

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search),
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">All Leads</h2>
          <p className="text-sm text-gray-500">{filtered.length} leads found</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Add Lead
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <input
          type="text"
          placeholder="🔍 Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Name", "Phone", "Requirement", "Budget", "Status", "Date"].map(
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
            {filtered.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">
                  {lead.name}
                </td>
                <td className="px-6 py-4 text-gray-600">{lead.phone}</td>
                <td className="px-6 py-4 text-gray-600">{lead.requirement}</td>
                <td className="px-6 py-4 text-gray-600">₹{lead.budget}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[lead.status]}`}
                  >
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{lead.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">👥</p>
            <p>No leads found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leads;
