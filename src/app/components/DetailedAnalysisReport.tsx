import { useNavigate } from "react-router";
import { ArrowLeft, Download, Share2, AlertTriangle, CheckCircle2, XCircle, Activity } from "lucide-react";

export function DetailedAnalysisReport() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate("/result")}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 flex-1">Detailed Analysis Report</h1>
          <button className="text-gray-600 hover:text-gray-900">
            <Download className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-600 ml-14">Generated on May 5, 2026 at 2:34 PM</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto w-full space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-6 text-white text-center">
            <div className="text-5xl font-bold mb-2">58%</div>
            <div className="text-lg font-semibold mb-1">Authenticity Score</div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm">
              <AlertTriangle className="w-4 h-4" />
              Uncertain - Needs Review
            </div>
          </div>

          {/* Detection Categories */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Detection Results</h2>
            <div className="space-y-3">
              <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-gray-900">Compression Artifacts</span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">Failed</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Excessive compression detected indicating multiple re-saves
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">78%</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span className="font-medium text-gray-900">Noise Patterns</span>
                  </div>
                  <span className="text-sm font-semibold text-amber-600">Warning</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Irregular noise distribution suggests possible manipulation
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">64%</span>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-2xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Color Consistency</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">Passed</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Color distribution appears natural and consistent
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '91%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">91%</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span className="font-medium text-gray-900">EXIF Metadata</span>
                  </div>
                  <span className="text-sm font-semibold text-amber-600">Incomplete</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Some metadata fields are missing or modified
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">45%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Technical Analysis
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Manipulation Indicators</div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Copy-move detection: 2 regions match at 89% similarity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>JPEG compression level inconsistency across image</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>Lighting direction variations detected</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">AI Detection Results</div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 mb-1">AI Generated</div>
                      <div className="text-2xl font-bold text-gray-900">34%</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Human Created</div>
                      <div className="text-2xl font-bold text-gray-900">66%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Processing Chain</div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Original</span>
                    <span>→</span>
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Edited</span>
                    <span>→</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Compressed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">1.</span>
                <span>Upload the original, uncompressed version if available</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">2.</span>
                <span>Verify the source and context of the image independently</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">3.</span>
                <span>Use caution when making critical decisions based on this image</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => navigate("/result")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow"
          >
            Back to Results
          </button>
        </div>
      </div>
    </div>
  );
}
