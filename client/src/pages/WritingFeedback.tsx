import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { 
  ArrowLeft, 
  Award, 
  CheckCircle, 
  AlertCircle,
  Lightbulb,
  ThumbsUp,
  TrendingUp,
  Loader2,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import type { WritingSubmission, WritingTopic } from '@shared/schema';

interface GrammarError {
  original: string;
  corrected: string;
  explanation: string;
  type: string;
}

interface Suggestion {
  category: string;
  issue: string;
  suggestion: string;
  example?: string;
}

interface SubmissionWithTopic extends WritingSubmission {
  topic: WritingTopic;
}

export default function WritingFeedback() {
  const [, params] = useRoute('/learn/writing/feedback/:id');
  const [, setLocation] = useLocation();
  const [showCorrected, setShowCorrected] = useState(false);
  const id = params?.id ? parseInt(params.id) : null;
  
  const { data: submission, isLoading } = useQuery<SubmissionWithTopic>({
    queryKey: [`/api/writing/submissions/${id}`],
    enabled: !!id
  });
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" data-testid="loader-feedback" />
        <p className="text-muted-foreground">AI가 첨삭 중입니다...</p>
      </div>
    );
  }
  
  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-3" data-testid="icon-not-found" />
        <p className="text-muted-foreground mb-4">피드백을 찾을 수 없어요</p>
        <Button onClick={() => setLocation('/learn/writing')} data-testid="button-back-to-topics">
          목록으로 돌아가기
        </Button>
      </div>
    );
  }
  
  const hasGPTFeedback = submission.grammarErrors || submission.suggestions || submission.correctedContent;
  const score = submission.aiScore || 0;
  
  const scoreColor = 
    score >= 90 ? 'text-green-600' :
    score >= 80 ? 'text-blue-600' :
    score >= 70 ? 'text-yellow-600' :
    score >= 60 ? 'text-orange-600' : 'text-red-600';
  
  const ScoreIcon = 
    score >= 90 ? Award :
    score >= 80 ? ThumbsUp :
    score >= 70 ? Lightbulb :
    score >= 60 ? FileText : TrendingUp;
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setLocation('/learn/writing/my-writings')}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          내가 쓴 글 목록
        </Button>
        
        {/* 주제 정보 */}
        <Card className="mb-6" data-testid="card-topic-info">
          <CardHeader>
            <CardTitle className="text-2xl">{submission.topic.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{submission.topic.prompt}</p>
          </CardHeader>
        </Card>
        
        {/* 점수 */}
        {submission.aiScore && (
          <Card className="mb-6" data-testid="card-score">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <ScoreIcon className="w-16 h-16 text-primary" data-testid="icon-score" />
                </div>
                <div className={`text-5xl font-bold mb-2 ${scoreColor}`} data-testid="text-score">
                  {score}점
                </div>
                <p className="text-muted-foreground mb-6" data-testid="text-score-message">
                  {score >= 90 ? 'Excellent! 훌륭해요!' :
                   score >= 80 ? 'Good! 잘했어요!' :
                   score >= 70 ? 'Satisfactory. 괜찮아요!' :
                   score >= 60 ? 'Needs improvement. 조금 더 노력해봐요!' :
                   'Keep practicing! 계속 연습하면 잘하게 될 거예요!'}
                </p>
                
                {submission.aiFeedback && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-2xl mx-auto" data-testid="card-overall-feedback">
                    <p className="text-sm">{submission.aiFeedback}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* 원본 vs 교정본 */}
        {hasGPTFeedback && submission.correctedContent && (
          <Card className="mb-6" data-testid="card-content-comparison">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>내가 쓴 글</CardTitle>
                <Button
                  variant={showCorrected ? "default" : "outline"}
                  onClick={() => setShowCorrected(!showCorrected)}
                  size="sm"
                  data-testid="button-toggle-corrected"
                >
                  {showCorrected ? '원본 보기' : '교정본 보기'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-6 border" data-testid="text-content">
                <p className="leading-relaxed whitespace-pre-wrap">
                  {showCorrected ? submission.correctedContent : submission.content}
                </p>
              </div>
              
              {showCorrected && (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground" data-testid="text-corrected-notice">
                  <Lightbulb className="w-4 h-4" />
                  이것은 AI가 교정한 버전입니다. 원본과 비교해보세요!
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* 문법 오류 */}
        {hasGPTFeedback && submission.grammarErrors && submission.grammarErrors.length > 0 && (
          <Card className="mb-6" data-testid="card-grammar-errors">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-destructive" />
                <CardTitle>
                  문법 오류 ({submission.grammarErrors.length}개)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {submission.grammarErrors.map((error: GrammarError, index: number) => (
                <div
                  key={index}
                  className="bg-destructive/10 border border-destructive/20 rounded-lg p-4"
                  data-testid={`error-${index}`}
                >
                  <div className="flex items-start gap-3">
                    <Badge variant="destructive" className="text-xs" data-testid={`badge-error-type-${index}`}>
                      {error.type}
                    </Badge>
                    <div className="flex-1 space-y-2">
                      <div>
                        <span className="text-sm font-medium text-destructive">틀린 표현: </span>
                        <span className="text-sm line-through" data-testid={`text-original-${index}`}>
                          {error.original}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">올바른 표현: </span>
                        <span className="text-sm font-semibold" data-testid={`text-corrected-${index}`}>
                          {error.corrected}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-explanation-${index}`}>
                        {error.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {/* 개선 제안 */}
        {hasGPTFeedback && submission.suggestions && submission.suggestions.length > 0 && (
          <Card className="mb-6" data-testid="card-suggestions">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-600" />
                <CardTitle>
                  개선 제안 ({submission.suggestions.length}개)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {submission.suggestions.map((suggestion: Suggestion, index: number) => (
                <div
                  key={index}
                  className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
                  data-testid={`suggestion-${index}`}
                >
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="text-xs bg-yellow-100 dark:bg-yellow-900" data-testid={`badge-suggestion-category-${index}`}>
                      {suggestion.category}
                    </Badge>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium" data-testid={`text-suggestion-issue-${index}`}>
                        {suggestion.issue}
                      </p>
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground" data-testid={`text-suggestion-text-${index}`}>
                          {suggestion.suggestion}
                        </p>
                      </div>
                      {suggestion.example && (
                        <div className="bg-background rounded p-3 border" data-testid={`text-suggestion-example-${index}`}>
                          <p className="text-xs text-muted-foreground mb-1">예시:</p>
                          <p className="text-sm">
                            {suggestion.example}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {/* 잘한 점 */}
        {submission.aiStrengths && submission.aiStrengths.length > 0 && (
          <Card className="mb-6" data-testid="card-strengths">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-6 h-6 text-green-600" />
                <CardTitle>잘한 점</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {submission.aiStrengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start gap-2" data-testid={`strength-${index}`}>
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        {/* 개선할 점 */}
        {submission.areasForImprovement && submission.areasForImprovement.length > 0 && (
          <Card className="mb-6" data-testid="card-areas-for-improvement">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <CardTitle>개선할 점</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {submission.areasForImprovement.map((area: string, index: number) => (
                  <li key={index} className="flex items-start gap-2" data-testid={`improvement-${index}`}>
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        {/* 액션 버튼 */}
        <div className="flex gap-3" data-testid="action-buttons">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setLocation('/learn/writing')}
            data-testid="button-new-writing"
          >
            새 글 쓰기
          </Button>
          <Button
            className="flex-1"
            onClick={() => setLocation('/learn/writing/my-writings')}
            data-testid="button-my-writings"
          >
            내 글 목록
          </Button>
        </div>
      </div>
    </div>
  );
}
