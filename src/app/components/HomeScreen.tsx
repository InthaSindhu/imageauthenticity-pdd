import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Upload, History, Shield, Sparkles, Clock, CheckCircle2, User, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function HomeScreen() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 px-6 pt-12 pb-32 rounded-b-[2.5rem]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome back, {user?.name || "User"}!
            </h1>
            <p className="text-blue-100">Verify your images instantly</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/notifications")}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors relative"
            >
              <Bell className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-blue-600">
                <span className="text-white text-xs font-bold">2</span>
              </div>
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <User className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{user?.stats?.totalScans ?? 0}</div>
            <div className="text-xs text-blue-100">Total Scans</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{user?.stats?.verified ?? 0}</div>
            <div className="text-xs text-blue-100">Verified</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{user?.stats?.accuracy ?? 100}%</div>
            <div className="text-xs text-blue-100">Accuracy</div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-20">
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <button
            onClick={() => navigate("/upload")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 flex items-center justify-between hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-lg">Upload Image</div>
                <div className="text-sm text-blue-100">Verify authenticity now</div>
              </div>
            </div>
            <Sparkles className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => navigate("/history")}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <History className="w-6 h-6 text-blue-600" />
            </div>
            <div className="font-semibold text-gray-900 mb-1">History</div>
            <div className="text-sm text-gray-600">View past scans</div>
          </button>

          <button
            onClick={() => navigate("/activity")}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-left w-full"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="font-semibold text-gray-900 mb-1">Recent</div>
            <div className="text-sm text-gray-600">Latest results</div>
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">Pro Tip</div>
              <div className="text-sm text-gray-700">
                For best results, upload high-quality images with good lighting and minimal compression.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
