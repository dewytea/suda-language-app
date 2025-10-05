import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface VocabularyItemProps {
  word: string;
  translation: string;
  example?: string;
  onDelete: () => void;
}

export function VocabularyItem({ word, translation, example, onDelete }: VocabularyItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const handleSpeak = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    try {
      const res = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: word })
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate audio");
      }
      
      const data = await res.json();
      
      const audio = new Audio(`data:${data.mimeType};base64,${data.audioData}`);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        toast({
          title: "오디오 재생 실패",
          description: "음성을 재생할 수 없습니다.",
          variant: "destructive"
        });
      };
      await audio.play();
    } catch (error: any) {
      setIsPlaying(false);
      toast({
        title: "음성 생성 실패",
        description: error.message || "음성을 생성할 수 없습니다.",
        variant: "destructive"
      });
    }
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
