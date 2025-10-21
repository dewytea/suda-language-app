import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, TrendingUp, Target, Award, BarChart3 } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function ListeningStats() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/listening/stats'],
    queryFn: async () => {
      const response = await fetch('/api/listening/stats', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const {
    totalCompleted = 0,
    averageScore = 0,
    averageAccuracy = 0,
    categoryStats = [],
    difficultyStats = []
  } = stats || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-center gap-3">
          <Link href="/learn/listening">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">통계</h1>
            <p className="text-sm text-muted-foreground mt-1">
              당신의 학습 성과를 확인하세요
            </p>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">완료한 레슨</div>
              <div className="text-2xl font-bold text-foreground">{totalCompleted}</div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">평균 점수</div>
              <div className="text-2xl font-bold text-foreground">{Math.round(averageScore)}점</div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">평균 정확도</div>
              <div className="text-2xl font-bold text-foreground">{averageAccuracy.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Stats */}
      {categoryStats.length > 0 && (
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">카테고리별 통계</h2>
          </div>
          <div className="space-y-3">
            {categoryStats.map((cat: any) => (
              <div key={cat.category} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium text-foreground">{cat.category}</div>
                  <div className="text-sm text-muted-foreground">{cat.count}회 연습</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">{Math.round(cat.avgScore)}점</div>
                  <div className="text-sm text-muted-foreground">{cat.avgAccuracy.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Difficulty Stats */}
      {difficultyStats.length > 0 && (
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">난이도별 통계</h2>
          </div>
          <div className="space-y-3">
            {difficultyStats.map((diff: any) => (
              <div key={diff.difficulty} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Level {diff.difficulty}</div>
                  <div className="text-sm text-muted-foreground">{diff.count}회 연습</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">{Math.round(diff.avgScore)}점</div>
                  <div className="text-sm text-muted-foreground">{diff.avgAccuracy.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link href="/learn/listening/history" className="flex-1">
          <Button variant="outline" className="w-full">
            학습 기록 보기
          </Button>
        </Link>
        <Link href="/learn/listening" className="flex-1">
          <Button className="w-full">
            연습 시작하기
          </Button>
        </Link>
      </div>
    </div>
  );
}
