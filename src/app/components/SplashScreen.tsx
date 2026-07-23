import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Shield, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function SplashScreen() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (user) {
        navigate("/home");
      } else {
        navigate("/login");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="relative inline-block mb-8">
          <Shield className="w-24 h-24 text-white" strokeWidth={1.5} />
          <CheckCircle className="w-10 h-10 text-green-400 absolute -bottom-2 -right-2" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">VerifyImage</h1>
        <p className="text-blue-100 text-lg">Authenticate with Confidence</p>
      </div>
    </div>
  );
}
