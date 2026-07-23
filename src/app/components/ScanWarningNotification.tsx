import { useNavigate } from "react-router";
import { AlertTriangle, Eye, Upload, X, AlertCircle } from "lucide-react";

export function ScanWarningNotification() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Toast-style notification at top */}
        <div className="bg-white rounded-2xl shadow-xl p-5 mb-6 border-2 border-amber-200 animate-in slide-in-from-top">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Scan Completed with Issues
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Verification found some concerning patterns
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/result-uncertain")}
                  className="text-sm font-semibold text-amber-600 hover:text-amber-700"
                >
                  Review Details
                </button>
                <span className="text-gray-300">•</span>
                <button className="text-sm font-medium text-gray-600 hover:text-gray-700">
                  Dismiss
                </button>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Full-screen modal style */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Verification Completed
          </h2>
          <p className="text-gray-600 mb-2">
            We found some issues that need your attention
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full mb-6">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-semibold">58% Confidence - Uncertain</span>
          </div>

          <div className="bg-amber-50 rounded-2xl p-5 mb-6 border border-amber-200">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <div className="font-semibold text-gray-900 mb-2">Issues Detected</div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Metadata partially corrupted or modified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Minor inconsistencies detected</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600 mb-1">1</div>
                <div className="text-xs text-gray-600">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600 mb-1">2</div>
                <div className="text-xs text-gray-600">Warnings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">4.1s</div>
                <div className="text-xs text-gray-600">Scan Time</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => navigate("/result-uncertain")}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              View Detailed Report
            </button>
            <button
              onClick={() => navigate("/upload")}
              className="w-full bg-white border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Try Better Quality Image
            </button>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="text-gray-600 py-2 font-medium hover:text-gray-900 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
