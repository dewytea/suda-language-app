interface FeedbackParams {
  score: number;
  missedWords: string[];
  extraWords: string[];
  accuracy: number;
}

export interface FeedbackResult {
  feedback: string;
  isAI: boolean;
}

export function generateLocalFeedback(params: FeedbackParams): string | null {
  const { score, missedWords, extraWords, accuracy } = params;

  // 완벽한 경우 (90점 이상, 놓친 단어 없음)
  if (score >= 90 && missedWords.length === 0) {
    return "완벽해요! 발음이 아주 정확합니다! 🎉\n계속 이렇게 연습하면 원어민처럼 말할 수 있을 거예요!\n💡 팁: 다음 단계로 더 어려운 문장에 도전해보세요!";
  }

  // 매우 좋은 경우 (80-89점)
  if (score >= 80) {
    if (missedWords.length === 0) {
      return "정말 잘했어요! 발음이 거의 완벽합니다! 👍\n조금만 더 연습하면 완벽할 거예요!\n💡 팁: 문장의 리듬과 억양에 신경 써보세요!";
    } else if (missedWords.length <= 2) {
      return `잘했어요! 거의 다 맞았습니다! 😊\n"${missedWords.join(', ')}" 부분만 다시 연습해보세요!\n💡 팁: 놓친 단어를 천천히 반복해서 말해보세요!`;
    }
  }

  // 좋은 경우 (70-79점)
  if (score >= 70) {
    if (missedWords.length <= 1) {
      return "괜찮아요! 계속 연습하면 더 좋아질 거예요! 🙂\n발음의 정확도를 조금 더 높여보세요!\n💡 팁: 원어민 발음을 여러 번 듣고 따라 해보세요!";
    } else if (missedWords.length <= 3) {
      return `좋아요! 조금만 더 노력하면 됩니다! 💪\n"${missedWords.slice(0, 2).join(', ')}" 등의 단어를 집중적으로 연습해보세요!\n💡 팁: 각 단어를 개별적으로 먼저 연습한 후 문장 전체를 말해보세요!`;
    }
  }

  // 보통 경우 (50-69점)
  if (score >= 50) {
    if (missedWords.length <= 2 && extraWords.length === 0) {
      return "괜찮아요! 다시 도전해봐요! 😊\n발음에 좀 더 신경 쓰면 점수가 올라갈 거예요!\n💡 팁: 천천히, 명확하게 발음하는 것이 중요해요!";
    }
  }

  // 복잡한 경우는 AI 피드백 필요
  return null;
}

export async function generateAIFeedback(params: FeedbackParams & { 
  originalText: string; 
  spokenText: string; 
}): Promise<string> {
  const { originalText, spokenText, score, missedWords, extraWords } = params;

  try {
    const response = await fetch('/api/speaking/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originalText,
        spokenText,
        score,
        missedWords,
        extraWords
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get AI feedback');
    }

    const { feedback } = await response.json();
    return feedback;
  } catch (error) {
    console.error('AI feedback error:', error);
    // 폴백 피드백
    return "좋은 시도였어요! 💪\n계속 연습하면 발음이 더 좋아질 거예요!\n💡 팁: 녹음을 들어보면서 원어민 발음과 비교해보세요!";
  }
}

export async function getFeedback(params: FeedbackParams & { 
  originalText: string; 
  spokenText: string; 
}): Promise<FeedbackResult> {
  // 먼저 로컬 피드백 시도 (무료)
  const localFeedback = generateLocalFeedback(params);
  
  if (localFeedback) {
    return {
      feedback: localFeedback,
      isAI: false
    };
  }

  // 복잡한 경우 AI 피드백 사용
  const aiFeedback = await generateAIFeedback(params);
  return {
    feedback: aiFeedback,
    isAI: true
  };
}
