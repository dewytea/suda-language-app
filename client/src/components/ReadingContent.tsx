import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Languages } from "lucide-react";
import { useState } from "react";

interface ReadingContentProps {
  title: string;
  content: string;
  translation?: string;
}

export function ReadingContent({ title, content, translation }: ReadingContentProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
    console.log("Word clicked:", word);
  };

  return (
    <Card className="p-8 space-y-6" data-testid="card-reading-content">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-skill-reading" />
          <h2 className="font-serif font-semibold text-2xl">{title}</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTranslation(!showTranslation)}
          data-testid="button-toggle-translation"
        >
          <Languages className="h-4 w-4 mr-2" />
          {showTranslation ? "Hide" : "Show"} Translation
        </Button>
      </div>
      <div className="prose prose-lg max-w-none">
        <p className="leading-loose text-base">
          {content.split(" ").map((word, idx) => (
            <span
              key={idx}
              className="hover:underline hover:text-primary cursor-pointer transition-colors"
              onClick={() => handleWordClick(word)}
            >
              {word}{" "}
            </span>
          ))}
        </p>
      </div>
      {showTranslation && translation && (
        <div className="p-4 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">{translation}</p>
        </div>
      )}
    </Card>
  );
}
