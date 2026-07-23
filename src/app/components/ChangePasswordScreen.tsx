import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { api } from "../services/api";

export function ChangePasswordScreen() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const passwordStrength = newPassword.length === 0 ? null :
    newPassword.length < 6 ? 'weak' :
    newPassword.length < 10 ? 'medium' : 'strong';

  const isValid =
    currentPassword.length > 0 &&
    newPassword.length >= 6 &&
    confirmPassword === newPassword;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.changePassword(currentPassword, newPassword);
      setShowSuccess(true);
      setTimeout(() => navigate("/profile"), 1800);
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please check your current password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Change Password</h1>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">

            {/* Security tips */}
            <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <div className="font-semibold text-gray-900 mb-1">Security Tips</div>
                  Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Strength meter */}
                {passwordStrength && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-700">Password Strength</span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength === 'weak' ? 'text-red-600' :
                        passwordStrength === 'medium' ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <div className={`flex-1 h-2 rounded-full ${
                        passwordStrength === 'weak' ? 'bg-red-500' :
                        passwordStrength === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                      }`} />
                      <div className={`flex-1 h-2 rounded-full ${
                        passwordStrength === 'medium' ? 'bg-amber-500' :
                        passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                      <div className={`flex-1 h-2 rounded-full ${
                        passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
                )}
                {confirmPassword && newPassword === confirmPassword && newPassword.length > 0 && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Passwords match
                  </p>
                )}
              </div>

              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={!isValid || saving}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  disabled={saving}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Password Requirements */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Password Requirements</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${newPassword.length >= 8 ? 'text-green-600' : 'text-gray-300'}`} />
                <span>At least 8 characters long</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-300'}`} />
                <span>Contains uppercase letter</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-300'}`} />
                <span>Contains lowercase letter</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-300'}`} />
                <span>Contains number</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Password Updated!</h3>
            <p className="text-gray-600">Your password has been changed successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}
