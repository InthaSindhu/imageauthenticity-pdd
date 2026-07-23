import { useNavigate } from "react-router";
import { XCircle, AlertCircle, RefreshCw, Home } from "lucide-react";

export function ErrorAlertDialog() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="max-w-sm w-full">
        {/* Error Alert Dialog */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Scan Failed
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't complete the verification process. Please try again or contact support if the issue persists.
          </p>

          <div className="bg-red-50 rounded-2xl p-4 mb-6 border border-red-200">
            <div className="flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <div className="font-semibold text-gray-900 mb-1">Error Details</div>
                <p className="text-xs text-gray-600">
                  The image file may be corrupted or in an unsupported format.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/upload")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-2xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={() => navigate("/home")}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3.5 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
