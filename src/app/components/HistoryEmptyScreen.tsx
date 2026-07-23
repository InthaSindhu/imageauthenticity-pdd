import { useNavigate } from "react-router";
import { ArrowLeft, Package, Upload, Sparkles } from "lucide-react";

export function HistoryEmptyScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/home")}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Verification History</h1>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-16 h-16 text-gray-400" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            No History Yet
          </h2>
          <p className="text-gray-600 mb-8">
            You haven't verified any images yet. Start by uploading your first image to check its authenticity.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 mb-8 border border-blue-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 mb-2">Get Started</div>
                <div className="text-sm text-gray-700">
                  Upload an image to verify its authenticity using our advanced AI detection system.
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/upload")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload First Image
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-gray-300 mb-1">0</div>
              <div className="text-xs text-gray-600">Total Scans</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-gray-300 mb-1">0</div>
              <div className="text-xs text-gray-600">Verified</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-gray-300 mb-1">0</div>
              <div className="text-xs text-gray-600">Flagged</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
