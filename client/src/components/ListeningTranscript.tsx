import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface Sentence {
  id: number;
  text: string;
  translation: string;
}

interface ListeningTranscriptProps {
  sentences: Sentence[];
  currentSentence?: number;
}

export function ListeningTranscript({ sentences, currentSentence = 0 }: ListeningTranscriptProps) {
  const handleRepeat = (id: number) => {
    console.log("Repeating sentence:", id);
  };

  return (
    <Card className="p-6 space-y-3" data-testid="card-listening-transcript">
      <h3 className="font-semibold text-lg mb-4">Transcript</h3>
      {sentences.map((sentence) => (
        <div
          key={sentence.id}
          className={`p-4 rounded-md border transition-colors ${
            currentSentence === sentence.id ? "border-primary bg-primary/5" : "border-transparent"
          }`}
          data-testid={`transcript-sentence-${sentence.id}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1">
              <p className="font-medium">{sentence.text}</p>
              <p className="text-sm text-muted-foreground">{sentence.translation}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0"
              onClick={() => handleRepeat(sentence.id)}
              data-testid={`button-repeat-${sentence.id}`}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </Card>
  );
}
