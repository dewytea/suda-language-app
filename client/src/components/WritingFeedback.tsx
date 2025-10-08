import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, XCircle, Lightbulb, Save, Trash2 } from "lucide-react";

interface Correction {
  original: string;
  corrected: string;
  type: "grammar" | "vocabulary" | "spelling";
}

interface WritingFeedbackProps {
  score: number;
  corrections: Correction[];
  suggestions: string[];
  onSave?: () => void;
  onDiscard?: () => void;
  isSaving?: boolean;
  isSaved?: boolean;
}

export function WritingFeedback({ score, corrections, suggestions, onSave, onDiscard, isSaving = false, isSaved = false }: WritingFeedbackProps) {
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

      {onSave && onDiscard && !isSaved && (
        <div className="flex gap-3 pt-4 border-t">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex-1" data-testid="button-save-writing">
                <Save className="h-4 w-4 mr-2" />
                저장하기
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>작성한 글을 저장하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  저장한 글은 나중에 다시 확인하고 복습할 수 있습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={onSave} disabled={isSaving}>
                  {isSaving ? "저장 중..." : "저장"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex-1" data-testid="button-discard-writing">
                <Trash2 className="h-4 w-4 mr-2" />
                삭제하기
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>평가 결과를 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  삭제한 결과는 복구할 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={onDiscard} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      
      {isSaved && (
        <div className="flex items-center justify-center gap-2 pt-4 border-t text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span>이미 저장된 글입니다</span>
        </div>
      )}
    </Card>
  );
}
