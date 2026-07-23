import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Mail, Lock, ArrowRight, AlertCircle, XCircle } from "lucide-react";

export function LoginErrorScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("wrongpass");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("Invalid email or password. Please try again.");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    // Validation
    let hasError = false;

    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      hasError = true;
    }

    if (!hasError) {
      setGeneralError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full justify-center">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to verify your images</p>
        </div>

        {generalError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-red-900 mb-1">Login Failed</div>
              <div className="text-sm text-red-700">{generalError}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${emailError ? 'text-red-500' : 'text-gray-400'}`} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                  setGeneralError("");
                }}
                placeholder="Enter your email"
                className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                  emailError
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {emailError && (
                <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {emailError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span>{emailError}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${passwordError ? 'text-red-500' : 'text-gray-400'}`} />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                  setGeneralError("");
                }}
                placeholder="Enter your password"
                className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                  passwordError
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {passwordError && (
                <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {passwordError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span>{passwordError}</span>
              </p>
            )}
          </div>

          <button
            type="button"
            className="text-sm text-blue-600 font-medium hover:text-blue-700"
          >
            Forgot Password?
          </button>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Sign In
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
