import { Trophy, X } from 'lucide-react';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  minutes: number;
}

const achievements = {
  10: {
    title: '10분 달성!',
    description: '10분간 집중해서 대화했어요',
    message: '꾸준한 연습이 실력을 만들어요!'
  },
  20: {
    title: '20분 달성!',
    description: '20분간 열심히 대화했어요',
    message: '정말 잘하고 계세요! 계속 이어가세요!'
  },
  30: {
    title: '30분 달성!',
    description: '30분간 끈기있게 대화했어요',
    message: '대단해요! 이렇게 하면 빠르게 실력이 늘어요!'
  }
};

export default function AchievementModal({ isOpen, onClose, minutes }: AchievementModalProps) {
  if (!isOpen) return null;

  const achievement = achievements[minutes as keyof typeof achievements] || achievements[10];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        data-testid="overlay-achievement-modal"
      />
      
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full p-8 animate-bounce-in border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover-elevate active-elevate-2 rounded-md"
          data-testid="button-close-achievement"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
            <Trophy className="w-12 h-12 text-white" data-testid="icon-achievement-trophy" />
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-2" data-testid="text-achievement-title">
            {achievement.title}
          </h3>
          
          <p className="text-muted-foreground mb-4" data-testid="text-achievement-description">
            {achievement.description}
          </p>

          <div className="bg-primary/10 rounded-lg p-4 mb-6">
            <p className="text-sm text-foreground font-medium">
              {achievement.message}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover-elevate active-elevate-2 font-medium"
            data-testid="button-continue-achievement"
          >
            계속 대화하기
          </button>
        </div>
      </div>
    </div>
  );
}
