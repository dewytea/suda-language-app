import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { ReadingQuestion } from '@shared/schema';

interface ReadingQuestionsProps {
  questions: ReadingQuestion[];
  selectedAnswers: Record<string, string>;
  onAnswerChange: (answers: Record<string, string>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitted: boolean;
}

const questionTypeNames = {
  main_idea: '주제',
  detail: '세부사항',
  inference: '추론',
  vocabulary: '어휘'
};

const questionTypeColors = {
  main_idea: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  detail: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  inference: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  vocabulary: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
};

export default function ReadingQuestions({
  questions,
  selectedAnswers,
  onAnswerChange,
  onSubmit,
  isSubmitting,
  submitted
}: ReadingQuestionsProps) {
  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    if (submitted) return;
    
    onAnswerChange({
      ...selectedAnswers,
      [questionIndex.toString()]: answer
    });
  };

  const allAnswered = questions.every((_, index) => {
    return selectedAnswers[index.toString()] !== undefined;
  });

  const getAnswerStatus = (questionIndex: number, option: string) => {
    if (!submitted) return null;
    
    const question = questions[questionIndex];
    const selected = selectedAnswers[questionIndex.toString()];
    const isCorrect = question.correctAnswer === option;
    const isSelected = selected === option;

    if (isSelected && isCorrect) return 'correct';
    if (isSelected && !isCorrect) return 'incorrect';
    if (!isSelected && isCorrect) return 'missed';
    return null;
  };

  const getAnswerStyle = (status: string | null) => {
    if (status === 'correct') return 'bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-500';
    if (status === 'incorrect') return 'bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-500';
    if (status === 'missed') return 'bg-yellow-100 border-yellow-500 dark:bg-yellow-900/30 dark:border-yellow-500';
    return 'border-border hover-elevate';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            독해 문제
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map((question, qIndex) => {
            const correctCount = submitted
              ? questions.slice(0, qIndex + 1).filter((q, i) => {
                  return selectedAnswers[i.toString()] === q.correctAnswer;
                }).length
              : 0;

            return (
              <div key={question.id} className="space-y-4 pb-6 border-b last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {qIndex + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-medium">{question.questionText}</p>
                      <Badge 
                        className={questionTypeColors[question.questionType]}
                        data-testid={`badge-question-type-${qIndex}`}
                      >
                        {questionTypeNames[question.questionType]}
                      </Badge>
                    </div>

                    <div className="space-y-2 mt-4">
                      {question.options.map((option, oIndex) => {
                        const status = getAnswerStatus(qIndex, option);
                        const isSelected = selectedAnswers[qIndex.toString()] === option;

                        return (
                          <button
                            key={oIndex}
                            onClick={() => handleAnswerSelect(qIndex, option)}
                            disabled={submitted}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${getAnswerStyle(status)} ${
                              isSelected && !submitted ? 'border-primary bg-primary/5' : ''
                            } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                            data-testid={`button-answer-${qIndex}-${oIndex}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold">
                                {String.fromCharCode(65 + oIndex)}
                              </div>
                              <span className="flex-1">{option}</span>
                              {status === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                              {status === 'incorrect' && <XCircle className="w-5 h-5 text-red-600" />}
                              {status === 'missed' && <CheckCircle2 className="w-5 h-5 text-yellow-600" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {submitted && question.explanation && (
                      <div 
                        className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800"
                        data-testid={`text-explanation-${qIndex}`}
                      >
                        <p className="text-sm">
                          <span className="font-semibold text-blue-700 dark:text-blue-300">설명:</span>{' '}
                          <span className="text-blue-600 dark:text-blue-400">{question.explanation}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {!submitted && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={onSubmit}
                disabled={!allAnswered || isSubmitting}
                size="lg"
                data-testid="button-submit-answers"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                {isSubmitting ? '제출 중...' : '답안 제출'}
              </Button>
            </div>
          )}

          {submitted && (
            <div className="pt-4">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                <CardContent className="p-6">
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-bold">
                      {questions.filter((q, i) => selectedAnswers[i.toString()] === q.correctAnswer).length} / {questions.length}
                    </p>
                    <p className="text-muted-foreground">
                      정답률: {Math.round((questions.filter((q, i) => selectedAnswers[i.toString()] === q.correctAnswer).length / questions.length) * 100)}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
