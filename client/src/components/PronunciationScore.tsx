import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PronunciationScoreProps {
  score: number;
}

export function PronunciationScore({ score }: PronunciationScoreProps) {
  const getScoreColor = () => {
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-yellow-500";
    return "text-destructive";
  };

  const getScoreLabel = () => {
    if (score >= 80) return "Excellent!";
    if (score >= 60) return "Good";
    return "Keep practicing";
  };

  return (
    <Card className="p-6 space-y-4" data-testid="card-pronunciation-score">
      <div className="text-center">
        <div className={`text-6xl font-bold ${getScoreColor()}`}>{score}</div>
        <p className="text-sm text-muted-foreground mt-2">{getScoreLabel()}</p>
      </div>
      <Progress value={score} className="h-3" />
    </Card>
  );
}
