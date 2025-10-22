import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioPlayerAdvancedProps {
  text: string;
  paragraphs?: { text: string; translation: string }[];
  currentParagraph?: number;
  onPlayComplete?: () => void;
}

export interface AudioPlayerAdvancedRef {
  play: () => void;
  pause: () => void;
  restart: () => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5];

export const AudioPlayerAdvanced = forwardRef<AudioPlayerAdvancedRef, AudioPlayerAdvancedProps>(
  function AudioPlayerAdvanced({ 
    text, 
    paragraphs, 
    currentParagraph,
    onPlayComplete 
  }, ref) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isSupported, setIsSupported] = useState(true);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    
    // Determine which text to play
    const textToPlay = paragraphs && currentParagraph !== undefined
      ? paragraphs[currentParagraph]?.text || text
      : text;
    
    useEffect(() => {
      // Web Speech API support check
      if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
        setIsSupported(false);
        return;
      }
      
      try {
        // Initialize Web Speech API
        utteranceRef.current = new SpeechSynthesisUtterance(textToPlay);
        utteranceRef.current.lang = 'en-US';
        utteranceRef.current.rate = playbackRate;
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
    }, [textToPlay, playbackRate, onPlayComplete]);
    
    const startPlayback = () => {
      if (!isSupported || !utteranceRef.current || !('speechSynthesis' in window)) return;
      
      setProgress(0);
      utteranceRef.current.rate = playbackRate;
      window.speechSynthesis.speak(utteranceRef.current);
      setIsPlaying(true);
      
      // Progress simulation
      const words = textToPlay.split(' ').length;
      const estimatedDuration = (words * 0.5 * 1000) / playbackRate;
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
    };
    
    const stopPlayback = () => {
      if (!isSupported || !('speechSynthesis' in window)) return;
      
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
    
    const handlePlay = () => {
      if (isPlaying) {
        stopPlayback();
      } else {
        startPlayback();
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
    
    const handleSpeedChange = (speed: number) => {
      const wasPlaying = isPlaying;
      
      if (isPlaying) {
        stopPlayback();
      }
      
      setPlaybackRate(speed);
      
      // If was playing, restart with new speed
      if (wasPlaying && utteranceRef.current) {
        setTimeout(() => {
          startPlayback();
        }, 100);
      }
    };
    
    // Expose play, pause, restart methods to parent
    useImperativeHandle(ref, () => ({
      play: startPlayback,
      pause: stopPlayback,
      restart: handleRestart,
    }));
    
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-foreground">오디오</h3>
          </div>
          
          {/* Speed control */}
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4 text-muted-foreground mr-1" />
            {SPEED_OPTIONS.map((speed) => (
              <Button
                key={speed}
                variant={playbackRate === speed ? "default" : "ghost"}
                size="sm"
                onClick={() => handleSpeedChange(speed)}
                disabled={!isSupported}
                className="h-7 px-2 text-xs"
                data-testid={`button-speed-${speed}`}
              >
                {speed}x
              </Button>
            ))}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Controls */}
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
          {isPlaying ? `재생 중 (${playbackRate}x)...` : `재생 속도: ${playbackRate}x`}
        </p>
      </div>
    );
  }
);
