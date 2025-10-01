import { LevelBadge } from "../LevelBadge";

export default function LevelBadgeExample() {
  return (
    <div className="p-8 space-y-4">
      <LevelBadge level={1} />
      <LevelBadge level={4} />
      <LevelBadge level={8} />
    </div>
  );
}
