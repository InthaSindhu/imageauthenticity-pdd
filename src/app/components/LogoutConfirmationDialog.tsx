import { useNavigate } from "react-router";
import { LogOut, AlertCircle, X } from "lucide-react";

export function LogoutConfirmationDialog() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Simulate logout
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="max-w-sm w-full">
        {/* Logout Confirmation Dialog */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate("/profile")}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogOut className="w-10 h-10 text-blue-600" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Sign Out?
          </h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to sign out of your account? You'll need to sign in again to access your verifications.
          </p>

          <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
            <div className="flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="text-xs text-gray-600">
                  Your verification history and settings will be saved and available when you sign back in.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-2xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Yes, Sign Out
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3.5 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
