import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";

export function SignupErrorScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("test@test");
  const [password, setPassword] = useState("weak");
  const [confirmPassword, setConfirmPassword] = useState("different");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("Please enter a valid email address");
  const [passwordError, setPasswordError] = useState("Password must be at least 8 characters");
  const [confirmPasswordError, setConfirmPasswordError] = useState("Passwords do not match");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    if (!name.trim()) {
      setNameError("Full name is required");
      hasError = true;
    }

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

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (!hasError) {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full justify-center">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Start verifying images today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${nameError ? 'text-red-500' : 'text-gray-400'}`} />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError("");
                }}
                placeholder="Enter your name"
                className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                  nameError
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {nameError && (
                <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {nameError && (
              <p className="mt-2 text-sm text-red-600">{nameError}</p>
            )}
          </div>

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
              <p className="mt-2 text-sm text-red-600">{emailError}</p>
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
                }}
                placeholder="Create a password"
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
              <p className="mt-2 text-sm text-red-600">{passwordError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${confirmPasswordError ? 'text-red-500' : 'text-gray-400'}`} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError("");
                }}
                placeholder="Confirm your password"
                className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                  confirmPasswordError
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {confirmPasswordError && (
                <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {confirmPasswordError && (
              <p className="mt-2 text-sm text-red-600">{confirmPasswordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-6"
          >
            Create Account
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
