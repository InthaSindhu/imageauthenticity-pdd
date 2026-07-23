import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Upload, Image } from "lucide-react";

export function UploadDragOverScreen() {
  const navigate = useNavigate();
  const [isDragging] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/home")}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Upload Image</h1>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div
            className={`bg-white rounded-3xl border-2 border-dashed p-12 text-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50 scale-105 shadow-xl'
                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all ${
                isDragging ? 'bg-blue-600 scale-110' : 'bg-blue-100'
              }`}
            >
              <Upload className={`w-10 h-10 transition-all ${isDragging ? 'text-white' : 'text-blue-600'}`} />
            </div>
            <h3
              className={`text-xl font-semibold mb-2 transition-colors ${
                isDragging ? 'text-blue-600' : 'text-gray-900'
              }`}
            >
              {isDragging ? 'Drop your image here' : 'Choose an image'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isDragging ? 'Release to upload' : 'Tap to browse your gallery'}
            </p>
            {!isDragging && (
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <Image className="w-4 h-4" />
                <span>Supports JPG, PNG, WebP</span>
              </div>
            )}
          </div>

          {isDragging && (
            <div className="mt-6 bg-blue-50 rounded-2xl p-4 border border-blue-200 animate-pulse">
              <p className="text-center text-sm text-blue-700 font-medium">
                Ready to upload your file
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
