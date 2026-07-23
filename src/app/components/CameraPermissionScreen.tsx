import { useNavigate } from "react-router";
import { Camera, CheckCircle2, Shield } from "lucide-react";

export function CameraPermissionScreen() {
  const navigate = useNavigate();

  const handleAllow = () => {
    navigate("/home");
  };

  const handleDeny = () => {
    navigate("/camera-permission-denied");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl p-8 shadow-lg text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Camera Access
            </h2>
            <p className="text-gray-600 mb-8">
              VerifyImage needs access to your camera to take photos for verification analysis.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  Take photos directly within the app for instant verification
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  Capture high-quality images for accurate analysis
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  No images are stored without your permission
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAllow}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow"
              >
                Allow Camera Access
              </button>
              <button
                onClick={handleDeny}
                className="w-full bg-white border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <div className="font-semibold text-gray-900 mb-1">Privacy First</div>
                Your photos are processed securely and never shared with third parties. You can change permissions anytime in Settings.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
