// 텍스트 정규화 (대소문자, 구두점 제거)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, '') // 구두점 제거
    .replace(/\s+/g, ' ') // 여러 공백을 하나로
    .trim();
}

// 단어 배열로 분리
function getWords(text: string): string[] {
  return normalizeText(text).split(' ').filter(word => word.length > 0);
}

// 레벤슈타인 거리 (편집 거리)
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // 삭제
        matrix[i][j - 1] + 1, // 삽입
        matrix[i - 1][j - 1] + cost // 교체
      );
    }
  }

  return matrix[len1][len2];
}

// 두 단어가 비슷한지 체크 (오타 허용)
function isSimilar(word1: string, word2: string, threshold: number = 0.8): boolean {
  if (word1 === word2) return true;
  
  const maxLen = Math.max(word1.length, word2.length);
  const distance = levenshteinDistance(word1, word2);
  const similarity = 1 - distance / maxLen;
  
  return similarity >= threshold;
}

// 메인 비교 결과 인터페이스
export interface ComparisonResult {
  correctWords: string[]; // 정확히 맞은 단어
  incorrectWords: Array<{ // 틀린 단어
    user: string;
    correct: string;
    position: number;
  }>;
  missedWords: string[]; // 놓친 단어 (말 안 함)
  extraWords: string[]; // 추가 단어 (원본에 없음)
  accuracy: number; // 정확도 (0-100)
  score: number; // 최종 점수 (0-100)
}

// 위치별 단어 상태를 추적하는 확장 인터페이스
interface WordStatus {
  word: string;
  position: number;
  status: 'correct' | 'incorrect' | 'missed';
  userWord?: string;
}

export function compareTexts(
  originalText: string,
  userText: string
): ComparisonResult {
  const originalWords = getWords(originalText);
  const userWords = getWords(userText);
  
  const correctWords: string[] = [];
  const incorrectWords: Array<{ user: string; correct: string; position: number }> = [];
  const missedWords: string[] = [];
  const extraWords: string[] = [];
  
  // 단어별 비교
  const maxLength = Math.max(originalWords.length, userWords.length);
  
  for (let i = 0; i < maxLength; i++) {
    const original = originalWords[i];
    const user = userWords[i];
    
    if (!original && user) {
      // 추가된 단어
      extraWords.push(user);
    } else if (original && !user) {
      // 놓친 단어
      missedWords.push(original);
    } else if (original && user) {
      if (original === user) {
        // 정확히 맞음
        correctWords.push(original);
      } else if (isSimilar(original, user, 0.8)) {
        // 비슷함 (오타 허용) - 정답으로 처리
        correctWords.push(original);
      } else {
        // 완전히 다름
        incorrectWords.push({
          user: user,
          correct: original,
          position: i
        });
      }
    }
  }
  
  // 정확도 계산
  const totalWords = originalWords.length;
  const correctCount = correctWords.length;
  const accuracy = totalWords > 0 ? Math.round((correctCount / totalWords) * 100) : 0;
  
  // 점수 계산 (페널티 적용)
  let score = accuracy;
  
  // 틀린 단어 페널티 (-2점씩)
  score -= incorrectWords.length * 2;
  
  // 놓친 단어 페널티 (-3점씩, 더 중요)
  score -= missedWords.length * 3;
  
  // 추가 단어 페널티 (-1점씩)
  score -= extraWords.length * 1;
  
  // 최소 0점, 최대 100점
  score = Math.max(0, Math.min(100, score));
  
  return {
    correctWords,
    incorrectWords,
    missedWords,
    extraWords,
    accuracy,
    score
  };
}

// 단어 하이라이트용 (원본 텍스트에 색상 정보 추가)
export interface HighlightedWord {
  word: string;
  status: 'correct' | 'incorrect' | 'missed';
  userWord?: string; // 틀렸을 때 사용자가 입력한 단어
}

export function getHighlightedWords(
  originalText: string,
  comparisonResult: ComparisonResult
): HighlightedWord[] {
  const originalWords = getWords(originalText);
  const highlighted: HighlightedWord[] = [];
  
  // 위치별로 상태를 정확히 추적
  // correctWords, missedWords는 배열이므로 순서대로 소비
  const correctIndices = new Set<number>();
  const missedIndices = new Set<number>();
  
  // incorrectWords는 이미 position을 가지고 있음
  const incorrectMap = new Map<number, { user: string; correct: string }>();
  comparisonResult.incorrectWords.forEach(item => {
    incorrectMap.set(item.position, { user: item.user, correct: item.correct });
  });
  
  // 원본 단어를 순회하면서 상태 결정
  let correctIdx = 0;
  let missedIdx = 0;
  
  for (let i = 0; i < originalWords.length; i++) {
    const word = originalWords[i];
    
    // 먼저 틀린 단어인지 확인 (position 기반)
    if (incorrectMap.has(i)) {
      const incorrect = incorrectMap.get(i)!;
      highlighted.push({
        word,
        status: 'incorrect',
        userWord: incorrect.user
      });
    } 
    // 맞은 단어인지 확인 (순서대로 매칭)
    else if (correctIdx < comparisonResult.correctWords.length && 
             comparisonResult.correctWords[correctIdx] === word) {
      highlighted.push({ word, status: 'correct' });
      correctIdx++;
    }
    // 놓친 단어인지 확인 (순서대로 매칭)
    else if (missedIdx < comparisonResult.missedWords.length && 
             comparisonResult.missedWords[missedIdx] === word) {
      highlighted.push({ word, status: 'missed' });
      missedIdx++;
    }
    // 예상치 못한 경우 - 안전장치
    else {
      // 맞은 단어 배열에서 다시 검색
      if (comparisonResult.correctWords.includes(word)) {
        highlighted.push({ word, status: 'correct' });
      } else if (comparisonResult.missedWords.includes(word)) {
        highlighted.push({ word, status: 'missed' });
      } else {
        // 기본값
        highlighted.push({ word, status: 'missed' });
      }
    }
  }
  
  return highlighted;
}
