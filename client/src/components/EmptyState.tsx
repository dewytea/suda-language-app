import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  progress?: {
    current: number;
    total: number;
  };
}

export function EmptyState({
  icon: IconComponent,
  title,
  description,
  actionLabel,
  onAction,
  progress,
}: EmptyStateProps) {
  return (
    <Card className="w-full max-w-md mx-auto p-12">
      <div className="text-center space-y-6">
        {/* Icon */}
        <div className="flex items-center justify-center">
          <IconComponent className="w-16 h-16 text-muted-foreground/50" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold">{title}</h3>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {description}
        </p>

        {/* Progress Bar */}
        {progress && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              현재 진행률: {progress.current}/{progress.total}
            </p>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={onAction}
          size="lg"
          className="w-full"
          data-testid="button-empty-state-action"
        >
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
}
