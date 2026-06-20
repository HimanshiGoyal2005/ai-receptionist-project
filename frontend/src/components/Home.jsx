import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const [prompt, setInputPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("leads");
  const navigate = useNavigate();

  const useCases = {
    leads: {
      title: "Automate Outbound & Inbound Lead Generation",
      desc: "Stop manually entering data. Our AI context loops scan incoming voice streams, parse dynamic intents, and push high-buying metrics instantly into your CRM with zero lag.",
      metric: "99.4% Extraction Accuracy",
    },
    appointments: {
      title: "Seamless Real-time Slot Reservation",
      desc: "Connect conversational triggers directly to your calendar. The pipeline handles availability, time-zone offsets, and rescheduling without human intervention.",
      metric: "<500ms Latency",
    },
    support: {
      title: "24/7 Cognitive Knowledge Base",
      desc: "Train your AI on your specific FAQs, documentation, and past transcripts. It handles complex queries with the empathy and accuracy of a senior receptionist.",
      metric: "Zero Manual Touchpoints",
    },
  };

  return (
    <div className="text-slate-800 font-sans pb-24 min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-lg text-white shadow-lg shadow-purple-200">
            🤖
          </div>
          <span className="text-sm font-black tracking-tighter text-slate-900 uppercase">
            AI RECEPTIONIST
          </span>
        </div>
        <Link
          to="/login"
          className="px-6 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-md transition-all"
        >
          Sign In Console
        </Link>
      </header>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-12 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-100 bg-white shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
            Enterprise-Ready Voice AI Infrastructure
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.05]">
          Your Business, <br />
          <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            Voice-Activated.
          </span>
        </h1>

        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Deploy production-grade voice assistants that don't just listen—they
          execute. Sync calls to database actions instantly.
        </p>

        {/* Action Input */}
        <div className="relative group max-w-2xl mx-auto mt-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-xl">
            <input
              value={prompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Describe your receptionist's goal (e.g., 'Take orders for my cafe')..."
              className="w-full pl-6 py-4 outline-none text-sm placeholder:text-slate-400 font-medium"
            />
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              Start Building <span className="text-cyan-400">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Features */}
      <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Why developers trust our pipeline
          </h3>
          <p className="text-slate-500 text-sm">
            We provide the lowest latency voice-to-database infrastructure. No
            more middleware bloat—just clean, parsed data piped directly into
            your Postgres clusters.
          </p>
        </div>
        <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
          <h3 className="text-lg font-bold">Latency Standard</h3>
          <p className="text-4xl font-black text-cyan-400">480ms</p>
          <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">
            Average round-trip execution
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex justify-center gap-4 mb-8">
          {Object.keys(useCases).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-400"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <h4 className="text-xl font-bold mb-4">
            {useCases[activeTab].title}
          </h4>
          <p className="text-slate-600 text-sm leading-loose">
            {useCases[activeTab].desc}
          </p>
        </div>
      </div>
    </div>
  );
}
