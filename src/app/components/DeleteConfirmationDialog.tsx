import { useNavigate } from "react-router";
import { Trash2, AlertTriangle, X } from "lucide-react";

export function DeleteConfirmationDialog() {
  const navigate = useNavigate();

  const handleDelete = () => {
    // Simulate deletion
    setTimeout(() => {
      navigate("/history-empty");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="max-w-sm w-full">
        {/* Delete Confirmation Dialog */}
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
            Delete Verification?
          </h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this verification result? This action cannot be undone.
          </p>

          <div className="bg-amber-50 rounded-2xl p-4 mb-6 border border-amber-200">
            <div className="flex items-start gap-3 text-left">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <div className="font-semibold text-gray-900 mb-1">Warning</div>
                <p className="text-xs text-gray-600">
                  Once deleted, you won't be able to recover this verification report or its associated data.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDelete}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 rounded-2xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Yes, Delete
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
