import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Award, Target, Calendar, Star, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { SpeakingHistory } from "@shared/schema";
import { EmptyState } from "@/components/EmptyState";
import { LoadingBar } from "@/components/LoadingBar";
import { useLocation } from "wouter";

export default function SpeakingStatsPage() {
  const [selectedLanguage] = useState("en");
  const [, setLocation] = useLocation();

  const { data: history = [], isLoading } = useQuery<SpeakingHistory[]>({
    queryKey: ["/api/speaking-history", selectedLanguage],
  });

  // Calculate statistics from history
  const totalSessions = history.length;
  const averageScore = totalSessions > 0
    ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / totalSessions)
    : 0;
  const bestScore = totalSessions > 0
    ? Math.max(...history.map(h => h.score))
    : 0;

  const scoreRanges = [
    { range: "90-100", min: 90, max: 100, color: "bg-green-500" },
    { range: "70-89", min: 70, max: 89, color: "bg-blue-500" },
    { range: "50-69", min: 50, max: 69, color: "bg-yellow-500" },
    { range: "0-49", min: 0, max: 49, color: "bg-red-500" },
  ];

  const scoreDistribution = scoreRanges.map(({ range, min, max, color }) => ({
    range,
    count: history.filter(h => h.score >= min && h.score <= max).length,
    color,
  }));

  const maxCount = Math.max(...scoreDistribution.map(d => d.count), 1);

  // Recent improvement (last 10 vs previous 10)
  const recentHistory = history.slice(0, 10);
  const previousHistory = history.slice(10, 20);
  const recentAvg = recentHistory.length > 0
    ? recentHistory.reduce((sum, h) => sum + h.score, 0) / recentHistory.length
    : 0;
  const previousAvg = previousHistory.length > 0
    ? previousHistory.reduce((sum, h) => sum + h.score, 0) / previousHistory.length
    : 0;
  const improvement = recentAvg - previousAvg;

  if (isLoading) {
    return (
      <>
        <LoadingBar isLoading={true} />
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl">학습 통계</h1>
              <p className="text-muted-foreground">로딩 중...</p>
            </div>
          </div>
          {/* Skeleton UI */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (totalSessions < 10) {
    return (
      <>
        <LoadingBar isLoading={false} />
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl">학습 통계</h1>
              <p className="text-muted-foreground">나의 학습 현황을 확인하세요</p>
            </div>
          </div>

          <EmptyState
            icon={BarChart3}
            title="아직 통계가 부족해요"
            description="10개 문장을 연습하면\n상세한 통계를 볼 수 있어요"
            actionLabel="더 연습하기"
            onAction={() => setLocation('/learn/speaking')}
            progress={{
              current: totalSessions,
              total: 10
            }}
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
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-3xl">학습 통계</h1>
            <p className="text-muted-foreground">나의 학습 현황을 확인하세요</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover-elevate transition-all duration-300 animate-in fade-in slide-in-from-bottom" style={{ animationDelay: '0ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                총 학습 세션
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-sessions">
                {totalSessions}
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all duration-300 animate-in fade-in slide-in-from-bottom" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                평균 점수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-average-score">
                {averageScore}
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all duration-300 animate-in fade-in slide-in-from-bottom" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                최고 점수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-best-score">
                {bestScore}
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all duration-300 animate-in fade-in slide-in-from-bottom" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                최근 향상도
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${improvement > 0 ? 'text-green-500' : improvement < 0 ? 'text-red-500' : ''}`} data-testid="text-improvement">
                {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">최근 10회 vs 이전 10회</p>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              점수 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scoreDistribution.map(({ range, count, color }, index) => (
                <div
                  key={range}
                  className="space-y-2 animate-in fade-in slide-in-from-left duration-500"
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{range}점</span>
                    <Badge variant="outline">{count}회</Badge>
                  </div>
                  <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 ${color} opacity-80 transition-all duration-1000`}
                      style={{
                        width: `${(count / maxCount) * 100}%`,
                        transitionDelay: `${500 + index * 100}ms`
                      }}
                    />
                    <div className="absolute inset-0 flex items-center px-3">
                      <span className="text-sm font-medium text-foreground mix-blend-difference">
                        {count > 0 ? `${Math.round((count / totalSessions) * 100)}%` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: '900ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                학습 성과
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover-elevate transition-all">
                <span className="text-sm">90점 이상 획득</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  {scoreDistribution[0].count}회
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover-elevate transition-all">
                <span className="text-sm">연속 학습</span>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  {totalSessions}일
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover-elevate transition-all">
                <span className="text-sm">완료한 문장</span>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                  {totalSessions}개
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in slide-in-from-right duration-500" style={{ animationDelay: '1000ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                학습 팁
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {averageScore >= 80 ? (
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 animate-in fade-in zoom-in duration-500">
                  <p className="text-sm font-medium text-green-500">훌륭해요!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    평균 점수가 80점 이상입니다. 더 어려운 문장에 도전해보세요!
                  </p>
                </div>
              ) : averageScore >= 60 ? (
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 animate-in fade-in zoom-in duration-500">
                  <p className="text-sm font-medium text-blue-500">잘하고 있어요!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    꾸준히 연습하면 더 좋은 결과를 얻을 수 있습니다.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 animate-in fade-in zoom-in duration-500">
                  <p className="text-sm font-medium text-yellow-500">계속 도전하세요!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    느린 속도로 연습하고, 정확한 발음에 집중해보세요.
                  </p>
                </div>
              )}

              {improvement > 5 && (
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20 animate-in fade-in zoom-in duration-500" style={{ animationDelay: '100ms' }}>
                  <p className="text-sm font-medium text-purple-500">발전 중!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    최근 점수가 {improvement.toFixed(1)}점 향상되었습니다!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
