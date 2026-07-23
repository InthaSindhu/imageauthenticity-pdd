import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Bell, Moon, Globe, HelpCircle, FileText, Shield, ChevronRight, Smartphone, Mail as MailIcon, Vibrate } from "lucide-react";

export function SettingsScreen() {
  const navigate = useNavigate();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [verificationAlerts, setVerificationAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [vibration, setVibration] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-md mx-auto w-full space-y-6">
          {/* Notifications Section */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Push Notifications</div>
                  <div className="text-sm text-gray-600">Receive alerts on your device</div>
                </div>
                <button
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Email Notifications</div>
                  <div className="text-sm text-gray-600">Get updates via email</div>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Verification Alerts</div>
                  <div className="text-sm text-gray-600">Alerts when scan completes</div>
                </div>
                <button
                  onClick={() => setVerificationAlerts(!verificationAlerts)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    verificationAlerts ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      verificationAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Moon className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Appearance</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Dark Mode</div>
                  <div className="text-sm text-gray-600">Use dark theme</div>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Language</div>
                    <div className="text-sm text-gray-600">English (US)</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Security & Privacy</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Biometric Authentication</div>
                  <div className="text-sm text-gray-600">Use Face ID or fingerprint</div>
                </div>
                <button
                  onClick={() => setBiometricAuth(!biometricAuth)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    biometricAuth ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      biometricAuth ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="text-left">
                  <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-600">Not enabled</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="text-left">
                  <div className="font-medium text-gray-900">Privacy Settings</div>
                  <div className="text-sm text-gray-600">Manage your data</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button
                onClick={() => navigate("/permissions")}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="text-left">
                  <div className="font-medium text-gray-900">App Permissions</div>
                  <div className="text-sm text-gray-600">Camera, storage, and more</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Preferences</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Vibration</div>
                  <div className="text-sm text-gray-600">Haptic feedback</div>
                </div>
                <button
                  onClick={() => setVibration(!vibration)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    vibration ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      vibration ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="text-left">
                  <div className="font-medium text-gray-900">Auto-Delete History</div>
                  <div className="text-sm text-gray-600">After 90 days</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="text-left">
                  <div className="font-medium text-gray-900">Data Usage</div>
                  <div className="text-sm text-gray-600">Download over WiFi only</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="space-y-1">
              <button
                onClick={() => navigate("/help-faq")}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Help & Support</div>
                    <div className="text-sm text-gray-600">FAQs and contact us</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Terms & Privacy</div>
                    <div className="text-sm text-gray-600">Legal information</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <MailIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Send Feedback</div>
                    <div className="text-sm text-gray-600">Help us improve</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="text-center py-6">
            <p className="text-sm text-gray-500">Version 1.0.0</p>
            <p className="text-xs text-gray-400 mt-1">© 2026 VerifyImage. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
