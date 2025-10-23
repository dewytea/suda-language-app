import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Lightbulb, CheckCircle } from 'lucide-react';
import { AudioPlayerAdvanced } from './AudioPlayerAdvanced';
import { DictationInput } from './DictationInput';
import ResultModal from './ResultModal';
import ClickableText from '@/components/vocabulary/ClickableText';
import { compareTexts, getHighlightedWords, type ComparisonResult } from '@/lib/listening/scoreUtils';
import { Button } from '@/components/ui/button';
import type { ListeningLesson } from '@shared/schema';

interface ListeningCardLongProps {
  lesson: ListeningLesson;
  onClose: () => void;
  onComplete: () => void;
}

export default function ListeningCardLong({ lesson, onClose, onComplete }: ListeningCardLongProps) {
  // 학습 단계: 'overview' (전체 듣기) → 'detail' (문장별 학습)
  const [learningStage, setLearningStage] = useState<'overview' | 'detail'>('overview');
  
  // 전체 듣기 모드 상태
  const [showFullTranslation, setShowFullTranslation] = useState(false);
  const [fullListenCount, setFullListenCount] = useState(0);
  
  // 문장별 학습 모드 상태
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [showSentenceTranslation, setShowSentenceTranslation] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const paragraphs = lesson.paragraphs || [];
  const currentParagraph = paragraphs[currentSentenceIndex];
  const isLastSentence = currentSentenceIndex === paragraphs.length - 1;
  
  // 전체 듣기 완료 핸들러
  const handleFullAudioComplete = () => {
    setFullListenCount(prev => prev + 1);
  };
  
  // 문장별 학습 단계로 이동
  const handleStartDetailLearning = () => {
    setLearningStage('detail');
    setCurrentSentenceIndex(0);
  };
  
  // 전체 듣기로 돌아가기
  const handleBackToOverview = () => {
    setLearningStage('overview');
    setCurrentSentenceIndex(0);
    setSubmitted(false);
    setUserAnswer('');
    setResult(null);
  };
  
  // 다음 문장으로
  const handleNextSentence = () => {
    if (currentSentenceIndex < paragraphs.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
      setSubmitted(false);
      setUserAnswer('');
      setResult(null);
      setShowResult(false);
      setShowSentenceTranslation(false);
    }
  };
  
  // 이전 문장으로
  const handlePrevSentence = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(prev => prev - 1);
      setSubmitted(false);
      setUserAnswer('');
      setResult(null);
      setShowResult(false);
      setShowSentenceTranslation(false);
    }
  };
  
  // 받아쓰기 제출
  const handleSubmit = async (answer: string) => {
    if (!currentParagraph) return;
    
    setUserAnswer(answer);
    setSubmitted(true);
    
    const comparisonResult = compareTexts(currentParagraph.text, answer);
    setResult(comparisonResult);
    setShowResult(true);
  };
  
  const handleRetry = () => {
    setSubmitted(false);
    setUserAnswer('');
    setResult(null);
    setShowResult(false);
  };
  
  const handleResultNext = () => {
    setShowResult(false);
    if (isLastSentence) {
      onComplete();
    } else {
      handleNextSentence();
    }
  };
  
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-background dark:bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* 헤더 */}
          <div className="sticky top-0 bg-background dark:bg-background border-b px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-bold text-foreground" data-testid="text-learning-stage">
                {learningStage === 'overview' ? '1단계: 전체 듣기' : '2단계: 문장별 학습'}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-muted-foreground" data-testid="text-difficulty">
                  Level {lesson.difficulty}
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground" data-testid="text-category">
                  {lesson.category}
                </span>
                {learningStage === 'detail' && (
                  <>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground" data-testid="text-progress">
                      {currentSentenceIndex + 1} / {paragraphs.length}
                    </span>
                  </>
                )}
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
          
          {/* 컨텐츠 */}
          <div className="p-6">
            {learningStage === 'overview' ? (
              /* ===== 1단계: 전체 듣기 모드 ===== */
              <div className="space-y-6">
                {/* 안내 메시지 */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4" data-testid="guide-overview">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        1단계: 전체 내용 파악하기
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        먼저 전체 내용을 여러 번 들으며 큰 흐름을 파악하세요.
                        준비가 되면 "문장별 학습 시작" 버튼을 눌러주세요.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* 전체 오디오 플레이어 */}
                <div data-testid="full-audio-player">
                  <AudioPlayerAdvanced
                    text={lesson.text}
                    onPlayComplete={handleFullAudioComplete}
                  />
                </div>
                
                {/* 재생 횟수 */}
                {fullListenCount > 0 && (
                  <div className="text-center" data-testid="listen-count">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      {fullListenCount}회 들었어요
                    </span>
                  </div>
                )}
                
                {/* 전체 스크립트 */}
                <div className="bg-muted/50 rounded-xl border p-6" data-testid="full-script">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">
                      전체 스크립트
                      <span className="text-sm text-muted-foreground font-normal ml-2">
                        (단어를 클릭하면 뜻을 볼 수 있어요)
                      </span>
                    </h3>
                    <Button
                      variant={showFullTranslation ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setShowFullTranslation(!showFullTranslation)}
                      data-testid="button-toggle-full-translation"
                    >
                      {showFullTranslation ? '번역 숨기기' : '번역 보기'}
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {paragraphs.map((para, index) => (
                      <div
                        key={index}
                        className="p-4 bg-background rounded-lg border"
                        data-testid={`overview-paragraph-${index}`}
                      >
                        <div className="text-foreground mb-2 leading-relaxed">
                          <ClickableText text={para.text} />
                        </div>
                        {showFullTranslation && (
                          <p className="text-sm text-muted-foreground pt-2 border-t" data-testid={`overview-translation-${index}`}>
                            {para.translation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 다음 단계 버튼 */}
                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={handleStartDetailLearning}
                    className="gap-3 shadow-lg"
                    data-testid="button-start-detail-learning"
                  >
                    문장별 학습 시작하기
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ) : (
              /* ===== 2단계: 문장별 학습 모드 ===== */
              <div className="space-y-6">
                {/* 진행 상황 */}
                <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4" data-testid="progress-bar-container">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-100" data-testid="sentence-progress">
                      문장 {currentSentenceIndex + 1} / {paragraphs.length}
                    </span>
                    <button
                      onClick={handleBackToOverview}
                      className="text-sm text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-1 rounded"
                      data-testid="button-back-to-overview"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      전체 듣기로 돌아가기
                    </button>
                  </div>
                  <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                    <div
                      className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full transition-all"
                      style={{
                        width: `${((currentSentenceIndex + 1) / paragraphs.length) * 100}%`
                      }}
                      data-testid="progress-bar"
                    />
                  </div>
                </div>
                
                {/* 현재 문장 */}
                {currentParagraph && (
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-6" data-testid="current-sentence-container">
                    <h3 className="font-semibold text-foreground mb-4">
                      현재 문장
                    </h3>
                    <div className="text-lg text-foreground mb-3 leading-relaxed" data-testid="current-sentence-text">
                      <ClickableText text={currentParagraph.text} />
                    </div>
                    <button
                      onClick={() => setShowSentenceTranslation(!showSentenceTranslation)}
                      className="text-sm text-primary hover:text-primary/80 hover-elevate px-2 py-1 rounded"
                      data-testid="button-toggle-sentence-translation"
                    >
                      {showSentenceTranslation ? '번역 숨기기' : '번역 보기'}
                    </button>
                    {showSentenceTranslation && (
                      <p className="text-sm text-muted-foreground mt-2 pt-2 border-t" data-testid="sentence-translation">
                        {currentParagraph.translation}
                      </p>
                    )}
                  </div>
                )}
                
                {/* 오디오 플레이어 */}
                {currentParagraph && (
                  <div data-testid="sentence-audio-player">
                    <AudioPlayerAdvanced
                      text={currentParagraph.text}
                    />
                  </div>
                )}
                
                {/* 받아쓰기 */}
                {!submitted && (
                  <div data-testid="dictation-input-container">
                    <DictationInput onSubmit={handleSubmit} />
                  </div>
                )}
                
                {/* 네비게이션 버튼 */}
                {!submitted && (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handlePrevSentence}
                      disabled={currentSentenceIndex === 0}
                      className="flex-1 gap-2"
                      data-testid="button-prev-sentence"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      이전 문장
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleNextSentence}
                      disabled={isLastSentence}
                      className="flex-1 gap-2"
                      data-testid="button-next-sentence"
                    >
                      다음 문장
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 결과 모달 */}
      {result && currentParagraph && (
        <ResultModal
          isOpen={showResult}
          result={result}
          highlightedWords={getHighlightedWords(currentParagraph.text, result)}
          originalText={currentParagraph.text}
          userAnswer={userAnswer}
          onRetry={handleRetry}
          onNext={handleResultNext}
          onClose={() => setShowResult(false)}
        />
      )}
    </>
  );
}
