import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Clock, BookOpen, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClickableText from '@/components/vocabulary/ClickableText';
import ReadingQuestions from '@/components/reading/ReadingQuestions';
import { supabase } from '@/lib/supabase';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { ReadingPassage as PassageType, ReadingQuestion } from '@shared/schema';

export default function ReadingPassage() {
  const [, params] = useRoute('/learn/reading/:id');
  const [, setLocation] = useLocation();
  const passageId = params?.id ? parseInt(params.id) : null;
  
  const [startTime] = useState(new Date());
  const [showTranslations, setShowTranslations] = useState<Set<number>>(new Set());
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const { data: passage, isLoading: passageLoading } = useQuery<PassageType>({
    queryKey: ['/api/reading/passages', passageId],
    enabled: !!passageId,
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`/api/reading/passages/${passageId}`, {
        credentials: 'include',
        headers,
      });

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    },
  });

  const { data: questionsData, isLoading: questionsLoading } = useQuery<{ questions: ReadingQuestion[] }>({
    queryKey: ['/api/reading/questions', passageId],
    enabled: !!passageId,
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`/api/reading/questions/${passageId}`, {
        credentials: 'include',
        headers,
      });

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/reading/progress', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reading/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reading/progress'] });
    },
  });

  const toggleTranslation = (index: number) => {
    const newSet = new Set(showTranslations);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setShowTranslations(newSet);
  };

  const handleSubmit = () => {
    if (!passage || !questionsData?.questions) return;

    const questions = questionsData.questions;
    const correctCount = questions.filter((q, index) => {
      return selectedAnswers[index.toString()] === q.correctAnswer;
    }).length;

    const score = Math.round((correctCount / questions.length) * 100);
    const endTime = new Date();
    const readingTime = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const wpm = passage.wordCount ? Math.round((passage.wordCount / readingTime) * 60) : 0;

    submitMutation.mutate({
      passageId: passage.id,
      answers: selectedAnswers,
      score,
      correctCount,
      totalCount: questions.length,
      readingTime,
      wpm,
    });
  };

  if (!passageId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>지문을 찾을 수 없습니다.</p>
      </div>
    );
  }

  if (passageLoading || questionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse">로딩 중...</div>
      </div>
    );
  }

  if (!passage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>지문을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const paragraphs = passage.paragraphs || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation('/learn/reading')}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{passage.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{passage.wordCount} 단어</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>약 {Math.ceil((passage.estimatedTime || 60) / 60)}분</span>
            </div>
            <span>Level {passage.difficulty}</span>
          </div>
        </div>
      </div>

      <Card data-testid="card-passage-content">
        <CardHeader>
          <CardTitle>지문</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {paragraphs.length > 0 ? (
            paragraphs.map((para, index) => (
              <div key={index} className="space-y-3">
                <div className="text-base leading-relaxed">
                  <ClickableText text={para.text} />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTranslation(index)}
                    data-testid={`button-toggle-translation-${index}`}
                    className="h-8"
                  >
                    {showTranslations.has(index) ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" />
                        <span>해석 숨기기</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        <span>해석 보기</span>
                      </>
                    )}
                  </Button>
                </div>

                {showTranslations.has(index) && (
                  <div 
                    className="p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground"
                    data-testid={`text-translation-${index}`}
                  >
                    {para.translation}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="space-y-3">
              <div className="text-base leading-relaxed">
                <ClickableText text={passage.content} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!showQuestions && (
        <div className="flex justify-center">
          <Button
            onClick={() => setShowQuestions(true)}
            size="lg"
            data-testid="button-show-questions"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            독해 문제 풀기
          </Button>
        </div>
      )}

      {showQuestions && questionsData?.questions && (
        <ReadingQuestions
          questions={questionsData.questions}
          selectedAnswers={selectedAnswers}
          onAnswerChange={setSelectedAnswers}
          onSubmit={handleSubmit}
          isSubmitting={submitMutation.isPending}
          submitted={submitMutation.isSuccess}
        />
      )}
    </div>
  );
}
