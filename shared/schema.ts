import { z } from "zod";

// User Progress
export const userProgress = {
  id: z.number(),
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
  memorized: z.boolean().default(false),
});

export type InsertKeySentence = z.infer<typeof insertKeySentenceSchema>;
export type KeySentence = InsertKeySentence & { id: number };

// Notes
export const insertNoteSchema = z.object({
  content: z.string(),
  skill: z.enum(["speaking", "reading", "listening", "writing"]),
  language: z.string(),
});

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = InsertNote & { id: number; createdAt: Date };

// Review Items
export const insertReviewItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
  language: z.string(),
  skill: z.enum(["speaking", "reading", "listening", "writing"]),
});

export type InsertReviewItem = z.infer<typeof insertReviewItemSchema>;
export type ReviewItem = InsertReviewItem & { id: number; nextReview: Date };

// Achievements
export const insertAchievementSchema = z.object({
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
  sentence: z.string(),
  score: z.number(),
  language: z.string(),
  feedback: z.string().optional(),
});

export type InsertPronunciationResult = z.infer<typeof insertPronunciationResultSchema>;
export type PronunciationResult = InsertPronunciationResult & { id: number; createdAt: Date };

// Writing Results
export const insertWritingResultSchema = z.object({
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
});

export type InsertWritingResult = z.infer<typeof insertWritingResultSchema>;
export type WritingResult = InsertWritingResult & { id: number; createdAt: Date };
