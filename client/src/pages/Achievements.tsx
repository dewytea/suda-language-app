import { AchievementBadge } from "@/components/AchievementBadge";
import { Card } from "@/components/ui/card";
import { Award, Trophy } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { useQuery } from "@tanstack/react-query";
import type { Achievement } from "@shared/schema";

export default function Achievements() {
  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Award className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="font-serif font-bold text-4xl">Achievements</h1>
          <p className="text-muted-foreground mt-1">Track your progress and unlock rewards</p>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-primary" />
          <h2 className="font-semibold text-xl">Overall Progress</h2>
        </div>
        <ProgressBar 
          value={unlockedCount} 
          max={totalCount} 
          label="Achievements Unlocked" 
          showPercentage={false}
        />
        <p className="text-sm text-muted-foreground">
          {unlockedCount} of {totalCount} achievements unlocked
        </p>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            title={achievement.title}
            description={achievement.description}
            icon={achievement.icon}
            unlocked={achievement.unlocked}
          />
        ))}
      </div>
    </div>
  );
}
