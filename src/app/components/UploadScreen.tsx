import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Upload, Camera, Image, ArrowLeft, CheckCircle2, X } from "lucide-react";
import { api } from "../services/api";

export function UploadScreen() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ fileName: string; fileSize: string; resolution: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Camera capture states
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Handle uploaded files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        
        // Extract meta
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";
        setImageMeta({
          fileName: file.name,
          fileSize: sizeMB,
          resolution: "3264×2448 px" // default placeholder resolution for upload
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Camera
  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
      
      // Delay binding stream slightly to ensure video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 200);
    } catch (err: any) {
      console.error("Camera access failed", err);
      // Redirect to permission denied screen as per Figma flow
      navigate("/camera-permission-denied");
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  // Capture Photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      if (context) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL("image/jpeg");
        setSelectedImage(dataUrl);
        
        setImageMeta({
          fileName: `captured_${Date.now()}.jpg`,
          fileSize: "1.2 MB",
          resolution: `${canvas.width}×${canvas.height} px`
        });
        
        stopCamera();
      }
    }
  };

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Send to backend and navigate to processing
  const handleVerify = async () => {
    if (!selectedImage) return;
    setLoading(true);
    setError(null);
    try {
      const payload = selectedImage;
      const name = imageMeta?.fileName || "photo.jpg";
      const meta = {
        fileSize: imageMeta?.fileSize || "1.0 MB",
        resolution: imageMeta?.resolution || "1920×1080 px"
      };

      const result = await api.verifyImage(payload, name, meta);
      // Go to processing screen, passing scan ID in URL params
      navigate(`/processing?id=${result.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to initiate verification.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/home")}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Upload Image</h1>
      </div>

      <div className="flex-1 p-6 flex flex-col">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-4 text-sm">
            {error}
          </div>
        )}

        {!selectedImage ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <label className="w-full max-w-md cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-all">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Choose an image
                </h3>
                <p className="text-gray-600 mb-6">
                  Tap to browse your gallery
                </p>
                <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                  <Image className="w-4 h-4" />
                  <span>Supports JPG, PNG, WebP</span>
                </div>
              </div>
            </label>

            <div className="flex items-center gap-4 w-full max-w-md mt-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <button
              onClick={startCamera}
              className="w-full max-w-md bg-white border border-gray-300 rounded-2xl py-4 px-6 mt-6 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <Camera className="w-5 h-5 text-gray-700" />
              <span className="font-semibold text-gray-900">Take Photo</span>
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-white rounded-3xl overflow-hidden mb-6 shadow-lg relative flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Selected"
                className="max-h-[60vh] max-w-full object-contain"
              />
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                Image "{imageMeta?.fileName}" loaded successfully ({imageMeta?.fileSize}). Ready to verify authenticity.
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedImage(null)}
                disabled={loading}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Change Image
              </button>
              <button
                onClick={handleVerify}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Verifying..." : "Verify Now"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for taking photos */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Live Camera Feed Modal Overlay */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col justify-between">
          <div className="p-6 flex items-center justify-between text-white border-b border-white/10">
            <h2 className="text-lg font-bold">Align Image & Shoot</h2>
            <button
              onClick={stopCamera}
              className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center hover:bg-white/25 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-zinc-950">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Guide framing box */}
            <div className="absolute inset-8 border-2 border-dashed border-white/40 rounded-3xl pointer-events-none flex items-center justify-center">
              <div className="text-xs text-white/50 bg-black/40 px-3 py-1.5 rounded-full">
                Position document or subject here
              </div>
            </div>
          </div>

          <div className="p-8 bg-zinc-900 flex items-center justify-center border-t border-white/10 gap-6">
            <button
              onClick={stopCamera}
              className="px-6 py-3.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              onClick={capturePhoto}
              className="w-20 h-20 bg-white hover:bg-zinc-200 transition-colors rounded-full flex items-center justify-center border-8 border-white/30 active:scale-95 duration-100"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </button>
            <div className="w-20" /> {/* spacing spacer */}
          </div>
        </div>
      )}
    </div>
  );
}
