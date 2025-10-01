import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Trash2 } from "lucide-react";

interface VocabularyItemProps {
  word: string;
  translation: string;
  example?: string;
  onDelete: () => void;
}

export function VocabularyItem({ word, translation, example, onDelete }: VocabularyItemProps) {
  const handleSpeak = () => {
    console.log("Speaking word:", word);
  };

  return (
    <Card className="p-4" data-testid={`card-vocab-${word}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-lg">{word}</h4>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleSpeak} data-testid={`button-speak-${word}`}>
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{translation}</p>
          {example && <p className="text-sm italic mt-2">"{example}"</p>}
        </div>
        <Button size="icon" variant="ghost" onClick={onDelete} data-testid={`button-delete-${word}`}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </Card>
  );
}
