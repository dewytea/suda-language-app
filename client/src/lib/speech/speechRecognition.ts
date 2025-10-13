interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionAlternative[];
  [index: number]: SpeechRecognitionAlternative[];
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export function isSpeechRecognitionSupported(): boolean {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function startSpeechRecognition(
  language: string,
  onResult: (transcript: string, confidence: number) => void,
  onError: (error: string) => void,
  onStart?: () => void,
  onEnd?: () => void
): SpeechRecognitionInstance | null {
  if (!isSpeechRecognitionSupported()) {
    onError('음성 인식이 지원되지 않는 브라우저입니다. Chrome이나 Edge를 사용해주세요.');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = language;
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    console.log('Speech recognition started');
    onStart?.();
  };

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const result = event.results[0][0];
    const transcript = result.transcript;
    const confidence = result.confidence;
    
    console.log('Speech recognition result:', transcript, 'confidence:', confidence);
    onResult(transcript, confidence);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error('Speech recognition error:', event.error);
    
    let errorMessage = '음성 인식 실패';
    switch (event.error) {
      case 'no-speech':
        errorMessage = '음성이 감지되지 않았습니다. 다시 시도해주세요.';
        break;
      case 'audio-capture':
        errorMessage = '마이크를 사용할 수 없습니다. 마이크 연결을 확인해주세요.';
        break;
      case 'not-allowed':
        errorMessage = '마이크 권한이 거부되었습니다. 설정에서 마이크 권한을 허용해주세요.';
        break;
      case 'network':
        errorMessage = '네트워크 오류가 발생했습니다.';
        break;
      default:
        errorMessage = `음성 인식 오류: ${event.error}`;
    }
    
    onError(errorMessage);
  };

  recognition.onend = () => {
    console.log('Speech recognition ended');
    onEnd?.();
  };

  try {
    recognition.start();
    return recognition;
  } catch (error) {
    console.error('Failed to start speech recognition:', error);
    onError('음성 인식을 시작할 수 없습니다.');
    return null;
  }
}

export const LANGUAGE_CODES: Record<string, string> = {
  'en': 'en-US',
  'ko': 'ko-KR',
  'es': 'es-ES',
  'ja': 'ja-JP',
  'zh': 'zh-CN',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'ar': 'ar-SA',
  'hi': 'hi-IN',
  'pt': 'pt-BR'
};

export function getLanguageCode(language: string): string {
  return LANGUAGE_CODES[language] || 'en-US';
}
