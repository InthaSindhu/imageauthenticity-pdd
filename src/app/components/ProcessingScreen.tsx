import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Loader2, Shield, Sparkles, Scan } from "lucide-react";
import { api } from "../services/api";

export function ProcessingScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scanId = searchParams.get("id");
  const [statusText, setStatusText] = useState("Scanning metadata...");

  useEffect(() => {
    if (!scanId) {
      // Fallback if no ID is provided
      const timer = setTimeout(() => {
        navigate("/result");
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Step-by-step simulated progress text
    const textTimer1 = setTimeout(() => setStatusText("Running deep learning AI models..."), 1000);
    const textTimer2 = setTimeout(() => setStatusText("Generating confidence score..."), 2000);

    const redirectTimer = setTimeout(async () => {
      try {
        const scan = await api.getScanDetails(scanId);
        // Route by EfficientNet-B3 verdict (Real → authentic, Deepfake/Tempered → fake)
        const verdict = scan.verdict || scan.prediction;
        if (verdict === 'Real' || scan.status === 'verified') {
          navigate(`/result-authentic?id=${scanId}`);
        } else {
          // Deepfake or Tempered
          navigate(`/result-fake?id=${scanId}`);
        }
      } catch (err) {
        console.error('Failed to load processing scan:', err);
        navigate(`/result?id=${scanId}`); // fallback
      }
    }, 3200);

    return () => {
      clearTimeout(textTimer1);
      clearTimeout(textTimer2);
      clearTimeout(redirectTimer);
    };
  }, [navigate, scanId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-6">
      <div className="text-center max-w-md w-full">
        <div className="relative inline-block mb-8">
          <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Shield className="w-16 h-16 text-white" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-40 h-40 text-white/30 animate-spin" strokeWidth={1} />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">Analyzing Image</h2>
        <p className="text-blue-100 text-lg mb-12 h-8">
          {statusText}
        </p>

        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Scan className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-medium">Scanning metadata</div>
              <div className="text-blue-100 text-sm">Checking EXIF data...</div>
            </div>
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-medium">AI analysis</div>
              <div className="text-blue-100 text-sm">Running deep learning models...</div>
            </div>
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-medium">Verification</div>
              <div className="text-blue-100 text-sm">Generating confidence score...</div>
            </div>
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        </div>

        <div className="mt-12">
          <div className="inline-flex items-center gap-2 text-blue-100">
            <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
            <span className="text-sm">This may take a few seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
}
