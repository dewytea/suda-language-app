import {
  type UserProgress,
  type InsertUserProgress,
  type Vocabulary,
  type InsertVocabulary,
  type KeySentence,
  type InsertKeySentence,
  type Note,
  type InsertNote,
  type ReviewItem,
  type InsertReviewItem,
  type Achievement,
  type InsertAchievement,
  type PronunciationResult,
  type InsertPronunciationResult,
  type WritingResult,
  type InsertWritingResult,
} from "@shared/schema";

export interface IStorage {
  // User Progress
  getUserProgress(language: string): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(language: string, updates: Partial<UserProgress>): Promise<UserProgress>;

  // Vocabulary
  getVocabulary(language: string): Promise<Vocabulary[]>;
  addVocabulary(vocab: InsertVocabulary): Promise<Vocabulary>;
  deleteVocabulary(id: number): Promise<void>;

  // Key Sentences
  getKeySentences(language: string, scenario?: string): Promise<KeySentence[]>;
  addKeySentence(sentence: InsertKeySentence): Promise<KeySentence>;
  updateKeySentence(id: number, updates: Partial<KeySentence>): Promise<KeySentence>;

  // Notes
  getNotes(language: string, skill?: string): Promise<Note[]>;
  saveNote(note: InsertNote): Promise<Note>;

  // Review Items
  getReviewItems(language: string): Promise<ReviewItem[]>;
  addReviewItem(item: InsertReviewItem): Promise<ReviewItem>;
  updateReviewItem(id: number, nextReview: Date): Promise<ReviewItem>;

  // Achievements
  getAchievements(): Promise<Achievement[]>;
  unlockAchievement(id: number): Promise<Achievement>;

  // Pronunciation Results
  savePronunciationResult(result: InsertPronunciationResult): Promise<PronunciationResult>;
  getPronunciationResults(language: string): Promise<PronunciationResult[]>;

  // Writing Results
  saveWritingResult(result: InsertWritingResult): Promise<WritingResult>;
  getWritingResults(language: string): Promise<WritingResult[]>;
  updateWritingResult(id: number, updates: Partial<WritingResult>): Promise<WritingResult>;
}

export class MemStorage implements IStorage {
  private userProgress: Map<string, UserProgress>;
  private vocabulary: Map<number, Vocabulary>;
  private keySentences: Map<number, KeySentence>;
  private notes: Map<number, Note>;
  private reviewItems: Map<number, ReviewItem>;
  private achievements: Map<number, Achievement>;
  private pronunciationResults: Map<number, PronunciationResult>;
  private writingResults: Map<number, WritingResult>;
  private nextId: number;

  constructor() {
    this.userProgress = new Map();
    this.vocabulary = new Map();
    this.keySentences = new Map();
    this.notes = new Map();
    this.reviewItems = new Map();
    this.achievements = new Map();
    this.pronunciationResults = new Map();
    this.writingResults = new Map();
    this.nextId = 1;

    this.initializeAchievements();
  }

  private initializeAchievements() {
    const defaultAchievements = [
      { title: "First Steps", description: "Complete your first lesson", icon: "🎯", unlocked: false },
      { title: "Week Warrior", description: "Maintain a 7-day streak", icon: "🔥", unlocked: false },
      { title: "Speaking Star", description: "Complete 10 speaking lessons", icon: "🎤", unlocked: false },
      { title: "Bookworm", description: "Read 5 stories", icon: "📚", unlocked: false },
      { title: "Good Listener", description: "Complete 10 listening exercises", icon: "👂", unlocked: false },
      { title: "Master Writer", description: "Write 20 essays", icon: "✍️", unlocked: false },
      { title: "Polyglot", description: "Learn 3 languages", icon: "🌍", unlocked: false },
      { title: "Century Club", description: "Earn 100 points", icon: "💯", unlocked: false },
      { title: "Dedication", description: "30-day streak", icon: "⭐", unlocked: false },
    ];

    defaultAchievements.forEach((ach) => {
      const id = this.nextId++;
      this.achievements.set(id, { ...ach, id });
    });
  }

  // User Progress
  async getUserProgress(language: string): Promise<UserProgress | undefined> {
    return this.userProgress.get(language);
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const id = this.nextId++;
    const userProg: UserProgress = { ...progress, id };
    this.userProgress.set(progress.language, userProg);
    return userProg;
  }

