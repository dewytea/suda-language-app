import { SkillCard } from "../SkillCard";
import { Mic } from "lucide-react";

export default function SkillCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <SkillCard
        title="Speaking"
        icon={Mic}
        duration="30 min"
        progress={65}
        color="speaking"
        onClick={() => console.log('Speaking clicked')}
      />
    </div>
  );
}
