import { useNavigate } from "react-router";
import { ServerCrash, RefreshCw, Home, AlertCircle, Mail } from "lucide-react";

export function ServerErrorScreen() {
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
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ServerCrash className="w-16 h-16 text-red-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Server Error
          </h2>
          <p className="text-gray-600 mb-8">
            Something went wrong on our end. Our team has been notified and is working to fix it.
          </p>

          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="bg-red-50 rounded-2xl p-5 mb-6 border border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-left text-sm text-gray-700">
                  <div className="font-semibold text-gray-900 mb-2">What's Going On?</div>
                  <p className="mb-3">
                    Our servers are experiencing technical difficulties. This is not an issue with your device or connection.
                  </p>
                  <div className="bg-white rounded-xl p-3 border border-red-200">
                    <div className="text-xs text-gray-600 mb-1">Error Details</div>
                    <div className="font-mono text-sm text-red-600 font-semibold">
                      500 Internal Server Error
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Timestamp: {new Date().toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-left mb-6">
              <div className="font-semibold text-gray-900 mb-3">What Can You Do?</div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Wait a few minutes and try again</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Check our status page for updates</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Contact support if the problem persists</span>
                </div>
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
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/home")}
                  className="bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <p className="text-sm text-gray-700">
              Our engineers have been automatically notified. Thank you for your patience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
