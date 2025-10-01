import { AchievementBadge } from "@/components/AchievementBadge";
import { Card } from "@/components/ui/card";
import { Award, Trophy } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";

export default function Achievements() {
  const achievements = [
    { title: "First Steps", description: "Complete your first lesson", icon: "🎯", unlocked: true },
    { title: "Week Warrior", description: "Maintain a 7-day streak", icon: "🔥", unlocked: true },
    { title: "Speaking Star", description: "Complete 10 speaking lessons", icon: "🎤", unlocked: true },
    { title: "Bookworm", description: "Read 5 stories", icon: "📚", unlocked: true },
    { title: "Good Listener", description: "Complete 10 listening exercises", icon: "👂", unlocked: false },
    { title: "Master Writer", description: "Write 20 essays", icon: "✍️", unlocked: false },
    { title: "Polyglot", description: "Learn 3 languages", icon: "🌍", unlocked: false },
    { title: "Century Club", description: "Earn 100 points", icon: "💯", unlocked: true },
    { title: "Dedication", description: "30-day streak", icon: "⭐", unlocked: false },
  ];

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
          value={5} 
          max={9} 
          label="Achievements Unlocked" 
          showPercentage={false}
        />
        <p className="text-sm text-muted-foreground">5 of 9 achievements unlocked</p>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <AchievementBadge
            key={achievement.title}
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
