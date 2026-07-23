import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, HelpCircle, ChevronDown, Shield, Upload, Eye, Clock, Mail, MessageCircle } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How does image verification work?",
    answer: "Our AI-powered system analyzes multiple aspects of your image including metadata, pixel patterns, compression artifacts, and digital signatures. The verification process checks for signs of manipulation, AI generation, and authenticity markers to provide a confidence score."
  },
  {
    question: "What file formats are supported?",
    answer: "VerifyImage supports JPG, PNG, WebP, and HEIC image formats. For best results, upload the original, uncompressed version of your image. Maximum file size is 25MB per image."
  },
  {
    question: "How accurate is the verification?",
    answer: "Our verification system has a 98% accuracy rate when analyzing images. However, results depend on image quality, file metadata availability, and the complexity of any modifications. We provide a confidence score to help you understand the reliability of each result."
  },
  {
    question: "How long does verification take?",
    answer: "Most verifications complete in 2-5 seconds depending on image size and complexity. Larger files or images requiring deeper analysis may take up to 10 seconds. You'll receive a notification when your scan is complete."
  },
  {
    question: "Is my data secure and private?",
    answer: "Yes! All images are encrypted during upload and analysis. We never share your images with third parties. Images are processed securely and automatically deleted from our servers after 30 days. You can delete your verification history anytime."
  },
  {
    question: "What does the confidence score mean?",
    answer: "The confidence score (0-100%) indicates how certain our system is about the verification result. 90%+ means highly authentic, 60-89% indicates possible modifications, and below 60% suggests significant manipulation or AI generation."
  },
  {
    question: "Can I verify multiple images at once?",
    answer: "Currently, VerifyImage processes one image at a time for optimal accuracy. Batch processing is coming soon in a future update. You can queue multiple verifications by uploading images one after another."
  },
  {
    question: "What if I get an uncertain result?",
    answer: "An uncertain result means our system found conflicting indicators. Try uploading the original, highest-quality version of the image. Check the detailed report for specific issues detected, and consider factors like image compression or format conversion."
  },
];

export function HelpFAQScreen() {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/settings")}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Help & FAQ</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-2xl mx-auto w-full space-y-6">
          {/* Quick Start Guide */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">How to Use VerifyImage</h2>
                <p className="text-blue-100 text-sm">Quick start guide</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                  1
                </div>
                <div>
                  <div className="font-semibold mb-1">Upload or Capture Image</div>
                  <p className="text-blue-100 text-sm">Select an image from your gallery or take a new photo using your camera.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                  2
                </div>
                <div>
                  <div className="font-semibold mb-1">Wait for Analysis</div>
                  <p className="text-blue-100 text-sm">Our AI system will analyze the image for authenticity in just seconds.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                  3
                </div>
                <div>
                  <div className="font-semibold mb-1">Review Results</div>
                  <p className="text-blue-100 text-sm">Check the confidence score and detailed analysis report for verification details.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Classification Guidelines */}
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">
            <h3 className="font-bold text-gray-900 text-lg border-b pb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Image Classification Guidelines
            </h3>

            {/* Real Image card */}
            <div className="border border-green-200 bg-green-50/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-green-700 font-bold">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                Real (Authentic) Image
              </div>
              <p className="text-sm text-gray-700">An image is classified as Real if:</p>
              <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                <li>It is captured directly by a camera.</li>
                <li>No objects have been added or removed.</li>
                <li>No regions have been copied and pasted.</li>
                <li>The image has not been altered using editing software.</li>
                <li>Lighting, shadows, and textures appear natural and consistent.</li>
              </ul>
              <div className="pt-2 border-t border-green-100">
                <span className="text-xs font-semibold text-green-800">Examples:</span>
                <p className="text-[11px] text-gray-600 italic">Original selfie from a mobile phone, unedited landscape photograph, original CCTV image, raw camera image.</p>
              </div>
            </div>

            {/* Fake Image card */}
            <div className="border border-red-200 bg-red-50/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-700 font-bold">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                Fake (Manipulated) Image
              </div>
              <p className="text-sm text-gray-700">An image is classified as Fake if:</p>
              <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                <li>Objects have been added, removed, or modified.</li>
                <li>Parts of the image are copied and pasted.</li>
                <li>Faces are swapped using AI.</li>
                <li>The image is generated by AI tools.</li>
                <li>Editing software has significantly changed the original content.</li>
              </ul>
              <div className="pt-2 border-t border-red-100">
                <span className="text-xs font-semibold text-red-800">Examples:</span>
                <p className="text-[11px] text-gray-600 italic">Person added into a group photo, object removed from a scene, deepfake face image, AI-generated human face, heavily edited photo.</p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                <Upload className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900 text-sm mb-1">Multiple Upload Options</div>
                  <p className="text-xs text-gray-600">Upload from gallery or take photos directly</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900 text-sm mb-1">Advanced AI Detection</div>
                  <p className="text-xs text-gray-600">Multi-layer analysis for accurate results</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                <Eye className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900 text-sm mb-1">Detailed Reports</div>
                  <p className="text-xs text-gray-600">Comprehensive analysis with explanations</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900 text-sm mb-1">Verification History</div>
                  <p className="text-xs text-gray-600">Access all past scans and results</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform ${
                        expandedIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedIndex === index && (
                    <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Need More Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-2xl font-semibold hover:shadow-xl transition-shadow flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                Email Support
              </button>
              <button className="w-full bg-white border border-gray-300 text-gray-700 py-3.5 rounded-2xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Live Chat
              </button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 pb-6">
            VerifyImage v1.0.0 • Last updated May 5, 2026
          </div>
        </div>
      </div>
    </div>
  );
}
