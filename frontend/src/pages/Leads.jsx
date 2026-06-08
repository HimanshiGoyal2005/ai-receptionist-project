import { useState, useEffect } from "react";
import API from "../services/api";

const statusStyles = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  converted: "bg-green-100 text-green-700",
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">All Leads</h2>
          <p className="text-sm text-gray-500">{filtered.length} leads found</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <input
          type="text"
          placeholder="🔍 Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">⏳</p>
            <p>Loading leads...</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
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
                    className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {lead.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{lead.phone}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {lead.requirement}
                  </td>
                  <td className="px-6 py-4 text-gray-600">₹{lead.budget}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[lead.status] || "bg-gray-100 text-gray-700"}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {lead.created_at
                      ? new Date(lead.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">👥</p>
            <p>No leads yet — upload audio to create leads!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leads;
