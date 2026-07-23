import { useNavigate } from "react-router";
import { Clock, RefreshCw, Home, AlertCircle } from "lucide-react";

export function TimeoutErrorScreen() {
  const navigate = useNavigate();

  const handleRetry = () => {
    // Simulate retrying
    setTimeout(() => {
      navigate("/home");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Clock className="w-16 h-16 text-amber-600" />
            <div className="absolute inset-0 border-4 border-amber-600 border-t-transparent rounded-full animate-spin opacity-30"></div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Request Timeout
          </h2>
          <p className="text-gray-600 mb-8">
            The request took too long to complete. This might be due to a slow connection or high server load.
          </p>

          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="bg-amber-50 rounded-2xl p-5 mb-6 border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-left text-sm text-gray-700">
                  <div className="font-semibold text-gray-900 mb-2">What Does This Mean?</div>
                  <p className="mb-3">
                    Your verification request started but didn't finish within the expected time. Your data is safe, and you can try again.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-left mb-6">
              <div className="font-semibold text-gray-900 mb-3">Common Causes:</div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm">📶</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm mb-1">Slow Connection</div>
                    <div className="text-xs text-gray-600">Your internet speed may be limited</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-sm">🖼️</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm mb-1">Large File Size</div>
                    <div className="text-xs text-gray-600">Image file may be very large</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 text-sm">⚡</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm mb-1">Server Load</div>
                    <div className="text-xs text-gray-600">High traffic on our servers</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
              <div className="font-semibold text-gray-900 text-sm mb-2">💡 Pro Tip</div>
              <p className="text-sm text-gray-700">
                Try compressing your image or using a smaller file size for faster processing.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Retry Request
              </button>
              <button
                onClick={() => navigate("/home")}
                className="w-full bg-white border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Error Code: <span className="font-mono font-semibold">TIMEOUT_408</span>
          </div>
        </div>
      </div>
    </div>
  );
}
