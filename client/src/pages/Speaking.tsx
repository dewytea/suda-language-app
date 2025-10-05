import { VoiceRecorder } from "@/components/VoiceRecorder";
import { PronunciationScore } from "@/components/PronunciationScore";
import { KeySentenceCard } from "@/components/KeySentenceCard";
import { LevelGuide } from "@/components/LevelGuide";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Volume2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { KeySentence, PronunciationResult, UserProgress } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Speaking() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [currentSentence, setCurrentSentence] = useState("Where is the boarding gate?");
  const [latestScore, setLatestScore] = useState<PronunciationResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const { toast } = useToast();

  const { data: progress } = useQuery<UserProgress>({
    queryKey: ["/api/progress", selectedLanguage],
  });

  const { data: sentences = [], status: sentencesStatus } = useQuery<KeySentence[]>({
    queryKey: ["/api/sentences", selectedLanguage],
  });

  const evaluatePronunciation = useMutation({
    mutationFn: async ({ sentence, audioBlob }: { sentence: string; audioBlob?: Blob }) => {
      let audioData = undefined;
      if (audioBlob) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(audioBlob);
        });
        audioData = await base64Promise;
      }

      const res = await apiRequest("POST", `/api/pronunciation/evaluate`, {
        sentence,
        language: selectedLanguage,
        audioData,
      });
      return await res.json();
    },
    onSuccess: (data: PronunciationResult) => {
      setLatestScore(data);
      queryClient.invalidateQueries({ queryKey: ["/api/pronunciation", selectedLanguage] });
    },
  });

  const addSentence = useMutation({
    mutationFn: async (sentence: Omit<KeySentence, "id">) => {
      const res = await apiRequest("POST", "/api/sentences", sentence);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sentences", selectedLanguage] });
    },
  });

  useEffect(() => {
    if (sentencesStatus === "success" && sentences.length === 0) {
      const defaultSentences = [
        { sentence: "Where is the boarding gate?", translation: "탑승구가 어디에 있나요?", language: "en", scenario: "airport", memorized: false },
        { sentence: "I would like to check in, please.", translation: "체크인하고 싶습니다.", language: "en", scenario: "airport", memorized: false },
        { sentence: "Can I see your passport?", translation: "여권을 보여주시겠습니까?", language: "en", scenario: "airport", memorized: false },
      ];
      
      defaultSentences.forEach(s => addSentence.mutate(s));
    }
  }, [sentencesStatus, sentences.length]);

  const handleRecordingComplete = (audioBlob: Blob) => {
    evaluatePronunciation.mutate({
      sentence: currentSentence,
      audioBlob,
    });
  };

  const handlePlaySentence = async () => {
    if (isPlayingAudio) return;
    
    setIsPlayingAudio(true);
    try {
      const res = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentSentence })
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate audio");
      }
      
      const data = await res.json();
      
      const audio = new Audio(`data:${data.mimeType};base64,${data.audioData}`);
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => {
        setIsPlayingAudio(false);
        toast({
          title: "오디오 재생 실패",
          description: "음성을 재생할 수 없습니다.",
          variant: "destructive"
        });
      };
      await audio.play();
    } catch (error: any) {
      setIsPlayingAudio(false);
      toast({
        title: "음성 생성 실패",
        description: error.message || "음성을 생성할 수 없습니다.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Mic className="h-8 w-8 text-skill-speaking" />
        <div>
          <h1 className="font-serif font-bold text-4xl">말하기 연습</h1>
          <p className="text-muted-foreground mt-1">30분 • 발음과 억양에 집중하세요</p>
        </div>
      </div>

      <LevelGuide level={progress?.level || 1} skill="speaking" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-semibold text-xl mb-4">음성 녹음</h2>
            <p className="text-sm text-muted-foreground mb-6">
              아래 문장을 따라 읽고 즉각적인 피드백을 받아보세요
            </p>
            <div className="p-4 bg-muted rounded-md mb-6">
              <div className="flex items-center justify-center gap-3">
                <p className="text-lg font-medium text-center">
                  "{currentSentence}"
                </p>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={handlePlaySentence}
                  disabled={isPlayingAudio}
                  data-testid="button-play-sentence"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
          </Card>
        </div>

        <div className="space-y-6">
          {evaluatePronunciation.isPending && (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">발음을 평가하고 있습니다...</p>
            </Card>
          )}
          {latestScore && !evaluatePronunciation.isPending && (
            <PronunciationScore score={latestScore.score} />
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="font-serif font-semibold text-2xl">오늘의 핵심 문장</h2>
        <p className="text-muted-foreground">반드시 익혀야 할 필수 표현들입니다</p>
        <div className="grid grid-cols-1 gap-4">
          {sentences.map((item) => (
            <KeySentenceCard
              key={item.id}
              sentence={item.sentence}
              translation={item.translation}
              index={item.id}
              memorized={item.memorized}
              onSentenceClick={() => setCurrentSentence(item.sentence)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
