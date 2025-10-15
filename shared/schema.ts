import { z } from "zod";

// User Progress
export const userProgress = {
  id: z.number(),
  userId: z.string(),
  language: z.string(),
  level: z.number(),
  totalPoints: z.number(),
  streakDays: z.number(),
  speakingProgress: z.number(),
  readingProgress: z.number(),
  listeningProgress: z.number(),
  writingProgress: z.number(),
};

export const insertUserProgressSchema = z.object({
  userId: z.string(),
  language: z.string(),
  level: z.number().default(1),
  totalPoints: z.number().default(0),
  streakDays: z.number().default(0),
  speakingProgress: z.number().default(0),
  readingProgress: z.number().default(0),
  listeningProgress: z.number().default(0),
  writingProgress: z.number().default(0),
});

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = InsertUserProgress & { id: number };

// Vocabulary Items
export const insertVocabularySchema = z.object({
  userId: z.string(),
  word: z.string(),
  translation: z.string(),
  example: z.string().optional(),
  language: z.string(),
});

export type InsertVocabulary = z.infer<typeof insertVocabularySchema>;
export type Vocabulary = InsertVocabulary & { id: number };

// Key Sentences
export const insertKeySentenceSchema = z.object({
  sentence: z.string(),
  translation: z.string(),
  language: z.string(),
  scenario: z.string().optional(),
  category: z.enum(["daily", "travel", "business"]).default("daily"),
  difficulty: z.number().min(1).max(5).default(1),
  memorized: z.boolean().default(false),
});

export type InsertKeySentence = z.infer<typeof insertKeySentenceSchema>;
export type KeySentence = InsertKeySentence & { id: number };

// Notes
export const insertNoteSchema = z.object({
  userId: z.string(),
  content: z.string(),
  skill: z.enum(["speaking", "reading", "listening", "writing"]),
  language: z.string(),
});

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = InsertNote & { id: number; createdAt: Date };

// Review Items
export const insertReviewItemSchema = z.object({
  userId: z.string(),
  question: z.string(),
  answer: z.string(),
  language: z.string(),
  skill: z.enum(["speaking", "reading", "listening", "writing"]),
});

export type InsertReviewItem = z.infer<typeof insertReviewItemSchema>;
export type ReviewItem = InsertReviewItem & { id: number; nextReview: Date };

// Achievements
export const insertAchievementSchema = z.object({
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  unlocked: z.boolean().default(false),
  unlockedAt: z.date().optional(),
});

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = InsertAchievement & { id: number };

// Pronunciation Results
export const insertPronunciationResultSchema = z.object({
  userId: z.string(),
  sentence: z.string(),
  score: z.number(),
  language: z.string(),
  feedback: z.string().optional(),
});

export type InsertPronunciationResult = z.infer<typeof insertPronunciationResultSchema>;
export type PronunciationResult = InsertPronunciationResult & { id: number; createdAt: Date };

// Writing Results
export const insertWritingResultSchema = z.object({
  userId: z.string(),
  prompt: z.string(),
  userText: z.string(),
  score: z.number(),
  corrections: z.array(z.object({
    original: z.string(),
    corrected: z.string(),
    type: z.enum(["grammar", "vocabulary", "spelling"]),
  })),
  suggestions: z.array(z.string()),
  language: z.string(),
  saved: z.boolean().default(false),
});

export type InsertWritingResult = z.infer<typeof insertWritingResultSchema>;
export type WritingResult = InsertWritingResult & { id: number; createdAt: Date };

// Speaking Progress
export const insertSpeakingProgressSchema = z.object({
  userId: z.string(),
  language: z.string(),
  completedSentences: z.number().default(0),
  averageScore: z.number().default(0),
  todayStudyTime: z.number().default(0),
  lastStudyDate: z.string().optional(),
});

export type InsertSpeakingProgress = z.infer<typeof insertSpeakingProgressSchema>;
export type SpeakingProgress = InsertSpeakingProgress & { id: number };

// Favorite Sentences
export const insertFavoriteSentenceSchema = z.object({
  userId: z.string(),
  sentenceId: z.number(),
  language: z.string(),
});

export type InsertFavoriteSentence = z.infer<typeof insertFavoriteSentenceSchema>;
export type FavoriteSentence = InsertFavoriteSentence & { id: number; createdAt: Date };

// Speaking History (practice sessions)
export const insertSpeakingHistorySchema = z.object({
  userId: z.string(),
  sentenceId: z.number(),
  sentence: z.string(),
  language: z.string(),
  score: z.number(),
  transcript: z.string(),
  accuracy: z.number(),
  missedWords: z.array(z.string()).default([]),
  extraWords: z.array(z.string()).default([]),
});

export type InsertSpeakingHistory = z.infer<typeof insertSpeakingHistorySchema>;
export type SpeakingHistory = InsertSpeakingHistory & { id: number; createdAt: Date };
