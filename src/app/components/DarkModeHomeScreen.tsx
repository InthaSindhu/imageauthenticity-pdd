import { useNavigate } from "react-router";
import { Shield, Upload, History, TrendingUp, CheckCircle2, AlertTriangle, Bell, User, Settings, Moon } from "lucide-react";

export function DarkModeHomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AuthentiCheck</h1>
              <p className="text-xs text-blue-100">Image Verification</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-white mb-1">24</div>
            <div className="text-xs text-blue-100">Verified</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-white mb-1">3</div>
            <div className="text-xs text-blue-100">Flagged</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-white mb-1">98%</div>
            <div className="text-xs text-blue-100">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto w-full space-y-6">
          {/* Upload Card */}
          <button
            onClick={() => navigate("/upload")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-center hover:shadow-2xl transition-shadow border border-blue-500/50"
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Verify an Image</h2>
            <p className="text-sm text-blue-100">
              Upload or capture to check authenticity
            </p>
          </button>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/history")}
              className="bg-gray-800 rounded-2xl p-6 text-center hover:bg-gray-750 transition-colors border border-gray-700"
            >
              <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <History className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">History</h3>
              <p className="text-xs text-gray-400">View past scans</p>
            </button>

            <button
              onClick={() => navigate("/activity")}
              className="bg-gray-800 rounded-2xl p-6 text-center hover:bg-gray-750 transition-colors border border-gray-700"
            >
              <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Activity</h3>
              <p className="text-xs text-gray-400">Recent analytics</p>
            </button>
          </div>

          {/* Recent Scans */}
          <div className="bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Recent Scans</h2>
              <button
                onClick={() => navigate("/history")}
                className="text-sm font-medium text-blue-400 hover:text-blue-300"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/result")}
                className="w-full flex items-center gap-4 p-4 bg-gray-750 rounded-xl hover:bg-gray-700 transition-colors border border-gray-600"
              >
                <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-white text-sm">landscape-photo.jpg</div>
                  <div className="text-xs text-gray-400">2 hours ago • 94% authentic</div>
                </div>
              </button>

              <button
                onClick={() => navigate("/result-uncertain")}
                className="w-full flex items-center gap-4 p-4 bg-gray-750 rounded-xl hover:bg-gray-700 transition-colors border border-gray-600"
              >
                <div className="w-10 h-10 bg-amber-900/50 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-white text-sm">portrait-edit.png</div>
                  <div className="text-xs text-gray-400">1 day ago • 58% uncertain</div>
                </div>
              </button>

              <button
                onClick={() => navigate("/result-authentic")}
                className="w-full flex items-center gap-4 p-4 bg-gray-750 rounded-xl hover:bg-gray-700 transition-colors border border-gray-600"
              >
                <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-white text-sm">nature-scene.jpg</div>
                  <div className="text-xs text-gray-400">2 days ago • 96% authentic</div>
                </div>
              </button>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl p-6 border border-purple-700/50">
            <div className="flex items-start gap-3">
              <Moon className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <div className="font-semibold text-white mb-1">Dark Mode Active</div>
                <p>
                  Easier on the eyes for nighttime verification. Toggle in Settings to switch back to light mode.
                </p>
              </div>
            </div>
          </div>

          {/* Settings Link */}
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center justify-between p-5 bg-gray-800 rounded-2xl hover:bg-gray-750 transition-colors border border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-gray-300" />
              </div>
              <div className="text-left">
                <div className="font-medium text-white">Settings</div>
                <div className="text-xs text-gray-400">Customize your experience</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
