import { useNavigate } from "react-router";
import { ArrowLeft, XCircle, RefreshCw, Upload } from "lucide-react";

export function UploadErrorScreen() {
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
        <h1 className="text-xl font-bold text-gray-900">Upload Image</h1>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Upload Failed
            </h3>
            <p className="text-gray-600 mb-8">
              We couldn't upload your image. Please try again.
            </p>

            <div className="bg-red-50 rounded-2xl p-4 mb-8 text-left border border-red-200">
              <div className="font-semibold text-red-900 mb-2">Error Details</div>
              <ul className="space-y-2 text-sm text-red-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Network connection interrupted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>File size: 3.6 MB (within limit)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Error code: NETWORK_ERROR</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              <button
                onClick={() => navigate("/upload")}
                className="w-full bg-white border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Choose Different Image
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="w-full mt-6 text-gray-600 py-3 font-medium hover:text-gray-900 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
