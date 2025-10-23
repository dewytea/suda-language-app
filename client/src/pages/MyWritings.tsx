import { useLocation } from 'wouter';
import { 
  ArrowLeft,
  FileText,
  Calendar,
  Award,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import type { WritingSubmission, WritingTopic } from '@shared/schema';

interface SubmissionWithTopic extends WritingSubmission {
  topic: WritingTopic;
}

export default function MyWritings() {
  const [, setLocation] = useLocation();
  
  const { data: submissions, isLoading } = useQuery<SubmissionWithTopic[]>({
    queryKey: ['/api/writing/submissions']
  });
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" data-testid="loader-submissions" />
        <p className="text-muted-foreground">글 목록을 불러오는 중...</p>
      </div>
    );
  }
  
  const sortedSubmissions = submissions?.sort((a, b) => {
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  }) || [];
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setLocation('/learn/writing')}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          주제 목록으로
        </Button>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="heading-title">내가 쓴 글</h1>
          <p className="text-muted-foreground" data-testid="text-description">
            지금까지 작성한 글과 AI 첨삭 결과를 확인해보세요
          </p>
        </div>
        
        {/* 통계 카드 */}
        {submissions && submissions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card data-testid="card-total-count">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 작성한 글</CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-count">
                  {submissions.length}개
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="card-avg-score">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">평균 점수</CardTitle>
                <Award className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-avg-score">
                  {submissions.filter(s => s.aiScore).length > 0
                    ? Math.round(
                        submissions
                          .filter(s => s.aiScore)
                          .reduce((sum, s) => sum + (s.aiScore || 0), 0) /
                          submissions.filter(s => s.aiScore).length
                      )
                    : 0}
                  점
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="card-avg-words">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">평균 단어 수</CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-avg-words">
                  {Math.round(
                    submissions.reduce((sum, s) => sum + s.wordCount, 0) / submissions.length
                  )}
                  words
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* 글 목록 */}
        {sortedSubmissions.length === 0 ? (
          <Card data-testid="card-empty">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">아직 작성한 글이 없어요</p>
              <Button onClick={() => setLocation('/learn/writing')} data-testid="button-start-writing">
                지금 글쓰기 시작하기
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedSubmissions.map((submission) => {
              const scoreColor = submission.aiScore
                ? submission.aiScore >= 90
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : submission.aiScore >= 80
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : submission.aiScore >= 70
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                : '';
              
              return (
                <Card
                  key={submission.id}
                  className="hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setLocation(`/learn/writing/feedback/${submission.id}`)}
                  data-testid={`card-submission-${submission.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1" data-testid={`title-${submission.id}`}>
                          {submission.topic.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1" data-testid={`date-${submission.id}`}>
                            <Calendar className="w-3 h-3" />
                            {new Date(submission.submittedAt).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <span data-testid={`words-${submission.id}`}>
                            {submission.wordCount} words
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {submission.aiScore !== null && submission.aiScore !== undefined && (
                          <Badge className={scoreColor} data-testid={`badge-score-${submission.id}`}>
                            {submission.aiScore}점
                          </Badge>
                        )}
                        {!submission.aiScore && (
                          <Badge variant="outline" data-testid={`badge-no-score-${submission.id}`}>
                            평가 대기
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`preview-${submission.id}`}>
                      {submission.content}
                    </p>
                    
                    {submission.grammarErrors && submission.grammarErrors.length > 0 && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground" data-testid={`error-count-${submission.id}`}>
                        <AlertCircle className="w-3 h-3 text-destructive" />
                        문법 오류 {submission.grammarErrors.length}개 발견
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
