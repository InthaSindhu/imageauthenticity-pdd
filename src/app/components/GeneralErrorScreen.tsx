import { useState } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, RefreshCw, Home, Copy, CheckCircle2, Mail } from "lucide-react";

export function GeneralErrorScreen() {
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const errorId = "ERR_" + Math.random().toString(36).substring(2, 11).toUpperCase();

  const handleRetry = () => {
    setRetryCount(retryCount + 1);
    // Simulate retrying
    setTimeout(() => {
      navigate("/home");
    }, 1000);
  };

  const handleCopyError = () => {
    const errorDetails = `Error ID: ${errorId}\nTimestamp: ${new Date().toISOString()}\nAttempts: ${retryCount + 1}`;
    navigator.clipboard.writeText(errorDetails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-16 h-16 text-red-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Something Went Wrong
          </h2>
          <p className="text-gray-600 mb-8">
            We encountered an unexpected error. Don't worry, we're here to help you get back on track.
          </p>

          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            {retryCount > 0 && (
              <div className="bg-amber-50 rounded-2xl p-4 mb-6 border border-amber-200">
                <div className="text-sm text-amber-800">
                  <span className="font-semibold">Retry Attempt {retryCount}</span>
                  <p className="text-xs mt-1 text-amber-700">
                    If the problem persists, please contact support
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              <div className="text-left mb-4">
                <div className="text-xs text-gray-600 mb-2">Error Reference</div>
                <div className="flex items-center justify-between gap-3">
                  <div className="font-mono text-sm font-semibold text-gray-900">
                    {errorId}
                  </div>
                  <button
                    onClick={handleCopyError}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Share this ID with support for faster assistance
              </div>
            </div>

            <div className="text-left mb-6">
              <div className="font-semibold text-gray-900 mb-3">What You Can Try:</div>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <RefreshCw className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm">
                    <div className="font-medium text-gray-900 mb-1">Retry the Action</div>
                    <div className="text-gray-600 text-xs">Most errors are temporary and resolve on retry</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <Home className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm">
                    <div className="font-medium text-gray-900 mb-1">Go Back Home</div>
                    <div className="text-gray-600 text-xs">Start fresh from the home screen</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm">
                    <div className="font-medium text-gray-900 mb-1">Contact Support</div>
                    <div className="text-gray-600 text-xs">We're here to help 24/7</div>
                  </div>
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
                  Support
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Need immediate help? Visit our Help Center or contact support@verifyimage.com
          </p>
        </div>
      </div>
    </div>
  );
}
