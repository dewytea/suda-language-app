import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, CheckCircle2 } from "lucide-react";

interface DailyGoalProgressProps {
  speakingProgress: number;
  readingProgress: number;
  listeningProgress: number;
  writingProgress: number;
}

export function DailyGoalProgress({
  speakingProgress,
  readingProgress,
  listeningProgress,
  writingProgress,
}: DailyGoalProgressProps) {
  const totalProgress = speakingProgress + readingProgress + listeningProgress + writingProgress;
  const totalGoal = 60; // 30 + 10 + 10 + 10 minutes
  const overallPercentage = Math.min((totalProgress / totalGoal) * 100, 100);
  const isComplete = totalProgress >= totalGoal;

  return (
    <Card className="p-6 space-y-4" data-testid="card-daily-goal">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          ) : (
            <Target className="h-6 w-6 text-primary" />
          )}
          <h3 className="font-semibold text-lg">오늘의 목표</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{totalProgress}분</p>
          <p className="text-xs text-muted-foreground">/ {totalGoal}분</p>
        </div>
      </div>

      <Progress value={overallPercentage} className="h-3" />

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">말하기</span>
            <span className="font-medium">{speakingProgress}/30분</span>
          </div>
          <Progress value={(speakingProgress / 30) * 100} className="h-1" />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">읽기</span>
            <span className="font-medium">{readingProgress}/10분</span>
          </div>
          <Progress value={(readingProgress / 10) * 100} className="h-1" />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">듣기</span>
            <span className="font-medium">{listeningProgress}/10분</span>
          </div>
          <Progress value={(listeningProgress / 10) * 100} className="h-1" />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">쓰기</span>
            <span className="font-medium">{writingProgress}/10분</span>
          </div>
          <Progress value={(writingProgress / 10) * 100} className="h-1" />
        </div>
      </div>

      {isComplete && (
        <div className="pt-3 border-t flex items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            오늘의 목표를 달성했습니다!
          </p>
        </div>
      )}
    </Card>
  );
}
