import { useNavigate } from "react-router";
import { CloudOff, RefreshCw, Home, AlertTriangle } from "lucide-react";

export function NetworkErrorScreen() {
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
          <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CloudOff className="w-16 h-16 text-orange-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Network Error
          </h2>
          <p className="text-gray-600 mb-8">
            We couldn't connect to our servers. This might be a temporary network issue.
          </p>

          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="bg-orange-50 rounded-2xl p-5 mb-6 border border-orange-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-left text-sm text-gray-700">
                  <div className="font-semibold text-gray-900 mb-2">What Happened?</div>
                  <p>
                    Your request couldn't reach our servers. This could be due to poor network quality, firewall restrictions, or connectivity issues.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-left mb-6">
              <div className="font-semibold text-gray-900 mb-3">Try These Steps:</div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold mt-0.5">
                    1
                  </div>
                  <div className="flex-1 text-sm text-gray-700">
                    Check your internet connection is stable
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold mt-0.5">
                    2
                  </div>
                  <div className="flex-1 text-sm text-gray-700">
                    Disable VPN or proxy if you're using one
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold mt-0.5">
                    3
                  </div>
                  <div className="flex-1 text-sm text-gray-700">
                    Wait a moment and try again
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Retry Connection
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
            Error Code: <span className="font-mono font-semibold">NET_ERR_01</span>
          </div>
        </div>
      </div>
    </div>
  );
}
