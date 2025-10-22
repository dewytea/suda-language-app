import { useState, useRef } from 'react';
import { Eye, EyeOff, FileText, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioPlayerAdvanced, type AudioPlayerAdvancedRef } from './AudioPlayerAdvanced';
import ClickableText from '@/components/vocabulary/ClickableText';
import type { ListeningLesson } from '@shared/schema';

interface LongContentPlayerProps {
  lesson: ListeningLesson;
}

export function LongContentPlayer({ lesson }: LongContentPlayerProps) {
  const [currentParagraph, setCurrentParagraph] = useState<number | null>(null);
  const [showTranslations, setShowTranslations] = useState<boolean[]>(
    lesson.paragraphs?.map(() => false) || []
  );
  const audioPlayerRef = useRef<AudioPlayerAdvancedRef>(null);
  
  const paragraphs = lesson.paragraphs || [];
  
  const toggleTranslation = (index: number) => {
    setShowTranslations(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };
  
  const toggleAllTranslations = () => {
    const allShown = showTranslations.every(s => s);
    setShowTranslations(paragraphs.map(() => !allShown));
  };
  
  const playParagraph = (index: number) => {
    setCurrentParagraph(index);
    // Trigger playback after state update
    setTimeout(() => {
      audioPlayerRef.current?.play();
    }, 100);
  };
  
  const playAll = () => {
    setCurrentParagraph(null);
    // Trigger playback after state update
    setTimeout(() => {
      audioPlayerRef.current?.play();
    }, 100);
  };
  
  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">긴 컨텐츠</h3>
          <span className="text-sm text-muted-foreground">
            ({lesson.wordCount || 0} 단어, 약 {lesson.estimatedDuration || 0}초)
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAllTranslations}
          data-testid="button-toggle-all-translations"
        >
          {showTranslations.every(s => s) ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              전체 번역 숨기기
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              전체 번역 보기
            </>
          )}
        </Button>
      </div>
      
      {/* Audio Player */}
      <AudioPlayerAdvanced
        ref={audioPlayerRef}
        text={lesson.text}
        paragraphs={paragraphs}
        currentParagraph={currentParagraph ?? undefined}
      />
      
      {/* Play all button */}
      {currentParagraph !== null && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={playAll}
            data-testid="button-play-all"
          >
            <Play className="w-4 h-4 mr-2" />
            전체 재생
          </Button>
        </div>
      )}
      
      {/* Paragraphs */}
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          <div
            key={index}
            className={`bg-card rounded-xl border p-5 transition-all ${
              currentParagraph === index
                ? 'ring-2 ring-primary border-primary'
                : 'hover-elevate'
            }`}
            data-testid={`paragraph-${index}`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <ClickableText
                  text={paragraph.text}
                  className="text-foreground leading-relaxed"
                />
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => playParagraph(index)}
                  className="p-2 bg-primary/10 hover-elevate active-elevate-2 rounded-lg transition-colors"
                  title="이 문단 재생"
                  data-testid={`button-play-paragraph-${index}`}
                >
                  <Play className="w-4 h-4 text-primary" />
                </button>
                
                <button
                  onClick={() => toggleTranslation(index)}
                  className="p-2 bg-muted hover-elevate active-elevate-2 rounded-lg transition-colors"
                  title={showTranslations[index] ? '번역 숨기기' : '번역 보기'}
                  data-testid={`button-toggle-translation-${index}`}
                >
                  {showTranslations[index] ? (
                    <EyeOff className="w-4 h-4 text-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-foreground" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Translation */}
            {showTranslations[index] && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {paragraph.translation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Full text translation (always hidden by default) */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
        <h4 className="font-semibold text-foreground mb-3">전체 번역</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {lesson.translation}
        </p>
      </div>
    </div>
  );
}
