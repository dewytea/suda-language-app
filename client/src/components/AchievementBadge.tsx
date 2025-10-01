import { Card } from "@/components/ui/card";
import { Trophy, Lock } from "lucide-react";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon?: string;
  unlocked: boolean;
}

export function AchievementBadge({ title, description, icon = "🏆", unlocked }: AchievementBadgeProps) {
  return (
    <Card
      className={`p-4 text-center transition-all ${
        unlocked ? "hover-elevate active-elevate-2" : "opacity-50"
      }`}
      data-testid={`card-achievement-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="space-y-2">
        <div className="relative inline-block">
          <div className={`text-4xl ${!unlocked && "grayscale"}`}>{icon}</div>
          {!unlocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}
