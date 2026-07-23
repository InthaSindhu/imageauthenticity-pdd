import { useNavigate } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";

export function HistoryLoadingScreen() {
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
        <h1 className="text-xl font-bold text-gray-900">Verification History</h1>
      </div>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-16 mx-auto"></div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-16 mx-auto"></div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-16 mx-auto"></div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 animate-pulse"
            >
              <div className="w-20 h-20 rounded-xl bg-gray-200 flex-shrink-0"></div>

              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-100 rounded w-40"></div>
              </div>

              <div className="w-5 h-5 bg-gray-200 rounded flex-shrink-0"></div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading your history...</p>
        </div>
      </div>
    </div>
  );
}
