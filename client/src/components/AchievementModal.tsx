import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AchievementModalProps {
  title: string;
  message: string;
  icon: LucideIcon;
  xpReward?: number;
  badge?: string;
  stats?: string;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  onClose: () => void;
}

export function AchievementModal({
  title,
  message,
  icon: IconComponent,
  xpReward,
  badge,
  stats,
  primaryAction,
  secondaryAction,
  onClose,
}: AchievementModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <Card className="relative z-10 w-full max-w-md p-8 shadow-2xl animate-in zoom-in slide-in-from-top duration-500">
        <div className="text-center space-y-6">
          {/* Icon with animation */}
          <div className="flex items-center justify-center animate-in zoom-in duration-700 delay-150">
            <IconComponent className="w-20 h-20 text-primary" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>

          {/* Message */}
          <p className="text-lg text-muted-foreground">{message}</p>

          {/* Stats */}
          {stats && (
            <p className="text-md font-medium text-foreground">{stats}</p>
          )}

          {/* Badge */}
          {badge && (
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="font-semibold text-primary">{badge}</p>
            </div>
          )}

          {/* XP Reward */}
          {xpReward && (
            <div className="inline-block px-6 py-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                +{xpReward} XP 획득!
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {secondaryAction && (
              <Button
                variant="outline"
                onClick={secondaryAction.onClick}
                className="flex-1"
                data-testid="button-achievement-secondary"
              >
                {secondaryAction.label}
              </Button>
            )}
            <Button
              onClick={primaryAction.onClick}
              className="flex-1"
              data-testid="button-achievement-primary"
            >
              {primaryAction.label}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
