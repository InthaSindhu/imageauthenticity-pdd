import { useState } from "react";
import { useNavigate } from "react-router";
import { Camera, FolderOpen, Bell, Shield, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface Permission {
  id: string;
  name: string;
  description: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  required: boolean;
}

const permissions: Permission[] = [
  {
    id: 'camera',
    name: 'Camera',
    description: 'Take photos for instant verification',
    icon: Camera,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    required: false,
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Upload and save images',
    icon: FolderOpen,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    required: true,
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Get alerts when verification completes',
    icon: Bell,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    required: false,
  },
];

export function OnboardingPermissionsScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'intro' | 'requesting'>('intro');

  const handleContinue = () => {
    setStep('requesting');
    // Simulate permission request
    setTimeout(() => {
      navigate("/home");
    }, 2000);
  };

  if (step === 'requesting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-6">
        <div className="text-center max-w-md w-full">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Setting Up Permissions
          </h2>
          <p className="text-blue-100 mb-8">
            Please allow the requested permissions when prompted
          </p>

          <div className="space-y-3">
            {permissions.map((permission, idx) => {
              const Icon = permission.icon;
              return (
                <div
                  key={permission.id}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4"
                  style={{ animationDelay: `${idx * 200}ms` }}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-white">{permission.name}</div>
                    <div className="text-sm text-blue-100">Requesting...</div>
                  </div>
                  <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome to VerifyImage
            </h1>
            <p className="text-gray-600">
              To provide you with the best experience, we need a few permissions
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Permissions We Need</h3>
            <div className="space-y-4">
              {permissions.map((permission) => {
                const Icon = permission.icon;
                return (
                  <div
                    key={permission.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className={`w-12 h-12 ${permission.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${permission.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-medium text-gray-900">{permission.name}</div>
                        {permission.required ? (
                          <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                            Required
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 py-0.5 rounded-full">
                            Optional
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{permission.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-5 mb-6 border border-blue-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <div className="font-semibold text-gray-900 mb-2">Your Privacy Matters</div>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>We never access data without your permission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>All data is encrypted and secure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>You can change permissions anytime</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/home")}
              className="w-full text-gray-600 py-3 font-medium hover:text-gray-900 transition-colors"
            >
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
