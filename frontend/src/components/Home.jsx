import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const [prompt, setInputPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("leads");
  const navigate = useNavigate();

  const useCases = {
    leads: {
      title: "Automate Outbound & Inbound Lead Generation",
      desc: "Our AI context loops scan incoming voice streams, parse dynamic intents, and push high-buying metrics instantly into your central database clusters with zero manual lag.",
      metric: "99.4% Extraction Accuracy",
    },
    appointments: {
      title: "Seamless Real-time Slot Reservation Routing",
      desc: "Connect conversational triggers directly to core calendar grids. The pipeline manages user availability limits, processes time parameters, and scales receptionist buffers automatically.",
      metric: "<500ms Latency Intervals",
    },
    support: {
      title: "24/7 Intelligent Knowledge Base Synthesis",
      desc: "Train your cognitive receptionist matrix on FAQs, raw document blocks, or past audio transcripts to answer user inquiries around the clock with human-like empathy.",
      metric: "Zero Manual Touchpoints",
    },
  };

  const handleActionRedirect = () => {
    // Direct forced path to login parameters for a standard SaaS portal flow
    navigate("/login");
  };

  return (
    <div className="space-y-16 text-slate-800 font-sans pb-16 min-h-screen bg-[#F8FAFC]">
      {/* ── 🌟 PREMIUM NAVIGATION BAR ── */}
      <header className="w-full max-w-6xl mx-auto px-6 h-20 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-base text-white shadow-md">
            🤖
          </div>
          <span
            className="text-xs font-black tracking-wider text-slate-900 uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            AI RECEPTIONIST
          </span>
        </div>

        <div>
          <Link
            to="/login"
            className="inline-flex px-4 py-2 rounded-xl text-xs font-bold bg-white text-purple-600 border border-slate-200 shadow-sm hover:bg-slate-50 transition-all duration-200"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Sign In Console
          </Link>
        </div>
      </header>

      {/* ── SECTION 1: HERO CONTAINER ── */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-4 animate-fade-in relative z-10 px-6">
        {/* Upper Micro Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-100 bg-purple-50/40 shadow-sm mx-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600">
            Next-Gen Conversational Creation
          </span>
        </div>

        {/* Hero Main Catchline */}
        <h1
          className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Create your Production-Grade
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            Voice AI Assistant
          </span>
        </h1>

        <p className="text-base text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
          Simply describe your automation guidelines in plain text, launch
          intelligent call-routing nodes, and sync structured leads data
          seamlessly.
        </p>

        {/* 🌟 OmniDim Style Prompt Input Component */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-xl p-4 shadow-[0_20px_50px_rgba(15,23,42,0.02)] max-w-2xl mx-auto text-left mt-8 relative">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-3.5 text-slate-400 text-lg">
                💡
              </span>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Describe what type of Voice AI receptionist you want to build..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-500/5 transition-all shadow-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            <button
              onClick={handleActionRedirect}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-md flex items-center justify-center gap-2 flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <span>Create Agent</span>
              <span className="font-bold">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: INTERACTIVE USE-CASE TABS ── */}
      <div className="max-w-4xl mx-auto space-y-6 relative z-10 px-6">
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/60 max-w-md mx-auto shadow-inner">
          {Object.keys(useCases).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === tab
                  ? "bg-white text-purple-600 shadow-sm border border-slate-200/40"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {tab === "leads"
                ? "Lead Gen"
                : tab === "appointments"
                  ? "Appointments"
                  : "Support Matrix"}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-xl p-8 shadow-[0_4px_30px_rgba(15,23,42,0.02)] grid grid-cols-1 md:grid-cols-12 gap-6 items-center min-h-[220px]">
          <div className="md:col-span-8 space-y-3">
            <h3
              className="text-lg font-extrabold text-slate-900 tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {useCases[activeTab].title}
            </h3>
            <p
              className="text-sm text-slate-500 leading-relaxed font-medium"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {useCases[activeTab].desc}
            </p>
          </div>
          <div className="md:col-span-4 bg-slate-50 border border-slate-200/60 rounded-xl p-5 text-center shadow-inner">
            <p
              className="text-xs font-bold text-slate-400 uppercase tracking-widest"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Pipeline Standard
            </p>
            <p
              className="text-xl font-black text-purple-600 tracking-tight mt-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {useCases[activeTab].metric}
            </p>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: HOW IT WORKS TIMELINE ── */}
      <div className="max-w-5xl mx-auto space-y-8 relative z-10 px-6">
        <div className="text-center space-y-2">
          <h2
            className="text-xl font-extrabold text-slate-900 uppercase tracking-wider"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Operational Process Loop
          </h2>
          <p
            className="text-xs font-bold text-slate-400 uppercase tracking-widest"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Deploy Voice AI assistant layers in three quick steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {[
            {
              step: "01",
              title: "Write Guidelines",
              desc: "Describe the prompt rules, select context tokens, and map required conversational intents.",
            },
            {
              step: "02",
              title: "Process Stream Audio",
              desc: "Upload past customer logs or recordings directly into our low-latency whisper processing line.",
            },
            {
              step: "03",
              title: "Automate Actions",
              desc: "Deploy your assistant live. The model automatically streams parsed leads context directly into dashboards.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200/80 bg-white/60 p-6 space-y-3 shadow-sm relative group hover:border-purple-200 transition-colors duration-200"
            >
              <span
                className="text-3xl font-black text-slate-200 absolute right-6 top-4 block group-hover:text-purple-100 transition-colors"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {item.step}
              </span>
              <h4
                className="text-base font-extrabold text-slate-900 tracking-tight pt-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {item.title}
              </h4>
              <p
                className="text-xs text-slate-500 font-medium leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 4: INTEGRATION STACK ── */}
      <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 p-8 text-center bg-gradient-to-br from-slate-50/50 to-white/50 shadow-[0_4px_30px_rgba(15,23,42,0.01)] relative z-10 mx-6">
        <h3
          className="text-base font-extrabold text-slate-900 uppercase tracking-widest mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Plug into your developer tools
        </h3>
        <p
          className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-6"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Seamless native serialization out of the box
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 opacity-60 grayscale hover:opacity-80 transition-opacity duration-300">
          <span className="text-xs font-black tracking-widest text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            POSTGRESQL
          </span>
          <span className="text-xs font-black tracking-widest text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            SUPABASE
          </span>
          <span className="text-xs font-black tracking-widest text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            REACT/MERN
          </span>
          <span className="text-xs font-black tracking-widest text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            WHATSAPP
          </span>
        </div>
      </div>
    </div>
  );
}
