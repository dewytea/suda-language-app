import { Coins } from "lucide-react";

interface PointsDisplayProps {
  points: number;
}

export function PointsDisplay({ points }: PointsDisplayProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-accent rounded-md" data-testid="display-points">
      <Coins className="h-5 w-5 text-yellow-500" />
      <span className="font-bold text-lg">{points.toLocaleString()}</span>
      <span className="text-sm text-muted-foreground">points</span>
    </div>
  );
}
