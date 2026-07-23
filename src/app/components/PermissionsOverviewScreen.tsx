import { useNavigate } from "react-router";
import { ArrowLeft, Camera, FolderOpen, Bell, MapPin, CheckCircle2, XCircle, ChevronRight, Shield } from "lucide-react";

interface Permission {
  id: string;
  name: string;
  description: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  status: 'granted' | 'denied' | 'not-requested';
  path: string;
}

const permissions: Permission[] = [
  {
    id: 'camera',
    name: 'Camera',
    description: 'Take photos for verification',
    icon: Camera,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    status: 'granted',
    path: '/camera-permission',
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Read and save images',
    icon: FolderOpen,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    status: 'denied',
    path: '/storage-permission',
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Receive verification alerts',
    icon: Bell,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    status: 'granted',
    path: '/settings',
  },
  {
    id: 'location',
    name: 'Location',
    description: 'Optional: Add location metadata',
    icon: MapPin,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    status: 'not-requested',
    path: '/settings',
  },
];

export function PermissionsOverviewScreen() {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'granted':
        return (
          <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-semibold">Allowed</span>
          </div>
        );
      case 'denied':
        return (
          <div className="flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1.5 rounded-full">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-semibold">Denied</span>
          </div>
        );
      case 'not-requested':
        return (
          <div className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
            <span className="text-xs font-semibold">Not Set</span>
          </div>
        );
    }
  };

  const grantedCount = permissions.filter(p => p.status === 'granted').length;
  const deniedCount = permissions.filter(p => p.status === 'denied').length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/settings")}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">App Permissions</h1>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-md mx-auto w-full space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-6 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Permissions Status</h2>
                <p className="text-blue-100 text-sm">Manage app access</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-3xl font-bold mb-1">{grantedCount}</div>
                <div className="text-sm text-blue-100">Allowed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-3xl font-bold mb-1">{deniedCount}</div>
                <div className="text-sm text-blue-100">Denied</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">All Permissions</h3>
            <div className="space-y-2">
              {permissions.map((permission) => {
                const Icon = permission.icon;
                return (
                  <button
                    key={permission.id}
                    onClick={() => navigate(permission.path)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className={`w-12 h-12 ${permission.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${permission.iconColor}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 mb-0.5">{permission.name}</div>
                      <div className="text-sm text-gray-600">{permission.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(permission.status)}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
            <div className="font-semibold text-gray-900 mb-2">Why We Need Permissions</div>
            <p className="text-sm text-gray-700 mb-3">
              VerifyImage requires certain permissions to provide you with the best image verification experience.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Camera:</strong> Take photos directly in the app</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Storage:</strong> Upload existing images and save results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Notifications:</strong> Get alerts when verification completes</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <div className="font-semibold text-gray-900 mb-1">Privacy Protected</div>
                All permissions can be revoked at any time from your device settings. We never access your data without explicit permission.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
