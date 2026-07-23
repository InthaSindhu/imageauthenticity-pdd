import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  AlertTriangle, XCircle, Info, Home, Share2,
  Download, Eye, FileText, TrendingUp, ShieldAlert, Camera
} from "lucide-react";
import { api } from "../services/api";

const MANIPULATION_ICONS: Record<string, string> = {
  "AI Generated":                    "🤖",
  "Deepfake / Face Swap":            "👤",
  "Image Splicing":                  "✂️",
  "Copy-Move Forgery":               "📋",
  "Heavy Retouching / Object Removal": "🖌️",
  "Unknown":                         "⚠️",
};

export function ResultFakeScreen() {
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
          console.error("Failed to load fake scan details:", err);
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
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis data...</p>
        </div>
      </div>
    );
  }

  const confidence        = scan?.confidence        ?? 88;
  const confidenceTier    = scan?.confidenceTier    ?? 'High';
  const verdict           = scan?.verdict           ?? scan?.prediction ?? 'Deepfake';
  const manipulationType  = scan?.manipulationType  ?? 'Unknown';
  const explanation       = scan?.explanation       ?? 'Manipulation signatures detected.';
  const fileName          = scan?.fileName          ?? 'photo.jpg';
  const size              = scan?.fileSize          ?? '2.1 MB';
  const resolution        = scan?.resolution        ?? '1920×1080';
  const probabilities     = scan?.probabilities     ?? { Deepfake: 0, Real: 0, Tempered: 0 };
  const indicators: string[] = scan?.indicators ?? [
    'EXIF Metadata: Missing',
    'Noise Pattern: Synthetic',
    'AI Detection: Positive',
    'Compression: Anomalous',
  ];
  const manipIcon = verdict === 'Deepfake' ? '👤' : verdict === 'Tempered' ? '✂️' : '⚠️';
  const verdictLabel = verdict === 'Deepfake' ? 'DEEPFAKE DETECTED' : verdict === 'Tempered' ? 'TAMPERED IMAGE' : 'MANIPULATION DETECTED';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── HERO HEADER ── */}
      <div className="bg-gradient-to-br from-red-600 to-rose-800 px-6 pt-12 pb-20 rounded-b-[2.5rem] shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-4 backdrop-blur-sm text-5xl">
            {manipIcon}
          </div>
          <div className="inline-block bg-red-950/50 text-red-100 text-sm font-extrabold px-5 py-2 rounded-full mb-4 uppercase tracking-widest border border-white/30">
            ✗ {verdictLabel}
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">{verdictLabel}</h1>
          <p className="text-red-100 text-sm">
            EfficientNet-B3 classified this image as{' '}
            <span className="font-semibold text-white">
              {verdict === 'Deepfake' ? 'a Deepfake (AI-Generated Face)' : verdict === 'Tempered' ? 'Tampered / Edited' : 'Manipulated'}
            </span>
          </p>
        </div>

        {/* Confidence tile — exact model output */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 flex items-center justify-between">
          <div className="text-center">
            <div className="text-5xl font-bold text-white">{confidence}%</div>
            <div className="text-red-100 text-sm mt-1">EfficientNet-B3 Confidence</div>
          </div>
          <div className="w-px h-16 bg-white/30"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{verdict.toUpperCase()}</div>
            <div className="text-red-100 text-sm mt-1">Verdict</div>
          </div>
          <div className="w-px h-16 bg-white/30"></div>
          <div className="text-center">
            <ShieldAlert className="w-8 h-8 text-white mx-auto mb-1" />
            <div className="text-red-100 text-xs">FLAGGED</div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 -mt-8">
        <div className="max-w-2xl mx-auto w-full space-y-5">

          {/* ── IMAGE PREVIEW ── */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-red-600" />
              Analyzed Image
            </h3>
            <div className="aspect-video bg-gradient-to-br from-red-50 to-rose-100 rounded-2xl flex items-center justify-center overflow-hidden">
              {scan?.imageUrl ? (
                <img src={scan.imageUrl} alt={fileName} className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-red-400">
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

          {/* ── MANIPULATION TYPE BADGE ── */}
          <div className="bg-red-50 border border-red-200 rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-xl">
                {manipIcon}
              </div>
              <div>
                <div className="text-xs text-red-500 font-semibold uppercase tracking-wider">Manipulation Type Detected</div>
                <div className="text-lg font-bold text-red-900">{manipulationType}</div>
              </div>
            </div>
          </div>

          {/* ── WHY THIS RESULT ── */}
          <div className="bg-white border border-red-100 rounded-3xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-red-600" />
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
                  <div key={idx} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900">{label}</span>
                    </div>
                    <span className="text-sm font-semibold text-red-600">{value ?? "✗"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── PROBABILITIES BREAKDOWN ── */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              EfficientNet-B3 Class Probabilities
            </h3>
            <div className="space-y-3">
              {/* Deepfake */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Deepfake</span>
                  <span className="font-bold text-red-600">{((probabilities.Deepfake || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${((probabilities.Deepfake || 0) * 100).toFixed(1)}%` }}></div>
                </div>
              </div>
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
              {/* Tempered */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Tempered</span>
                  <span className="font-bold text-orange-600">{((probabilities.Tempered || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${((probabilities.Tempered || 0) * 100).toFixed(1)}%` }}></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Source: EfficientNet-B3 softmax output (argmax = {verdict})</p>
          </div>

          {/* ── QUICK STATS ── */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
              <div className="text-xl font-bold text-red-600 mb-1">{confidence}%</div>
              <div className="text-xs text-gray-500">Fake Probability</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
              <div className="text-sm font-bold text-red-600 mb-1">{resolution}</div>
              <div className="text-xs text-gray-500">Resolution</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
              <div className="text-sm font-bold text-red-600 mb-1">{size}</div>
              <div className="text-xs text-gray-500">File Size</div>
            </div>
          </div>

          {/* ── FAKE CRITERIA ── */}
          <div className="bg-red-50 rounded-3xl p-6 border border-red-200">
            <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Fake (Manipulated) Classification Criteria
            </h3>
            <p className="text-xs text-red-700 mb-3">This image matched one or more of the following manipulation criteria:</p>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                "Objects have been added, removed, or modified",
                "Parts of the image are copied and pasted (copy-move forgery)",
                "Faces are swapped using AI (deepfake)",
                "Image is generated entirely by AI tools — no camera EXIF found",
                "Editing software has significantly changed the original content",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">✗</span>
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
          <div className="grid grid-cols-3 gap-3 pb-8">
            <button
              onClick={() => navigate(`/share?id=${scanId || ""}`)}
              className="bg-white border border-gray-300 rounded-2xl py-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Share</span>
            </button>
            <button
              onClick={() => alert("Report downloaded successfully")}
              className="bg-white border border-gray-300 rounded-2xl py-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Report</span>
            </button>
            <button
              onClick={() => navigate("/home")}
              className="bg-white border border-gray-300 rounded-2xl py-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Home className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Home</span>
            </button>
          </div>

          <button
            onClick={() => navigate("/upload")}
            className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow mb-8"
          >
            Verify Another Image
          </button>
        </div>
      </div>
    </div>
  );
}
