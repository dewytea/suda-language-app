import { Trophy, TrendingUp, AlertCircle, CheckCircle, XCircle, X, RotateCcw, ArrowRight } from 'lucide-react';
import type { ComparisonResult, HighlightedWord } from '@/lib/listening/scoreUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultModalProps {
  isOpen: boolean;
  result: ComparisonResult;
  highlightedWords: HighlightedWord[];
  originalText: string;
  userAnswer: string;
  onRetry: () => void;
  onNext: () => void;
  onClose: () => void;
}

export default function ResultModal({
  isOpen,
  result,
  highlightedWords,
  originalText,
  userAnswer,
  onRetry,
  onNext,
  onClose
}: ResultModalProps) {
  if (!isOpen) return null;
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400';
    if (score >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  const getScoreMessage = (score: number) => {
    if (score >= 90) return '완벽해요!';
    if (score >= 70) return '잘했어요!';
    if (score >= 50) return '괜찮아요!';
    return '다시 한번 연습해봐요!';
  };
  
  const getScoreIcon = (score: number) => {
    if (score >= 90) return Trophy;
    if (score >= 70) return TrendingUp;
    if (score >= 50) return AlertCircle;
    return RotateCcw;
  };
  
  const ScoreIcon = getScoreIcon(result.score);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* 점수 헤더 */}
        <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 text-center relative pb-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover-elevate active-elevate-2 rounded-lg transition-colors"
            data-testid="button-close-result"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-background rounded-full">
              <ScoreIcon className={`w-12 h-12 ${getScoreColor(result.score)}`} />
            </div>
          </div>
          
          <h2 className={`text-5xl font-bold mb-2 ${getScoreColor(result.score)}`}>
            {result.score}점
          </h2>
          <p className="text-lg text-muted-foreground">{getScoreMessage(result.score)}</p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* 정확도 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">정확도</span>
              <span className="text-sm font-semibold text-foreground">{result.accuracy}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  result.accuracy >= 90
                    ? 'bg-green-600 dark:bg-green-500'
                    : result.accuracy >= 70
                    ? 'bg-blue-600 dark:bg-blue-500'
                    : result.accuracy >= 50
                    ? 'bg-orange-600 dark:bg-orange-500'
                    : 'bg-red-600 dark:bg-red-500'
                }`}
                style={{ width: `${result.accuracy}%` }}
              />
            </div>
          </div>
          
          {/* 통계 */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {result.correctWords.length}
                </p>
                <p className="text-xs text-muted-foreground">맞은 단어</p>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4 text-center">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {result.missedWords.length}
                </p>
                <p className="text-xs text-muted-foreground">놓친 단어</p>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
              <CardContent className="p-4 text-center">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {result.incorrectWords.length}
                </p>
                <p className="text-xs text-muted-foreground">틀린 단어</p>
              </CardContent>
            </Card>
          </div>
          
          {/* 하이라이트된 정답 */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">정답 (단어별 분석)</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {highlightedWords.map((item, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-lg font-medium ${
                        item.status === 'correct'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : item.status === 'missed'
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}
                      title={
                        item.status === 'incorrect'
                          ? `당신의 답변: "${item.userWord}"`
                          : undefined
                      }
                      data-testid={`word-${item.status}-${index}`}
                    >
                      {item.word}
                      {item.status === 'incorrect' && item.userWord && (
                        <span className="text-xs ml-1">
                          (입력: {item.userWord})
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 당신의 답변 */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">당신의 답변</h3>
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <p className="text-foreground">{userAnswer}</p>
              </CardContent>
            </Card>
          </div>
          
          {/* 놓친 단어 상세 */}
          {result.missedWords.length > 0 && (
            <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <h4 className="font-semibold text-orange-800 dark:text-orange-300">
                    놓친 단어들
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missedWords.map((word, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-background rounded-lg text-orange-800 dark:text-orange-300 font-medium"
                      data-testid={`missed-word-${index}`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-400 mt-3">
                  이 단어들을 다시 들어보세요!
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* 틀린 단어 상세 */}
          {result.incorrectWords.length > 0 && (
            <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <h4 className="font-semibold text-red-800 dark:text-red-300">
                    틀린 단어들
                  </h4>
                </div>
                <div className="space-y-2">
                  {result.incorrectWords.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-background rounded-lg p-3"
                      data-testid={`incorrect-word-${index}`}
                    >
                      <div>
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          입력: "{item.user}"
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          정답: "{item.correct}"
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* 추가 단어 */}
          {result.extraWords.length > 0 && (
            <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                  추가된 단어들
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-400 mb-2">
                  원본에 없는 단어를 입력했어요
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.extraWords.map((word, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-background rounded-lg text-purple-800 dark:text-purple-300 font-medium"
                      data-testid={`extra-word-${index}`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onRetry}
              className="flex-1"
              data-testid="button-retry"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              다시 연습하기
            </Button>
            <Button
              onClick={onNext}
              className="flex-1"
              data-testid="button-next"
            >
              다음 레슨
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
