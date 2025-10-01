import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StreakDisplayProps {
  days: number;
}

export function StreakDisplay({ days }: StreakDisplayProps) {
  return (
    <Badge variant="secondary" className="gap-2 px-4 py-2" data-testid="badge-streak">
      <Flame className="h-5 w-5 text-orange-500" />
      <span className="font-bold text-lg">{days}</span>
      <span className="text-sm">day streak</span>
    </Badge>
  );
}
