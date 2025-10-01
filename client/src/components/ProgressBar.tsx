import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ value, max = 100, label, showPercentage = true }: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="space-y-2" data-testid="progress-bar">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="font-medium">{label}</span>}
          {showPercentage && <span className="text-muted-foreground">{percentage}%</span>}
        </div>
      )}
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
