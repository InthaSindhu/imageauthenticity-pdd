import { useNavigate } from "react-router";
import { ArrowLeft, TrendingUp, Brain, AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";

export function AIConfidenceBreakdown() {
  const navigate = useNavigate();

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
          <h1 className="text-xl font-bold text-gray-900">AI Confidence Breakdown</h1>
          <p className="text-xs text-gray-600">Classification Analysis</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto w-full space-y-6">
          {/* Visual Breakdown - Pie Chart Style */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Classification Distribution
            </h2>

            {/* Circular Progress Indicator */}
            <div className="relative w-64 h-64 mx-auto mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">58%</div>
                  <div className="text-sm text-gray-600">Total Score</div>
                </div>
              </div>
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Real/Authentic - Green */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="20"
                  strokeDasharray="75.4 251.2"
                  strokeDashoffset="0"
                />
                {/* Suspicious - Amber */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="20"
                  strokeDasharray="62.8 251.2"
                  strokeDashoffset="-75.4"
                />
                {/* Fake/Manipulated - Red */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray="113 251.2"
                  strokeDashoffset="-138.2"
                />
              </svg>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">Real</span>
                </div>
                <div className="text-2xl font-bold text-green-600">30%</div>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">Suspicious</span>
                </div>
                <div className="text-2xl font-bold text-amber-600">25%</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">Fake</span>
                </div>
                <div className="text-2xl font-bold text-red-600">45%</div>
              </div>
            </div>
          </div>

          {/* Confidence Levels */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Confidence Levels by Category
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Authentic Content</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Elements matching natural photography patterns
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-900">Suspicious Patterns</span>
                  </div>
                  <span className="text-sm font-semibold text-amber-600">25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Inconclusive indicators requiring further review
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-gray-900">Manipulated Content</span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Clear signs of digital manipulation or AI generation
                </p>
              </div>
            </div>
          </div>

          {/* AI Model Details */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Model Analysis Details</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Deep Learning Model</span>
                <span className="text-sm text-gray-900 font-semibold">CNN v3.2</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Training Dataset</span>
                <span className="text-sm text-gray-900 font-semibold">2.5M images</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Model Accuracy</span>
                <span className="text-sm text-gray-900 font-semibold">98.2%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Last Updated</span>
                <span className="text-sm text-gray-900 font-semibold">May 1, 2026</span>
              </div>
            </div>
          </div>

          {/* Understanding the Score */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Understanding Your Score</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <strong>58% overall score</strong> indicates uncertainty. The AI detected conflicting signals:
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>30% authentic patterns suggest some original content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>45% manipulation indicators point to editing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>25% inconclusive data requires human review</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/result-uncertain")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow"
          >
            View Full Results
          </button>
        </div>
      </div>
    </div>
  );
}
