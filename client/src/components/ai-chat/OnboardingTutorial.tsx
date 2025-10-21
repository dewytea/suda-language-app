import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Bot, Clapperboard, GraduationCap, Lightbulb } from 'lucide-react';

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    title: 'AI 대화 파트너와 함께해요',
    description: 'AI와 자유롭게 대화하며 언어 실력을 키워보세요. 실수해도 괜찮아요!',
    icon: Bot
  },
  {
    title: '시나리오를 선택하세요',
    description: '자유 대화부터 식당, 호텔, 면접까지 다양한 상황을 연습할 수 있어요.',
    icon: Clapperboard
  },
  {
    title: '학습 모드를 활용하세요',
    description: '학습 모드를 켜면 AI가 문법을 교정하고 더 나은 표현을 제안해줘요.',
    icon: GraduationCap
  },
  {
    title: '주제 제안을 활용하세요',
    description: '무슨 말을 해야 할지 모르겠다면 제안된 주제를 클릭해보세요!',
    icon: Lightbulb
  }
];

export default function OnboardingTutorial({ isOpen, onClose }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  if (!isOpen) return null;
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('ai_chat_tutorial_completed', 'true');
      onClose();
    }
  };
  
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    localStorage.setItem('ai_chat_tutorial_completed', 'true');
    onClose();
  };
  
  const step = steps[currentStep];
  const Icon = step.icon;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleSkip}
        data-testid="overlay-onboarding"
      />
      
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-lg w-full p-8 border">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-1 hover-elevate active-elevate-2 rounded-md"
          data-testid="button-skip-onboarding"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full mb-6">
            <Icon className="w-12 h-12 text-white" data-testid={`icon-onboarding-step-${currentStep}`} />
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-3" data-testid="text-onboarding-title">
            {step.title}
          </h3>
          
          <p className="text-muted-foreground mb-8" data-testid="text-onboarding-description">
            {step.description}
          </p>
          
          {/* 진행 표시 */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted'
                }`}
                data-testid={`progress-dot-${idx}`}
              />
            ))}
          </div>
          
          {/* 버튼 */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex-1 py-3 border border-border text-foreground rounded-lg hover-elevate active-elevate-2 flex items-center justify-center gap-2"
                data-testid="button-onboarding-prev"
              >
                <ChevronLeft className="w-5 h-5" />
                이전
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover-elevate active-elevate-2 flex items-center justify-center gap-2"
              data-testid="button-onboarding-next"
            >
              {currentStep === steps.length - 1 ? '시작하기' : '다음'}
              {currentStep < steps.length - 1 && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
          
          <button
            onClick={handleSkip}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-skip-tutorial"
          >
            건너뛰기
          </button>
        </div>
      </div>
    </div>
  );
}
