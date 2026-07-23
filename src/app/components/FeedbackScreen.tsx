import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MessageSquare, AlertCircle, CheckCircle2, Send, Loader2, Star } from "lucide-react";
import { api } from "../services/api";

const ISSUE_TYPES = [
  {
    id: "false-positive",
    label: "False Positive",
    desc: "The image was flagged as fake, but it's actually authentic",
  },
  {
    id: "false-negative",
    label: "False Negative",
    desc: "The image was marked authentic, but it's actually manipulated",
  },
  {
    id: "incorrect-score",
    label: "Incorrect Confidence Score",
    desc: "The confidence percentage doesn't match the actual result",
  },
  {
    id: "other",
    label: "Other Issue",
    desc: "Something else went wrong with the analysis",
  },
];

export function FeedbackScreen() {
  const navigate = useNavigate();
  const [issueType, setIssueType] = useState<string>("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = issueType && feedback.trim().length > 0 && rating > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.sendFeedback(rating, feedback.trim(), issueType);
      setSubmitted(true);
      setTimeout(() => navigate("/home"), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Report Feedback</h1>
          <p className="text-xs text-gray-600">Help us improve detection accuracy</p>
        </div>
      </div>

      {submitted ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your feedback has been submitted. Our team will review it to improve detection algorithms.
            </p>
            <div className="animate-pulse text-sm text-gray-500">Returning to home...</div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto w-full space-y-6">

            {/* Star Rating */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Rate Your Experience
              </h2>
              <div className="flex items-center justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= (hoveredStar || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-gray-600 mt-3">
                  {rating === 1 ? 'Very Poor' : rating === 2 ? 'Poor' : rating === 3 ? 'Average' : rating === 4 ? 'Good' : 'Excellent!'}
                </p>
              )}
            </div>

            {/* Issue Type Selection */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                What went wrong?
              </h2>
              <div className="space-y-3">
                {ISSUE_TYPES.map((issue) => (
                  <button
                    key={issue.id}
                    onClick={() => setIssueType(issue.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      issueType === issue.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-gray-900 mb-1">{issue.label}</div>
                    <div className="text-sm text-gray-600">{issue.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Tell us more
              </h2>
              <textarea
                placeholder="Please provide details about what you expected vs. what you received. Any additional context helps us improve our algorithms."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value.slice(0, 500))}
                className="w-full h-40 p-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              />
              <div className={`text-xs mt-2 text-right ${feedback.length >= 490 ? 'text-red-500' : 'text-gray-500'}`}>
                {feedback.length} / 500 characters
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
              <div className="text-sm text-gray-700">
                <div className="font-semibold text-gray-900 mb-2">Your Privacy</div>
                <p>
                  Your feedback is used solely to improve our detection models in accordance with our privacy policy.
                </p>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pb-6">
              <button
                onClick={() => navigate(-1)}
                className="py-4 px-6 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className={`py-4 px-6 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  canSubmit && !submitting
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
