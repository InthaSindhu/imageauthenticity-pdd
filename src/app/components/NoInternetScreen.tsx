import { useNavigate } from "react-router";
import { WifiOff, RefreshCw, Settings, AlertCircle } from "lucide-react";

export function NoInternetScreen() {
  const navigate = useNavigate();

  const handleRetry = () => {
    // Simulate checking connection
    setTimeout(() => {
      navigate("/home");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <WifiOff className="w-16 h-16 text-red-600" />
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-2xl font-bold">!</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            No Internet Connection
          </h2>
          <p className="text-gray-600 mb-8">
            Oops! It looks like you're not connected to the internet. Please check your connection and try again.
          </p>

          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <div className="font-semibold text-gray-900 mb-2">Quick Fixes</div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Check if Wi-Fi or mobile data is turned on</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Try turning Airplane mode off</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Check if you're in an area with signal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Restart your router or device</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <button className="w-full bg-white border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Settings className="w-5 h-5" />
                Open Network Settings
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="text-gray-600 py-3 font-medium hover:text-gray-900 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
