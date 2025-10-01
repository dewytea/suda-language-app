import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface KeySentenceCardProps {
  sentence: string;
  translation: string;
  index: number;
  memorized?: boolean;
  onSentenceClick?: () => void;
}

export function KeySentenceCard({ sentence, translation, index, memorized: initialMemorized = false, onSentenceClick }: KeySentenceCardProps) {
  const [memorized, setMemorized] = useState(initialMemorized);

  useEffect(() => {
    setMemorized(initialMemorized);
  }, [initialMemorized]);

  const updateSentence = useMutation({
    mutationFn: async (memorized: boolean) => {
      const res = await apiRequest("PATCH", `/api/sentences/${index}`, { memorized });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sentences"] });
    },
  });

  const handleSpeak = () => {
    if (onSentenceClick) {
      onSentenceClick();
    }
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(sentence);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMemorize = () => {
    const newMemorized = !memorized;
    setMemorized(newMemorized);
    updateSentence.mutate(newMemorized);
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
        onClick={handleMemorize}
        data-testid={`button-memorize-${index}`}
      >
        {memorized ? <Check className="h-4 w-4 mr-2" /> : null}
        {memorized ? "Memorized" : "Mark as Memorized"}
      </Button>
    </Card>
  );
}
