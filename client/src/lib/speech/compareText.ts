export interface TextComparisonResult {
  accuracy: number;
  matchedWords: string[];
  missedWords: string[];
  extraWords: string[];
  totalWords: number;
  matchedCount: number;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function compareText(
  original: string,
  spoken: string
): TextComparisonResult {
  const originalNormalized = normalizeText(original);
  const spokenNormalized = normalizeText(spoken);
  
  const originalWords = originalNormalized.split(' ').filter(w => w.length > 0);
  const spokenWords = spokenNormalized.split(' ').filter(w => w.length > 0);
  
  const matchedWords: string[] = [];
  const missedWords: string[] = [];
  const originalWordsUsed = new Set<number>();
  const spokenWordsUsed = new Set<number>();
  
  originalWords.forEach((origWord, origIndex) => {
    const spokenIndex = spokenWords.findIndex((spWord, idx) => 
      !spokenWordsUsed.has(idx) && spWord === origWord
    );
    
    if (spokenIndex !== -1) {
      matchedWords.push(origWord);
      originalWordsUsed.add(origIndex);
      spokenWordsUsed.add(spokenIndex);
    }
  });
  
  originalWords.forEach((word, index) => {
    if (!originalWordsUsed.has(index)) {
      missedWords.push(word);
    }
  });
  
  const extraWords = spokenWords.filter((_, index) => !spokenWordsUsed.has(index));
  
  const accuracy = originalWords.length > 0 
    ? Math.round((matchedWords.length / originalWords.length) * 100)
    : 0;
  
  return {
    accuracy,
    matchedWords,
    missedWords,
    extraWords,
    totalWords: originalWords.length,
    matchedCount: matchedWords.length
  };
}
