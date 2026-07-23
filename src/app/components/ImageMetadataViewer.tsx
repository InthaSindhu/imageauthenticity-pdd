import { useNavigate } from "react-router";
import { ArrowLeft, Copy, FileText, Camera, MapPin, Calendar, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function ImageMetadataViewer() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/result")}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Image Metadata</h1>
          <p className="text-xs text-gray-600">Technical Information</p>
        </div>
        <button
          onClick={handleCopy}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
        >
          {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto w-full space-y-6">
          {/* File Information */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              File Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">File Name</span>
                <span className="text-sm text-gray-900 font-mono">landscape-2024.jpg</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">File Size</span>
                <span className="text-sm text-gray-900 font-semibold">3.6 MB</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Format</span>
                <span className="text-sm text-gray-900 font-semibold">JPEG</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Color Space</span>
                <span className="text-sm text-gray-900 font-semibold">sRGB</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Compression</span>
                <span className="text-sm text-gray-900 font-semibold">85% Quality</span>
              </div>
            </div>
          </div>

          {/* Image Properties */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              Image Properties
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Resolution</span>
                <span className="text-sm text-gray-900 font-semibold">4032 × 3024 px</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Aspect Ratio</span>
                <span className="text-sm text-gray-900 font-semibold">4:3</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">DPI</span>
                <span className="text-sm text-gray-900 font-semibold">72 × 72</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Bit Depth</span>
                <span className="text-sm text-gray-900 font-semibold">24-bit</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Orientation</span>
                <span className="text-sm text-gray-900 font-semibold">Landscape</span>
              </div>
            </div>
          </div>

          {/* Camera Information */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-green-600" />
              Camera Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Camera Make</span>
                <span className="text-sm text-gray-900 font-semibold">Apple</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Camera Model</span>
                <span className="text-sm text-gray-900 font-semibold">iPhone 14 Pro</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Lens</span>
                <span className="text-sm text-gray-900 font-semibold">Main Camera</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Focal Length</span>
                <span className="text-sm text-gray-900 font-semibold">6.86 mm</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Aperture</span>
                <span className="text-sm text-gray-900 font-semibold">f/1.78</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">ISO</span>
                <span className="text-sm text-gray-900 font-semibold">125</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Shutter Speed</span>
                <span className="text-sm text-gray-900 font-semibold">1/120 sec</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Flash</span>
                <span className="text-sm text-gray-900 font-semibold">Off</span>
              </div>
            </div>
          </div>

          {/* Date & Location */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Date & Location
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Date Taken</span>
                <span className="text-sm text-gray-900 font-semibold">May 3, 2026, 2:45 PM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Date Modified</span>
                <span className="text-sm text-gray-900 font-semibold">May 4, 2026, 10:22 AM</span>
              </div>
              <div className="flex items-start justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">GPS Coordinates</span>
                <div className="text-right">
                  <div className="text-sm text-gray-900 font-mono">37.7749° N</div>
                  <div className="text-sm text-gray-900 font-mono">122.4194° W</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Location</span>
                </div>
                <span className="text-sm text-gray-900 font-semibold">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Software & Processing */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Software & Processing</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Software</span>
                <span className="text-sm text-gray-900 font-semibold">iOS 17.4</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Processing</span>
                <span className="text-sm text-gray-900 font-semibold">HDR, Smart HDR 5</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Color Profile</span>
                <span className="text-sm text-gray-900 font-semibold">Display P3</span>
              </div>
            </div>
          </div>

          {/* Metadata Status */}
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <div className="font-semibold text-gray-900 mb-1">Metadata Status</div>
                <p>
                  Some EXIF data appears to have been modified after capture. Date modified is newer than date taken, suggesting post-processing or editing.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/result")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow"
          >
            Back to Results
          </button>
        </div>
      </div>
    </div>
  );
}
