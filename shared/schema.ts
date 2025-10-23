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
  userId: z.string().optional(), // Optional: system sentences have no userId (shared), user sentences have userId
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

// AI Chat Sessions
export const insertAIChatSessionSchema = z.object({
  userId: z.string(),
  scenario: z.enum(["free", "restaurant", "hotel", "shopping", "interview", "travel"]),
  language: z.string().default("en"),
  grammarCorrectionEnabled: z.boolean().default(false),
  messageCount: z.number().default(0),
  duration: z.number().default(0),
  completed: z.boolean().default(false),
});

export type InsertAIChatSession = z.infer<typeof insertAIChatSessionSchema>;
export type AIChatSession = InsertAIChatSession & { id: number; createdAt: Date; updatedAt: Date };

// AI Chat Messages
export const insertAIChatMessageSchema = z.object({
  sessionId: z.number(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  correctedContent: z.string().optional(),
  hasGrammarErrors: z.boolean().default(false),
});

export type InsertAIChatMessage = z.infer<typeof insertAIChatMessageSchema>;
export type AIChatMessage = InsertAIChatMessage & { id: number; createdAt: Date };

// AI Chat Stats
export const insertAIChatStatsSchema = z.object({
  userId: z.string(),
  language: z.string().default("en"),
  totalSessions: z.number().default(0),
  totalMessages: z.number().default(0),
  totalDuration: z.number().default(0),
  longestStreak: z.number().default(0),
  currentStreak: z.number().default(0),
  lastChatDate: z.string().optional(),
  achievements: z.array(z.string()).default([]),
});

export type InsertAIChatStats = z.infer<typeof insertAIChatStatsSchema>;
export type AIChatStats = InsertAIChatStats & { id: number };

// Listening Lessons
export const insertListeningLessonSchema = z.object({
  text: z.string(),
  translation: z.string(),
  audioUrl: z.string().optional(),
  difficulty: z.number().min(1).max(5),
  category: z.enum(["일상", "여행", "비즈니스", "AI/테크", "명언", "역사", "문학", "환경/과학"]),
  duration: z.number(), // seconds
  contentType: z.enum(["sentence", "long"]).default("sentence"),
  paragraphs: z.array(z.object({
    text: z.string(),
    translation: z.string(),
  })).optional(),
  wordCount: z.number().optional(),
  estimatedDuration: z.number().optional(), // seconds for long content
});

export type InsertListeningLesson = z.infer<typeof insertListeningLessonSchema>;
export type ListeningLesson = InsertListeningLesson & { id: number; createdAt: Date };

// Listening Progress
export const insertListeningProgressSchema = z.object({
  userId: z.string(),
  lessonId: z.number(),
  userAnswer: z.string(),
  score: z.number().min(0).max(100),
  accuracy: z.number().min(0).max(100),
  completed: z.boolean().default(true),
});

export type InsertListeningProgress = z.infer<typeof insertListeningProgressSchema>;
export type ListeningProgress = InsertListeningProgress & { id: number; completedAt: Date; createdAt: Date };

// Vocabulary Words (단어 사전)
export const insertVocabularyWordSchema = z.object({
  word: z.string(),
  definition: z.string(),
  phonetic: z.string().optional(),
  partOfSpeech: z.string().optional(),
  exampleSentence: z.string().optional(),
  difficultyLevel: z.number().min(1).max(5).optional(),
  frequencyRank: z.number().optional(),
});

export type InsertVocabularyWord = z.infer<typeof insertVocabularyWordSchema>;
export type VocabularyWord = InsertVocabularyWord & { id: number; createdAt: Date };

// User Vocabulary (사용자 단어장)
export const insertUserVocabularySchema = z.object({
  userId: z.string(),
  wordId: z.number(),
  learned: z.boolean().default(false),
  timesReviewed: z.number().default(0),
  notes: z.string().optional(),
});

export type InsertUserVocabulary = z.infer<typeof insertUserVocabularySchema>;
export type UserVocabulary = InsertUserVocabulary & { id: number; lastReviewedAt?: Date; createdAt: Date };

// Reading Passages (독해 지문)
export const insertReadingPassageSchema = z.object({
  title: z.string(),
  content: z.string(),
  contentType: z.enum(["news", "story", "essay", "email", "ad"]),
  difficulty: z.number().min(1).max(5),
  wordCount: z.number(),
  estimatedTime: z.number().optional(), // seconds
  source: z.string().optional(),
  paragraphs: z.array(z.object({
    text: z.string(),
    translation: z.string(),
  })).optional(),
});

export type InsertReadingPassage = z.infer<typeof insertReadingPassageSchema>;
export type ReadingPassage = InsertReadingPassage & { id: number; createdAt: Date };

// Reading Questions (독해 문제) - Phase 2에서 사용
export const insertReadingQuestionSchema = z.object({
  passageId: z.number(),
  questionText: z.string(),
  questionType: z.enum(["main_idea", "detail", "inference", "vocabulary"]),
  options: z.array(z.string()),
  correctAnswer: z.string(),
  explanation: z.string().optional(),
});

export type InsertReadingQuestion = z.infer<typeof insertReadingQuestionSchema>;
export type ReadingQuestion = InsertReadingQuestion & { id: number; createdAt: Date };

// Reading Progress (독해 학습 진도)
export const insertReadingProgressSchema = z.object({
  userId: z.string(),
  passageId: z.number(),
  answers: z.record(z.string()).optional(), // questionId -> answer
  score: z.number().min(0).max(100).optional(),
  correctCount: z.number().optional(),
  totalCount: z.number().optional(),
  readingTime: z.number().optional(), // seconds
  wpm: z.number().optional(), // Words Per Minute
  completed: z.boolean().default(false),
});

export type InsertReadingProgress = z.infer<typeof insertReadingProgressSchema>;
export type ReadingProgress = InsertReadingProgress & { id: number; completedAt: Date; createdAt: Date };

// Writing Topics (글쓰기 주제)
export const insertWritingTopicSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.enum(["email", "essay", "letter", "review", "story", "opinion"]),
  difficulty: z.number().min(1).max(5),
  prompt: z.string(),
  guidelines: z.array(z.string()),
  wordCountMin: z.number().optional(),
  wordCountMax: z.number().optional(),
  exampleAnswer: z.string().optional(),
});

export type InsertWritingTopic = z.infer<typeof insertWritingTopicSchema>;
export type WritingTopic = InsertWritingTopic & { id: number; createdAt: Date };

// Writing Submissions (제출한 글)
export const insertWritingSubmissionSchema = z.object({
  userId: z.string(),
  topicId: z.number(),
  content: z.string(),
  wordCount: z.number(),
  aiScore: z.number().min(0).max(100).optional(),
  aiStrengths: z.array(z.string()).optional(),
  aiWeaknesses: z.array(z.string()).optional(),
  aiFeedback: z.string().optional(),
  aiSuggestions: z.array(z.string()).optional(),
});

export type InsertWritingSubmission = z.infer<typeof insertWritingSubmissionSchema>;
export type WritingSubmission = InsertWritingSubmission & { id: number; submittedAt: Date; createdAt: Date };
