import { useNavigate } from "react-router";
import { Download, Sparkles, CheckCircle2, X, Shield, Zap, Star } from "lucide-react";

export function AppUpdateScreen() {
  const navigate = useNavigate();

  const handleUpdate = () => {
    // Simulate app update
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <button
            onClick={() => navigate("/home")}
            className="ml-auto mb-4 text-gray-400 hover:text-gray-600 transition-colors flex"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Download className="w-12 h-12 text-white" />
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full mb-4">
            <span className="text-sm font-semibold">Version 2.0.0 Available</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Update Available!
          </h2>
          <p className="text-gray-600 mb-8">
            A new version of VerifyImage is ready to install with exciting improvements and new features.
          </p>

          <div className="text-left mb-6">
            <div className="font-semibold text-gray-900 mb-4">What's New in 2.0.0</div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Enhanced AI Detection</div>
                  <div className="text-sm text-gray-600">30% faster processing with improved accuracy</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Advanced Security</div>
                  <div className="text-sm text-gray-600">Better privacy protection and data encryption</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">New Features</div>
                  <div className="text-sm text-gray-600">Batch scanning and detailed reporting</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600 mb-1">Download Size</div>
                <div className="text-lg font-bold text-gray-900">45.2 MB</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Release Date</div>
                <div className="text-lg font-bold text-gray-900">May 5, 2026</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-gray-700 text-left">
                Updates include bug fixes, performance improvements, and new verification algorithms.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleUpdate}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Update Now
            </button>
            <button
              onClick={() => navigate("/home")}
              className="w-full bg-white border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Remind Me Later
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Automatic updates can be enabled in Settings
          </p>
        </div>
      </div>
    </div>
  );
}
