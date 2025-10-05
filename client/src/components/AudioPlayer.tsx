import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  title: string;
  duration?: string;
  sentences?: Array<{ id: number; text: string; translation: string }>;
}

export function AudioPlayer({ title, duration = "5:00", sentences = [] }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlayPause = async () => {
    if (sentences.length === 0) {
      toast({
        title: "재생할 콘텐츠가 없습니다",
        description: "듣기 연습용 문장이 없습니다.",
        variant: "destructive"
      });
      return;
    }

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // Resume existing audio if available
      if (audioRef.current) {
        setIsPlaying(true);
        await audioRef.current.play();
      } else {
        // Start new playback
        setIsPlaying(true);
      }
    }
  };

  const playCurrentSentence = async () => {
    if (currentSentenceIndex >= sentences.length) {
      setCurrentSentenceIndex(0);
      setProgress(0);
      return;
    }

    setIsLoading(true);
    try {
      const sentence = sentences[currentSentenceIndex];
      const res = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sentence.text })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate audio");
      }

      const data = await res.json();
      
      // Convert base64 to blob for better browser compatibility
      const binaryString = atob(data.audioData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.mimeType || 'audio/pcm' });
      const audioUrl = URL.createObjectURL(blob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };

      audio.onended = () => {
        audioRef.current = null;
        const nextIndex = currentSentenceIndex + 1;
        if (nextIndex < sentences.length) {
          setCurrentSentenceIndex(nextIndex);
          setProgress((nextIndex / sentences.length) * 100);
        } else {
          setIsPlaying(false);
          setCurrentSentenceIndex(0);
          setProgress(100);
        }
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        toast({
          title: "오디오 재생 실패",
          description: "음성을 재생할 수 없습니다.",
          variant: "destructive"
        });
      };

      await audio.play();
    } catch (error: any) {
      setIsPlaying(false);
      setIsLoading(false);
      toast({
        title: "음성 생성 실패",
        description: error.message || "음성을 생성할 수 없습니다.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (isPlaying && !audioRef.current) {
      playCurrentSentence();
    }
  }, [currentSentenceIndex]);

  useEffect(() => {
    if (isPlaying && !audioRef.current && sentences.length > 0) {
      playCurrentSentence();
    }
  }, [isPlaying]);

  const handleRestart = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setCurrentSentenceIndex(0);
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <Card className="p-6 space-y-4" data-testid="card-audio-player">
      <div className="flex items-center gap-3">
        <Volume2 className="h-6 w-6 text-skill-listening" />
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{duration}</p>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex items-center justify-center gap-4">
        <Button size="icon" variant="outline" onClick={handleRestart} data-testid="button-restart">
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button 
          size="icon" 
          className="h-14 w-14 rounded-full" 
          onClick={handlePlayPause} 
          disabled={isLoading}
          data-testid="button-play-pause"
        >
          {isLoading ? (
            <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
          ) : isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>
      </div>
    </Card>
  );
}
