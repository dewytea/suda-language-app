import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, LucideIcon } from 'lucide-react';

interface ErrorModalProps {
  icon?: LucideIcon;
  title: string;
  message: string;
  tips?: string[];
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  onClose: () => void;
}

export function ErrorModal({
  icon: IconComponent,
  title,
  message,
  tips,
  primaryAction,
  secondaryAction,
  onClose,
}: ErrorModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <Card className="relative z-10 w-full max-w-md p-8 shadow-2xl animate-in zoom-in slide-in-from-bottom duration-300">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex items-center justify-center">
            {IconComponent ? (
              <IconComponent className="w-16 h-16 text-destructive" />
            ) : (
              <AlertCircle className="w-16 h-16 text-destructive" />
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold">{title}</h3>

          {/* Message */}
          <p className="text-muted-foreground whitespace-pre-line">{message}</p>

          {/* Tips */}
          {tips && tips.length > 0 && (
            <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20 text-left">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-semibold text-blue-600 dark:text-blue-400">
                    팁:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {tips.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {secondaryAction && (
              <Button
                variant="outline"
                onClick={secondaryAction.onClick}
                className="flex-1"
                data-testid="button-error-secondary"
              >
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                onClick={primaryAction.onClick}
                className="flex-1"
                data-testid="button-error-primary"
              >
                {primaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
