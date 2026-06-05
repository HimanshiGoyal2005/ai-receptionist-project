import { useState } from "react";
import API from "../services/api";

const stats = [
  { label: "Total Calls", value: "24", icon: "📞", color: "bg-blue-500" },
  { label: "Total Leads", value: "18", icon: "👥", color: "bg-green-500" },
  {
    label: "Appointments Today",
    value: "5",
    icon: "📅",
    color: "bg-purple-500",
  },
  {
    label: "Conversion Rate",
    value: "75%",
    icon: "📈",
    color: "bg-orange-500",
  },
];

function Dashboard() {
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!audioFile) {
      setError("Please select an audio file first!");
      return;
    }
    setLoading(true);
    setError("");
    setTranscript("");
    setAiReply("");

    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const res = await API.post("/api/call/process", formData);
      setTranscript(res.data.transcript);
      setAiReply(res.data.ai_reply);
    } catch (err) {
      setError(
        "Backend not connected yet — will work once Prarthna sets up the API!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4"
          >
            <div
              className={`${stat.color} text-white text-2xl w-12 h-12 rounded-lg flex items-center justify-center`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Audio Upload */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🎙️ Test Audio Upload
        </h3>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
          <p className="text-gray-500 mb-3">
            Upload a .wav or .mp3 file to test the AI pipeline
          </p>
          <input
            type="file"
            accept=".wav,.mp3,.m4a"
            onChange={(e) => setAudioFile(e.target.files[0])}
            className="text-sm text-gray-600"
          />
          {audioFile && (
            <p className="mt-2 text-sm text-green-600 font-medium">
              ✅ {audioFile.name}
            </p>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg mb-3">
            {error}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-all"
        >
          {loading ? "⏳ Processing..." : "🚀 Upload & Process"}
        </button>

        {/* Results */}
        {transcript && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-1">
              📝 Transcript:
            </p>
            <p className="text-sm text-gray-600">{transcript}</p>
          </div>
        )}
        {aiReply && (
          <div className="mt-3 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-semibold text-blue-700 mb-1">
              🤖 AI Reply:
            </p>
            <p className="text-sm text-blue-600">{aiReply}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
