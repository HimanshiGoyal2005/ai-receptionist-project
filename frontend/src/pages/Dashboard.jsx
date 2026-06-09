import { useState, useEffect, useRef } from "react";
import API from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    total_calls: 0,
    total_leads: 0,
    appointments_today: 0,
    conversion_rate: 0,
  });
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    API.get("/api/analytics/overview")
      .then((res) => setStats(res.data))
      .catch(() => {
        API.get("/api/leads")
          .then((res) => {
            setStats((prev) => ({ ...prev, total_leads: res.data.length }));
          })
          .catch(() => {});
      });
  }, []);

  const handleUpload = async () => {
    if (!audioFile) {
      setError("Please select an audio file first!");
      return;
    }
    setLoading(true);
    setError("");
    setTranscript("");
    setAiReply("");
    setAudioUrl("");

    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const res = await API.post("/api/call/process", formData);
      setTranscript(res.data.transcript);
      setAiReply(res.data.ai_reply);

      if (res.data.audio_url) {
        const fullAudioUrl = `http://localhost:8000${res.data.audio_url}`;
        setAudioUrl(fullAudioUrl);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
        }, 500);
      }

      API.get("/api/analytics/overview")
        .then((res) => setStats(res.data))
        .catch(() => {});
    } catch (err) {
      setError("Error processing audio. Check backend connection!");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Calls",
      value: stats.total_calls,
      icon: (
        <svg
          className="w-5 h-5 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.72l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.72.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      borderColor: "border-blue-500/20 hover:border-blue-500/40",
      glow: "group-hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]",
    },
    {
      label: "Total Leads",
      value: stats.total_leads,
      icon: (
        <svg
          className="w-5 h-5 text-emerald-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      borderColor: "border-emerald-500/20 hover:border-emerald-500/40",
      glow: "group-hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    },
    {
      label: "Appointments Today",
      value: stats.appointments_today,
      icon: (
        <svg
          className="w-5 h-5 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      borderColor: "border-purple-500/20 hover:border-purple-500/40",
      glow: "group-hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]",
    },
    {
      label: "Conversion Rate",
      value: stats.conversion_rate ? `${stats.conversion_rate}%` : "0%",
      icon: (
        <svg
          className="w-5 h-5 text-amber-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      borderColor: "border-amber-500/20 hover:border-amber-500/40",
      glow: "group-hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#080B11] text-gray-100 p-1 space-y-8 antialiased">
      {/* Header section for a proper contextual dashboard look */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r divide-neutral-400 from-white to-gray-400 bg-clip-text text-transparent">
            System Overview
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track AI receptionist health and operations metrics.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`group relative bg-[#0F1420]/60 backdrop-blur-md rounded-xl border ${stat.borderColor} p-6 transition-all duration-300 hover:-translate-y-1 ${stat.glow}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 tracking-wide uppercase">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-bold text-white tracking-tight mt-1">
                  {stat.value}
                </h3>
              </div>
              <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Feature Container - 2 Column Split when analytics expand */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Audio Upload Widget */}
        <div className="lg:col-span-6 bg-[#0F1420]/40 backdrop-blur-md rounded-2xl border border-gray-800/80 p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-base font-semibold text-gray-200 tracking-wide">
              Voice Engine Automation Playground
            </h3>
          </div>

          {/* Premium Dropzone File Wrapper */}
          <label
            className={`group block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
              audioFile
                ? "border-emerald-500/50 bg-emerald-500/5"
                : "border-gray-800 hover:border-blue-500/50 bg-[#0B0F19]/60 hover:bg-blue-500/[0.02]"
            }`}
          >
            <input
              type="file"
              accept=".wav,.mp3,.m4a,.mp4"
              onChange={(e) => setAudioFile(e.target.files[0])}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center">
              <div
                className={`p-4 rounded-full mb-3 bg-gray-900 border transition-all duration-300 ${
                  audioFile
                    ? "border-emerald-500 text-emerald-400"
                    : "border-gray-800 text-gray-400 group-hover:text-blue-400 group-hover:border-blue-500/30"
                }`}
              >
                {audioFile ? (
                  <svg
                    className="w-6 h-6 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                )}
              </div>

              {audioFile ? (
                <div>
                  <p className="text-sm font-semibold text-emerald-400 max-w-xs truncate mx-auto">
                    {audioFile.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ready for full deep pipeline ingestion
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    Drop audio agent sample file or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Supports WAV, MP3, M4A, or MP4 formats
                  </p>
                </div>
              )}
            </div>
          </label>

          {error && (
            <div className="mt-4 flex items-center gap-2.5 text-xs text-red-400 bg-red-950/30 border border-red-500/20 px-4 py-3 rounded-xl">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full mt-5 relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-800 disabled:to-gray-800 text-white font-medium text-sm py-3 px-4 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.4)] disabled:shadow-none flex items-center justify-center gap-2 group disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                <span>Processing Pipeline Engine...</span>
              </>
            ) : (
              <>
                <span>Execute & Parse Intelligence</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Real-time Streaming Processing Results Dashboard Component */}
        <div className="lg:col-span-6 space-y-4">
          {!transcript && !aiReply && !audioUrl && (
            <div className="h-[310px] flex flex-col items-center justify-center text-center border border-gray-800/40 bg-[#0F1420]/10 rounded-2xl p-6 border-dashed">
              <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 mb-3">
                🤖
              </div>
              <p className="text-sm font-medium text-gray-400">
                Pipeline Outputs Idle
              </p>
              <p className="text-xs text-gray-600 max-w-xs mt-1">
                Run an audio upload processing call to generate transcripts and
                semantic conversational analysis responses real-time.
              </p>
            </div>
          )}

          {/* Transcript Log Container */}
          {transcript && (
            <div className="bg-[#0F1420]/50 border border-gray-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/10">
                  📝 Raw Speech-To-Text
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed bg-[#070A10] border border-gray-900 rounded-lg p-3.5">
                {transcript}
              </p>
            </div>
          )}

          {/* LLM Generative Response Matrix Box */}
          {aiReply && (
            <div className="bg-[#0F1420]/50 border border-gray-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold tracking-wider text-purple-400 uppercase bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/10">
                  🤖 Evaluated LLM Response
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed bg-[#070A10] border border-gray-900 rounded-lg p-3.5">
                {aiReply}
              </p>
            </div>
          )}

          {/* Waveform Sound / Synthesis Output Player */}
          {audioUrl && (
            <div className="bg-[#0F1420]/50 border border-emerald-500/20 rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  🔊 Generated TTS Synthesis Voice
                </span>
              </div>
              <div className="bg-[#070A10] border border-gray-900 rounded-lg p-2.5">
                <audio
                  ref={audioRef}
                  controls
                  className="w-full custom-audio-player opacity-90 accent-emerald-500"
                  src={audioUrl}
                >
                  Your secure browser ecosystem configuration does not support
                  high fidelity audio.
                </audio>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
