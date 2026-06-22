console.log("Dashboard rendered");
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
      icon: "📞",
      color: "from-purple-500/10 to-purple-600/5",
      textColor: "text-purple-600",
      borderColor: "rgba(124, 58, 237, 0.12)",
      glow: "rgba(124, 58, 237, 0.04)",
    },
    {
      label: "Total Leads",
      value: stats.total_leads,
      icon: "👥",
      color: "from-cyan-500/10 to-cyan-600/5",
      textColor: "text-cyan-600",
      borderColor: "rgba(6, 182, 212, 0.12)",
      glow: "rgba(6, 182, 212, 0.04)",
    },
    {
      label: "Appointments Today",
      value: stats.appointments_today,
      icon: "📅",
      color: "from-purple-500/10 to-cyan-500/5",
      textColor: "text-purple-600",
      borderColor: "rgba(124, 58, 237, 0.12)",
      glow: "rgba(124, 58, 237, 0.04)",
    },
    {
      label: "Conversion Rate",
      value: stats.conversion_rate ? `${stats.conversion_rate}%` : "0%",
      icon: "📈",
      color: "from-cyan-500/10 to-purple-500/5",
      textColor: "text-cyan-600",
      borderColor: "rgba(6, 182, 212, 0.12)",
      glow: "rgba(6, 182, 212, 0.04)",
    },
  ];

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200/60 pb-5">
        <h1
          className="text-2xl font-extrabold text-slate-900 tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          System Overview
        </h1>
        <p
          className="text-sm font-medium text-slate-500 mt-1"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Track AI receptionist health and operations metrics.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="group relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 transition-all duration-300"
            style={{
              border: `1px solid ${stat.borderColor}`,
              boxShadow: `0 4px 20px rgba(15, 23, 42, 0.01)`,
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 12px 30px ${stat.glow}, 0 4px 12px rgba(15, 23, 42, 0.02)`;
              e.currentTarget.style.borderColor = stat.textColor.includes(
                "purple",
              )
                ? "rgba(124, 58, 237, 0.25)"
                : "rgba(6, 182, 212, 0.25)";
            }}
            onOriginalMouseLeave={(e) => {}}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 20px rgba(15, 23, 42, 0.01)`;
              e.currentTarget.style.borderColor = stat.borderColor;
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-[11px] font-bold text-slate-400 uppercase tracking-wider"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {stat.label}
                </p>
                <h3
                  className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {stat.value}
                </h3>
              </div>
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg ${stat.textColor} border border-white/50 shadow-sm group-hover:scale(1.05) transition-transform duration-300`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Feature Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Audio Upload Widget */}
        <div className="lg:col-span-6">
          <div
            className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 transition-all duration-300"
            style={{
              border: "1px solid rgba(226, 232, 240, 0.8)",
              boxShadow:
                "0 0 40px rgba(6, 182, 212, 0.01), 0 0 40px rgba(124, 58, 237, 0.01), 0 20px 50px rgba(15, 23, 42, 0.02)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)] animate-pulse" />
              <h3
                className="text-base font-extrabold text-slate-900 tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Voice Engine Automation
              </h3>
            </div>

            {/* Dropzone */}
            <label
              className={`group block border rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                audioFile
                  ? "border-cyan-300 bg-cyan-50/10"
                  : "border-slate-200 hover:border-purple-200 bg-slate-50/40 hover:bg-white"
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
                  className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center font-bold text-base border transition-all ${
                    audioFile
                      ? "bg-cyan-50 border-cyan-100 text-cyan-500 shadow-sm"
                      : "bg-white border-slate-100 text-slate-400 group-hover:border-purple-100 group-hover:text-purple-500"
                  }`}
                >
                  {audioFile ? "✓" : "🎙️"}
                </div>

                {audioFile ? (
                  <div>
                    <p
                      className="text-sm font-bold text-cyan-700 max-w-xs truncate"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {audioFile.name}
                    </p>
                    <p
                      className="text-xs font-semibold text-slate-400 mt-1"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Ready for core pipeline extraction
                    </p>
                  </div>
                ) : (
                  <div>
                    <p
                      className="text-sm font-bold text-slate-800 tracking-tight"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Drop audio file or click to browse
                    </p>
                    <p
                      className="text-xs font-medium text-slate-400 mt-1"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Supports WAV, MP3, M4A, or MP4
                    </p>
                  </div>
                )}
              </div>
            </label>

            {error && (
              <div
                className="mt-4 px-4 py-2.5 rounded-xl border border-rose-100 bg-rose-50/50 text-rose-500 text-xs font-semibold flex items-center gap-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full mt-5 py-3 px-4 rounded-xl font-bold text-white text-sm transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                boxShadow: "0 4px 14px rgba(124, 58, 237, 0.2)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 22px rgba(124, 58, 237, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(124, 58, 237, 0.2)";
              }}
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
                  <span style={{ fontFamily: "'Inter', sans-serif" }}>
                    Processing Voice Engine...
                  </span>
                </>
              ) : (
                <>
                  <span>Upload & Process Stream</span>
                  <span className="font-bold">→</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-6 space-y-4">
          {!transcript && !aiReply && !audioUrl && (
            <div
              className="h-[285px] flex flex-col items-center justify-center rounded-2xl bg-white/40 text-center p-6 shadow-sm"
              style={{ border: "1px solid rgba(226, 232, 240, 0.6)" }}
            >
              <div className="text-3xl mb-2">🤖</div>
              <p
                className="text-sm font-bold text-slate-800"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Pipeline Idle
              </p>
              <p
                className="text-xs font-medium text-slate-400 max-w-xs mt-1.5 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Upload an audio file to start processing transcripts and AI
                responses.
              </p>
            </div>
          )}

          {/* Transcript */}
          {transcript && (
            <div
              className="rounded-2xl bg-white/70 backdrop-blur-xl p-5 shadow-sm"
              style={{ border: "1px solid rgba(226, 232, 240, 0.8)" }}
            >
              <div className="mb-2">
                <span
                  className="text-[10px] font-bold text-purple-600 bg-purple-50/60 border border-purple-100/80 px-2.5 py-1 rounded-md inline-block uppercase tracking-wider"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  📝 Transcript
                </span>
              </div>
              <p
                className="text-sm text-slate-700 leading-relaxed bg-white/60 rounded-xl p-4 border border-slate-100 font-medium"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {transcript}
              </p>
            </div>
          )}

          {/* AI Reply */}
          {aiReply && (
            <div
              className="rounded-2xl bg-white/70 backdrop-blur-xl p-5 shadow-sm"
              style={{ border: "1px solid rgba(226, 232, 240, 0.8)" }}
            >
              <div className="mb-2">
                <span
                  className="text-[10px] font-bold text-cyan-600 bg-cyan-50/60 border border-cyan-100/80 px-2.5 py-1 rounded-md inline-block uppercase tracking-wider"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  🤖 AI Response
                </span>
              </div>
              <p
                className="text-sm text-slate-700 leading-relaxed bg-white/60 rounded-xl p-4 border border-slate-100 font-medium"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {aiReply}
              </p>
            </div>
          )}

          {/* Audio Player */}
          {audioUrl && (
            <div
              className="rounded-2xl bg-white/70 backdrop-blur-xl p-5 shadow-sm"
              style={{ border: "1px solid rgba(226, 232, 240, 0.8)" }}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span
                  className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md inline-block uppercase tracking-wider"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  🔊 Voice Reply
                </span>
              </div>
              <audio
                ref={audioRef}
                controls
                className="w-full accent-cyan-600"
                src={audioUrl}
                style={{
                  background: "#F8FAFC",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
