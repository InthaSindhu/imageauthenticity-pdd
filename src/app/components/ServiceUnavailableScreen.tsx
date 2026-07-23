import { useNavigate } from "react-router";
import { Construction, RefreshCw, Home, Clock, Bell } from "lucide-react";

export function ServiceUnavailableScreen() {
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
          <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction className="w-16 h-16 text-amber-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Service Temporarily Unavailable
          </h2>
          <p className="text-gray-600 mb-8">
            We're performing scheduled maintenance to improve your experience. We'll be back shortly!
          </p>

          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 mb-6 border border-amber-200">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-left text-sm text-gray-700">
                  <div className="font-semibold text-gray-900 mb-2">Scheduled Maintenance</div>
                  <p className="mb-3">
                    Our services are temporarily unavailable due to planned maintenance. This helps us keep the app running smoothly and securely.
                  </p>
                  <div className="bg-white rounded-xl p-3 border border-amber-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Expected Duration</span>
                      <span className="text-sm font-semibold text-amber-600">~30 minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Estimated Return</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {new Date(Date.now() + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-left mb-6">
              <div className="font-semibold text-gray-900 mb-3">What's Being Improved:</div>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 text-sm text-gray-700">
                    Enhanced verification algorithms for better accuracy
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 text-sm text-gray-700">
                    Performance improvements for faster processing
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 text-sm text-gray-700">
                    Security updates and system optimizations
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900 text-sm mb-1">Get Notified</div>
                  <p className="text-sm text-gray-700">
                    Enable notifications in settings to receive alerts when we're back online.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Check Status
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
            Status Code: <span className="font-mono font-semibold">503 Service Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
