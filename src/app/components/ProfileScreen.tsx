import { useNavigate } from "react-router";
import { ArrowLeft, Edit2, Settings, LogOut, Shield, Award, Clock, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header gradient */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 px-6 pt-12 pb-24 rounded-b-[2.5rem]">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/home")}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="text-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
            {loading ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : (
              <span className="text-3xl font-bold text-white">{initials}</span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {user?.name ?? '—'}
          </h1>
          <p className="text-blue-100 mb-6">{user?.email ?? '—'}</p>
          <button
            onClick={() => navigate("/edit-profile")}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium hover:bg-white/30 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="px-6 -mt-16">
        {/* Stats */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Statistics</h2>
          {loading ? (
            <div className="grid grid-cols-3 gap-4 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {user?.stats?.totalScans ?? 0}
                </div>
                <div className="text-xs text-gray-600">Total Scans</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {user?.stats?.verified ?? 0}
                </div>
                <div className="text-xs text-gray-600">Verified</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {user?.stats?.accuracy ?? 100}%
                </div>
                <div className="text-xs text-gray-600">Accuracy</div>
              </div>
            </div>
          )}
        </div>

        {/* Account */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Account</h2>
          <div className="space-y-1">
            <button
              onClick={() => navigate("/edit-profile")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Edit2 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Edit Profile</div>
                  <div className="text-sm text-gray-600">Update your information</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => navigate("/change-password")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Change Password</div>
                  <div className="text-sm text-gray-600">Update your password</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => navigate("/history")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Scan History</div>
                  <div className="text-sm text-gray-600">View all past verifications</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Membership */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Membership</h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Current Plan</div>
                <div className="text-xl font-bold text-gray-900">Pro Plan</div>
              </div>
              <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                Active
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
              <Clock className="w-4 h-4 text-gray-600" />
              <span>Renews on June 5, 2026</span>
            </div>
            <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Manage Subscription
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white border border-red-300 text-red-600 py-4 rounded-2xl font-semibold hover:bg-red-50 transition-colors mb-8"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
