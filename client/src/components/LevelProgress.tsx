import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

interface LevelProgressProps {
  currentLevel: number;
  totalPoints: number;
  nextLevelPoints?: number;
}

export function LevelProgress({ currentLevel, totalPoints, nextLevelPoints = 1000 }: LevelProgressProps) {
  const clampedLevel = Math.max(1, Math.min(currentLevel, 15));
  const pointsForCurrentLevel = (clampedLevel - 1) * 1000;
  const pointsInCurrentLevel = Math.max(0, totalPoints - pointsForCurrentLevel);
  const progressPercentage = Math.min((pointsInCurrentLevel / nextLevelPoints) * 100, 100);

  const getLevelDescription = () => {
    if (clampedLevel <= 5) {
      return {
        title: "초급 단계",
        description: "기본적인 인사말과 간단한 문장을 배우고 있습니다.",
        nextGoal: "일상 대화의 기초를 다지세요"
      };
    }
    if (clampedLevel <= 10) {
      return {
        title: "중급 단계",
        description: "복잡한 문장과 다양한 상황에서의 대화를 익히고 있습니다.",
        nextGoal: "더 자연스러운 표현을 구사하세요"
      };
    }
    return {
      title: "고급 단계",
      description: "원어민 수준의 유창한 소통을 목표로 하고 있습니다.",
      nextGoal: "완벽한 언어 구사력을 향해 나아가세요"
    };
  };

  const levelInfo = getLevelDescription();

  return (
    <Card className="p-6 space-y-4" data-testid="card-level-progress">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {levelInfo.title}
          </h3>
          <p className="text-sm text-muted-foreground">{levelInfo.description}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">Level {clampedLevel}</p>
          <p className="text-xs text-muted-foreground">최대 15</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">다음 레벨까지</span>
          <span className="font-medium">{pointsInCurrentLevel}/{nextLevelPoints} 포인트</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <div className="pt-2 border-t">
        <p className="text-sm font-medium text-primary">{levelInfo.nextGoal}</p>
      </div>
    </Card>
  );
}
