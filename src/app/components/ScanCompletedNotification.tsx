import { useNavigate } from "react-router";
import { CheckCircle2, Eye, Share2, Download, X } from "lucide-react";

export function ScanCompletedNotification() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Toast-style notification at top */}
        <div className="bg-white rounded-2xl shadow-xl p-5 mb-6 border-2 border-green-200 animate-in slide-in-from-top">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Scan Completed Successfully
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Your image has been verified and is authentic
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/result")}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View Results
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
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Verification Complete!
          </h2>
          <p className="text-gray-600 mb-2">
            Your image has been successfully verified
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-semibold">94% Authentic</span>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
                <div className="text-xs text-gray-600">Checks Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">2.3s</div>
                <div className="text-xs text-gray-600">Scan Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
                <div className="text-xs text-gray-600">Issues Found</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => navigate("/result")}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              View Full Report
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
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
