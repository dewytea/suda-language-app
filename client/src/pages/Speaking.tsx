import { VoiceRecorder } from "@/components/VoiceRecorder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2, Check, Clock, TrendingUp, RotateCcw, ChevronRight, Heart, BarChart3, History, Trophy, Star, MicOff, WifiOff, AlertCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { KeySentence, PronunciationResult, SpeakingProgress, FavoriteSentence } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { compareText, type TextComparisonResult } from "@/lib/speech/compareText";
import { calculateScore, getXPReward, type ScoringResult } from "@/lib/speech/calculateScore";
import { getFeedback } from "@/lib/speech/generateFeedback";
import { Tutorial } from "@/components/Tutorial";
import { AchievementModal } from "@/components/AchievementModal";
import { ErrorModal } from "@/components/ErrorModal";
import { LoadingBar } from "@/components/LoadingBar";
import { Link } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  aiFeedback?: string;
  isLoadingFeedback?: boolean;
}

export default function Speaking() {
  const [selectedLanguage] = useState("en");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [currentSentence, setCurrentSentence] = useState<KeySentence | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [achievementModal, setAchievementModal] = useState<{
    show: boolean;
    type: 'first' | '10' | '50';
    score?: number;
    avgScore?: number;
  }>({ show: false, type: 'first' });
  const [errorModal, setErrorModal] = useState<{
    show: boolean;
    type: 'microphone' | 'recognition' | 'network' | 'save';
    message?: string;
  }>({ show: false, type: 'microphone' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const lastUpdateTimeRef = useRef(Date.now());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const { data: speakingProgress, isLoading: isLoadingProgress } = useQuery<SpeakingProgress>({
    queryKey: ["/api/speaking-progress", selectedLanguage],
  });

  const { data: allSentences = [], isLoading: isLoadingSentences } = useQuery<KeySentence[]>({
    queryKey: ["/api/sentences", selectedLanguage],
  });

  const { data: favoriteSentences = [] } = useQuery<FavoriteSentence[]>({
    queryKey: ["/api/favorites", selectedLanguage],
  });

  // Check if tutorial should be shown
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('speakingTutorialCompleted');
    if (!tutorialCompleted && !isLoadingSentences && allSentences.length > 0) {
      setShowTutorial(true);
    }
  }, [isLoadingSentences, allSentences]);

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
    onError: () => {
      setErrorModal({ show: true, type: 'save' });
    }
  });

  const toggleFavorite = useMutation({
    mutationFn: async (sentenceId: number) => {
      const isFav = favoriteSentences.some(f => f.sentenceId === sentenceId);
      if (isFav) {
        const res = await apiRequest("DELETE", `/api/favorites/${sentenceId}/${selectedLanguage}`);
        return await res.json();
      } else {
        const res = await apiRequest("POST", `/api/favorites`, { sentenceId, language: selectedLanguage });
        return await res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites", selectedLanguage] });
    },
  });

  const addHistory = useMutation({
    mutationFn: async (historyData: any) => {
      const res = await apiRequest("POST", "/api/speaking-history", historyData);
      return await res.json();
    },
  });

  const handleTranscriptComplete = async (transcript: string, confidence: number) => {
    if (!currentSentence) return;
    
    setIsAnalyzing(true);
    
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
      ...scoringResult,
      isLoadingFeedback: true,
    };
    
    setAnalysisResult(result);
    setIsAnalyzing(false);
    
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
    
    // Show XP toast with animation
    toast({
      title: `+${xpReward} XP 획득!`,
      description: `${scoringResult.feedback} - ${scoringResult.score}점`,
      duration: 3000,
    });

    // Save to history
    addHistory.mutate({
      sentenceId: currentSentence.id,
      sentence: currentSentence.sentence,
      language: selectedLanguage,
      score: scoringResult.score,
      transcript,
      accuracy: comparison.accuracy,
      missedWords: comparison.missedWords,
      extraWords: comparison.extraWords,
    });

    // Check for achievements
    const firstCompleted = localStorage.getItem('firstSpeakingCompleted');
    if (!firstCompleted) {
      setTimeout(() => {
        setAchievementModal({ show: true, type: 'first', score: scoringResult.score });
        localStorage.setItem('firstSpeakingCompleted', 'true');
      }, 1000);
    } else if (newCompletedCount === 10) {
      setTimeout(() => {
        setAchievementModal({ show: true, type: '10', avgScore: newAverage });
      }, 1000);
    } else if (newCompletedCount === 50) {
      setTimeout(() => {
        setAchievementModal({ show: true, type: '50', avgScore: newAverage });
      }, 1000);
    }

    // Get AI feedback asynchronously
    try {
      const feedbackResult = await getFeedback({
        originalText: currentSentence.sentence,
        spokenText: transcript,
        score: scoringResult.score,
        missedWords: comparison.missedWords,
        extraWords: comparison.extraWords,
        accuracy: comparison.accuracy,
      });

      setAnalysisResult(prev => prev ? {
        ...prev,
        aiFeedback: feedbackResult.feedback,
        isLoadingFeedback: false,
      } : null);
    } catch (error) {
      console.error('Failed to get feedback:', error);
      setAnalysisResult(prev => prev ? {
        ...prev,
        isLoadingFeedback: false,
      } : null);
    }
  };

  useEffect(() => {
    if (filteredSentences.length > 0 && !currentSentence) {
      setCurrentSentence(filteredSentences[0]);
    }
  }, [filteredSentences, currentSentence]);

  const handleError = (error: string) => {
    // Check error type and show appropriate modal
    if (error.toLowerCase().includes('permission') || error.toLowerCase().includes('not-allowed')) {
      setErrorModal({ show: true, type: 'microphone', message: error });
    } else if (error.toLowerCase().includes('network') || error.toLowerCase().includes('fetch')) {
      setErrorModal({ show: true, type: 'network', message: error });
    } else {
      setErrorModal({ show: true, type: 'recognition', message: error });
    }
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
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      audio.playbackRate = playbackRate;
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => {
        setIsPlayingAudio(false);
        setErrorModal({ show: true, type: 'network', message: '오디오를 재생할 수 없습니다.' });
      };
      audioRef.current = audio;
      await audio.play();
    } catch (error: any) {
      setIsPlayingAudio(false);
      setErrorModal({ show: true, type: 'network', message: error.message || '음성을 생성할 수 없습니다.' });
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "문장 선택",
      description: "여기서 연습할 문장을 선택하세요!\n\n카테고리와 난이도로\n필터링할 수 있어요",
      icon: ChevronRight
    },
    {
      title: "녹음하기",
      description: "마이크 버튼을 눌러\n녹음을 시작하세요!\n\n문장을 크고 명확하게\n읽어주세요",
      icon: Mic
    },
    {
      title: "결과 확인",
      description: "AI가 발음을 분석하고\n점수를 줘요!\n\n놓친 단어도 알려주니\n다시 연습해보세요",
      icon: TrendingUp
    }
  ];

  return (
    <>
      <LoadingBar isLoading={isLoadingProgress || isLoadingSentences || isAnalyzing} />
      
      {showTutorial && (
        <Tutorial
          steps={tutorialSteps}
          storageKey="speakingTutorialCompleted"
          onComplete={() => setShowTutorial(false)}
          onSkip={() => setShowTutorial(false)}
        />
      )}

      {achievementModal.show && (
        <AchievementModal
          title={
            achievementModal.type === 'first' ? '축하합니다!' :
            achievementModal.type === '10' ? '대단해요!' :
            '정말 대단해요!'
          }
          message={
            achievementModal.type === 'first' ? '첫 문장을 완료했어요!' :
            achievementModal.type === '10' ? '10문장을 완료했어요!' :
            '50문장을 완료했어요!'
          }
          icon={
            achievementModal.type === 'first' ? Check :
            achievementModal.type === '10' ? Trophy :
            Star
          }
          stats={
            achievementModal.type === 'first' ? `점수: ${achievementModal.score}점` :
            `평균 점수: ${achievementModal.avgScore}점`
          }
          badge={
            achievementModal.type === 'first' ? undefined :
            achievementModal.type === '10' ? '"말문이 트이다" 배지 획득!' :
            '"Speaking Master" 배지 획득!'
          }
          xpReward={
            achievementModal.type === 'first' ? 20 :
            achievementModal.type === '10' ? 50 :
            100
          }
          primaryAction={{
            label: '계속하기',
            onClick: () => {
              setAchievementModal({ ...achievementModal, show: false });
              handleNext();
            }
          }}
          secondaryAction={
            achievementModal.type !== 'first' ? {
              label: '통계 보기',
              onClick: () => {
                setAchievementModal({ ...achievementModal, show: false });
                window.location.href = '/learn/speaking/stats';
              }
            } : undefined
          }
          onClose={() => setAchievementModal({ ...achievementModal, show: false })}
        />
      )}

      {errorModal.show && (
        <ErrorModal
          icon={
            errorModal.type === 'microphone' ? Mic :
            errorModal.type === 'recognition' ? MicOff :
            errorModal.type === 'network' ? WifiOff :
            AlertCircle
          }
          title={
            errorModal.type === 'microphone' ? '마이크 접근 권한이 필요해요' :
            errorModal.type === 'recognition' ? '음성을 인식하지 못했어요' :
            errorModal.type === 'network' ? '서버에 연결할 수 없어요' :
            '저장하지 못했어요'
          }
          message={
            errorModal.type === 'microphone' 
              ? 'Speaking 연습을 위해 마이크 사용을 허용해주세요\n\n설정 방법:\n브라우저 주소창 왼쪽 🔒 → 권한 → 마이크 허용'
              : errorModal.type === 'recognition'
              ? '음성을 명확하게 인식하지 못했습니다'
              : errorModal.type === 'network'
              ? '잠시 후 다시 시도해주세요'
              : '인터넷 연결을 확인하고 다시 시도해주세요'
          }
          tips={
            errorModal.type === 'recognition' ? [
              '조용한 곳에서 연습하세요',
              '마이크 가까이에서 말하세요',
              '크고 명확하게 발음하세요'
            ] : undefined
          }
          primaryAction={
            errorModal.type !== 'save' ? {
              label: '다시 시도하기',
              onClick: () => setErrorModal({ ...errorModal, show: false })
            } : undefined
          }
          secondaryAction={{
            label: errorModal.type === 'save' ? '확인' : '나중에',
            onClick: () => setErrorModal({ ...errorModal, show: false })
          }}
          onClose={() => setErrorModal({ ...errorModal, show: false })}
        />
      )}

      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mic className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl">말하기 연습</h1>
              <p className="text-muted-foreground">발음과 억양에 집중하세요</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/learn/speaking/stats">
              <Button variant="outline" size="sm" data-testid="button-stats">
                <BarChart3 className="h-4 w-4 mr-2" />
                통계
              </Button>
            </Link>
            <Link href="/learn/speaking/history">
              <Button variant="outline" size="sm" data-testid="button-history">
                <History className="h-4 w-4 mr-2" />
                기록
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover-elevate transition-all duration-300">
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

          <Card className="hover-elevate transition-all duration-300">
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

          <Card className="hover-elevate transition-all duration-300">
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
          <Card className="transition-all duration-300">
            <CardHeader>
              <CardTitle>문장 연습</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentSentence ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-left duration-500">
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
                        <div className="flex items-center gap-2">
                          <Button 
                            size="icon" 
                            variant={favoriteSentences.some(f => f.sentenceId === currentSentence.id) ? "default" : "ghost"}
                            onClick={() => toggleFavorite.mutate(currentSentence.id)}
                            data-testid="button-favorite"
                            className="transition-all duration-300"
                          >
                            <Heart className={`h-5 w-5 transition-all duration-300 ${favoriteSentences.some(f => f.sentenceId === currentSentence.id) ? 'fill-current scale-110' : ''}`} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={handlePlaySentence}
                            disabled={isPlayingAudio}
                            data-testid="button-play-sentence"
                          >
                            <Volume2 className={`h-5 w-5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted-foreground" data-testid="text-translation">
                        {currentSentence.translation}
                      </p>
                      
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-sm text-muted-foreground">재생 속도:</span>
                        <Select value={playbackRate.toString()} onValueChange={(v) => setPlaybackRate(parseFloat(v))}>
                          <SelectTrigger className="w-32" data-testid="select-playback-speed">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.75">느리게 (0.75x)</SelectItem>
                            <SelectItem value="1.0">보통 (1.0x)</SelectItem>
                            <SelectItem value="1.25">빠르게 (1.25x)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <VoiceRecorder 
                    language={selectedLanguage}
                    onTranscriptComplete={handleTranscriptComplete}
                    onError={handleError}
                  />
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  필터 조건에 맞는 문장이 없습니다
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="transition-all duration-300">
            <CardHeader>
              <CardTitle>발음 평가</CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                  <div className="text-center space-y-2">
                    <div className="text-6xl font-bold text-primary animate-in zoom-in duration-700" data-testid="text-pronunciation-score">
                      {analysisResult.score}
                    </div>
                    <p className="text-sm text-muted-foreground">점</p>
                    <p className="text-lg font-semibold">{analysisResult.feedback}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="font-medium">정확도</span>
                        <span className="text-muted-foreground">{analysisResult.comparison.accuracy}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-1000"
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
                              className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 animate-in fade-in zoom-in"
                              style={{ animationDelay: `${i * 100}ms` }}
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
                              className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 animate-in fade-in zoom-in"
                              style={{ animationDelay: `${i * 100}ms` }}
                              data-testid={`badge-extra-word-${i}`}
                            >
                              {word}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-lg border border-blue-500/20 dark:border-blue-500/10">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <span className="text-lg">🤖</span>
                        AI 코치의 피드백
                      </h4>
                      
                      {analysisResult.isLoadingFeedback ? (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm" data-testid="feedback-loading">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                          피드백 생성 중... (약 3초 소요)
                        </div>
                      ) : analysisResult.aiFeedback ? (
                        <div className="text-sm whitespace-pre-line leading-relaxed" data-testid="text-ai-feedback">
                          {analysisResult.aiFeedback}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground" data-testid="feedback-unavailable">
                          피드백을 생성할 수 없습니다.
                        </div>
                      )}
                    </div>
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
                <div className="text-center text-muted-foreground py-16 space-y-3">
                  <div className="text-5xl opacity-50">🎤</div>
                  <p>문장을 녹음하면 발음 평가가 표시됩니다</p>
                </div>
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
              {filteredSentences.map((sentence, index) => (
                <button
                  key={sentence.id}
                  onClick={() => {
                    setCurrentSentence(sentence);
                    setAnalysisResult(null);
                  }}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-300 hover-elevate animate-in fade-in slide-in-from-bottom ${
                    currentSentence?.id === sentence.id ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
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
    </>
  );
}
