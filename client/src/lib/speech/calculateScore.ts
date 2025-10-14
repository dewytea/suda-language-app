export interface ScoringResult {
  score: number;
  feedback: string;
}

export function calculateScore(
  accuracy: number,
  originalLength: number,
  spokenLength: number,
  confidence: number = 1.0
): ScoringResult {
  let score = accuracy;
  
  const lengthRatio = spokenLength / originalLength;
  if (lengthRatio < 0.7) {
    score -= 15;
  } else if (lengthRatio > 1.3) {
    score -= 10;
  }
  
  const confidenceBonus = Math.round((confidence - 0.8) * 10);
  if (confidence >= 0.8) {
    score += Math.max(0, confidenceBonus);
  }
  
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  let feedback = '';
  
  if (score >= 90) {
    feedback = '완벽해요!';
  } else if (score >= 70) {
    feedback = '잘했어요!';
  } else if (score >= 50) {
    feedback = '괜찮아요! 다시 해볼까요?';
  } else {
    feedback = '다시 연습해봐요!';
  }
  
  return { score, feedback };
}

export function getXPReward(score: number): number {
  if (score >= 90) return 30;
  if (score >= 70) return 20;
  if (score >= 50) return 10;
  return 5;
}