  async updateUserProgress(language: string, updates: Partial<UserProgress>): Promise<UserProgress> {
    const existing = this.userProgress.get(language);
    if (!existing) {
      throw new Error("User progress not found");
    }
    const updated = { ...existing, ...updates };
    this.userProgress.set(language, updated);
    return updated;
  }

  // Vocabulary
  async getVocabulary(language: string): Promise<Vocabulary[]> {
    return Array.from(this.vocabulary.values()).filter((v) => v.language === language);
  }

  async addVocabulary(vocab: InsertVocabulary): Promise<Vocabulary> {
    const id = this.nextId++;
    const vocabulary: Vocabulary = { ...vocab, id };
    this.vocabulary.set(id, vocabulary);
    return vocabulary;
  }

  async deleteVocabulary(id: number): Promise<void> {
    this.vocabulary.delete(id);
  }

  // Key Sentences
  async getKeySentences(language: string, scenario?: string): Promise<KeySentence[]> {
    return Array.from(this.keySentences.values()).filter(
      (s) => s.language === language && (!scenario || s.scenario === scenario)
    );
  }

  async addKeySentence(sentence: InsertKeySentence): Promise<KeySentence> {
    const id = this.nextId++;
    const keySentence: KeySentence = { ...sentence, id };
    this.keySentences.set(id, keySentence);
    return keySentence;
  }

  async updateKeySentence(id: number, updates: Partial<KeySentence>): Promise<KeySentence> {
    const existing = this.keySentences.get(id);
    if (!existing) {
      throw new Error("Key sentence not found");
    }
    const updated = { ...existing, ...updates };
    this.keySentences.set(id, updated);
    return updated;
  }

  // Notes
  async getNotes(language: string, skill?: string): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(
      (n) => n.language === language && (!skill || n.skill === skill)
    );
  }

  async saveNote(note: InsertNote): Promise<Note> {
    const id = this.nextId++;
    const savedNote: Note = { ...note, id, createdAt: new Date() };
    this.notes.set(id, savedNote);
    return savedNote;
  }

  // Review Items
  async getReviewItems(language: string): Promise<ReviewItem[]> {
    const now = new Date();
    return Array.from(this.reviewItems.values()).filter(
      (r) => r.language === language && r.nextReview <= now
    );
  }

  async addReviewItem(item: InsertReviewItem): Promise<ReviewItem> {
    const id = this.nextId++;
    const reviewItem: ReviewItem = { ...item, id, nextReview: new Date() };
    this.reviewItems.set(id, reviewItem);
    return reviewItem;
  }

  async updateReviewItem(id: number, nextReview: Date): Promise<ReviewItem> {
    const existing = this.reviewItems.get(id);
    if (!existing) {
      throw new Error("Review item not found");
    }
    const updated = { ...existing, nextReview };
    this.reviewItems.set(id, updated);
    return updated;
  }

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async unlockAchievement(id: number): Promise<Achievement> {
    const existing = this.achievements.get(id);
    if (!existing) {
      throw new Error("Achievement not found");
    }
    const updated = { ...existing, unlocked: true, unlockedAt: new Date() };
    this.achievements.set(id, updated);
    return updated;
  }

  // Pronunciation Results
  async savePronunciationResult(result: InsertPronunciationResult): Promise<PronunciationResult> {
    const id = this.nextId++;
    const savedResult: PronunciationResult = { ...result, id, createdAt: new Date() };
    this.pronunciationResults.set(id, savedResult);
    return savedResult;
  }

  async getPronunciationResults(language: string): Promise<PronunciationResult[]> {
    return Array.from(this.pronunciationResults.values()).filter((r) => r.language === language);
  }

  // Writing Results
  async saveWritingResult(result: InsertWritingResult): Promise<WritingResult> {
    const id = this.nextId++;
    const savedResult: WritingResult = { ...result, id, createdAt: new Date() };
    this.writingResults.set(id, savedResult);
    return savedResult;
  }

  async getWritingResults(language: string): Promise<WritingResult[]> {
    return Array.from(this.writingResults.values()).filter((r) => r.language === language);
  }

  async updateWritingResult(id: number, updates: Partial<WritingResult>): Promise<WritingResult> {
    const existing = this.writingResults.get(id);
    if (!existing) {
      throw new Error("Writing result not found");
    }
    const updated = { ...existing, ...updates };
    this.writingResults.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
