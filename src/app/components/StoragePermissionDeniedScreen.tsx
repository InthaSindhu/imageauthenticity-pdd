import { useNavigate } from "react-router";
import { FolderOpen, XCircle, Settings, AlertCircle, Camera } from "lucide-react";

export function StoragePermissionDeniedScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl p-8 shadow-lg text-center mb-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <FolderOpen className="w-12 h-12 text-red-600" />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Storage Access Denied
            </h2>
            <p className="text-gray-600 mb-8">
              Storage access is currently disabled. To upload images from your device, you'll need to enable storage permissions.
            </p>

            <div className="bg-amber-50 rounded-2xl p-5 mb-8 border border-amber-200">
              <div className="flex items-start gap-3 text-left">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <div className="font-semibold text-gray-900 mb-2">Limited Functionality</div>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Cannot upload images from gallery</li>
                    <li>• Cannot save verification reports</li>
                    <li>• Cannot access downloaded files</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-5 mb-8 border border-purple-200">
              <div className="font-semibold text-gray-900 mb-3">How to Enable Storage Access</div>
              <ol className="space-y-2 text-sm text-gray-700 text-left">
                <li className="flex gap-2">
                  <span className="font-semibold text-purple-600">1.</span>
                  <span>Open your device Settings</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-purple-600">2.</span>
                  <span>Navigate to Apps & Permissions</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-purple-600">3.</span>
                  <span>Select "VerifyImage" from the list</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-purple-600">4.</span>
                  <span>Enable Storage or Files permission</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-purple-600">5.</span>
                  <span>Return to the app</span>
                </li>
              </ol>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2">
                <Settings className="w-5 h-5" />
                Open Settings
              </button>
              <button
                onClick={() => navigate("/camera-permission")}
                className="w-full bg-white border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Use Camera Instead
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="w-full text-gray-600 py-3 font-medium hover:text-gray-900 transition-colors"
          >
            Continue Without Storage
          </button>
        </div>
      </div>
    </div>
  );
}
