import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play } from "lucide-react";
import { Card } from "@/components/ui/card";

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecording(true);
      console.log("Recording stopped");
    } else {
      setIsRecording(true);
      setHasRecording(false);
      console.log("Recording started");
    }
  };

  const handlePlay = () => {
    console.log("Playing recording");
  };

  return (
    <Card className="p-6 space-y-4" data-testid="card-voice-recorder">
      <div className="flex items-center justify-center">
        <div className="relative">
          <Button
            size="icon"
            variant={isRecording ? "destructive" : "default"}
            className={`h-20 w-20 rounded-full ${isRecording ? "animate-pulse" : ""}`}
            onClick={handleRecord}
            data-testid="button-record"
          >
            {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </Button>
          {isRecording && (
            <div className="absolute inset-0 rounded-full border-4 border-destructive animate-ping opacity-75" />
          )}
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        {isRecording ? "Recording..." : hasRecording ? "Recording saved" : "Tap to record"}
      </p>
      {hasRecording && (
        <Button variant="outline" className="w-full" onClick={handlePlay} data-testid="button-play-recording">
          <Play className="h-4 w-4 mr-2" />
          Play Recording
        </Button>
      )}
    </Card>
  );
}
