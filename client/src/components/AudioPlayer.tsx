import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface AudioPlayerProps {
  title: string;
  duration?: string;
}

export function AudioPlayer({ title, duration = "5:00" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying ? "Paused" : "Playing");
  };

  const handleRestart = () => {
    setProgress(0);
    console.log("Restarted");
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
        <Button size="icon" className="h-14 w-14 rounded-full" onClick={handlePlayPause} data-testid="button-play-pause">
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
      </div>
    </Card>
  );
}
