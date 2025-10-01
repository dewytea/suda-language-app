import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { LucideIcon } from "lucide-react";

interface SkillCardProps {
  title: string;
  icon: LucideIcon;
  duration: string;
  progress: number;
  color: "speaking" | "reading" | "listening" | "writing";
  onClick: () => void;
}

export function SkillCard({ title, icon: Icon, duration, progress, color, onClick }: SkillCardProps) {
  const colorClasses = {
    speaking: "text-skill-speaking",
    reading: "text-skill-reading",
    listening: "text-skill-listening",
    writing: "text-skill-writing",
  };

  return (
    <Card className="p-6 space-y-4 hover-elevate active-elevate-2 transition-all" data-testid={`card-skill-${title.toLowerCase()}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`${colorClasses[color]}`}>
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-serif font-semibold text-xl">{title}</h3>
            <p className="text-sm text-muted-foreground">{duration}</p>
          </div>
        </div>
      </div>
      <ProgressBar value={progress} showPercentage={true} />
      <Button className="w-full" onClick={onClick} data-testid={`button-start-${title.toLowerCase()}`}>
        Start Practice
      </Button>
    </Card>
  );
}
