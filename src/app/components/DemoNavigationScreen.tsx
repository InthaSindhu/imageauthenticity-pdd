import { useNavigate } from "react-router";
import { Shield, ChevronRight } from "lucide-react";

interface RouteGroup {
  title: string;
  routes: { name: string; path: string }[];
}

const routeGroups: RouteGroup[] = [
  {
    title: "Core Screens",
    routes: [
      { name: "Splash Screen", path: "/splash" },
      { name: "Login Screen", path: "/login" },
      { name: "Signup Screen", path: "/signup" },
      { name: "Home Screen", path: "/home" },
    ],
  },
  {
    title: "Authentication States",
    routes: [
      { name: "Login - Normal", path: "/login" },
      { name: "Login - Error State", path: "/login-error" },
      { name: "Signup - Normal", path: "/signup" },
      { name: "Signup - Error State", path: "/signup-error" },
    ],
  },
  {
    title: "Upload States",
    routes: [
      { name: "Upload - Empty", path: "/upload" },
      { name: "Upload - Drag Over", path: "/upload-drag" },
      { name: "Upload - Uploading", path: "/uploading" },
      { name: "Upload - Error", path: "/upload-error" },
    ],
  },
  {
    title: "Processing",
    routes: [{ name: "Processing Screen", path: "/processing" }],
  },
  {
    title: "Result Variations",
    routes: [
      { name: "Result - Authentic", path: "/result" },
      { name: "Result - Fake/Manipulated", path: "/result-fake" },
      { name: "Result - Uncertain", path: "/result-uncertain" },
    ],
  },
  {
    title: "History States",
    routes: [
      { name: "History - With Data", path: "/history" },
      { name: "History - Empty", path: "/history-empty" },
      { name: "History - Loading", path: "/history-loading" },
    ],
  },
  {
    title: "Profile & Settings",
    routes: [
      { name: "Profile Screen", path: "/profile" },
      { name: "Edit Profile", path: "/edit-profile" },
      { name: "Change Password", path: "/change-password" },
      { name: "Settings & Preferences", path: "/settings" },
    ],
  },
  {
    title: "Permissions",
    routes: [
      { name: "Onboarding Permissions", path: "/onboarding-permissions" },
      { name: "Permissions Overview", path: "/permissions" },
      { name: "Camera Permission Request", path: "/camera-permission" },
      { name: "Camera Permission Denied", path: "/camera-permission-denied" },
      { name: "Storage Permission Request", path: "/storage-permission" },
      { name: "Storage Permission Denied", path: "/storage-permission-denied" },
    ],
  },
  {
    title: "Error States",
    routes: [
      { name: "No Internet Connection", path: "/error-no-internet" },
      { name: "Network Error", path: "/error-network" },
      { name: "Server Error (500)", path: "/error-server" },
      { name: "Service Unavailable (503)", path: "/error-service-unavailable" },
      { name: "Request Timeout", path: "/error-timeout" },
      { name: "General Error", path: "/error-general" },
    ],
  },
  {
    title: "Notifications & Alerts",
    routes: [
      { name: "Notification Center", path: "/notifications" },
      { name: "Scan Completed Success", path: "/notification-scan-completed" },
      { name: "Scan Completed Warning", path: "/notification-scan-warning" },
      { name: "Error Alert Dialog", path: "/alert-error" },
      { name: "Delete Confirmation", path: "/alert-delete-confirmation" },
      { name: "Clear History Confirmation", path: "/alert-clear-history" },
      { name: "Logout Confirmation", path: "/alert-logout-confirmation" },
    ],
  },
  {
    title: "Other Screens",
    routes: [
      { name: "App Update Available", path: "/app-update" },
      { name: "Help & FAQ", path: "/help-faq" },
    ],
  },
  {
    title: "Advanced Screens",
    routes: [
      { name: "Image Comparison View", path: "/comparison" },
      { name: "Detailed Analysis Report", path: "/analysis" },
      { name: "AI Confidence Breakdown", path: "/confidence" },
      { name: "Image Metadata Viewer", path: "/metadata" },
      { name: "Recent Activity Dashboard", path: "/activity" },
      { name: "Search & Filter", path: "/search" },
      { name: "Share Result", path: "/share" },
      { name: "Feedback & Report", path: "/feedback" },
      { name: "Tutorial Onboarding", path: "/tutorial" },
      { name: "Dark Mode Home", path: "/dark-mode" },
    ],
  },
];

export function DemoNavigationScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 px-6 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">VerifyImage</h1>
            <p className="text-blue-100 text-sm">UI State Variations Demo</p>
          </div>
        </div>
        <p className="text-blue-100">
          Explore all UI states and variations of the image authenticity verification app
        </p>
      </div>

      <div className="p-6 space-y-6">
        {routeGroups.map((group, idx) => (
          <div key={idx}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {group.title}
            </h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {group.routes.map((route, routeIdx) => (
                <button
                  key={routeIdx}
                  onClick={() => navigate(route.path)}
                  className={`w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    routeIdx !== group.routes.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <span className="font-medium text-gray-900">{route.name}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
