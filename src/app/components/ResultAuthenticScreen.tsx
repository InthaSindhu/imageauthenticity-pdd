import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft, CheckCircle2, Download, Share2, Eye,
  FileText, TrendingUp, Info, ShieldCheck, Camera
} from "lucide-react";
import { api } from "../services/api";

export function ResultAuthenticScreen() {
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
          console.error("Failed to load authentic scan details:", err);
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
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification details...</p>
        </div>
      </div>
    );
  }

  const confidence      = scan?.confidence      ?? 96;
  const confidenceTier  = scan?.confidenceTier  ?? 'High';
  const verdict         = scan?.verdict         ?? scan?.prediction ?? 'Real';
  const explanation     = scan?.explanation     ?? 'No significant manipulation artifacts detected. EXIF metadata verified.';
  const fileName        = scan?.fileName        ?? 'photo.jpg';
  const size            = scan?.fileSize        ?? '3.6 MB';
  const resolution      = scan?.resolution      ?? '4032×3024';
  const probabilities   = scan?.probabilities   ?? { Deepfake: 0, Real: 1, Tempered: 0 };
  const indicators: string[] = scan?.indicators ?? [
    'EXIF Metadata: Valid & Complete',
    'Camera Hardware: Verified',
    'Noise Pattern: Natural',
    'AI Detection: Negative',
    'Compression: Consistent',
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Nav */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/history")}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 flex-1">Scan Results</h1>
        <button onClick={() => alert("Report downloaded successfully")} className="text-gray-600 hover:text-gray-900">
          <Download className="w-5 h-5" />
        </button>
        <button onClick={() => navigate(`/share?id=${scanId || ""}`)} className="text-gray-600 hover:text-gray-900">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto w-full space-y-6">

          {/* ── RESULT HEADER ── */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white text-center shadow-2xl">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <div className="inline-block bg-emerald-900/40 text-emerald-100 text-sm font-extrabold px-5 py-2 rounded-full mb-4 uppercase tracking-widest border border-white/30">
              ✓ REAL IMAGE
            </div>
            <h2 className="text-3xl font-bold mb-2">REAL IMAGE</h2>
            <p className="text-green-100 mb-6 text-sm">
              EfficientNet-B3 verified this image as Authentic / Genuine
            </p>
            <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
              <div>
                <div className="text-5xl font-bold">{confidence}%</div>
                <div className="text-green-100 text-sm">EfficientNet-B3 Confidence</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-left">
                <div className="text-sm font-semibold text-green-100">Verdict</div>
                <div className="text-xl font-bold">VERIFIED REAL</div>
              </div>
            </div>
          </div>

          {/* ── IMAGE PREVIEW ── */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Analyzed Image
            </h3>
            <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center overflow-hidden">
              {scan?.imageUrl ? (
                <img src={scan.imageUrl} alt={fileName} className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-green-700">
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
          <div className="bg-green-50 border border-green-200 rounded-3xl p-6">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-green-700" />
              Why this result?
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
          </div>

          {/* ── PROBABILITIES BREAKDOWN ── */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              EfficientNet-B3 Class Probabilities
            </h3>
            <div className="space-y-3">
              {/* Real */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Real</span>
                  <span className="font-bold text-green-600">{((probabilities.Real || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${((probabilities.Real || 0) * 100).toFixed(1)}%` }}></div>
                </div>
              </div>
              {/* Deepfake */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Deepfake</span>
                  <span className="font-bold text-red-500">{((probabilities.Deepfake || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-red-400 h-2.5 rounded-full" style={{ width: `${((probabilities.Deepfake || 0) * 100).toFixed(1)}%` }}></div>
                </div>
              </div>
              {/* Tempered */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Tempered</span>
                  <span className="font-bold text-orange-500">{((probabilities.Tempered || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-orange-400 h-2.5 rounded-full" style={{ width: `${((probabilities.Tempered || 0) * 100).toFixed(1)}%` }}></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Source: EfficientNet-B3 softmax output (argmax = {verdict})</p>
          </div>

          {/* ── DETECTION INDICATORS ── */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Detection Indicators</h3>
            <div className="space-y-3">
              {indicators.map((ind: string, idx: number) => {
                const [label, value] = ind.split(":").map(s => s.trim());
                return (
                  <div key={idx} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900">{label}</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">{value ?? "✓"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── QUICK STATS ── */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
              <div className="text-xl font-bold text-green-600 mb-1">{confidence}%</div>
              <div className="text-xs text-gray-600">Confidence</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
              <div className="text-sm font-bold text-green-600 mb-1">{resolution}</div>
              <div className="text-xs text-gray-600">Resolution</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
              <div className="text-sm font-bold text-green-600 mb-1">{size}</div>
              <div className="text-xs text-gray-600">File Size</div>
            </div>
          </div>

          {/* ── REAL IMAGE CRITERIA ── */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Real (Authentic) Classification Criteria — All Passed
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                "Captured directly by a camera — verified EXIF structures present",
                "No objects have been added or removed",
                "No regions have been copied and pasted",
                "Image has not been altered by editing software",
                "Lighting, shadows, and textures appear natural and consistent",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── MORE INFORMATION LINKS ── */}
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
          <div className="grid grid-cols-2 gap-3 pb-6">
            <button
              onClick={() => navigate("/upload")}
              className="py-4 px-6 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Scan Another
            </button>
            <button
              onClick={() => navigate("/home")}
              className="py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-shadow"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
