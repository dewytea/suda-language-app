import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { Card } from "@/components/ui/card";
import { 
  startSpeechRecognition, 
  isSpeechRecognitionSupported, 
  getLanguageCode 
} from "@/lib/speech/speechRecognition";

interface SpeechRecognitionInstance {
  stop: () => void;
}

interface VoiceRecorderProps {
  language?: string;
  onTranscriptComplete?: (transcript: string, confidence: number) => void;
  onError?: (error: string) => void;
}

export function VoiceRecorder({ 
  language = "en", 
  onTranscriptComplete,
  onError 
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const handleRecord = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      if (!isSpeechRecognitionSupported()) {
        const errorMsg = "음성 인식이 지원되지 않는 브라우저입니다. Chrome이나 Edge를 사용해주세요.";
        onError?.(errorMsg);
        return;
      }

      setTranscript("");
      setIsRecording(true);
      
      const languageCode = getLanguageCode(language);
      
      recognitionRef.current = startSpeechRecognition(
        languageCode,
        (text: string, confidence: number) => {
          console.log("Transcript received:", text, "Confidence:", confidence);
          setTranscript(text);
          setIsRecording(false);
          onTranscriptComplete?.(text, confidence);
        },
        (error: string) => {
          console.error("Speech recognition error:", error);
          setIsRecording(false);
          onError?.(error);
        },
        () => {
          console.log("Speech recognition started");
        },
        () => {
          console.log("Speech recognition ended");
          setIsRecording(false);
        }
      );
    }
  };

  const supportMessage = !isSpeechRecognitionSupported() 
    ? "이 브라우저는 음성 인식을 지원하지 않습니다" 
    : isRecording 
      ? "듣고 있어요... 문장을 말해주세요" 
      : transcript 
        ? "녹음 완료!" 
        : "버튼을 눌러 말하기 시작";

  return (
    <Card className="p-6 space-y-4" data-testid="card-voice-recorder">
      <div className="flex items-center justify-center">
        <div className="relative">
          <Button
            size="icon"
            variant={isRecording ? "destructive" : "default"}
            className={`h-20 w-20 rounded-full ${isRecording ? "animate-pulse" : ""}`}
            onClick={handleRecord}
            disabled={!isSpeechRecognitionSupported()}
            data-testid="button-record"
          >
            {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </Button>
          {isRecording && (
            <div 
              className="absolute inset-0 rounded-full border-4 border-destructive animate-ping opacity-75 pointer-events-none" 
              style={{ animationDuration: '1.5s' }}
            />
          )}
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        {supportMessage}
      </p>
      {transcript && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium mb-1">인식된 내용:</p>
          <p className="text-sm italic" data-testid="text-transcript">"{transcript}"</p>
        </div>
      )}
    </Card>
  );
}
