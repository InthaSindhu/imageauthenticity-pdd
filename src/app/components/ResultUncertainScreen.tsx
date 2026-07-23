import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  HelpCircle, Info, Home, Share2, Upload, AlertCircle,
  Eye, Camera, FileText, TrendingUp
} from "lucide-react";
import { api } from "../services/api";

export function ResultUncertainScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scanId = searchParams.get("id");
  const [scan, setScan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScan() {
      if (scanId) {
        try {
          const data = await api.getScanDetails(scanId);
          setScan(data);
        } catch (err) {
          console.error("Failed to load uncertain scan details:", err);
        }
      }
      setLoading(false);
    }
    loadScan();
  }, [scanId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis data...</p>
        </div>
      </div>
    );
  }

  const confidence       = scan?.confidence       ?? 54;
  const confidenceTier   = scan?.confidenceTier   ?? "Low";
  const prediction       = scan?.prediction       ?? "Uncertain";
  const manipulationType = scan?.manipulationType ?? "Unknown";
  const explanation      = scan?.explanation      ?? "Unable to determine authenticity with high confidence.";
  const fileName         = scan?.fileName         ?? "photo.jpg";
  const size             = scan?.fileSize         ?? "2.0 MB";
  const resolution       = scan?.resolution       ?? "1920×1080";
  const indicators: string[] = scan?.indicators ?? [
    "EXIF Metadata: Absent",
    "Noise Analysis: Inconclusive",
    "Source: Cannot Confirm Camera",
    "Confidence: Below Threshold",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── HERO HEADER ── */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 px-6 pt-12 pb-20 rounded-b-[2.5rem] shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            <HelpCircle className="w-12 h-12 text-white" />
          </div>
          <div className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1 rounded-full mb-3 uppercase tracking-wider">
            ? Prediction: {prediction}
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Uncertain Result</h1>
          <p className="text-amber-100 text-sm">
            Unable to determine authenticity with high confidence
          </p>
        </div>

        {/* Confidence tile */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 flex items-center justify-between">
          <div className="text-center">
            <div className="text-5xl font-bold text-white">{confidence}%</div>
            <div className="text-amber-100 text-sm mt-1">Confidence Score</div>
          </div>
          <div className="w-px h-16 bg-white/30"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{confidenceTier}</div>
            <div className="text-amber-100 text-sm mt-1">Confidence Tier</div>
          </div>
          <div className="w-px h-16 bg-white/30"></div>
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-white mx-auto mb-1" />
            <div className="text-amber-100 text-xs">Inconclusive</div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 -mt-8">
        <div className="max-w-2xl mx-auto w-full space-y-5">

          {/* ── IMAGE PREVIEW ── */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-600" />
              Analyzed Image
            </h3>
            <div className="aspect-video bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl flex items-center justify-center overflow-hidden">
              {scan?.imageUrl ? (
                <img src={scan.imageUrl} alt={fileName} className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-amber-500">
                  <div className="text-4xl mb-2">🖼️</div>
                  <div className="text-sm font-medium">{fileName}</div>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Camera className="w-4 h-4" />
              <span>{fileName}</span>
              <span className="ml-auto">{size}</span>
            </div>
          </div>

          {/* ── WHY THIS RESULT ── */}
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6">
            <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-700" />
              Why this result?
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
          </div>

          {/* ── DETECTION INDICATORS ── */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Detection Indicators</h3>
            <div className="space-y-3">
              {indicators.map((ind: string, idx: number) => {
                const [label, value] = ind.split(":").map(s => s.trim());
                return (
                  <div key={idx} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900">{label}</span>
                    </div>
                    <span className="text-sm font-semibold text-amber-700">{value ?? "?"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── QUICK STATS ── */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
              <div className="text-xl font-bold text-amber-600 mb-1">{confidence}%</div>
              <div className="text-xs text-gray-500">Confidence</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
              <div className="text-sm font-bold text-amber-600 mb-1">{resolution}</div>
              <div className="text-xs text-gray-500">Resolution</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
              <div className="text-sm font-bold text-amber-600 mb-1">{size}</div>
              <div className="text-xs text-gray-500">File Size</div>
            </div>
          </div>

          {/* ── RECOMMENDATIONS ── */}
          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Recommendations
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                "Upload the original, uncompressed image if available (JPEG from camera or RAW format)",
                "Verify the source of the image through the original device or sender",
                "Use caution when relying on this image for important or legal decisions",
                "Avoid sharing this image without proper source verification",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── MORE INFO LINKS ── */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">More Information</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/metadata?id=${scanId || ""}`)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">View Metadata</span>
                </div>
                <span className="text-sm text-gray-500">EXIF & Technical Data →</span>
              </button>
              <button
                onClick={() => navigate(`/analysis?id=${scanId || ""}`)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Detailed Analysis Report</span>
                </div>
                <span className="text-sm text-gray-500">Full Report →</span>
              </button>
            </div>
          </div>

          {/* ── ACTION BUTTONS ── */}
          <div className="grid grid-cols-2 gap-3 pb-4">
            <button
              onClick={() => navigate("/upload")}
              className="bg-white border border-gray-300 rounded-2xl py-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Try Better Quality</span>
            </button>
            <button
              onClick={() => navigate("/home")}
              className="bg-white border border-gray-300 rounded-2xl py-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Home className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Back to Home</span>
            </button>
          </div>

          <button
            onClick={() => navigate(`/share?id=${scanId || ""}`)}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow mb-8 flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share Results
          </button>
        </div>
      </div>
    </div>
  );
}
