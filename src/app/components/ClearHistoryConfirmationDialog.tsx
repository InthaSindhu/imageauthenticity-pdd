import { useNavigate } from "react-router";
import { Trash2, AlertTriangle, X, AlertCircle } from "lucide-react";

export function ClearHistoryConfirmationDialog() {
  const navigate = useNavigate();

  const handleClearAll = () => {
    // Simulate clearing all history
    setTimeout(() => {
      navigate("/history-empty");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="max-w-sm w-full">
        {/* Clear All History Confirmation Dialog */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate("/history")}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 className="w-10 h-10 text-red-600" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Clear All History?
          </h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to permanently delete all verification records? This will remove all saved scans and reports.
          </p>

          <div className="bg-red-50 rounded-2xl p-5 mb-6 border border-red-200">
            <div className="flex items-start gap-3 text-left">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <div className="font-semibold text-red-900 mb-2">⚠️ Irreversible Action</div>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span>
                    <span>All verification history will be permanently deleted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span>
                    <span>Saved reports and results will be lost forever</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span>
                    <span>This action cannot be undone</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
            <div className="flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="text-xs text-gray-600">
                  <strong className="text-gray-900">27 verification records</strong> will be deleted from your account.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleClearAll}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 rounded-2xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Yes, Clear All History
            </button>
            <button
              onClick={() => navigate("/history")}
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
