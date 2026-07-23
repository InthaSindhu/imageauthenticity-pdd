import { useNavigate } from "react-router";
import { ArrowLeft, Upload, Loader2, CheckCircle2 } from "lucide-react";

export function UploadingScreen() {
  const navigate = useNavigate();
  const uploadProgress = 67;

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
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Uploading Image
              </h3>
              <p className="text-gray-600">
                Please wait while we upload your file
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-700 font-medium">landscape-photo.jpg</span>
                <span className="text-blue-600 font-semibold">{uploadProgress}%</span>
              </div>

              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>2.4 MB of 3.6 MB</span>
                <span>~5 seconds remaining</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900 mb-1">Secure Upload</div>
                  <div>Your image is encrypted during transfer and stored securely.</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="w-full mt-6 bg-white border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel Upload
          </button>
        </div>
      </div>
    </div>
  );
}
