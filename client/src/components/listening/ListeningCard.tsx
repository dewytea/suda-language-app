import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import { DictationInput } from './DictationInput';
import { Button } from '@/components/ui/button';
import type { ListeningLesson } from '@shared/schema';

interface ListeningCardProps {
  lesson: ListeningLesson;
  onClose: () => void;
  onComplete: (score: number, accuracy: number, userAnswer: string) => void;
}

export function ListeningCard({ lesson, onClose, onComplete }: ListeningCardProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  
  const calculateScore = (answer: string, correctText: string): { score: number; accuracy: number } => {
    const userWords = answer.toLowerCase().trim().split(/\s+/).filter(w => w);
    const correctWords = correctText.toLowerCase().trim().split(/\s+/).filter(w => w);
    
    if (correctWords.length === 0) return { score: 0, accuracy: 0 };
    
    // Levenshtein distance for word sequences
    const levenshteinDistance = (a: string[], b: string[]): number => {
      const matrix: number[][] = [];
      
      for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
      }
      
      for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
      }
      
      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b[i - 1] === a[j - 1]) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1, // substitution
              matrix[i][j - 1] + 1,     // insertion
              matrix[i - 1][j] + 1      // deletion
            );
          }
        }
      }
      
      return matrix[b.length][a.length];
    };
    
    const distance = levenshteinDistance(userWords, correctWords);
    const maxLength = Math.max(userWords.length, correctWords.length);
    
    // Similarity ratio based on edit distance
    const similarity = maxLength > 0 ? (1 - distance / maxLength) : 0;
    const accuracy = similarity * 100;
    const score = Math.max(0, Math.min(100, Math.round(accuracy)));
    
    return { score, accuracy };
  };
  
  const handleSubmit = (answer: string) => {
    setUserAnswer(answer);
    const result = calculateScore(answer, lesson.text);
    setScore(result.score);
    setAccuracy(result.accuracy);
    setSubmitted(true);
  };
  
  const handleComplete = () => {
    onComplete(score, accuracy, userAnswer);
  };
  
  const handleRetry = () => {
    setSubmitted(false);
    setUserAnswer('');
    setScore(0);
    setAccuracy(0);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-background rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Listening 연습</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-muted-foreground">
                Level {lesson.difficulty}
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {lesson.category}
              </span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover-elevate active-elevate-2 rounded-lg transition-colors"
            data-testid="button-close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* 콘텐츠 */}
        <div className="p-6 space-y-6">
          {/* 번역 토글 */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTranslation(!showTranslation)}
              data-testid="button-toggle-translation"
            >
              {showTranslation ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  번역 숨기기
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  번역 보기
                </>
              )}
            </Button>
          </div>
          
          {/* 번역 */}
          {showTranslation && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
              <p className="text-foreground text-center">
                {lesson.translation}
              </p>
            </div>
          )}
          
          {/* 오디오 플레이어 */}
          <AudioPlayer text={lesson.text} />
          
          {/* 받아쓰기 입력 또는 결과 */}
          {!submitted ? (
            <DictationInput onSubmit={handleSubmit} />
          ) : (
            <div className="bg-card rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">제출 완료!</h3>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${score >= 70 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {score}점
                  </div>
                  <div className="text-sm text-muted-foreground">
                    정확도: {accuracy.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">당신의 답변:</p>
                  <p className="text-foreground bg-muted p-4 rounded-lg" data-testid="text-user-answer">
                    {userAnswer}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">정답:</p>
                  <p className="text-foreground bg-green-50 dark:bg-green-950/30 p-4 rounded-lg" data-testid="text-correct-answer">
                    {lesson.text}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="flex-1"
                  data-testid="button-retry"
                >
                  다시 연습하기
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1"
                  data-testid="button-next"
                >
                  다음 레슨
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
