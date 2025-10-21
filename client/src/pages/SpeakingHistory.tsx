import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Calendar, Clock, Trophy, ThumbsUp, Zap, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { SpeakingHistory } from "@shared/schema";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { EmptyState } from "@/components/EmptyState";
import { LoadingBar } from "@/components/LoadingBar";
import { useLocation } from "wouter";

const categoryLabels = {
  daily: "일상",
  travel: "여행",
  business: "비즈니스",
};

export default function SpeakingHistoryPage() {
  const [selectedLanguage] = useState("en");
  const [, setLocation] = useLocation();

  const { data: history = [], isLoading, error, isError } = useQuery<SpeakingHistory[]>({
    queryKey: [`/api/speaking-history/${selectedLanguage}`],
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return Trophy;
    if (score >= 70) return ThumbsUp;
    if (score >= 50) return Zap;
    return BookOpen;
  };

  const groupedHistory = history.reduce((acc, item) => {
    const date = item.createdAt ? format(new Date(item.createdAt), "yyyy-MM-dd") : "Unknown";
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, SpeakingHistory[]>);

  const sortedDates = Object.keys(groupedHistory).sort((a, b) => b.localeCompare(a));

  if (isLoading) {
    return (
      <>
        <LoadingBar isLoading={true} />
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <History className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl">학습 기록</h1>
              <p className="text-muted-foreground">로딩 중...</p>
            </div>
          </div>
          {/* Skeleton UI */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-24 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <LoadingBar isLoading={false} />
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <History className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl">학습 기록</h1>
              <p className="text-muted-foreground">데이터를 불러오는 중 오류가 발생했습니다</p>
            </div>
          </div>

          <EmptyState
            icon={History}
            title="기록을 불러올 수 없습니다"
            description={`데이터를 불러오는 중 문제가 발생했습니다.\n${error instanceof Error ? error.message : '알 수 없는 오류'}`}
            actionLabel="다시 시도"
            onAction={() => window.location.reload()}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <LoadingBar isLoading={false} />
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <History className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-3xl">학습 기록</h1>
            <p className="text-muted-foreground">과거 연습 세션을 확인하세요</p>
          </div>
        </div>

        {history.length === 0 ? (
          <EmptyState
            icon={History}
            title="아직 학습 기록이 없어요"
            description="첫 문장을 연습하고\n발음 실력을 확인해보세요!"
            actionLabel="지금 시작하기"
            onAction={() => setLocation('/learn/speaking')}
          />
        ) : (
          <div className="space-y-6">
            {sortedDates.map((date, dateIndex) => (
              <div
                key={date}
                className="space-y-3 animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${dateIndex * 100}ms` }}
              >
                <div className="flex items-center gap-2 sticky top-0 bg-background py-2 z-10">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-semibold text-lg" data-testid={`text-date-${date}`}>
                    {format(new Date(date), "yyyy년 M월 d일 (E)", { locale: ko })}
                  </h2>
                  <Badge variant="outline" className="ml-2">
                    {groupedHistory[date].length}개
                  </Badge>
                </div>

                <div className="grid gap-3">
                  {groupedHistory[date].map((item, index) => (
                    <Card
                      key={`${item.id}-${index}`}
                      className="hover-elevate transition-all duration-300 animate-in fade-in slide-in-from-left"
                      style={{ animationDelay: `${index * 50}ms` }}
                      data-testid={`card-history-${item.id}`}
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <p className="font-semibold text-lg" data-testid={`text-sentence-${item.id}`}>
                                {item.sentence}
                              </p>
                              {item.transcript && (
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">내 발음:</p>
                                  <p className="text-sm bg-muted/50 px-3 py-2 rounded-lg" data-testid={`text-transcript-${item.id}`}>
                                    {item.transcript}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                              <div className={`flex items-center gap-2 text-3xl font-bold ${getScoreColor(item.score)}`} data-testid={`text-score-${item.id}`}>
                                {(() => {
                                  const IconComponent = getScoreIcon(item.score);
                                  return <IconComponent className="h-8 w-8" />;
                                })()}
                                {item.score}
                              </div>
                              <Badge variant="outline" className="border">
                                정확도: {item.accuracy}%
                              </Badge>
                            </div>
                          </div>

                          {(item.missedWords || item.extraWords) && (
                            <div className="flex gap-4 text-sm">
                              {item.missedWords && item.missedWords.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">놓친 단어:</span>
                                  <span className="text-red-500 font-medium">
                                    {item.missedWords.join(", ")}
                                  </span>
                                </div>
                              )}
                              {item.extraWords && item.extraWords.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">추가 단어:</span>
                                  <span className="text-blue-500 font-medium">
                                    {item.extraWords.join(", ")}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {item.createdAt ? format(new Date(item.createdAt), "HH:mm", { locale: ko }) : "시간 정보 없음"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
