import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { PenLine, ArrowLeft, Send, Loader2, CheckCircle2, XCircle, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { WritingTopic, WritingSubmission } from '@shared/schema';

export default function WritingEditor() {
  const [, params] = useRoute('/writing/editor/:id');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const topicId = params?.id ? parseInt(params.id) : null;
  
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [submission, setSubmission] = useState<WritingSubmission | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  }, [content]);

  const { data: topic, isLoading: topicLoading } = useQuery<WritingTopic>({
    queryKey: ['/api/writing/topics', topicId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      
      const response = await fetch(`/api/writing/topics/${topicId}`, {
        credentials: 'include',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !!topicId,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/writing/submit', {
        topicId,
        content,
        wordCount
      });
      return await res.json();
    },
    onSuccess: (data: WritingSubmission) => {
      setSubmission(data);
      toast({
        title: '제출 완료',
        description: '글이 성공적으로 제출되었습니다.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/writing/submissions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/writing/stats'] });
    },
    onError: (error: any) => {
      toast({
        title: '제출 실패',
        description: error.message || '글 제출에 실패했습니다.',
        variant: 'destructive',
      });
    },
  });

  const evaluateMutation = useMutation({
    mutationFn: async (submissionId: number) => {
      const res = await apiRequest('POST', `/api/writing/evaluate/${submissionId}`, {});
      return await res.json();
    },
    onSuccess: (data: WritingSubmission) => {
      setSubmission(data);
      setIsEvaluating(false);
      toast({
        title: 'AI 평가 완료',
        description: '글에 대한 피드백이 준비되었습니다.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/writing/submissions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/writing/stats'] });
    },
    onError: (error: any) => {
      setIsEvaluating(false);
      toast({
        title: 'AI 평가 실패',
        description: error.message || 'AI 평가에 실패했습니다.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: '내용을 입력해주세요',
        description: '글을 작성한 후 제출해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (topic?.wordCountMin && wordCount < topic.wordCountMin) {
      toast({
        title: '단어 수가 부족합니다',
        description: `최소 ${topic.wordCountMin}개의 단어가 필요합니다.`,
        variant: 'destructive',
      });
      return;
    }

    submitMutation.mutate();
  };

  const handleEvaluate = async () => {
    if (!submission) return;
    
    setIsEvaluating(true);
    evaluateMutation.mutate(submission.id);
  };

  const handleReset = () => {
    setContent('');
    setWordCount(0);
    setSubmission(null);
    toast({
      title: '초기화 완료',
      description: '새로운 글을 작성할 수 있습니다.',
    });
  };

  if (topicLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">주제를 찾을 수 없습니다</p>
              <Button onClick={() => setLocation('/writing')} className="mt-4" data-testid="button-back-to-list">
                목록으로 돌아가기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ['입문', '초급', '중급', '고급', '전문'];
    return labels[difficulty - 1] || '';
  };

  const getWordCountProgress = () => {
    if (!topic.wordCountMax) return 0;
    return Math.min((wordCount / topic.wordCountMax) * 100, 100);
  };

  const getWordCountColor = () => {
    if (!topic.wordCountMin) return 'text-foreground';
    if (wordCount < topic.wordCountMin) return 'text-orange-600 dark:text-orange-400';
    if (topic.wordCountMax && wordCount > topic.wordCountMax) return 'text-red-600 dark:text-red-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setLocation('/writing')}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록으로 돌아가기
        </Button>

        <Card className="mb-6" data-testid="card-topic-info">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge data-testid="badge-difficulty">
                    Lv.{topic.difficulty} - {getDifficultyLabel(topic.difficulty)}
                  </Badge>
                  <Badge variant="outline" data-testid="badge-category">
                    {topic.category}
                  </Badge>
                </div>
                <CardTitle className="text-2xl mb-2" data-testid="text-topic-title">
                  {topic.title}
                </CardTitle>
                <p className="text-muted-foreground" data-testid="text-topic-description">
                  {topic.description}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-foreground">주제</h3>
                <p className="text-sm text-foreground bg-muted p-3 rounded-lg" data-testid="text-topic-prompt">
                  {topic.prompt}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-foreground">작성 가이드</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {topic.guidelines.map((guideline, index) => (
                    <li key={index} className="flex items-start gap-2" data-testid={`text-guideline-${index}`}>
                      <span className="text-primary mt-0.5">•</span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {topic.wordCountMin && topic.wordCountMax && (
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">단어 수 목표</h3>
                  <p className="text-sm text-muted-foreground">
                    {topic.wordCountMin} - {topic.wordCountMax} 단어
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {!submission ? (
          <Card data-testid="card-editor">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenLine className="w-5 h-5" />
                글 작성하기
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="여기에 글을 작성해주세요..."
                className="min-h-[300px] resize-none"
                data-testid="textarea-content"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">단어 수</span>
                  <span className={`font-semibold ${getWordCountColor()}`} data-testid="text-word-count">
                    {wordCount} / {topic.wordCountMax || '∞'}
                  </span>
                </div>
                {topic.wordCountMax && (
                  <Progress value={getWordCountProgress()} className="h-2" data-testid="progress-wordcount" />
                )}
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={!content}
                  data-testid="button-reset"
                >
                  초기화
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending || !content.trim()}
                  data-testid="button-submit"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      제출 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      제출하기
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card data-testid="card-submitted-content">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  제출한 글
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap text-foreground" data-testid="text-submitted-content">
                  {submission.content}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span data-testid="text-submitted-wordcount">단어 수: {submission.wordCount}</span>
                  <span>•</span>
                  <span data-testid="text-submitted-date">
                    {new Date(submission.submittedAt).toLocaleString('ko-KR')}
                  </span>
                </div>
              </CardContent>
            </Card>

            {!submission.aiScore ? (
              <Card data-testid="card-evaluate">
                <CardContent className="p-6 text-center">
                  <Lightbulb className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2 text-foreground">AI 피드백 받기</h3>
                  <p className="text-muted-foreground mb-4">
                    AI가 작성한 글을 분석하고 상세한 피드백을 제공합니다
                  </p>
                  <Button
                    onClick={handleEvaluate}
                    disabled={isEvaluating}
                    size="lg"
                    data-testid="button-evaluate"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        AI 평가 중...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        AI 평가 받기
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card data-testid="card-score">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      평가 결과
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-primary mb-2" data-testid="text-ai-score">
                        {submission.aiScore}점
                      </div>
                      <p className="text-muted-foreground">100점 만점</p>
                    </div>

                    {submission.aiStrengths && submission.aiStrengths.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          잘한 점
                        </h3>
                        <ul className="space-y-2">
                          {submission.aiStrengths.map((strength, index) => (
                            <li 
                              key={index} 
                              className="text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-foreground"
                              data-testid={`text-strength-${index}`}
                            >
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {submission.aiWeaknesses && submission.aiWeaknesses.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                          <XCircle className="w-5 h-5 text-red-600" />
                          개선할 점
                        </h3>
                        <ul className="space-y-2">
                          {submission.aiWeaknesses.map((weakness, index) => (
                            <li 
                              key={index} 
                              className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-foreground"
                              data-testid={`text-weakness-${index}`}
                            >
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {submission.aiFeedback && (
                      <div className="mb-6">
                        <h3 className="font-semibold mb-3 text-foreground">상세 피드백</h3>
                        <p className="text-sm bg-muted p-4 rounded-lg whitespace-pre-wrap text-foreground" data-testid="text-ai-feedback">
                          {submission.aiFeedback}
                        </p>
                      </div>
                    )}

                    {submission.aiSuggestions && submission.aiSuggestions.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                          <Lightbulb className="w-5 h-5 text-yellow-600" />
                          개선 제안
                        </h3>
                        <ul className="space-y-2">
                          {submission.aiSuggestions.map((suggestion, index) => (
                            <li 
                              key={index} 
                              className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-foreground"
                              data-testid={`text-suggestion-${index}`}
                            >
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setLocation('/writing')}
                    data-testid="button-back-to-topics"
                  >
                    목록으로
                  </Button>
                  <Button
                    onClick={handleReset}
                    data-testid="button-write-again"
                  >
                    <PenLine className="w-4 h-4 mr-2" />
                    다시 작성하기
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
