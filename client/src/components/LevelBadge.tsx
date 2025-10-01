import { Badge } from "@/components/ui/badge";

interface LevelBadgeProps {
  level: number;
  maxLevel?: number;
}

export function LevelBadge({ level, maxLevel = 10 }: LevelBadgeProps) {
  const getLevelLabel = () => {
    if (level <= 3) return "초급";
    if (level <= 6) return "중급";
    return "고급";
  };

  return (
    <Badge variant="outline" className="font-semibold" data-testid={`badge-level-${level}`}>
      Level {level}/{maxLevel} · {getLevelLabel()}
    </Badge>
  );
}
