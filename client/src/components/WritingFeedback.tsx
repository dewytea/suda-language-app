import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";

interface Correction {
  original: string;
  corrected: string;
  type: "grammar" | "vocabulary" | "spelling";
}

interface WritingFeedbackProps {
  score: number;
  corrections: Correction[];
  suggestions: string[];
}

export function WritingFeedback({ score, corrections, suggestions }: WritingFeedbackProps) {
  const getCorrectionIcon = (type: string) => {
    return type === "grammar" ? "G" : type === "vocabulary" ? "V" : "S";
  };

  return (
    <Card className="p-6 space-y-6" data-testid="card-writing-feedback">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-xl">Feedback</h3>
        <div className="flex items-center gap-2">
          <div className="text-3xl font-bold text-primary">{score}</div>
          <div className="text-sm text-muted-foreground">/100</div>
        </div>
      </div>

      {corrections.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Corrections
          </h4>
          {corrections.map((correction, idx) => (
            <div key={idx} className="p-3 bg-muted rounded-md space-y-2" data-testid={`correction-${idx}`}>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {getCorrectionIcon(correction.type)}
                </Badge>
                <span className="text-sm line-through text-muted-foreground">{correction.original}</span>
                <span className="text-sm font-medium text-primary">→ {correction.corrected}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Suggestions
          </h4>
          <ul className="space-y-2">
            {suggestions.map((suggestion, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2" data-testid={`suggestion-${idx}`}>
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
