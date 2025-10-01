import { AchievementBadge } from "../AchievementBadge";

export default function AchievementBadgeExample() {
  return (
    <div className="p-8 grid grid-cols-3 gap-4 max-w-2xl">
      <AchievementBadge
        title="First Steps"
        description="Complete your first lesson"
        icon="🎯"
        unlocked={true}
      />
      <AchievementBadge
        title="Week Warrior"
        description="7-day streak"
        icon="🔥"
        unlocked={true}
      />
      <AchievementBadge
        title="Polyglot"
        description="Learn 3 languages"
        icon="🌍"
        unlocked={false}
      />
    </div>
  );
}
