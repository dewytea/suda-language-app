import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  text: string;
  onPlayComplete?: () => void;
}

export function AudioPlayer({ text, onPlayComplete }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Web Speech API 지원 확인
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setIsSupported(false);
      return;
    }
    
    try {
      // Web Speech API 초기화
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      utteranceRef.current.lang = 'en-US';
      utteranceRef.current.rate = 0.9; // 약간 느리게
      utteranceRef.current.pitch = 1;
      
      utteranceRef.current.onend = () => {
        setIsPlaying(false);
        setProgress(100);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        onPlayComplete?.();
      };
    } catch (error) {
      console.error('Failed to initialize SpeechSynthesisUtterance:', error);
      setIsSupported(false);
      return;
    }
    
    return () => {
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (error) {
          console.error('Failed to cancel speech synthesis:', error);
        }
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [text, onPlayComplete]);
  
  const handlePlay = () => {
    if (!isSupported || !utteranceRef.current || !('speechSynthesis' in window)) return;
    
    if (isPlaying) {
      // 일시정지
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    } else {
      // 재생
      setProgress(0);
      window.speechSynthesis.speak(utteranceRef.current);
      setIsPlaying(true);
      
      // 진행률 시뮬레이션
      const words = text.split(' ').length;
      const estimatedDuration = words * 0.5 * 1000; // 단어당 0.5초 추정
      const interval = estimatedDuration / 100;
      
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }
            return 100;
          }
          return prev + 1;
        });
      }, interval);
    }
  };
  
  const handleRestart = () => {
    if (!isSupported || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    setProgress(0);
    setIsPlaying(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };
  
  if (!isSupported) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl border border-yellow-200 dark:border-yellow-800 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Volume2 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <h3 className="font-semibold text-foreground">오디오</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          이 브라우저는 오디오 재생을 지원하지 않습니다. Chrome, Edge, Safari 등 최신 브라우저를 사용해주세요.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Volume2 className="w-5 h-5 text-green-600 dark:text-green-400" />
        <h3 className="font-semibold text-foreground">오디오</h3>
      </div>
      
      {/* 진행 바 */}
      <div className="mb-4">
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* 컨트롤 */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleRestart}
          disabled={!isSupported}
          className="p-3 bg-background hover-elevate active-elevate-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="처음부터"
          data-testid="button-restart-audio"
        >
          <RotateCcw className="w-5 h-5 text-foreground" />
        </button>
        
        <button
          onClick={handlePlay}
          disabled={!isSupported}
          className="p-4 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          title={isPlaying ? '일시정지' : '재생'}
          data-testid="button-play-pause"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-0.5" />
          )}
        </button>
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-3">
        {isPlaying ? '재생 중...' : '재생 버튼을 눌러 시작하세요'}
      </p>
    </div>
  );
}
