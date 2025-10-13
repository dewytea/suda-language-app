import { VoiceRecorder } from "@/components/VoiceRecorder";
import { PronunciationScore } from "@/components/PronunciationScore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2, Check, Clock, TrendingUp, RotateCcw, ChevronRight } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { KeySentence, PronunciationResult, SpeakingProgress } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { compareText, type TextComparisonResult } from "@/lib/speech/compareText";
import { calculateScore, getXPReward, type ScoringResult } from "@/lib/speech/calculateScore";

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

interface AnalysisResult extends ScoringResult {
  transcript: string;
  comparison: TextComparisonResult;
  confidence: number;
}

export default function Speaking() {
  const [selectedLanguage] = useState("en");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [currentSentence, setCurrentSentence] = useState<KeySentence | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
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

  const handleTranscriptComplete = (transcript: string, confidence: number) => {
    if (!currentSentence) return;
    
    const comparison = compareText(currentSentence.sentence, transcript);
    
    const originalWords = currentSentence.sentence.split(' ').filter(w => w.length > 0);
    const spokenWords = transcript.split(' ').filter(w => w.length > 0);
    
    const scoringResult = calculateScore(
      comparison.accuracy,
      originalWords.length,
      spokenWords.length,
      confidence
    );
    
    const result: AnalysisResult = {
      transcript,
      comparison,
      confidence,
      ...scoringResult
    };
    
    setAnalysisResult(result);
    
    const newCompletedCount = (speakingProgress?.completedSentences || 0) + 1;
    const currentAvg = speakingProgress?.averageScore || 0;
    const newAverage = currentAvg === 0 
      ? scoringResult.score 
      : Math.round((currentAvg * (newCompletedCount - 1) + scoringResult.score) / newCompletedCount);
    
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
    
    const xpReward = getXPReward(scoringResult.score);
    toast({
      title: `${scoringResult.emoji} ${scoringResult.feedback}`,
      description: `+${xpReward} XP 획득!`,
    });
  };

  useEffect(() => {
    if (filteredSentences.length > 0 && !currentSentence) {
      setCurrentSentence(filteredSentences[0]);
    }
  }, [filteredSentences, currentSentence]);

  const handleError = (error: string) => {
    toast({
      title: "음성 인식 오류",
      description: error,
      variant: "destructive"
    });
  };

  const handleRetry = () => {
    setAnalysisResult(null);
  };

  const handleNext = () => {
    setAnalysisResult(null);
    const currentIndex = filteredSentences.findIndex(s => s.id === currentSentence?.id);
    if (currentIndex < filteredSentences.length - 1) {
      setCurrentSentence(filteredSentences[currentIndex + 1]);
    } else {
      setCurrentSentence(filteredSentences[0]);
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

                <VoiceRecorder 
                  language={selectedLanguage}
                  onTranscriptComplete={handleTranscriptComplete}
                  onError={handleError}
                />
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
            {analysisResult ? (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="text-6xl font-bold text-primary" data-testid="text-pronunciation-score">
                    {analysisResult.score}
                  </div>
                  <p className="text-sm text-muted-foreground">점</p>
                  <p className="text-lg font-semibold">{analysisResult.emoji} {analysisResult.feedback}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="font-medium">정확도</span>
                      <span className="text-muted-foreground">{analysisResult.comparison.accuracy}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${analysisResult.comparison.accuracy}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <h4 className="font-semibold text-sm">당신이 말한 내용:</h4>
                    <p className="italic" data-testid="text-user-transcript">"{analysisResult.transcript}"</p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <h4 className="font-semibold text-sm">원본 문장:</h4>
                    <p data-testid="text-original-sentence">"{currentSentence?.sentence}"</p>
                  </div>

                  {analysisResult.comparison.missedWords.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-orange-600 dark:text-orange-400">
                        놓친 단어:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.comparison.missedWords.map((word, i) => (
                          <Badge 
                            key={i}
                            variant="outline"
                            className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20"
                            data-testid={`badge-missed-word-${i}`}
                          >
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisResult.comparison.extraWords.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-red-600 dark:text-red-400">
                        추가된 단어:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.comparison.extraWords.map((word, i) => (
                          <Badge 
                            key={i}
                            variant="outline"
                            className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                            data-testid={`badge-extra-word-${i}`}
                          >
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button 
                    onClick={handleRetry}
                    variant="outline"
                    className="flex-1"
                    data-testid="button-retry"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    다시 연습하기
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="flex-1"
                    data-testid="button-next"
                  >
                    다음 문장
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
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
