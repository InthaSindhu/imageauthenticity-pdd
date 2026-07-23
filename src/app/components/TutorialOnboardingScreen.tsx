import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, Zap, Shield, CheckCircle2, ArrowRight, X } from "lucide-react";

export function TutorialOnboardingScreen() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Upload,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      title: "Upload Your Image",
      description: "Take a photo or select an image from your gallery. We support JPG, PNG, and other common formats.",
      image: "📸",
    },
    {
      icon: Zap,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      title: "AI Analysis",
      description: "Our advanced AI scans your image for signs of manipulation, AI generation, and authenticity markers.",
      image: "🔍",
    },
    {
      icon: Shield,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      title: "Get Results",
      description: "Receive a detailed authenticity score with confidence breakdown, metadata analysis, and recommendations.",
      image: "✅",
    },
    {
      icon: CheckCircle2,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
      title: "Review & Share",
      description: "Save results to your history, share reports with others, and track your verification activity over time.",
      image: "📊",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/home");
    }
  };

  const handleSkip = () => {
    navigate("/home");
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex flex-col">
      {/* Skip Button */}
      <div className="px-6 py-4 flex justify-end">
        <button
          onClick={handleSkip}
          className="text-white/80 hover:text-white flex items-center gap-1 text-sm font-medium"
        >
          Skip
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="max-w-md w-full text-center">
          {/* Image/Icon Display */}
          <div className="mb-8">
            <div className={`w-32 h-32 ${currentStepData.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <Icon className={`w-16 h-16 ${currentStepData.iconColor}`} />
            </div>
            <div className="text-6xl mb-6">{currentStepData.image}</div>
          </div>

          {/* Text Content */}
          <h1 className="text-3xl font-bold text-white mb-4">
            {currentStepData.title}
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            {currentStepData.description}
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-6 pb-8">
        <div className="max-w-md mx-auto w-full space-y-6">
          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-white"
                    : index < currentStep
                    ? "w-2 bg-white/60"
                    : "w-2 bg-white/30"
                }`}
              ></div>
            ))}
          </div>

          {/* Next/Get Started Button */}
          <button
            onClick={handleNext}
            className="w-full bg-white text-purple-600 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            {currentStep < steps.length - 1 ? (
              <>
                Next
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Get Started
                <CheckCircle2 className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Step Counter */}
          <div className="text-center text-white/60 text-sm">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>
    </div>
  );
}
