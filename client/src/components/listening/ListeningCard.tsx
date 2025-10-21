import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import { DictationInput } from './DictationInput';
import ResultModal from './ResultModal';
import { Button } from '@/components/ui/button';
import type { ListeningLesson } from '@shared/schema';
import { compareTexts, getHighlightedWords, type ComparisonResult } from '@/lib/listening/scoreUtils';

interface ListeningCardProps {
  lesson: ListeningLesson;
  onClose: () => void;
  onComplete: (score: number, accuracy: number, userAnswer: string) => void;
}

export function ListeningCard({ lesson, onClose, onComplete }: ListeningCardProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  
  const handleSubmit = (answer: string) => {
    setUserAnswer(answer);
    
    // 텍스트 비교 및 점수 계산
    const comparisonResult = compareTexts(lesson.text, answer);
    setResult(comparisonResult);
    setSubmitted(true);
    setShowResultModal(true);
  };
  
  const handleRetry = () => {
    setSubmitted(false);
    setUserAnswer('');
    setResult(null);
    setShowResultModal(false);
  };
  
  const handleNext = () => {
    if (result) {
      onComplete(result.score, result.accuracy, userAnswer);
    }
  };
  
  const handleCloseResult = () => {
    setShowResultModal(false);
  };
  
  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50">
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
            
            {/* 받아쓰기 입력 */}
            {!submitted && (
              <DictationInput onSubmit={handleSubmit} />
            )}
          </div>
        </div>
      </div>
      
      {/* 결과 모달 */}
      {result && (
        <ResultModal
          isOpen={showResultModal}
          result={result}
          highlightedWords={getHighlightedWords(lesson.text, result)}
          originalText={lesson.text}
          userAnswer={userAnswer}
          onRetry={handleRetry}
          onNext={handleNext}
          onClose={handleCloseResult}
        />
      )}
    </>
  );
}
