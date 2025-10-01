import { Badge } from "@/components/ui/badge";

interface LevelBadgeProps {
  level: number;
  maxLevel?: number;
  showDescription?: boolean;
}

export function LevelBadge({ level, maxLevel = 15, showDescription = false }: LevelBadgeProps) {
  const clampedLevel = Math.max(1, Math.min(level, 15));
  
  const getLevelInfo = () => {
    if (clampedLevel <= 5) {
      return {
        label: "초급",
        tier: clampedLevel,
        description: "기본 회화와 간단한 문장 이해"
      };
    }
    if (clampedLevel <= 10) {
      return {
        label: "중급",
        tier: clampedLevel - 5,
        description: "일상 대화와 복잡한 표현 구사"
      };
    }
    return {
      label: "고급",
      tier: Math.min(clampedLevel - 10, 5),
      description: "원어민 수준의 유창한 소통"
    };
  };

  const levelInfo = getLevelInfo();

  return (
    <div className="space-y-2">
      <Badge variant="outline" className="font-semibold" data-testid={`badge-level-${clampedLevel}`}>
        Level {clampedLevel}/{maxLevel} · {levelInfo.label} {levelInfo.tier}
      </Badge>
      {showDescription && (
        <p className="text-xs text-muted-foreground">{levelInfo.description}</p>
      )}
    </div>
  );
}
