import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, LucideIcon } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface TutorialProps {
  steps: TutorialStep[];
  storageKey: string;
  onComplete: () => void;
  onSkip: () => void;
}

export function Tutorial({ steps, storageKey, onComplete, onSkip }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem(storageKey, 'true');
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(storageKey, 'true');
    onSkip();
  };

  const step = steps[currentStep];
  const IconComponent = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" />

      {/* Tutorial Card */}
      <Card className="relative z-10 w-full max-w-md mx-4 p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-tutorial-close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex items-center justify-center animate-in zoom-in duration-500 delay-150">
            <IconComponent className="w-16 h-16 text-primary" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold">{step.title}</h3>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {step.description}
          </p>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-primary'
                    : index < currentStep
                    ? 'w-2 bg-primary/50'
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="flex-1"
                data-testid="button-tutorial-prev"
              >
                이전
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1"
              data-testid="button-tutorial-next"
            >
              {currentStep === steps.length - 1 ? '시작하기' : '다음'}
            </Button>
          </div>

          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-tutorial-skip"
          >
            건너뛰기
          </button>
        </div>
      </Card>
    </div>
  );
}
