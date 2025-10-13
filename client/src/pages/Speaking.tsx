import { VoiceRecorder } from "@/components/VoiceRecorder";
import { PronunciationScore } from "@/components/PronunciationScore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2, Check, Clock, TrendingUp } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { KeySentence, PronunciationResult, SpeakingProgress } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const categoryLabels = {
  daily: "일상",
  travel: "여행",
  business: "비즈니스"
};

const difficultyColors = {
  1: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  2: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  3: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  4: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  5: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
};

export default function Speaking() {
  const [selectedLanguage] = useState("en");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [currentSentence, setCurrentSentence] = useState<KeySentence | null>(null);
  const [latestScore, setLatestScore] = useState<PronunciationResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const lastUpdateTimeRef = useRef(Date.now());
  const { toast } = useToast();

  const { data: speakingProgress } = useQuery<SpeakingProgress>({
    queryKey: ["/api/speaking-progress", selectedLanguage],
  });

  const { data: allSentences = [] } = useQuery<KeySentence[]>({
    queryKey: ["/api/sentences", selectedLanguage],
  });

  const filteredSentences = allSentences.filter(s => {
    if (selectedCategory !== "all" && s.category !== selectedCategory) return false;
    if (selectedDifficulty !== null && s.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const updateSpeakingProgress = useMutation({
    mutationFn: async (updates: Partial<SpeakingProgress>) => {
      const res = await apiRequest("PATCH", `/api/speaking-progress/${selectedLanguage}`, updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/speaking-progress", selectedLanguage] });
    },
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
      
      const newCompletedCount = (speakingProgress?.completedSentences || 0) + 1;
      const currentAvg = speakingProgress?.averageScore || 0;
      const newAverage = currentAvg === 0 
        ? data.score 
        : Math.round((currentAvg * (newCompletedCount - 1) + data.score) / newCompletedCount);
      
      const now = Date.now();
      const deltaMinutes = Math.floor((now - lastUpdateTimeRef.current) / 1000 / 60);
      lastUpdateTimeRef.current = now;
      
      const today = new Date().toISOString().split('T')[0];
      const todayStudyTime = speakingProgress?.lastStudyDate === today 
        ? (speakingProgress?.todayStudyTime || 0) + deltaMinutes
        : deltaMinutes;

      updateSpeakingProgress.mutate({
        completedSentences: newCompletedCount,
        averageScore: newAverage,
        todayStudyTime,
        lastStudyDate: today,
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/pronunciation", selectedLanguage] });
    },
  });

  useEffect(() => {
    if (filteredSentences.length > 0 && !currentSentence) {
      setCurrentSentence(filteredSentences[0]);
    }
  }, [filteredSentences, currentSentence]);

  const handleRecordingComplete = (audioBlob: Blob) => {
    if (currentSentence) {
      evaluatePronunciation.mutate({
        sentence: currentSentence.sentence,
        audioBlob,
      });
    }
  };

  const handlePlaySentence = async () => {
    if (isPlayingAudio || !currentSentence) return;
    
    setIsPlayingAudio(true);
    try {
      const res = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentSentence.sentence })
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Mic className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-serif font-bold text-3xl">말하기 연습</h1>
          <p className="text-muted-foreground">발음과 억양에 집중하세요</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              완료한 문장
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-completed-sentences">
              {speakingProgress?.completedSentences || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              평균 점수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-average-score">
              {speakingProgress?.averageScore || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              오늘 학습 시간
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-study-time">
              {speakingProgress?.todayStudyTime || 0}분
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>문장 연습</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentSentence ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border">
                      {categoryLabels[currentSentence.category as keyof typeof categoryLabels]}
                    </Badge>
                    <Badge variant="outline" className={`border ${difficultyColors[currentSentence.difficulty as keyof typeof difficultyColors]}`}>
                      난이도 {currentSentence.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="p-6 bg-muted/50 rounded-xl space-y-3">
                    <div className="flex items-start gap-3">
                      <p className="text-xl font-semibold flex-1" data-testid="text-current-sentence">
                        {currentSentence.sentence}
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
                    <p className="text-muted-foreground" data-testid="text-translation">
                      {currentSentence.translation}
                    </p>
                  </div>
                </div>

                <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
              </>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                필터 조건에 맞는 문장이 없습니다
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>발음 평가</CardTitle>
          </CardHeader>
          <CardContent>
            {evaluatePronunciation.isPending && (
              <p className="text-center text-muted-foreground py-8">발음을 평가하고 있습니다...</p>
            )}
            {latestScore && !evaluatePronunciation.isPending && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold text-primary" data-testid="text-pronunciation-score">
                    {latestScore.score}
                  </div>
                  <p className="text-sm text-muted-foreground">점</p>
                </div>
                {latestScore.feedback && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm" data-testid="text-feedback">
                      {latestScore.feedback}
                    </p>
                  </div>
                )}
              </div>
            )}
            {!latestScore && !evaluatePronunciation.isPending && (
              <p className="text-center text-muted-foreground py-8">
                문장을 녹음하면 발음 평가가 표시됩니다
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>문장 목록</CardTitle>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              data-testid="button-filter-all"
            >
              전체
            </Button>
            <Button
              variant={selectedCategory === "daily" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("daily")}
              data-testid="button-filter-daily"
            >
              일상
            </Button>
            <Button
              variant={selectedCategory === "travel" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("travel")}
              data-testid="button-filter-travel"
            >
              여행
            </Button>
            <Button
              variant={selectedCategory === "business" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("business")}
              data-testid="button-filter-business"
            >
              비즈니스
            </Button>
            <div className="w-px h-6 bg-border mx-2" />
            {[1, 2, 3, 4, 5].map((level) => (
              <Button
                key={level}
                variant={selectedDifficulty === level ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(selectedDifficulty === level ? null : level)}
                data-testid={`button-difficulty-${level}`}
              >
                레벨 {level}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredSentences.map((sentence) => (
              <button
                key={sentence.id}
                onClick={() => setCurrentSentence(sentence)}
                className={`w-full text-left p-4 rounded-lg border transition-colors hover-elevate ${
                  currentSentence?.id === sentence.id ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                data-testid={`button-sentence-${sentence.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border text-xs">
                        {categoryLabels[sentence.category as keyof typeof categoryLabels]}
                      </Badge>
                      <Badge variant="outline" className={`border text-xs ${difficultyColors[sentence.difficulty as keyof typeof difficultyColors]}`}>
                        {sentence.difficulty}
                      </Badge>
                    </div>
                    <p className="font-medium">{sentence.sentence}</p>
                    <p className="text-sm text-muted-foreground">{sentence.translation}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
