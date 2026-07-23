import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Maximize2, Eye, EyeOff, AlertCircle, ZoomIn } from "lucide-react";

export function ImageComparisonScreen() {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/result")}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Image Comparison</h1>
          <p className="text-xs text-gray-600">Original vs Analyzed</p>
        </div>
        <button className="text-blue-600 hover:text-blue-700">
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          {/* Comparison View */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Visual Comparison</h2>
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {showOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showOverlay ? 'Hide' : 'Show'} Highlights
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Original Image</div>
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Maximize2 className="w-12 h-12" />
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Analyzed Image</div>
                <div className="aspect-video bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Maximize2 className="w-12 h-12" />
                  </div>
                  {showOverlay && (
                    <>
                      <div className="absolute top-4 left-4 w-16 h-16 border-2 border-red-500 rounded-lg"></div>
                      <div className="absolute bottom-8 right-8 w-20 h-12 border-2 border-red-500 rounded-lg"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-amber-500 rounded-lg"></div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <div className="font-semibold text-gray-900 mb-1">3 Regions Highlighted</div>
                  <p className="text-xs text-gray-600">
                    Red areas indicate manipulation, amber areas show suspicious patterns
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detected Differences */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Detected Differences</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-2xl border border-red-200">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">Top-left corner modification</div>
                  <p className="text-sm text-gray-600 mb-2">
                    Pixel-level inconsistencies detected in this region
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Severity: <strong className="text-red-600">High</strong></span>
                    <span>Confidence: <strong>87%</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-2xl border border-red-200">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">Bottom-right shadow anomaly</div>
                  <p className="text-sm text-gray-600 mb-2">
                    Lighting inconsistencies suggest post-processing
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Severity: <strong className="text-red-600">High</strong></span>
                    <span>Confidence: <strong>92%</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold">
                  3
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">Center region texture pattern</div>
                  <p className="text-sm text-gray-600 mb-2">
                    Compression artifacts or possible cloning detected
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Severity: <strong className="text-amber-600">Medium</strong></span>
                    <span>Confidence: <strong>71%</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-6 text-white">
            <h3 className="font-semibold mb-4">Analysis Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold mb-1">3</div>
                <div className="text-xs text-blue-100">Regions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold mb-1">83%</div>
                <div className="text-xs text-blue-100">Avg Confidence</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold mb-1">High</div>
                <div className="text-xs text-blue-100">Risk Level</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/result")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow"
          >
            Back to Full Report
          </button>
        </div>
      </div>
    </div>
  );
}
