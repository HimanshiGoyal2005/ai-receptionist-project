import { useState } from "react";

const dummyConversations = [
  {
    id: 1,
    lead: "Rahul Sharma",
    phone: "9876543210",
    intent: "lead",
    sentiment: "positive",
    date: "2026-06-05 10:30 AM",
    transcript:
      "Hello, I am looking for a CRM software solution for my business. My team has 20 people and we need something affordable. My budget is around 50,000 rupees.",
    ai_summary:
      "Customer is interested in CRM software for a 20-person team. Budget: ₹50k. High buying intent.",
  },
  {
    id: 2,
    lead: "Priya Singh",
    phone: "9812345678",
    intent: "appointment",
    sentiment: "neutral",
    date: "2026-06-04 02:15 PM",
    transcript:
      "I need a new website for my boutique. Can we schedule a meeting to discuss the design requirements? I am free tomorrow at 3pm.",
    ai_summary:
      "Customer wants website design for boutique. Requested appointment for tomorrow 3PM. Budget: ₹30k.",
  },
  {
    id: 3,
    lead: "Amit Verma",
    phone: "9898989898",
    intent: "faq",
    sentiment: "positive",
    date: "2026-06-04 11:00 AM",
    transcript:
      "What technologies do you use for mobile app development? Do you support both Android and iOS? What is the typical timeline?",
    ai_summary:
      "Customer asked about mobile app tech stack and timeline. Interested in cross-platform development.",
  },
  {
    id: 4,
    lead: "Neha Gupta",
    phone: "9765432109",
    intent: "lead",
    sentiment: "neutral",
    date: "2026-06-03 04:45 PM",
    transcript:
      "I want to improve my website SEO. Currently getting very less traffic. My monthly budget for this is 20,000 rupees.",
    ai_summary:
      "Customer needs SEO services. Low website traffic issue. Budget: ₹20k/month.",
  },
];

const intentStyles = {
  lead: "bg-blue-100 text-blue-700",
  appointment: "bg-purple-100 text-purple-700",
  faq: "bg-gray-100 text-gray-700",
};

const sentimentStyles = {
  positive: "bg-green-100 text-green-700",
  neutral: "bg-yellow-100 text-yellow-700",
  negative: "bg-red-100 text-red-700",
};

function Conversations() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Conversations</h2>
        <p className="text-sm text-gray-500">
          {dummyConversations.length} total conversations
        </p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {dummyConversations.map((conv) => (
          <div
            key={conv.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            {/* Row */}
            <div
              className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === conv.id ? null : conv.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {conv.lead.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{conv.lead}</p>
                  <p className="text-xs text-gray-400">
                    {conv.phone} · {conv.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${intentStyles[conv.intent]}`}
                >
                  {conv.intent.charAt(0).toUpperCase() + conv.intent.slice(1)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${sentimentStyles[conv.sentiment]}`}
                >
                  {conv.sentiment.charAt(0).toUpperCase() +
                    conv.sentiment.slice(1)}
                </span>
                <span className="text-gray-400 text-lg">
                  {expanded === conv.id ? "▲" : "▼"}
                </span>
              </div>
            </div>

            {/* Expanded */}
            {expanded === conv.id && (
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    📝 Transcript
                  </p>
                  <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-200">
                    {conv.transcript}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    🤖 AI Summary
                  </p>
                  <p className="text-sm text-blue-700 bg-blue-50 rounded-lg p-3 border border-blue-200">
                    {conv.ai_summary}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Conversations;
