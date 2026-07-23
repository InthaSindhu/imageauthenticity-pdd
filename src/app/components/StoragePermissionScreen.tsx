import { useNavigate } from "react-router";
import { FolderOpen, CheckCircle2, Shield } from "lucide-react";

export function StoragePermissionScreen() {
  const navigate = useNavigate();

  const handleAllow = () => {
    navigate("/home");
  };

  const handleDeny = () => {
    navigate("/storage-permission-denied");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl p-8 shadow-lg text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Storage Access
            </h2>
            <p className="text-gray-600 mb-8">
              VerifyImage needs access to your device storage to read and save images for verification.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  Upload images from your photo library for verification
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  Save verification reports and results to your device
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  Access files from downloads and other folders
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAllow}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow"
              >
                Allow Storage Access
              </button>
              <button
                onClick={handleDeny}
                className="w-full bg-white border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <div className="font-semibold text-gray-900 mb-1">Your Data is Safe</div>
                We only access files you explicitly select. Your personal files remain private and secure.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
