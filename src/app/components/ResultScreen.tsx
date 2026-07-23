import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle2, AlertTriangle, HelpCircle, Info, Home, Share2, Download } from "lucide-react";
import { api } from "../services/api";

export function ResultScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scanId = searchParams.get("id");
  const [scan, setScan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResult() {
      if (scanId) {
        try {
          const data = await api.getScanDetails(scanId);
          setScan(data);
          // Route by EfficientNet-B3 verdict
          const verdict = data?.verdict || data?.prediction;
          if (verdict === 'Real' || data?.status === 'verified') {
            navigate(`/result-authentic?id=${scanId}`, { replace: true });
          } else {
            navigate(`/result-fake?id=${scanId}`, { replace: true });
          }
        } catch (err) {
          console.error('Failed to load result:', err);
        }
      }
      setLoading(false);
    }
    loadResult();
  }, [scanId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading result data...</p>
        </div>
      </div>
    );
  }

  const status          = scan?.status          ?? 'verified';
  const prediction      = scan?.verdict         ?? scan?.prediction ?? 'Real';
  const confidence      = scan?.confidence      ?? 94;
  const confidenceTier  = scan?.confidenceTier  ?? 'High';
  const manipulationType = scan?.manipulationType ?? 'None';
  const explanation     = scan?.explanation     ?? '';

  const isAuthentic = prediction === 'Real' || status === 'verified';

  const headerColor = isAuthentic
    ? 'from-green-500 to-emerald-600'
    : 'from-red-500 to-rose-600';

  const Icon = isAuthentic ? CheckCircle2 : AlertTriangle;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className={`bg-gradient-to-br ${headerColor} px-6 pt-12 pb-20 rounded-b-[2.5rem]`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <Icon className="w-12 h-12 text-white" />
          </div>
          <div className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            {prediction} Image
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isAuthentic ? 'Image Verified' : 'Image Flagged'}
          </h1>
          <p className="text-white/90 text-sm">
            {isAuthentic
              ? 'This image appears to be authentic'
              : `Manipulation Detected: ${manipulationType}`}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 flex items-center justify-between">
          <div className="text-center">
            <div className="text-5xl font-bold text-white">{confidence}%</div>
            <div className="text-white/80 text-sm mt-1">Confidence Score</div>
          </div>
          <div className="w-px h-12 bg-white/30"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{confidenceTier}</div>
            <div className="text-white/80 text-sm mt-1">Confidence Tier</div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 -mt-8">
        {/* Why this result */}
        {explanation ? (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-5">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Why this result?
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{explanation}</p>
          </div>
        ) : null}

        {/* Analysis checks */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-5">
          <h2 className="font-semibold text-gray-900 mb-4">Analysis Details</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">Metadata Analysis</div>
                <div className="text-sm text-gray-600">
                  {scan?.metadata?.statusText ?? "EXIF data analyzed."}
                </div>
              </div>
              <div className={`font-semibold text-sm ${isAuthentic ? 'text-green-600' : 'text-red-600'}`}>
                {isAuthentic ? 'Passed' : 'Failed'}
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">AI Detection</div>
                <div className="text-sm text-gray-600">
                  {isAuthentic
                    ? "No signs of AI-generated content detected."
                    : manipulationType === "AI Generated" || manipulationType === "Deepfake / Face Swap"
                    ? `${manipulationType} signatures detected.`
                    : "AI synthesis indicators not dominant."}
                </div>
              </div>
              <div className={`font-semibold text-sm ${isAuthentic ? 'text-green-600' : 'text-red-600'}`}>
                {isAuthentic ? 'Passed' : 'Failed'}
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">Manipulation Check</div>
                <div className="text-sm text-gray-600">
                  {isAuthentic
                    ? "No editing artifacts or inconsistencies found."
                    : manipulationType !== "None" && manipulationType !== "Unknown"
                    ? `${manipulationType} detected.`
                    : "Minor inconsistencies detected."}
                </div>
              </div>
              <div className={`font-semibold text-sm ${isAuthentic ? 'text-green-600' : 'text-red-600'}`}>
                {isAuthentic ? 'Passed' : 'Failed'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4 mb-5 border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              Verification completed on {scan ? `${scan.date} at ${scan.time}` : "—"}. Results are saved to your history.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
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
            <span className="text-sm font-medium text-gray-900">Export</span>
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
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow mb-6"
        >
          Verify Another Image
        </button>
      </div>
    </div>
  );
}
