import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, Mail, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function EditProfileScreen() {
  const navigate = useNavigate();
  const { user, updateProfile, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateProfile(name.trim(), email.trim());
      setShowSuccess(true);
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile. Please try again.');
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
        <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">

            {/* Avatar */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-white">{initials}</span>
              </div>
              <p className="text-sm text-gray-500 mt-3">Profile photo auto-generated from initials</p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={saving || loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  disabled={saving}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-bounce-once">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Updated!</h3>
            <p className="text-gray-600">Your changes have been saved successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}
