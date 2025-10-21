import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, CheckCircle2, Volume2 } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import type { ListeningProgress, ListeningLesson } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function ListeningHistory() {
  const { user } = useAuth();

  const { data: progressData, isLoading } = useQuery<{ progress: ListeningProgress[] }>({
    queryKey: ['/api/listening/progress'],
    queryFn: async () => {
      const response = await fetch('/api/listening/progress', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch progress');
      return response.json();
    }
  });

  const progress = progressData?.progress || [];

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
            <h1 className="text-2xl font-bold text-foreground">학습 기록</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {progress.length}개의 연습 세션
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : progress.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <Volume2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            아직 연습 기록이 없어요
          </h3>
          <p className="text-muted-foreground mb-6">
            Listening 연습을 시작하면 여기에 기록이 남아요
          </p>
          <Link href="/learn/listening">
            <Button>연습 시작하기</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {progress.map((item) => (
            <div
              key={item.id}
              className="bg-card border rounded-xl p-5"
              data-testid={`progress-${item.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Lesson #{item.lessonId}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDistanceToNow(new Date(item.completedAt), {
                          addSuffix: true,
                          locale: ko
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">점수</div>
                      <div className={`text-xl font-bold ${item.score >= 70 ? 'text-green-600' : item.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {item.score}점
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">정확도</div>
                      <div className="text-xl font-bold text-foreground">
                        {item.accuracy.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
