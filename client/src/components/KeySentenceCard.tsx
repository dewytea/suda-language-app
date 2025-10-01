import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Check } from "lucide-react";
import { useState } from "react";

interface KeySentenceCardProps {
  sentence: string;
  translation: string;
  index: number;
}

export function KeySentenceCard({ sentence, translation, index }: KeySentenceCardProps) {
  const [memorized, setMemorized] = useState(false);

  const handleSpeak = () => {
    console.log("Speaking sentence:", sentence);
  };

  return (
    <Card className="p-6 space-y-4" data-testid={`card-key-sentence-${index}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-lg font-medium leading-loose">{sentence}</p>
          <p className="text-sm text-muted-foreground mt-2">{translation}</p>
        </div>
        <Button size="icon" variant="ghost" onClick={handleSpeak} data-testid={`button-speak-${index}`}>
          <Volume2 className="h-5 w-5" />
        </Button>
      </div>
      <Button
        variant={memorized ? "default" : "outline"}
        className="w-full"
        onClick={() => setMemorized(!memorized)}
        data-testid={`button-memorize-${index}`}
      >
        {memorized ? <Check className="h-4 w-4 mr-2" /> : null}
        {memorized ? "Memorized" : "Mark as Memorized"}
      </Button>
    </Card>
  );
}
