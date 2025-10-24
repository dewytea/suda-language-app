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
  type SpeakingProgress,
  type InsertSpeakingProgress,
  type FavoriteSentence,
  type InsertFavoriteSentence,
  type SpeakingHistory,
  type InsertSpeakingHistory,
  type AIChatSession,
  type InsertAIChatSession,
  type AIChatMessage,
  type InsertAIChatMessage,
  type AIChatStats,
  type InsertAIChatStats,
  type ListeningLesson,
  type InsertListeningLesson,
  type ListeningProgress,
  type InsertListeningProgress,
  type VocabularyWord,
  type InsertVocabularyWord,
  type UserVocabulary,
  type InsertUserVocabulary,
  type ReadingPassage,
  type InsertReadingPassage,
  type ReadingQuestion,
  type InsertReadingQuestion,
  type ReadingProgress,
  type InsertReadingProgress,
  type WritingTopic,
  type InsertWritingTopic,
  type WritingSubmission,
  type InsertWritingSubmission,
} from "@shared/schema";

export interface IStorage {
  // User Progress
  getUserProgress(userId: string, language: string): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(userId: string, language: string, updates: Partial<UserProgress>): Promise<UserProgress>;

  // Vocabulary
  getVocabulary(userId: string, language: string): Promise<Vocabulary[]>;
  addVocabulary(vocab: InsertVocabulary): Promise<Vocabulary>;
  deleteVocabulary(userId: string, id: number): Promise<void>;

  // Key Sentences
  getKeySentences(userId: string, language: string, filters?: { scenario?: string; category?: string; difficulty?: number }): Promise<KeySentence[]>;
  addKeySentence(sentence: InsertKeySentence): Promise<KeySentence>;
  updateKeySentence(userId: string, id: number, updates: Partial<KeySentence>): Promise<KeySentence>;

  // Notes
  getNotes(userId: string, language: string, skill?: string): Promise<Note[]>;
  saveNote(note: InsertNote): Promise<Note>;

  // Review Items
  getReviewItems(userId: string, language: string): Promise<ReviewItem[]>;
  addReviewItem(item: InsertReviewItem): Promise<ReviewItem>;
  updateReviewItem(userId: string, id: number, nextReview: Date): Promise<ReviewItem>;

  // Achievements
  getAchievements(userId: string): Promise<Achievement[]>;
  unlockAchievement(userId: string, id: number): Promise<Achievement>;

  // Pronunciation Results
  savePronunciationResult(result: InsertPronunciationResult): Promise<PronunciationResult>;
  getPronunciationResults(userId: string, language: string): Promise<PronunciationResult[]>;

  // Writing Results
  saveWritingResult(result: InsertWritingResult): Promise<WritingResult>;
  getWritingResults(userId: string, language: string): Promise<WritingResult[]>;
  updateWritingResult(userId: string, id: number, updates: Partial<WritingResult>): Promise<WritingResult>;

  // Speaking Progress
  getSpeakingProgress(userId: string, language: string): Promise<SpeakingProgress | undefined>;
  createSpeakingProgress(progress: InsertSpeakingProgress): Promise<SpeakingProgress>;
  updateSpeakingProgress(userId: string, language: string, updates: Partial<SpeakingProgress>): Promise<SpeakingProgress>;

  // Favorite Sentences
  getFavoriteSentences(userId: string, language: string): Promise<FavoriteSentence[]>;
  addFavoriteSentence(favorite: InsertFavoriteSentence): Promise<FavoriteSentence>;
  removeFavoriteSentence(userId: string, sentenceId: number, language: string): Promise<void>;
  isFavoriteSentence(userId: string, sentenceId: number, language: string): Promise<boolean>;

  // Speaking History
  getSpeakingHistory(userId: string, language: string, limit?: number): Promise<SpeakingHistory[]>;
  addSpeakingHistory(history: InsertSpeakingHistory): Promise<SpeakingHistory>;
  getSpeakingStats(userId: string, language: string): Promise<{
    totalPracticed: number;
    averageScore: number;
    categoryStats: { category: string; count: number; avgScore: number }[];
    difficultyStats: { difficulty: number; count: number; avgScore: number }[];
    recentDays: { date: string; count: number; avgScore: number }[];
  }>;

  // AI Chat Sessions
  createAIChatSession(data: InsertAIChatSession): Promise<AIChatSession>;
  getAIChatSessions(userId: string, language?: string): Promise<AIChatSession[]>;
  getAIChatSession(sessionId: number): Promise<AIChatSession | undefined>;
  updateAIChatSession(sessionId: number, updates: Partial<AIChatSession>): Promise<AIChatSession>;
  
  // AI Chat Messages
  saveAIChatMessage(message: InsertAIChatMessage): Promise<AIChatMessage>;
  getAIChatMessages(sessionId: number): Promise<AIChatMessage[]>;
  
  // AI Chat Stats
  getAIChatStats(userId: string, language?: string): Promise<AIChatStats | undefined>;
  updateAIChatStats(userId: string, language: string, updates: Partial<AIChatStats>): Promise<AIChatStats>;

  // Listening Lessons
  getListeningLessons(filters?: { difficulty?: number; category?: string }): Promise<ListeningLesson[]>;
  getListeningLesson(id: number): Promise<ListeningLesson | undefined>;
  
  // Listening Progress
  addListeningProgress(progress: InsertListeningProgress): Promise<ListeningProgress>;
  getListeningProgress(userId: string, lessonId?: number): Promise<ListeningProgress[]>;
  getListeningStats(userId: string): Promise<{
    totalCompleted: number;
    averageScore: number;
    averageAccuracy: number;
    categoryStats: { category: string; count: number; avgScore: number; avgAccuracy: number }[];
    difficultyStats: { difficulty: number; count: number; avgScore: number; avgAccuracy: number }[];
    recentProgress: ListeningProgress[];
  }>;

  // Vocabulary Words
  getVocabularyWord(word: string): Promise<VocabularyWord | undefined>;
  getAllVocabularyWords(): Promise<VocabularyWord[]>;
  addVocabularyWord(word: InsertVocabularyWord): Promise<VocabularyWord>;
  
  // User Vocabulary
  getUserVocabulary(userId: string): Promise<(UserVocabulary & { word: VocabularyWord })[]>;
  saveUserVocabulary(userVocab: InsertUserVocabulary): Promise<UserVocabulary>;
  updateUserVocabulary(userId: string, id: number, updates: Partial<UserVocabulary>): Promise<UserVocabulary>;
  deleteUserVocabulary(userId: string, id: number): Promise<void>;
  isWordSaved(userId: string, wordId: number): Promise<boolean>;

  // Reading Passages
  getReadingPassages(filters?: { difficulty?: number; contentType?: string }): Promise<ReadingPassage[]>;
  getReadingPassage(id: number): Promise<ReadingPassage | undefined>;
  
  // Reading Questions
  getReadingQuestions(passageId: number): Promise<ReadingQuestion[]>;
  
  // Reading Progress
  addReadingProgress(progress: InsertReadingProgress): Promise<ReadingProgress>;
  getReadingProgress(userId: string, passageId?: number): Promise<ReadingProgress[]>;
  getReadingStats(userId: string): Promise<{
    totalCompleted: number;
    averageScore: number;
    averageWPM: number;
    difficultyStats: { difficulty: number; count: number; avgScore: number }[];
    recentProgress: ReadingProgress[];
  }>;

  // Writing Topics
  getWritingTopics(filters?: { difficulty?: number; category?: string }): Promise<WritingTopic[]>;
  getWritingTopic(id: number): Promise<WritingTopic | undefined>;
  addWritingTopic(topic: InsertWritingTopic): Promise<WritingTopic>;

  // Writing Submissions
  saveWritingSubmission(submission: InsertWritingSubmission): Promise<WritingSubmission>;
  getWritingSubmissions(userId: string): Promise<WritingSubmission[]>;
  getWritingSubmission(id: number): Promise<WritingSubmission | undefined>;
  updateWritingSubmission(id: number, updates: Partial<WritingSubmission>): Promise<WritingSubmission>;
  getWritingStats(userId: string): Promise<{
    totalSubmitted: number;
    averageScore: number;
    averageWordCount: number;
    recentSubmissions: WritingSubmission[];
  }>;

  // Learning Content for Writing Suggestions
  getRecentLearningContent(userId: string, language: string, limit?: number): Promise<{
    vocabulary: (UserVocabulary & { word: VocabularyWord })[];
    notes: Note[];
    recentTopics: string[];
  }>;
}

export class MemStorage implements IStorage {
  private userProgress: Map<string, UserProgress>;
  private vocabulary: Map<number, Vocabulary>;
  private keySentences: Map<number, KeySentence>;
  private notes: Map<number, Note>;
  private reviewItems: Map<number, ReviewItem>;
  private achievements: Map<number, Achievement>;
  private achievementTemplates: Array<{ title: string; description: string; icon: string }>;
  private userAchievementsInitialized: Set<string>;
  private pronunciationResults: Map<number, PronunciationResult>;
  private writingResults: Map<number, WritingResult>;
  private speakingProgress: Map<string, SpeakingProgress>;
  private favoriteSentences: Map<number, FavoriteSentence>;
  private speakingHistory: Map<number, SpeakingHistory>;
  private aiChatSessions: Map<number, AIChatSession>;
  private aiChatMessages: Map<number, AIChatMessage>;
  private aiChatStats: Map<string, AIChatStats>;
  private listeningLessons: Map<number, ListeningLesson>;
  private listeningProgress: Map<number, ListeningProgress>;
  private vocabularyWords: Map<number, VocabularyWord>;
  private userVocabulary: Map<number, UserVocabulary>;
  private readingPassages: Map<number, ReadingPassage>;
  private readingQuestions: Map<number, ReadingQuestion>;
  private readingProgress: Map<number, ReadingProgress>;
  private writingTopics: Map<number, WritingTopic>;
  private writingSubmissions: Map<number, WritingSubmission>;
  private nextId: number;

  constructor() {
    this.userProgress = new Map();
    this.vocabulary = new Map();
    this.keySentences = new Map();
    this.notes = new Map();
    this.reviewItems = new Map();
    this.achievements = new Map();
    this.achievementTemplates = [];
    this.userAchievementsInitialized = new Set();
    this.pronunciationResults = new Map();
    this.writingResults = new Map();
    this.speakingProgress = new Map();
    this.favoriteSentences = new Map();
    this.speakingHistory = new Map();
    this.aiChatSessions = new Map();
    this.aiChatMessages = new Map();
    this.aiChatStats = new Map();
    this.listeningLessons = new Map();
    this.listeningProgress = new Map();
    this.vocabularyWords = new Map();
    this.userVocabulary = new Map();
    this.readingPassages = new Map();
    this.readingQuestions = new Map();
    this.readingProgress = new Map();
    this.writingTopics = new Map();
    this.writingSubmissions = new Map();
    this.nextId = 1;

    this.initializeAchievementTemplates();
    this.initializeSentences();
    this.initializeListeningLessons();
    this.initializeVocabularyWords();
    this.initializeReadingPassages();
    this.initializeWritingTopics();
    this.initializeReadingQuestions();
  }

  private initializeAchievementTemplates() {
    this.achievementTemplates = [
      { title: "First Steps", description: "Complete your first lesson", icon: "trophy" },
      { title: "Week Warrior", description: "Maintain a 7-day streak", icon: "flame" },
      { title: "Speaking Star", description: "Complete 10 speaking lessons", icon: "mic" },
      { title: "Bookworm", description: "Read 5 stories", icon: "book-open" },
      { title: "Good Listener", description: "Complete 10 listening exercises", icon: "headphones" },
      { title: "Master Writer", description: "Write 20 essays", icon: "pen-tool" },
      { title: "Polyglot", description: "Learn 3 languages", icon: "globe" },
      { title: "Century Club", description: "Earn 100 points", icon: "award" },
      { title: "Dedication", description: "30-day streak", icon: "star" },
    ];
  }

  private ensureUserAchievements(userId: string) {
    if (!this.userAchievementsInitialized.has(userId)) {
      this.achievementTemplates.forEach((template) => {
        const id = this.nextId++;
        this.achievements.set(id, {
          userId,
          title: template.title,
          description: template.description,
          icon: template.icon,
          unlocked: false,
          id,
        });
      });
      this.userAchievementsInitialized.add(userId);
    }
  }

  private initializeSentences() {
    const sentences = [
      { sentence: "How are you?", translation: "어떻게 지내세요?", language: "en", category: "daily" as const, difficulty: 1 },
      { sentence: "Good morning!", translation: "좋은 아침입니다!", language: "en", category: "daily" as const, difficulty: 1 },
      { sentence: "Thank you very much.", translation: "정말 감사합니다.", language: "en", category: "daily" as const, difficulty: 1 },
      { sentence: "What's your name?", translation: "이름이 무엇인가요?", language: "en", category: "daily" as const, difficulty: 1 },
      { sentence: "Nice to meet you.", translation: "만나서 반갑습니다.", language: "en", category: "daily" as const, difficulty: 1 },
      { sentence: "Can you help me?", translation: "도와주실 수 있나요?", language: "en", category: "daily" as const, difficulty: 2 },
      { sentence: "I don't understand.", translation: "이해가 안 됩니다.", language: "en", category: "daily" as const, difficulty: 2 },
      { sentence: "Where is the bathroom?", translation: "화장실이 어디에 있나요?", language: "en", category: "daily" as const, difficulty: 2 },
      { sentence: "Could you speak more slowly?", translation: "좀 더 천천히 말씀해 주시겠어요?", language: "en", category: "daily" as const, difficulty: 2 },
      { sentence: "How much does this cost?", translation: "이것은 얼마인가요?", language: "en", category: "daily" as const, difficulty: 2 },
      { sentence: "Where is the boarding gate?", translation: "탑승구가 어디에 있나요?", language: "en", category: "travel" as const, difficulty: 2 },
      { sentence: "I need to check in for my flight.", translation: "항공편 체크인을 해야 합니다.", language: "en", category: "travel" as const, difficulty: 3 },
      { sentence: "Can I see your passport, please?", translation: "여권을 보여주시겠어요?", language: "en", category: "travel" as const, difficulty: 2 },
      { sentence: "What time does the flight depart?", translation: "비행기가 몇 시에 출발하나요?", language: "en", category: "travel" as const, difficulty: 2 },
      { sentence: "I'd like to book a hotel room.", translation: "호텔 방을 예약하고 싶습니다.", language: "en", category: "travel" as const, difficulty: 3 },
      { sentence: "Is breakfast included?", translation: "아침 식사가 포함되어 있나요?", language: "en", category: "travel" as const, difficulty: 2 },
      { sentence: "How do I get to the city center?", translation: "시내 중심가에 어떻게 가나요?", language: "en", category: "travel" as const, difficulty: 3 },
      { sentence: "Do you have any available seats?", translation: "빈 좌석이 있나요?", language: "en", category: "travel" as const, difficulty: 2 },
      { sentence: "My luggage is missing.", translation: "제 짐이 없어졌습니다.", language: "en", category: "travel" as const, difficulty: 3 },
      { sentence: "Can you recommend a good restaurant?", translation: "좋은 식당을 추천해 주시겠어요?", language: "en", category: "travel" as const, difficulty: 3 },
      { sentence: "I have a meeting at 2 PM.", translation: "오후 2시에 회의가 있습니다.", language: "en", category: "business" as const, difficulty: 3 },
      { sentence: "Could you send me the report?", translation: "보고서를 보내주시겠어요?", language: "en", category: "business" as const, difficulty: 3 },
      { sentence: "Let's schedule a follow-up call.", translation: "후속 통화 일정을 잡읍시다.", language: "en", category: "business" as const, difficulty: 4 },
      { sentence: "What's the deadline for this project?", translation: "이 프로젝트의 마감일이 언제인가요?", language: "en", category: "business" as const, difficulty: 3 },
      { sentence: "I'll need to review the contract.", translation: "계약서를 검토해야 합니다.", language: "en", category: "business" as const, difficulty: 4 },
      { sentence: "Can we discuss the budget?", translation: "예산에 대해 논의할 수 있을까요?", language: "en", category: "business" as const, difficulty: 4 },
      { sentence: "The presentation went very well.", translation: "발표가 아주 잘 진행되었습니다.", language: "en", category: "business" as const, difficulty: 3 },
      { sentence: "We need to increase our market share.", translation: "시장 점유율을 높여야 합니다.", language: "en", category: "business" as const, difficulty: 5 },
      { sentence: "I'd like to propose a new strategy.", translation: "새로운 전략을 제안하고 싶습니다.", language: "en", category: "business" as const, difficulty: 4 },
      { sentence: "Let's analyze the quarterly results.", translation: "분기 실적을 분석합시다.", language: "en", category: "business" as const, difficulty: 5 },
      { sentence: "The project is behind schedule.", translation: "프로젝트가 일정보다 늦어지고 있습니다.", language: "en", category: "business" as const, difficulty: 4 },
      { sentence: "We should focus on customer satisfaction.", translation: "고객 만족도에 집중해야 합니다.", language: "en", category: "business" as const, difficulty: 5 },
      { sentence: "I appreciate your cooperation.", translation: "협조해 주셔서 감사합니다.", language: "en", category: "business" as const, difficulty: 3 },
    ];

    sentences.forEach((sent) => {
      const id = this.nextId++;
      this.keySentences.set(id, { ...sent, id, memorized: false });
    });
  }

  // User Progress
  async getUserProgress(userId: string, language: string): Promise<UserProgress | undefined> {
    const key = `${userId}:${language}`;
    return this.userProgress.get(key);
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const id = this.nextId++;
    const userProg: UserProgress = { ...progress, id };
    const key = `${progress.userId}:${progress.language}`;
    this.userProgress.set(key, userProg);
    return userProg;
  }

  async updateUserProgress(userId: string, language: string, updates: Partial<UserProgress>): Promise<UserProgress> {
    const key = `${userId}:${language}`;
    const existing = this.userProgress.get(key);
    if (!existing) {
      throw new Error("User progress not found");
    }
    const updated = { ...existing, ...updates };
    this.userProgress.set(key, updated);
    return updated;
  }

  // Vocabulary
  async getVocabulary(userId: string, language: string): Promise<Vocabulary[]> {
    return Array.from(this.vocabulary.values()).filter((v) => v.userId === userId && v.language === language);
  }

  async addVocabulary(vocab: InsertVocabulary): Promise<Vocabulary> {
    const id = this.nextId++;
    const vocabulary: Vocabulary = { ...vocab, id };
    this.vocabulary.set(id, vocabulary);
    return vocabulary;
  }

  async deleteVocabulary(userId: string, id: number): Promise<void> {
    const vocab = this.vocabulary.get(id);
    if (vocab && vocab.userId === userId) {
      this.vocabulary.delete(id);
    }
  }

  // Key Sentences
  async getKeySentences(userId: string, language: string, filters?: { scenario?: string; category?: string; difficulty?: number }): Promise<KeySentence[]> {
    return Array.from(this.keySentences.values()).filter((s) => {
      // Include system sentences (no userId) and user's own sentences
      if (s.userId && s.userId !== userId) return false;
      if (s.language !== language) return false;
      if (filters?.scenario && s.scenario !== filters.scenario) return false;
      if (filters?.category && s.category !== filters.category) return false;
      if (filters?.difficulty && s.difficulty !== filters.difficulty) return false;
      return true;
    });
  }

  async addKeySentence(sentence: InsertKeySentence): Promise<KeySentence> {
    const id = this.nextId++;
    const keySentence: KeySentence = { ...sentence, id };
    this.keySentences.set(id, keySentence);
    return keySentence;
  }

  async updateKeySentence(userId: string, id: number, updates: Partial<KeySentence>): Promise<KeySentence> {
    const existing = this.keySentences.get(id);
    if (!existing) {
      throw new Error("Key sentence not found");
    }
    // Only allow updating user's own sentences or system sentences if user is admin
    if (existing.userId && existing.userId !== userId) {
      throw new Error("Not authorized to update this sentence");
    }
    const updated = { ...existing, ...updates };
    this.keySentences.set(id, updated);
    return updated;
  }

  // Notes
  async getNotes(userId: string, language: string, skill?: string): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(
      (n) => n.userId === userId && n.language === language && (!skill || n.skill === skill)
    );
  }

  async saveNote(note: InsertNote): Promise<Note> {
    const id = this.nextId++;
    const savedNote: Note = { ...note, id, createdAt: new Date() };
    this.notes.set(id, savedNote);
    return savedNote;
  }

  // Review Items
  async getReviewItems(userId: string, language: string): Promise<ReviewItem[]> {
    const now = new Date();
    return Array.from(this.reviewItems.values()).filter(
      (r) => r.userId === userId && r.language === language && r.nextReview <= now
    );
  }

  async addReviewItem(item: InsertReviewItem): Promise<ReviewItem> {
    const id = this.nextId++;
    const reviewItem: ReviewItem = { ...item, id, nextReview: new Date() };
    this.reviewItems.set(id, reviewItem);
    return reviewItem;
  }

  async updateReviewItem(userId: string, id: number, nextReview: Date): Promise<ReviewItem> {
    const existing = this.reviewItems.get(id);
    if (!existing || existing.userId !== userId) {
      throw new Error("Review item not found");
    }
    const updated = { ...existing, nextReview };
    this.reviewItems.set(id, updated);
    return updated;
  }

  // Achievements
  async getAchievements(userId: string): Promise<Achievement[]> {
    this.ensureUserAchievements(userId);
    return Array.from(this.achievements.values()).filter(a => a.userId === userId);
  }

  async unlockAchievement(userId: string, id: number): Promise<Achievement> {
    this.ensureUserAchievements(userId);
    const existing = this.achievements.get(id);
    if (!existing || existing.userId !== userId) {
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

  async getPronunciationResults(userId: string, language: string): Promise<PronunciationResult[]> {
    return Array.from(this.pronunciationResults.values()).filter((r) => r.userId === userId && r.language === language);
  }

  // Writing Results
  async saveWritingResult(result: InsertWritingResult): Promise<WritingResult> {
    const id = this.nextId++;
    const savedResult: WritingResult = { ...result, id, createdAt: new Date() };
    this.writingResults.set(id, savedResult);
    return savedResult;
  }

  async getWritingResults(userId: string, language: string): Promise<WritingResult[]> {
    return Array.from(this.writingResults.values()).filter((r) => r.userId === userId && r.language === language);
  }

  async updateWritingResult(userId: string, id: number, updates: Partial<WritingResult>): Promise<WritingResult> {
    const existing = this.writingResults.get(id);
    if (!existing || existing.userId !== userId) {
      throw new Error("Writing result not found");
    }
    const updated = { ...existing, ...updates };
    this.writingResults.set(id, updated);
    return updated;
  }

  // Speaking Progress
  async getSpeakingProgress(userId: string, language: string): Promise<SpeakingProgress | undefined> {
    const key = `${userId}:${language}`;
    return this.speakingProgress.get(key);
  }

  async createSpeakingProgress(progress: InsertSpeakingProgress): Promise<SpeakingProgress> {
    const id = this.nextId++;
    const speakingProg: SpeakingProgress = { ...progress, id };
    const key = `${progress.userId}:${progress.language}`;
    this.speakingProgress.set(key, speakingProg);
    return speakingProg;
  }

  async updateSpeakingProgress(userId: string, language: string, updates: Partial<SpeakingProgress>): Promise<SpeakingProgress> {
    const key = `${userId}:${language}`;
    const existing = this.speakingProgress.get(key);
    if (!existing) {
      throw new Error("Speaking progress not found");
    }
    const updated = { ...existing, ...updates };
    this.speakingProgress.set(key, updated);
    return updated;
  }

  // Favorite Sentences
  async getFavoriteSentences(userId: string, language: string): Promise<FavoriteSentence[]> {
    return Array.from(this.favoriteSentences.values()).filter(f => f.userId === userId && f.language === language);
  }

  async addFavoriteSentence(favorite: InsertFavoriteSentence): Promise<FavoriteSentence> {
    // Check if already favorited
    const existing = Array.from(this.favoriteSentences.values()).find(
      f => f.userId === favorite.userId && f.sentenceId === favorite.sentenceId && f.language === favorite.language
    );
    if (existing) {
      return existing;
    }

    const id = this.nextId++;
    const newFavorite: FavoriteSentence = { ...favorite, id, createdAt: new Date() };
    this.favoriteSentences.set(id, newFavorite);
    return newFavorite;
  }

  async removeFavoriteSentence(userId: string, sentenceId: number, language: string): Promise<void> {
    const entry = Array.from(this.favoriteSentences.entries()).find(
      ([_, f]) => f.userId === userId && f.sentenceId === sentenceId && f.language === language
    );
    if (entry) {
      this.favoriteSentences.delete(entry[0]);
    }
  }

  async isFavoriteSentence(userId: string, sentenceId: number, language: string): Promise<boolean> {
    return Array.from(this.favoriteSentences.values()).some(
      f => f.userId === userId && f.sentenceId === sentenceId && f.language === language
    );
  }

  // Speaking History
  async getSpeakingHistory(userId: string, language: string, limit: number = 50): Promise<SpeakingHistory[]> {
    const history = Array.from(this.speakingHistory.values())
      .filter(h => h.userId === userId && h.language === language)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return limit ? history.slice(0, limit) : history;
  }

  async addSpeakingHistory(history: InsertSpeakingHistory): Promise<SpeakingHistory> {
    const id = this.nextId++;
    const newHistory: SpeakingHistory = { ...history, id, createdAt: new Date() };
    this.speakingHistory.set(id, newHistory);
    return newHistory;
  }

  async getSpeakingStats(userId: string, language: string): Promise<{
    totalPracticed: number;
    averageScore: number;
    categoryStats: { category: string; count: number; avgScore: number }[];
    difficultyStats: { difficulty: number; count: number; avgScore: number }[];
    recentDays: { date: string; count: number; avgScore: number }[];
  }> {
    const history = Array.from(this.speakingHistory.values()).filter(h => h.userId === userId && h.language === language);
    const sentences = Array.from(this.keySentences.values());

    const totalPracticed = history.length;
    const averageScore = totalPracticed > 0
      ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / totalPracticed)
      : 0;

    // Category stats
    const categoryMap = new Map<string, { scores: number[]; count: number }>();
    history.forEach(h => {
      const sentence = sentences.find(s => s.id === h.sentenceId);
      if (sentence) {
        const cat = sentence.category;
        if (!categoryMap.has(cat)) {
          categoryMap.set(cat, { scores: [], count: 0 });
        }
        const data = categoryMap.get(cat)!;
        data.scores.push(h.score);
        data.count++;
      }
    });

    const categoryStats = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      avgScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.count)
    }));

    // Difficulty stats
    const difficultyMap = new Map<number, { scores: number[]; count: number }>();
    history.forEach(h => {
      const sentence = sentences.find(s => s.id === h.sentenceId);
      if (sentence) {
        const diff = sentence.difficulty;
        if (!difficultyMap.has(diff)) {
          difficultyMap.set(diff, { scores: [], count: 0 });
        }
        const data = difficultyMap.get(diff)!;
        data.scores.push(h.score);
        data.count++;
      }
    });

    const difficultyStats = Array.from(difficultyMap.entries()).map(([difficulty, data]) => ({
      difficulty,
      count: data.count,
      avgScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.count)
    })).sort((a, b) => a.difficulty - b.difficulty);

    // Recent 7 days stats
    const today = new Date();
    const recentDays: { date: string; count: number; avgScore: number }[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayHistory = history.filter(h => {
        const hDate = h.createdAt.toISOString().split('T')[0];
        return hDate === dateStr;
      });

      if (dayHistory.length > 0) {
        recentDays.push({
          date: dateStr,
          count: dayHistory.length,
          avgScore: Math.round(dayHistory.reduce((sum, h) => sum + h.score, 0) / dayHistory.length)
        });
      }
    }

    return {
      totalPracticed,
      averageScore,
      categoryStats,
      difficultyStats,
      recentDays
    };
  }

  // AI Chat Sessions
  async createAIChatSession(data: InsertAIChatSession): Promise<AIChatSession> {
    const id = this.nextId++;
    const session: AIChatSession = {
      id,
      userId: data.userId,
      scenario: data.scenario,
      language: data.language || 'en',
      grammarCorrectionEnabled: data.grammarCorrectionEnabled || false,
      messageCount: data.messageCount || 0,
      duration: data.duration || 0,
      completed: data.completed || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.aiChatSessions.set(id, session);
    return session;
  }

  async getAIChatSessions(userId: string, language?: string): Promise<AIChatSession[]> {
    const sessions = Array.from(this.aiChatSessions.values())
      .filter(s => s.userId === userId && (!language || s.language === language))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return sessions;
  }

  async getAIChatSession(sessionId: number): Promise<AIChatSession | undefined> {
    return this.aiChatSessions.get(sessionId);
  }

  async updateAIChatSession(sessionId: number, updates: Partial<AIChatSession>): Promise<AIChatSession> {
    const session = this.aiChatSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    
    const updated: AIChatSession = {
      ...session,
      ...updates,
      updatedAt: new Date()
    };
    this.aiChatSessions.set(sessionId, updated);
    return updated;
  }

  // AI Chat Messages
  async saveAIChatMessage(message: InsertAIChatMessage): Promise<AIChatMessage> {
    const id = this.nextId++;
    const chatMessage: AIChatMessage = {
      id,
      sessionId: message.sessionId,
      role: message.role,
      content: message.content,
      correctedContent: message.correctedContent,
      hasGrammarErrors: message.hasGrammarErrors || false,
      createdAt: new Date()
    };
    this.aiChatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async getAIChatMessages(sessionId: number): Promise<AIChatMessage[]> {
    const messages = Array.from(this.aiChatMessages.values())
      .filter(m => m.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return messages;
  }

  // AI Chat Stats
  async getAIChatStats(userId: string, language?: string): Promise<AIChatStats | undefined> {
    const key = `${userId}_${language || 'en'}`;
    return this.aiChatStats.get(key);
  }

  async updateAIChatStats(userId: string, language: string, updates: Partial<AIChatStats>): Promise<AIChatStats> {
    const key = `${userId}_${language}`;
    const existing = this.aiChatStats.get(key);
    
    const stats: AIChatStats = {
      id: existing?.id || this.nextId++,
      userId,
      language,
      totalSessions: updates.totalSessions ?? existing?.totalSessions ?? 0,
      totalMessages: updates.totalMessages ?? existing?.totalMessages ?? 0,
      totalDuration: updates.totalDuration ?? existing?.totalDuration ?? 0,
      longestStreak: updates.longestStreak ?? existing?.longestStreak ?? 0,
      currentStreak: updates.currentStreak ?? existing?.currentStreak ?? 0,
      lastChatDate: updates.lastChatDate ?? existing?.lastChatDate,
      achievements: updates.achievements ?? existing?.achievements ?? []
    };
    
    this.aiChatStats.set(key, stats);
    return stats;
  }

  // Initialize Listening Lessons
  private initializeListeningLessons() {
    const lessons = [
      // Difficulty 1: 일상 (초급)
      { text: "Hello, how are you?", translation: "안녕하세요, 어떻게 지내세요?", difficulty: 1, category: "일상" as const, duration: 3 },
      { text: "Good morning!", translation: "좋은 아침이에요!", difficulty: 1, category: "일상" as const, duration: 2 },
      { text: "Thank you very much.", translation: "정말 감사합니다.", difficulty: 1, category: "일상" as const, duration: 3 },
      { text: "Nice to meet you.", translation: "만나서 반가워요.", difficulty: 1, category: "일상" as const, duration: 3 },
      { text: "Have a great day!", translation: "좋은 하루 보내세요!", difficulty: 1, category: "일상" as const, duration: 3 },
      { text: "See you later.", translation: "나중에 봐요.", difficulty: 1, category: "일상" as const, duration: 2 },
      { text: "What is your name?", translation: "이름이 뭐예요?", difficulty: 1, category: "일상" as const, duration: 3 },
      { text: "Where are you from?", translation: "어디서 왔어요?", difficulty: 1, category: "일상" as const, duration: 3 },
      { text: "I am fine, thank you.", translation: "잘 지내요, 감사해요.", difficulty: 1, category: "일상" as const, duration: 3 },
      { text: "How old are you?", translation: "몇 살이에요?", difficulty: 1, category: "일상" as const, duration: 3 },
      
      // Difficulty 2: 일상 (기초)
      { text: "What time is it?", translation: "몇 시예요?", difficulty: 2, category: "일상" as const, duration: 3 },
      { text: "Can you help me?", translation: "도와주실 수 있나요?", difficulty: 2, category: "일상" as const, duration: 3 },
      { text: "I would like some water.", translation: "물 좀 주세요.", difficulty: 2, category: "일상" as const, duration: 4 },
      { text: "Where is the bathroom?", translation: "화장실이 어디예요?", difficulty: 2, category: "일상" as const, duration: 4 },
      { text: "How much does this cost?", translation: "이거 얼마예요?", difficulty: 2, category: "일상" as const, duration: 4 },
      { text: "I do not understand.", translation: "이해가 안 돼요.", difficulty: 2, category: "일상" as const, duration: 3 },
      { text: "Could you repeat that?", translation: "다시 말씀해 주시겠어요?", difficulty: 2, category: "일상" as const, duration: 4 },
      { text: "I am looking for a hotel.", translation: "호텔을 찾고 있어요.", difficulty: 2, category: "일상" as const, duration: 4 },
      { text: "What do you recommend?", translation: "뭘 추천하시나요?", difficulty: 2, category: "일상" as const, duration: 4 },
      { text: "Can I have the menu?", translation: "메뉴판 주시겠어요?", difficulty: 2, category: "일상" as const, duration: 4 },
      
      // Difficulty 2: 여행
      { text: "Where is the train station?", translation: "기차역이 어디예요?", difficulty: 2, category: "여행" as const, duration: 4 },
      { text: "I need a taxi.", translation: "택시가 필요해요.", difficulty: 2, category: "여행" as const, duration: 3 },
      { text: "How do I get to the airport?", translation: "공항에 어떻게 가나요?", difficulty: 2, category: "여행" as const, duration: 5 },
      { text: "Is there a bus stop nearby?", translation: "근처에 버스 정류장이 있나요?", difficulty: 2, category: "여행" as const, duration: 5 },
      { text: "I would like to buy a ticket.", translation: "표를 사고 싶어요.", difficulty: 2, category: "여행" as const, duration: 5 },
      
      // Difficulty 3: 비즈니스 (중급)
      { text: "I have a meeting at three.", translation: "3시에 회의가 있어요.", difficulty: 3, category: "비즈니스" as const, duration: 5 },
      { text: "Could you send me the report?", translation: "보고서를 보내주시겠어요?", difficulty: 3, category: "비즈니스" as const, duration: 5 },
      { text: "Let me check my schedule.", translation: "제 일정을 확인해볼게요.", difficulty: 3, category: "비즈니스" as const, duration: 5 },
      { text: "We need to discuss this further.", translation: "이것에 대해 더 논의해야 해요.", difficulty: 3, category: "비즈니스" as const, duration: 6 },
      { text: "I will get back to you soon.", translation: "곧 연락드릴게요.", difficulty: 3, category: "비즈니스" as const, duration: 5 },
    ];

    lessons.forEach((lesson) => {
      const id = this.nextId++;
      this.listeningLessons.set(id, {
        id,
        text: lesson.text,
        translation: lesson.translation,
        difficulty: lesson.difficulty,
        category: lesson.category,
        duration: lesson.duration,
        contentType: "sentence",
        createdAt: new Date()
      });
    });

    // Long Content (Difficulty 4-5)
    const longContent = [
      // 1. AI/테크
      {
        text: "Artificial intelligence continues to transform our daily lives. Companies worldwide are investing billions in AI research. From smart assistants to self-driving cars, AI applications are everywhere. Experts predict AI will create millions of new jobs while changing many existing ones. The technology raises important questions about privacy and ethics.",
        translation: "인공지능은 계속해서 우리의 일상을 변화시키고 있습니다. 전 세계 기업들이 AI 연구에 수십억 달러를 투자하고 있습니다. 스마트 어시스턴트부터 자율주행차까지, AI 애플리케이션은 어디에나 있습니다. 전문가들은 AI가 수백만 개의 새로운 일자리를 창출하면서 많은 기존 일자리를 변화시킬 것이라고 예측합니다. 이 기술은 프라이버시와 윤리에 관한 중요한 질문을 제기합니다.",
        difficulty: 4,
        category: "AI/테크" as const,
        paragraphs: [
          { text: "Artificial intelligence continues to transform our daily lives.", translation: "인공지능은 계속해서 우리의 일상을 변화시키고 있습니다." },
          { text: "Companies worldwide are investing billions in AI research.", translation: "전 세계 기업들이 AI 연구에 수십억 달러를 투자하고 있습니다." },
          { text: "From smart assistants to self-driving cars, AI applications are everywhere.", translation: "스마트 어시스턴트부터 자율주행차까지, AI 애플리케이션은 어디에나 있습니다." },
          { text: "Experts predict AI will create millions of new jobs while changing many existing ones.", translation: "전문가들은 AI가 수백만 개의 새로운 일자리를 창출하면서 많은 기존 일자리를 변화시킬 것이라고 예측합니다." },
          { text: "The technology raises important questions about privacy and ethics.", translation: "이 기술은 프라이버시와 윤리에 관한 중요한 질문을 제기합니다." }
        ],
        wordCount: 56,
        estimatedDuration: 45
      },
      // 2. 명언
      {
        text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. And the only way to do great work is to love what you do. If you have not found it yet, keep looking. Do not settle. As with all matters of the heart, you will know when you find it.",
        translation: "당신의 일은 인생의 많은 부분을 채울 것이고, 진정으로 만족하는 유일한 방법은 위대한 일이라고 믿는 것을 하는 것입니다. 그리고 위대한 일을 하는 유일한 방법은 당신이 하는 일을 사랑하는 것입니다. 아직 찾지 못했다면 계속 찾으세요. 타협하지 마세요. 마음의 모든 문제와 마찬가지로, 당신은 그것을 찾았을 때 알게 될 것입니다.",
        difficulty: 4,
        category: "명언" as const,
        paragraphs: [
          { text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.", translation: "당신의 일은 인생의 많은 부분을 채울 것이고, 진정으로 만족하는 유일한 방법은 위대한 일이라고 믿는 것을 하는 것입니다." },
          { text: "And the only way to do great work is to love what you do.", translation: "그리고 위대한 일을 하는 유일한 방법은 당신이 하는 일을 사랑하는 것입니다." },
          { text: "If you have not found it yet, keep looking. Do not settle.", translation: "아직 찾지 못했다면 계속 찾으세요. 타협하지 마세요." },
          { text: "As with all matters of the heart, you will know when you find it.", translation: "마음의 모든 문제와 마찬가지로, 당신은 그것을 찾았을 때 알게 될 것입니다." }
        ],
        wordCount: 73,
        estimatedDuration: 55
      },
      // 3. 역사
      {
        text: "On July 20, 1969, humans landed on the Moon for the first time. Neil Armstrong and Buzz Aldrin walked on the lunar surface while Michael Collins orbited above. Armstrong's famous words, \"That's one small step for man, one giant leap for mankind,\" echoed around the world. The mission took four days to reach the Moon. It represented years of scientific research and engineering achievements. The event inspired millions and marked a new era in space exploration.",
        translation: "1969년 7월 20일, 인류는 처음으로 달에 착륙했습니다. 닐 암스트롱과 버즈 올드린이 달 표면을 걸었고, 마이클 콜린스는 위에서 궤도를 돌았습니다. 암스트롱의 유명한 말, \"이것은 한 사람에게는 작은 발걸음이지만, 인류에게는 거대한 도약입니다\"는 전 세계에 울려 퍼졌습니다. 임무는 달에 도달하는 데 4일이 걸렸습니다. 그것은 수년간의 과학 연구와 공학적 업적을 나타냅니다. 이 사건은 수백만 명에게 영감을 주었고 우주 탐사의 새로운 시대를 열었습니다.",
        difficulty: 4,
        category: "역사" as const,
        paragraphs: [
          { text: "On July 20, 1969, humans landed on the Moon for the first time.", translation: "1969년 7월 20일, 인류는 처음으로 달에 착륙했습니다." },
          { text: "Neil Armstrong and Buzz Aldrin walked on the lunar surface while Michael Collins orbited above.", translation: "닐 암스트롱과 버즈 올드린이 달 표면을 걸었고, 마이클 콜린스는 위에서 궤도를 돌았습니다." },
          { text: "Armstrong's famous words, \"That's one small step for man, one giant leap for mankind,\" echoed around the world.", translation: "암스트롱의 유명한 말, \"이것은 한 사람에게는 작은 발걸음이지만, 인류에게는 거대한 도약입니다\"는 전 세계에 울려 퍼졌습니다." },
          { text: "The mission took four days to reach the Moon.", translation: "임무는 달에 도달하는 데 4일이 걸렸습니다." },
          { text: "It represented years of scientific research and engineering achievements.", translation: "그것은 수년간의 과학 연구와 공학적 업적을 나타냅니다." },
          { text: "The event inspired millions and marked a new era in space exploration.", translation: "이 사건은 수백만 명에게 영감을 주었고 우주 탐사의 새로운 시대를 열었습니다." }
        ],
        wordCount: 85,
        estimatedDuration: 60
      },
      // 4. 문학
      {
        text: "It is only with the heart that one can see rightly. What is essential is invisible to the eye. The most beautiful things in the world cannot be seen or touched. They must be felt with the heart. Time spent with someone you love is never wasted. The greatest glory in living lies not in never falling, but in rising every time we fall.",
        translation: "오직 마음으로만 제대로 볼 수 있습니다. 본질적인 것은 눈에 보이지 않습니다. 세상에서 가장 아름다운 것들은 보거나 만질 수 없습니다. 그것들은 마음으로 느껴야 합니다. 사랑하는 사람과 함께 보낸 시간은 결코 낭비되지 않습니다. 인생의 가장 큰 영광은 결코 넘어지지 않는 것이 아니라, 넘어질 때마다 일어서는 것입니다.",
        difficulty: 5,
        category: "문학" as const,
        paragraphs: [
          { text: "It is only with the heart that one can see rightly.", translation: "오직 마음으로만 제대로 볼 수 있습니다." },
          { text: "What is essential is invisible to the eye.", translation: "본질적인 것은 눈에 보이지 않습니다." },
          { text: "The most beautiful things in the world cannot be seen or touched.", translation: "세상에서 가장 아름다운 것들은 보거나 만질 수 없습니다." },
          { text: "They must be felt with the heart.", translation: "그것들은 마음으로 느껴야 합니다." },
          { text: "Time spent with someone you love is never wasted.", translation: "사랑하는 사람과 함께 보낸 시간은 결코 낭비되지 않습니다." },
          { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", translation: "인생의 가장 큰 영광은 결코 넘어지지 않는 것이 아니라, 넘어질 때마다 일어서는 것입니다." }
        ],
        wordCount: 75,
        estimatedDuration: 55
      },
      // 5. 환경/과학
      {
        text: "Climate change affects every corner of our planet. Rising temperatures are melting polar ice caps and raising sea levels. Extreme weather events are becoming more frequent and severe. Many species face extinction as their habitats disappear. Scientists warn we have limited time to take action. Renewable energy and sustainable practices offer hope for the future.",
        translation: "기후 변화는 지구의 모든 곳에 영향을 미칩니다. 온도 상승으로 극지방의 빙하가 녹고 해수면이 상승하고 있습니다. 극단적인 기상 현상이 더 빈번하고 심각해지고 있습니다. 많은 종들이 서식지가 사라지면서 멸종 위기에 처해 있습니다. 과학자들은 우리에게 행동할 시간이 제한되어 있다고 경고합니다. 재생 가능 에너지와 지속 가능한 관행이 미래에 대한 희망을 제공합니다.",
        difficulty: 4,
        category: "환경/과학" as const,
        paragraphs: [
          { text: "Climate change affects every corner of our planet.", translation: "기후 변화는 지구의 모든 곳에 영향을 미칩니다." },
          { text: "Rising temperatures are melting polar ice caps and raising sea levels.", translation: "온도 상승으로 극지방의 빙하가 녹고 해수면이 상승하고 있습니다." },
          { text: "Extreme weather events are becoming more frequent and severe.", translation: "극단적인 기상 현상이 더 빈번하고 심각해지고 있습니다." },
          { text: "Many species face extinction as their habitats disappear.", translation: "많은 종들이 서식지가 사라지면서 멸종 위기에 처해 있습니다." },
          { text: "Scientists warn we have limited time to take action.", translation: "과학자들은 우리에게 행동할 시간이 제한되어 있다고 경고합니다." },
          { text: "Renewable energy and sustainable practices offer hope for the future.", translation: "재생 가능 에너지와 지속 가능한 관행이 미래에 대한 희망을 제공합니다." }
        ],
        wordCount: 68,
        estimatedDuration: 50
      }
    ];

    longContent.forEach((content) => {
      const id = this.nextId++;
      this.listeningLessons.set(id, {
        id,
        text: content.text,
        translation: content.translation,
        difficulty: content.difficulty,
        category: content.category,
        duration: content.estimatedDuration,
        contentType: "long",
        paragraphs: content.paragraphs,
        wordCount: content.wordCount,
        estimatedDuration: content.estimatedDuration,
        createdAt: new Date()
      });
    });
  }

  // Initialize Vocabulary Words
  private initializeVocabularyWords() {
    const words = [
      // Level 1 - Basic (초급) - Most common words
      { word: "the", definition: "그, 그것(정관사)", phonetic: "/ðə/", partOfSpeech: "article", exampleSentence: "The sun is shining.", difficultyLevel: 1, frequencyRank: 1 },
      { word: "is", definition: "~이다, ~있다", phonetic: "/ɪz/", partOfSpeech: "verb", exampleSentence: "She is happy.", difficultyLevel: 1, frequencyRank: 2 },
      { word: "it", definition: "그것", phonetic: "/ɪt/", partOfSpeech: "pronoun", exampleSentence: "It is only with the heart that one can see rightly.", difficultyLevel: 1, frequencyRank: 3 },
      { word: "a", definition: "하나의(부정관사)", phonetic: "/ə/", partOfSpeech: "article", exampleSentence: "A dog is barking.", difficultyLevel: 1, frequencyRank: 4 },
      { word: "can", definition: "~할 수 있다", phonetic: "/kæn/", partOfSpeech: "verb", exampleSentence: "I can speak English.", difficultyLevel: 1, frequencyRank: 5 },
      { word: "with", definition: "~와 함께", phonetic: "/wɪð/", partOfSpeech: "preposition", exampleSentence: "Come with me.", difficultyLevel: 1, frequencyRank: 6 },
      { word: "one", definition: "하나, 사람", phonetic: "/wʌn/", partOfSpeech: "number/pronoun", exampleSentence: "One person can make a difference.", difficultyLevel: 1, frequencyRank: 7 },
      { word: "see", definition: "보다", phonetic: "/siː/", partOfSpeech: "verb", exampleSentence: "I can see the mountain.", difficultyLevel: 1, frequencyRank: 8 },
      { word: "that", definition: "그것, ~라는 것", phonetic: "/ðæt/", partOfSpeech: "pronoun/conjunction", exampleSentence: "I know that you care.", difficultyLevel: 1, frequencyRank: 9 },
      { word: "only", definition: "오직, 단지", phonetic: "/ˈəʊnli/", partOfSpeech: "adverb", exampleSentence: "There is only one way.", difficultyLevel: 1, frequencyRank: 10 },
      { word: "heart", definition: "마음, 심장", phonetic: "/hɑːrt/", partOfSpeech: "noun", exampleSentence: "Follow your heart.", difficultyLevel: 1, frequencyRank: 11 },
      { word: "rightly", definition: "올바르게, 제대로", phonetic: "/ˈraɪtli/", partOfSpeech: "adverb", exampleSentence: "You judged rightly.", difficultyLevel: 1, frequencyRank: 12 },
      { word: "hello", definition: "인사말, 안녕", phonetic: "/həˈləʊ/", partOfSpeech: "interjection", exampleSentence: "Hello, how are you today?", difficultyLevel: 1, frequencyRank: 100 },
      { word: "good", definition: "좋은, 훌륭한", phonetic: "/ɡʊd/", partOfSpeech: "adjective", exampleSentence: "That is a good idea.", difficultyLevel: 1, frequencyRank: 50 },
      { word: "time", definition: "시간", phonetic: "/taɪm/", partOfSpeech: "noun", exampleSentence: "What time is it?", difficultyLevel: 1, frequencyRank: 30 },
      { word: "day", definition: "날, 하루", phonetic: "/deɪ/", partOfSpeech: "noun", exampleSentence: "Have a nice day!", difficultyLevel: 1, frequencyRank: 40 },
      { word: "thank", definition: "감사하다", phonetic: "/θæŋk/", partOfSpeech: "verb", exampleSentence: "Thank you for your help.", difficultyLevel: 1, frequencyRank: 80 },
      { word: "help", definition: "돕다, 도움", phonetic: "/help/", partOfSpeech: "verb", exampleSentence: "Can you help me?", difficultyLevel: 1, frequencyRank: 60 },
      { word: "water", definition: "물", phonetic: "/ˈwɔːtər/", partOfSpeech: "noun", exampleSentence: "I need some water.", difficultyLevel: 1, frequencyRank: 90 },
      { word: "food", definition: "음식", phonetic: "/fuːd/", partOfSpeech: "noun", exampleSentence: "The food is delicious.", difficultyLevel: 1, frequencyRank: 85 },
      { word: "name", definition: "이름", phonetic: "/neɪm/", partOfSpeech: "noun", exampleSentence: "What is your name?", difficultyLevel: 1, frequencyRank: 70 },
      { word: "year", definition: "년, 해", phonetic: "/jɪər/", partOfSpeech: "noun", exampleSentence: "I am twenty years old.", difficultyLevel: 1, frequencyRank: 45 },
      { word: "people", definition: "사람들", phonetic: "/ˈpiːpl/", partOfSpeech: "noun", exampleSentence: "Many people are here.", difficultyLevel: 1, frequencyRank: 35 },
      { word: "work", definition: "일, 일하다", phonetic: "/wɜːrk/", partOfSpeech: "noun/verb", exampleSentence: "I work at a school.", difficultyLevel: 1, frequencyRank: 55 },
      { word: "place", definition: "장소", phonetic: "/pleɪs/", partOfSpeech: "noun", exampleSentence: "This is a nice place.", difficultyLevel: 1, frequencyRank: 65 },
      { word: "friend", definition: "친구", phonetic: "/frend/", partOfSpeech: "noun", exampleSentence: "She is my best friend.", difficultyLevel: 1, frequencyRank: 75 },
      
      // Level 2 - Elementary (기초)
      { word: "morning", definition: "아침", phonetic: "/ˈmɔːrnɪŋ/", partOfSpeech: "noun", exampleSentence: "Good morning everyone!", difficultyLevel: 2, frequencyRank: 95 },
      { word: "night", definition: "밤", phonetic: "/naɪt/", partOfSpeech: "noun", exampleSentence: "Good night, sleep well.", difficultyLevel: 2, frequencyRank: 105 },
      { word: "family", definition: "가족", phonetic: "/ˈfæməli/", partOfSpeech: "noun", exampleSentence: "I love my family.", difficultyLevel: 2, frequencyRank: 110 },
      { word: "house", definition: "집", phonetic: "/haʊs/", partOfSpeech: "noun", exampleSentence: "This is my house.", difficultyLevel: 2, frequencyRank: 120 },
      { word: "book", definition: "책", phonetic: "/bʊk/", partOfSpeech: "noun", exampleSentence: "I am reading a book.", difficultyLevel: 2, frequencyRank: 125 },
      { word: "school", definition: "학교", phonetic: "/skuːl/", partOfSpeech: "noun", exampleSentence: "She goes to school every day.", difficultyLevel: 2, frequencyRank: 115 },
      { word: "money", definition: "돈", phonetic: "/ˈmʌni/", partOfSpeech: "noun", exampleSentence: "I need some money.", difficultyLevel: 2, frequencyRank: 130 },
      { word: "world", definition: "세계", phonetic: "/wɜːrld/", partOfSpeech: "noun", exampleSentence: "The world is beautiful.", difficultyLevel: 2, frequencyRank: 135 },
      
      // Level 3 - Intermediate (중급)
      { word: "important", definition: "중요한", phonetic: "/ɪmˈpɔːrtnt/", partOfSpeech: "adjective", exampleSentence: "This is very important.", difficultyLevel: 3, frequencyRank: 150 },
      { word: "understand", definition: "이해하다", phonetic: "/ˌʌndərˈstænd/", partOfSpeech: "verb", exampleSentence: "I understand your concern.", difficultyLevel: 3, frequencyRank: 120 },
      { word: "different", definition: "다른, 상이한", phonetic: "/ˈdɪfrənt/", partOfSpeech: "adjective", exampleSentence: "Every situation is different.", difficultyLevel: 3, frequencyRank: 110 },
      { word: "business", definition: "사업, 업무", phonetic: "/ˈbɪznəs/", partOfSpeech: "noun", exampleSentence: "She runs her own business.", difficultyLevel: 3, frequencyRank: 140 },
      { word: "develop", definition: "개발하다, 발전시키다", phonetic: "/dɪˈveləp/", partOfSpeech: "verb", exampleSentence: "We need to develop new skills.", difficultyLevel: 3, frequencyRank: 130 },
      { word: "system", definition: "시스템, 체계", phonetic: "/ˈsɪstəm/", partOfSpeech: "noun", exampleSentence: "The education system needs reform.", difficultyLevel: 3, frequencyRank: 125 },
      { word: "provide", definition: "제공하다", phonetic: "/prəˈvaɪd/", partOfSpeech: "verb", exampleSentence: "The company provides training.", difficultyLevel: 3, frequencyRank: 135 },
      { word: "include", definition: "포함하다", phonetic: "/ɪnˈkluːd/", partOfSpeech: "verb", exampleSentence: "The price includes breakfast.", difficultyLevel: 3, frequencyRank: 115 },
      { word: "continue", definition: "계속하다", phonetic: "/kənˈtɪnjuː/", partOfSpeech: "verb", exampleSentence: "Please continue reading.", difficultyLevel: 3, frequencyRank: 145 },
      { word: "consider", definition: "고려하다, 생각하다", phonetic: "/kənˈsɪdər/", partOfSpeech: "verb", exampleSentence: "We should consider all options.", difficultyLevel: 3, frequencyRank: 155 },
      { word: "problem", definition: "문제", phonetic: "/ˈprɒbləm/", partOfSpeech: "noun", exampleSentence: "We need to solve this problem.", difficultyLevel: 3, frequencyRank: 160 },
      { word: "question", definition: "질문", phonetic: "/ˈkwestʃən/", partOfSpeech: "noun", exampleSentence: "Do you have any questions?", difficultyLevel: 3, frequencyRank: 165 },
      { word: "government", definition: "정부", phonetic: "/ˈɡʌvərnmənt/", partOfSpeech: "noun", exampleSentence: "The government announced new policies.", difficultyLevel: 3, frequencyRank: 170 },
      { word: "company", definition: "회사", phonetic: "/ˈkʌmpəni/", partOfSpeech: "noun", exampleSentence: "She works for a tech company.", difficultyLevel: 3, frequencyRank: 175 },
      { word: "program", definition: "프로그램", phonetic: "/ˈprəʊɡræm/", partOfSpeech: "noun", exampleSentence: "This is a great training program.", difficultyLevel: 3, frequencyRank: 180 },
      { word: "service", definition: "서비스", phonetic: "/ˈsɜːrvɪs/", partOfSpeech: "noun", exampleSentence: "Their customer service is excellent.", difficultyLevel: 3, frequencyRank: 185 },
      { word: "public", definition: "공공의, 대중의", phonetic: "/ˈpʌblɪk/", partOfSpeech: "adjective", exampleSentence: "This is a public park.", difficultyLevel: 3, frequencyRank: 190 },
      { word: "satisfied", definition: "만족한", phonetic: "/ˈsætɪsfaɪd/", partOfSpeech: "adjective", exampleSentence: "I am satisfied with the result.", difficultyLevel: 3, frequencyRank: 190 },
      
      // Level 4 - Upper Intermediate (중상급)
      { word: "artificial", definition: "인공의, 인위적인", phonetic: "/ˌɑːrtɪˈfɪʃl/", partOfSpeech: "adjective", exampleSentence: "Artificial intelligence is advancing rapidly.", difficultyLevel: 4, frequencyRank: 300 },
      { word: "intelligence", definition: "지능, 정보", phonetic: "/ɪnˈtelɪdʒəns/", partOfSpeech: "noun", exampleSentence: "Human intelligence is remarkable.", difficultyLevel: 4, frequencyRank: 250 },
      { word: "transform", definition: "변형시키다, 변환하다", phonetic: "/trænsˈfɔːrm/", partOfSpeech: "verb", exampleSentence: "Technology will transform education.", difficultyLevel: 4, frequencyRank: 280 },
      { word: "research", definition: "연구", phonetic: "/rɪˈsɜːrtʃ/", partOfSpeech: "noun/verb", exampleSentence: "Scientific research takes time.", difficultyLevel: 4, frequencyRank: 200 },
      { word: "investment", definition: "투자", phonetic: "/ɪnˈvestmənt/", partOfSpeech: "noun", exampleSentence: "This requires significant investment.", difficultyLevel: 4, frequencyRank: 220 },
      { word: "application", definition: "응용, 신청", phonetic: "/ˌæplɪˈkeɪʃn/", partOfSpeech: "noun", exampleSentence: "Mobile applications are everywhere.", difficultyLevel: 4, frequencyRank: 240 },
      { word: "prediction", definition: "예측", phonetic: "/prɪˈdɪkʃn/", partOfSpeech: "noun", exampleSentence: "Weather predictions are improving.", difficultyLevel: 4, frequencyRank: 320 },
      { word: "technology", definition: "기술", phonetic: "/tekˈnɑːlədʒi/", partOfSpeech: "noun", exampleSentence: "New technology changes lives.", difficultyLevel: 4, frequencyRank: 180 },
      { word: "privacy", definition: "프라이버시, 사생활", phonetic: "/ˈpraɪvəsi/", partOfSpeech: "noun", exampleSentence: "Privacy concerns are growing.", difficultyLevel: 4, frequencyRank: 290 },
      { word: "melting", definition: "녹는, 용해", phonetic: "/ˈmeltɪŋ/", partOfSpeech: "adjective", exampleSentence: "Ice caps are melting rapidly.", difficultyLevel: 4, frequencyRank: 350 },
      { word: "species", definition: "종, 종류", phonetic: "/ˈspiːʃiːz/", partOfSpeech: "noun", exampleSentence: "Many species face extinction.", difficultyLevel: 4, frequencyRank: 270 },
      { word: "habitat", definition: "서식지", phonetic: "/ˈhæbɪtæt/", partOfSpeech: "noun", exampleSentence: "Wildlife habitats are shrinking.", difficultyLevel: 4, frequencyRank: 380 },
      { word: "renewable", definition: "재생 가능한", phonetic: "/rɪˈnuːəbl/", partOfSpeech: "adjective", exampleSentence: "Renewable energy is the future.", difficultyLevel: 4, frequencyRank: 360 },
      { word: "sustainable", definition: "지속 가능한", phonetic: "/səˈsteɪnəbl/", partOfSpeech: "adjective", exampleSentence: "We need sustainable practices.", difficultyLevel: 4, frequencyRank: 340 },
      { word: "achievement", definition: "성취, 업적", phonetic: "/əˈtʃiːvmənt/", partOfSpeech: "noun", exampleSentence: "This is a great achievement.", difficultyLevel: 4, frequencyRank: 260 },
      { word: "essential", definition: "필수적인", phonetic: "/ɪˈsenʃl/", partOfSpeech: "adjective", exampleSentence: "Water is essential for life.", difficultyLevel: 4, frequencyRank: 230 },
      { word: "invisible", definition: "보이지 않는", phonetic: "/ɪnˈvɪzəbl/", partOfSpeech: "adjective", exampleSentence: "Love is invisible but real.", difficultyLevel: 4, frequencyRank: 370 },
      { word: "challenge", definition: "도전, 과제", phonetic: "/ˈtʃælɪndʒ/", partOfSpeech: "noun/verb", exampleSentence: "This is a big challenge.", difficultyLevel: 4, frequencyRank: 210 },
      { word: "opportunity", definition: "기회", phonetic: "/ˌɒpərˈtjuːnəti/", partOfSpeech: "noun", exampleSentence: "This is a great opportunity.", difficultyLevel: 4, frequencyRank: 195 },
      
      // Level 5 - Advanced (고급)
      { word: "ethics", definition: "윤리", phonetic: "/ˈeθɪks/", partOfSpeech: "noun", exampleSentence: "Medical ethics are important.", difficultyLevel: 5, frequencyRank: 400 },
      { word: "extinction", definition: "멸종", phonetic: "/ɪkˈstɪŋkʃn/", partOfSpeech: "noun", exampleSentence: "Climate change threatens extinction.", difficultyLevel: 5, frequencyRank: 420 },
      { word: "phenomenon", definition: "현상", phonetic: "/fəˈnɒmɪnən/", partOfSpeech: "noun", exampleSentence: "This is a natural phenomenon.", difficultyLevel: 5, frequencyRank: 430 },
      { word: "philosophy", definition: "철학", phonetic: "/fɪˈlɒsəfi/", partOfSpeech: "noun", exampleSentence: "She studies ancient philosophy.", difficultyLevel: 5, frequencyRank: 440 },
      { word: "sophisticated", definition: "정교한, 세련된", phonetic: "/səˈfɪstɪkeɪtɪd/", partOfSpeech: "adjective", exampleSentence: "This is a sophisticated system.", difficultyLevel: 5, frequencyRank: 450 },
    ];

    words.forEach((w) => {
      const id = this.nextId++;
      this.vocabularyWords.set(id, {
        id,
        word: w.word,
        definition: w.definition,
        phonetic: w.phonetic,
        partOfSpeech: w.partOfSpeech,
        exampleSentence: w.exampleSentence,
        difficultyLevel: w.difficultyLevel,
        frequencyRank: w.frequencyRank,
        createdAt: new Date()
      });
    });
  }

  // Listening Lessons
  async getListeningLessons(filters?: { difficulty?: number; category?: string }): Promise<ListeningLesson[]> {
    let lessons = Array.from(this.listeningLessons.values());
    
    if (filters?.difficulty) {
      lessons = lessons.filter(l => l.difficulty === filters.difficulty);
    }
    
    if (filters?.category) {
      lessons = lessons.filter(l => l.category === filters.category);
    }
    
    return lessons.sort((a, b) => a.difficulty - b.difficulty);
  }

  async getListeningLesson(id: number): Promise<ListeningLesson | undefined> {
    return this.listeningLessons.get(id);
  }

  // Listening Progress
  async addListeningProgress(progress: InsertListeningProgress): Promise<ListeningProgress> {
    const id = this.nextId++;
    const listeningProgress: ListeningProgress = {
      id,
      userId: progress.userId,
      lessonId: progress.lessonId,
      userAnswer: progress.userAnswer,
      score: progress.score,
      accuracy: progress.accuracy,
      completed: progress.completed ?? true,
      completedAt: new Date(),
      createdAt: new Date()
    };
    this.listeningProgress.set(id, listeningProgress);
    return listeningProgress;
  }

  async getListeningProgress(userId: string, lessonId?: number): Promise<ListeningProgress[]> {
    let progress = Array.from(this.listeningProgress.values())
      .filter(p => p.userId === userId);
    
    if (lessonId !== undefined) {
      progress = progress.filter(p => p.lessonId === lessonId);
    }
    
    return progress.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }

  async getListeningStats(userId: string): Promise<{
    totalCompleted: number;
    averageScore: number;
    averageAccuracy: number;
    categoryStats: { category: string; count: number; avgScore: number; avgAccuracy: number }[];
    difficultyStats: { difficulty: number; count: number; avgScore: number; avgAccuracy: number }[];
    recentProgress: ListeningProgress[];
  }> {
    const userProgress = Array.from(this.listeningProgress.values())
      .filter(p => p.userId === userId && p.completed);
    
    const totalCompleted = userProgress.length;
    const averageScore = totalCompleted > 0
      ? userProgress.reduce((sum, p) => sum + p.score, 0) / totalCompleted
      : 0;
    const averageAccuracy = totalCompleted > 0
      ? userProgress.reduce((sum, p) => sum + p.accuracy, 0) / totalCompleted
      : 0;
    
    // Category stats
    const categoryMap = new Map<string, { count: number; totalScore: number; totalAccuracy: number }>();
    userProgress.forEach(p => {
      const lesson = this.listeningLessons.get(p.lessonId);
      if (lesson) {
        const category = lesson.category;
        const existing = categoryMap.get(category) || { count: 0, totalScore: 0, totalAccuracy: 0 };
        categoryMap.set(category, {
          count: existing.count + 1,
          totalScore: existing.totalScore + p.score,
          totalAccuracy: existing.totalAccuracy + p.accuracy
        });
      }
    });
    
    const categoryStats = Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      count: stats.count,
      avgScore: stats.totalScore / stats.count,
      avgAccuracy: stats.totalAccuracy / stats.count
    }));
    
    // Difficulty stats
    const difficultyMap = new Map<number, { count: number; totalScore: number; totalAccuracy: number }>();
    userProgress.forEach(p => {
      const lesson = this.listeningLessons.get(p.lessonId);
      if (lesson) {
        const difficulty = lesson.difficulty;
        const existing = difficultyMap.get(difficulty) || { count: 0, totalScore: 0, totalAccuracy: 0 };
        difficultyMap.set(difficulty, {
          count: existing.count + 1,
          totalScore: existing.totalScore + p.score,
          totalAccuracy: existing.totalAccuracy + p.accuracy
        });
      }
    });
    
    const difficultyStats = Array.from(difficultyMap.entries()).map(([difficulty, stats]) => ({
      difficulty,
      count: stats.count,
      avgScore: stats.totalScore / stats.count,
      avgAccuracy: stats.totalAccuracy / stats.count
    })).sort((a, b) => a.difficulty - b.difficulty);
    
    // Recent progress (last 10)
    const recentProgress = userProgress
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
      .slice(0, 10);
    
    return {
      totalCompleted,
      averageScore,
      averageAccuracy,
      categoryStats,
      difficultyStats,
      recentProgress
    };
  }

  // Vocabulary Words
  async getVocabularyWord(word: string): Promise<VocabularyWord | undefined> {
    const lowerWord = word.toLowerCase();
    const wordEntry = Array.from(this.vocabularyWords.values()).find(
      w => w.word.toLowerCase() === lowerWord
    );
    return wordEntry;
  }

  async getAllVocabularyWords(): Promise<VocabularyWord[]> {
    return Array.from(this.vocabularyWords.values());
  }

  async addVocabularyWord(word: InsertVocabularyWord): Promise<VocabularyWord> {
    const id = this.nextId++;
    const vocabularyWord: VocabularyWord = {
      id,
      word: word.word.toLowerCase(),
      definition: word.definition,
      phonetic: word.phonetic,
      partOfSpeech: word.partOfSpeech,
      exampleSentence: word.exampleSentence,
      difficultyLevel: word.difficultyLevel,
      frequencyRank: word.frequencyRank,
      createdAt: new Date()
    };
    this.vocabularyWords.set(id, vocabularyWord);
    return vocabularyWord;
  }

  // User Vocabulary
  async getUserVocabulary(userId: string): Promise<(UserVocabulary & { word: VocabularyWord })[]> {
    const userVocab = Array.from(this.userVocabulary.values())
      .filter(v => v.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const result = userVocab.map(uv => {
      const word = this.vocabularyWords.get(uv.wordId);
      if (!word) {
        throw new Error(`Word ${uv.wordId} not found`);
      }
      return {
        ...uv,
        word
      };
    });
    
    return result;
  }

  async saveUserVocabulary(userVocab: InsertUserVocabulary): Promise<UserVocabulary> {
    // Check if already exists
    const existing = Array.from(this.userVocabulary.values()).find(
      v => v.userId === userVocab.userId && v.wordId === userVocab.wordId
    );
    
    if (existing) {
      return existing;
    }
    
    const id = this.nextId++;
    const vocabulary: UserVocabulary = {
      id,
      userId: userVocab.userId,
      wordId: userVocab.wordId,
      learned: userVocab.learned ?? false,
      timesReviewed: userVocab.timesReviewed ?? 0,
      notes: userVocab.notes,
      createdAt: new Date()
    };
    this.userVocabulary.set(id, vocabulary);
    return vocabulary;
  }

  async updateUserVocabulary(userId: string, id: number, updates: Partial<UserVocabulary>): Promise<UserVocabulary> {
    const existing = this.userVocabulary.get(id);
    if (!existing || existing.userId !== userId) {
      throw new Error(`User vocabulary ${id} not found`);
    }
    
    const updated: UserVocabulary = {
      ...existing,
      ...updates,
      lastReviewedAt: new Date()
    };
    this.userVocabulary.set(id, updated);
    return updated;
  }

  async deleteUserVocabulary(userId: string, id: number): Promise<void> {
    const existing = this.userVocabulary.get(id);
    if (!existing || existing.userId !== userId) {
      throw new Error(`User vocabulary ${id} not found`);
    }
    this.userVocabulary.delete(id);
  }

  async isWordSaved(userId: string, wordId: number): Promise<boolean> {
    const saved = Array.from(this.userVocabulary.values()).find(
      v => v.userId === userId && v.wordId === wordId
    );
    return !!saved;
  }

  // Reading Passages Initialization
  private initializeReadingPassages() {
    const passages: InsertReadingPassage[] = [
      {
        title: "My Daily Routine",
        content: "My name is Sarah. I am a student. I wake up at 7 AM every day. I eat breakfast with my family. Then I go to school by bus. School starts at 8:30 AM. I have lunch at 12 PM. After school, I do my homework. I like to read books in the evening. I go to bed at 10 PM.",
        contentType: "story",
        difficulty: 1,
        wordCount: 68,
        estimatedTime: 40,
        paragraphs: [
          {
            text: "My name is Sarah. I am a student. I wake up at 7 AM every day. I eat breakfast with my family. Then I go to school by bus. School starts at 8:30 AM. I have lunch at 12 PM. After school, I do my homework. I like to read books in the evening. I go to bed at 10 PM.",
            translation: "제 이름은 사라입니다. 저는 학생이에요. 저는 매일 오전 7시에 일어납니다. 가족과 함께 아침을 먹어요. 그리고 버스로 학교에 가요. 학교는 8시 30분에 시작해요. 점심은 12시에 먹어요. 방과 후에는 숙제를 해요. 저는 저녁에 책 읽는 것을 좋아해요. 밤 10시에 잠자리에 들어요."
          }
        ]
      },
      {
        title: "Party Invitation",
        content: "Dear friends,\n\nI am having a birthday party next Saturday at 3 PM. The party will be at my house. There will be cake, games, and music. Please bring your friends too! Let me know if you can come.\n\nSee you there!\nEmma",
        contentType: "email",
        difficulty: 2,
        wordCount: 52,
        estimatedTime: 35,
        paragraphs: [
          {
            text: "Dear friends,",
            translation: "친애하는 친구들에게,"
          },
          {
            text: "I am having a birthday party next Saturday at 3 PM. The party will be at my house. There will be cake, games, and music. Please bring your friends too! Let me know if you can come.",
            translation: "다음 주 토요일 오후 3시에 제 생일 파티를 해요. 파티는 제 집에서 할 거예요. 케이크, 게임, 음악이 있을 거예요. 친구들도 데려오세요! 올 수 있는지 알려주세요."
          },
          {
            text: "See you there!\nEmma",
            translation: "그곳에서 봐요!\n엠마"
          }
        ]
      },
      {
        title: "New Park Opens Downtown",
        content: "The city opened a new park downtown yesterday. The park has walking paths, playgrounds, and a small lake. Mayor Johnson said the park will help families enjoy outdoor activities. \"We wanted to create a beautiful space for everyone,\" the mayor explained. The park took two years to build and cost 5 million dollars. Local residents are excited about the new addition to their neighborhood. The park is open daily from 6 AM to 9 PM.",
        contentType: "news",
        difficulty: 3,
        wordCount: 85,
        estimatedTime: 50,
        paragraphs: [
          {
            text: "The city opened a new park downtown yesterday. The park has walking paths, playgrounds, and a small lake. Mayor Johnson said the park will help families enjoy outdoor activities. \"We wanted to create a beautiful space for everyone,\" the mayor explained. The park took two years to build and cost 5 million dollars. Local residents are excited about the new addition to their neighborhood. The park is open daily from 6 AM to 9 PM.",
            translation: "시에서 어제 도심에 새로운 공원을 열었습니다. 공원에는 산책로, 놀이터, 작은 호수가 있습니다. 존슨 시장은 이 공원이 가족들이 야외 활동을 즐기는 데 도움이 될 것이라고 말했습니다. \"우리는 모두를 위한 아름다운 공간을 만들고 싶었습니다\"라고 시장은 설명했습니다. 공원 건설에는 2년이 걸렸고 500만 달러의 비용이 들었습니다. 지역 주민들은 동네에 새로 추가된 이 공간에 대해 기뻐하고 있습니다. 공원은 오전 6시부터 오후 9시까지 매일 운영됩니다."
          }
        ]
      },
      {
        title: "The Benefits of Reading",
        content: "Reading is one of the most valuable habits a person can develop. It expands our knowledge, improves our vocabulary, and stimulates our imagination. When we read regularly, we expose ourselves to different perspectives and ideas. This helps us understand the world better and makes us more empathetic toward others.\n\nResearch shows that reading can reduce stress levels significantly. Just six minutes of reading can lower stress by up to 68 percent, according to scientists at the University of Sussex. Reading before bed can also improve sleep quality.\n\nFurthermore, reading keeps our minds active and engaged. Like physical exercise strengthens the body, mental exercise through reading strengthens the brain. Studies suggest that regular reading may even help prevent cognitive decline as we age.",
        contentType: "essay",
        difficulty: 4,
        wordCount: 128,
        estimatedTime: 75,
        paragraphs: [
          {
            text: "Reading is one of the most valuable habits a person can develop. It expands our knowledge, improves our vocabulary, and stimulates our imagination. When we read regularly, we expose ourselves to different perspectives and ideas. This helps us understand the world better and makes us more empathetic toward others.",
            translation: "독서는 사람이 기를 수 있는 가장 가치 있는 습관 중 하나입니다. 독서는 우리의 지식을 넓히고, 어휘력을 향상시키며, 상상력을 자극합니다. 정기적으로 책을 읽을 때, 우리는 다양한 관점과 아이디어에 노출됩니다. 이것은 우리가 세상을 더 잘 이해하고 다른 사람들에 대해 더 공감할 수 있게 해줍니다."
          },
          {
            text: "Research shows that reading can reduce stress levels significantly. Just six minutes of reading can lower stress by up to 68 percent, according to scientists at the University of Sussex. Reading before bed can also improve sleep quality.",
            translation: "연구에 따르면 독서는 스트레스 수준을 크게 줄일 수 있습니다. 서섹스 대학교의 과학자들에 따르면, 단 6분간의 독서만으로도 스트레스를 최대 68%까지 낮출 수 있다고 합니다. 잠자기 전에 책을 읽는 것은 수면의 질도 향상시킬 수 있습니다."
          },
          {
            text: "Furthermore, reading keeps our minds active and engaged. Like physical exercise strengthens the body, mental exercise through reading strengthens the brain. Studies suggest that regular reading may even help prevent cognitive decline as we age.",
            translation: "게다가, 독서는 우리의 마음을 활발하고 집중하게 유지합니다. 신체 운동이 몸을 강하게 만드는 것처럼, 독서를 통한 정신 운동은 뇌를 강화합니다. 연구에 따르면 정기적인 독서는 나이가 들면서 인지 능력 저하를 예방하는 데에도 도움이 될 수 있습니다."
          }
        ]
      },
      {
        title: "Artificial Intelligence in Healthcare",
        content: "Artificial intelligence is revolutionizing the healthcare industry in unprecedented ways. Machine learning algorithms can now detect diseases from medical images with accuracy that rivals or exceeds human experts. For instance, AI systems have demonstrated remarkable success in identifying early-stage cancers, cardiovascular conditions, and neurological disorders.\n\nThe implementation of AI in healthcare extends beyond diagnosis. Predictive analytics help hospitals optimize resource allocation, reducing wait times and improving patient outcomes. Natural language processing enables automated analysis of medical records, identifying patterns that might escape human observation. Robot-assisted surgeries allow for greater precision, resulting in fewer complications and faster recovery times.\n\nHowever, the integration of AI into healthcare raises important ethical questions. Issues of data privacy, algorithmic bias, and the role of human judgment in medical decision-making require careful consideration. As this technology continues to evolve, establishing appropriate regulatory frameworks and ethical guidelines becomes increasingly crucial to ensure that AI serves the best interests of patients while maintaining the fundamental principles of medical practice.",
        contentType: "news",
        difficulty: 5,
        wordCount: 168,
        estimatedTime: 100,
        paragraphs: [
          {
            text: "Artificial intelligence is revolutionizing the healthcare industry in unprecedented ways. Machine learning algorithms can now detect diseases from medical images with accuracy that rivals or exceeds human experts. For instance, AI systems have demonstrated remarkable success in identifying early-stage cancers, cardiovascular conditions, and neurological disorders.",
            translation: "인공지능은 전례 없는 방식으로 의료 산업에 혁명을 일으키고 있습니다. 머신러닝 알고리즘은 이제 의료 영상에서 인간 전문가와 맞먹거나 능가하는 정확도로 질병을 감지할 수 있습니다. 예를 들어, AI 시스템은 초기 단계 암, 심혈관 질환 및 신경 장애를 식별하는 데 놀라운 성공을 보여주었습니다."
          },
          {
            text: "The implementation of AI in healthcare extends beyond diagnosis. Predictive analytics help hospitals optimize resource allocation, reducing wait times and improving patient outcomes. Natural language processing enables automated analysis of medical records, identifying patterns that might escape human observation. Robot-assisted surgeries allow for greater precision, resulting in fewer complications and faster recovery times.",
            translation: "의료 분야에서 AI의 구현은 진단을 넘어 확장됩니다. 예측 분석은 병원이 자원 배분을 최적화하여 대기 시간을 줄이고 환자 결과를 개선하는 데 도움이 됩니다. 자연어 처리는 의료 기록의 자동 분석을 가능하게 하여 인간의 관찰에서 놓칠 수 있는 패턴을 식별합니다. 로봇 보조 수술은 더 높은 정밀도를 가능하게 하여 합병증을 줄이고 회복 시간을 단축시킵니다."
          },
          {
            text: "However, the integration of AI into healthcare raises important ethical questions. Issues of data privacy, algorithmic bias, and the role of human judgment in medical decision-making require careful consideration. As this technology continues to evolve, establishing appropriate regulatory frameworks and ethical guidelines becomes increasingly crucial to ensure that AI serves the best interests of patients while maintaining the fundamental principles of medical practice.",
            translation: "그러나 의료 분야에 AI를 통합하는 것은 중요한 윤리적 질문을 제기합니다. 데이터 프라이버시, 알고리즘 편향, 그리고 의료 의사결정에서 인간 판단의 역할에 대한 문제는 신중한 고려가 필요합니다. 이 기술이 계속 발전함에 따라, 의료 실무의 기본 원칙을 유지하면서 AI가 환자의 최선의 이익을 위해 봉사하도록 보장하기 위해 적절한 규제 프레임워크와 윤리 지침을 수립하는 것이 점점 더 중요해지고 있습니다."
          }
        ]
      }
    ];

    passages.forEach(passage => {
      const id = this.nextId++;
      const readingPassage: ReadingPassage = {
        id,
        ...passage,
        createdAt: new Date()
      };
      this.readingPassages.set(id, readingPassage);
    });
  }

  // Reading Passages
  async getReadingPassages(filters?: { difficulty?: number; contentType?: string }): Promise<ReadingPassage[]> {
    let passages = Array.from(this.readingPassages.values());
    
    if (filters?.difficulty) {
      passages = passages.filter(p => p.difficulty === filters.difficulty);
    }
    
    if (filters?.contentType) {
      passages = passages.filter(p => p.contentType === filters.contentType);
    }
    
    return passages.sort((a, b) => a.difficulty - b.difficulty);
  }

  async getReadingPassage(id: number): Promise<ReadingPassage | undefined> {
    return this.readingPassages.get(id);
  }

  // Reading Questions Initialization
  private initializeReadingQuestions() {
    const passageIds = Array.from(this.readingPassages.keys());
    
    // Level 1: My Daily Routine (passageId = 1)
    const level1Questions: Omit<InsertReadingQuestion, 'passageId'>[] = [
      {
        questionText: "What time does Sarah wake up?",
        questionType: "detail",
        options: ["6 AM", "7 AM", "8 AM", "9 AM"],
        correctAnswer: "7 AM",
        explanation: "The passage states \"I wake up at 7 AM every day.\""
      },
      {
        questionText: "How does Sarah go to school?",
        questionType: "detail",
        options: ["By car", "By bus", "By bike", "By walking"],
        correctAnswer: "By bus",
        explanation: "The text says \"Then I go to school by bus.\""
      },
      {
        questionText: "What does Sarah like to do in the evening?",
        questionType: "detail",
        options: ["Watch TV", "Play games", "Read books", "Exercise"],
        correctAnswer: "Read books",
        explanation: "According to the passage, \"I like to read books in the evening.\""
      }
    ];

    // Level 2: Party Invitation (passageId = 2)
    const level2Questions: Omit<InsertReadingQuestion, 'passageId'>[] = [
      {
        questionText: "What is the main purpose of this email?",
        questionType: "main_idea",
        options: ["To thank someone", "To invite friends to a party", "To ask for help", "To apologize"],
        correctAnswer: "To invite friends to a party",
        explanation: "Emma is inviting friends to her birthday party."
      },
      {
        questionText: "When is the party?",
        questionType: "detail",
        options: ["This Saturday", "Next Saturday", "This Sunday", "Next Sunday"],
        correctAnswer: "Next Saturday",
        explanation: "The email mentions \"next Saturday at 3 PM\"."
      },
      {
        questionText: "What will NOT be at the party?",
        questionType: "detail",
        options: ["Cake", "Games", "Music", "Swimming"],
        correctAnswer: "Swimming",
        explanation: "The email lists cake, games, and music, but not swimming."
      }
    ];

    // Level 3: New Park Opens Downtown (passageId = 3)
    const level3Questions: Omit<InsertReadingQuestion, 'passageId'>[] = [
      {
        questionText: "What is this article mainly about?",
        questionType: "main_idea",
        options: ["A famous mayor", "A new park opening", "Building costs", "City problems"],
        correctAnswer: "A new park opening",
        explanation: "The article discusses the opening of a new downtown park."
      },
      {
        questionText: "How long did it take to build the park?",
        questionType: "detail",
        options: ["One year", "Two years", "Three years", "Five years"],
        correctAnswer: "Two years",
        explanation: "The text states \"The park took two years to build\"."
      },
      {
        questionText: "What can you infer about the local residents?",
        questionType: "inference",
        options: ["They are angry", "They are excited", "They are confused", "They are worried"],
        correctAnswer: "They are excited",
        explanation: "The passage mentions \"Local residents are excited about the new addition\"."
      },
      {
        questionText: "What does \"addition\" mean in this context?",
        questionType: "vocabulary",
        options: ["Math problem", "Something new added", "Building material", "Park equipment"],
        correctAnswer: "Something new added",
        explanation: "In this context, \"addition\" refers to something new being added to the neighborhood."
      }
    ];

    // Level 4: The Benefits of Reading (passageId = 4)
    const level4Questions: Omit<InsertReadingQuestion, 'passageId'>[] = [
      {
        questionText: "What is the main idea of this essay?",
        questionType: "main_idea",
        options: ["Reading is expensive", "Reading has many benefits", "Books are old-fashioned", "Reading is difficult"],
        correctAnswer: "Reading has many benefits",
        explanation: "The essay discusses various benefits of reading."
      },
      {
        questionText: "According to the passage, how much can reading reduce stress?",
        questionType: "detail",
        options: ["50%", "60%", "68%", "80%"],
        correctAnswer: "68%",
        explanation: "The text states \"lower stress by up to 68 percent\"."
      },
      {
        questionText: "Reading is compared to what in the essay?",
        questionType: "detail",
        options: ["Eating healthy", "Physical exercise", "Sleeping well", "Watching movies"],
        correctAnswer: "Physical exercise",
        explanation: "The passage compares reading to physical exercise: \"Like physical exercise strengthens the body, mental exercise through reading strengthens the brain.\""
      },
      {
        questionText: "What can be inferred about reading before bed?",
        questionType: "inference",
        options: ["It causes headaches", "It helps you sleep better", "It wastes time", "It is too difficult"],
        correctAnswer: "It helps you sleep better",
        explanation: "The passage mentions \"Reading before bed can also improve sleep quality\"."
      }
    ];

    // Level 5: Artificial Intelligence in Healthcare (passageId = 5)
    const level5Questions: Omit<InsertReadingQuestion, 'passageId'>[] = [
      {
        questionText: "What is the main topic of this article?",
        questionType: "main_idea",
        options: ["Computer problems", "AI transforming healthcare", "Medical school training", "Hospital costs"],
        correctAnswer: "AI transforming healthcare",
        explanation: "The article discusses how AI is revolutionizing healthcare."
      },
      {
        questionText: "According to the passage, what can AI detect from medical images?",
        questionType: "detail",
        options: ["Only broken bones", "Only cancers", "Various diseases", "Only heart problems"],
        correctAnswer: "Various diseases",
        explanation: "The text mentions AI can identify \"early-stage cancers, cardiovascular conditions, and neurological disorders\"."
      },
      {
        questionText: "What ethical concerns does the article mention?",
        questionType: "detail",
        options: ["Cost only", "Data privacy and algorithmic bias", "Doctor unemployment", "Patient confusion"],
        correctAnswer: "Data privacy and algorithmic bias",
        explanation: "The passage specifically mentions \"Issues of data privacy, algorithmic bias\"."
      },
      {
        questionText: "What does \"unprecedented\" most likely mean?",
        questionType: "vocabulary",
        options: ["Expected", "Never seen before", "Expensive", "Dangerous"],
        correctAnswer: "Never seen before",
        explanation: "\"Unprecedented\" means something that has never happened or been seen before."
      }
    ];

    const allQuestions = [
      ...level1Questions.map(q => ({ ...q, passageId: passageIds[0] })),
      ...level2Questions.map(q => ({ ...q, passageId: passageIds[1] })),
      ...level3Questions.map(q => ({ ...q, passageId: passageIds[2] })),
      ...level4Questions.map(q => ({ ...q, passageId: passageIds[3] })),
      ...level5Questions.map(q => ({ ...q, passageId: passageIds[4] }))
    ];

    allQuestions.forEach(question => {
      const id = this.nextId++;
      const readingQuestion: ReadingQuestion = {
        id,
        ...question,
        createdAt: new Date()
      };
      this.readingQuestions.set(id, readingQuestion);
    });
  }

  // Reading Questions
  async getReadingQuestions(passageId: number): Promise<ReadingQuestion[]> {
    return Array.from(this.readingQuestions.values())
      .filter(q => q.passageId === passageId)
      .sort((a, b) => a.id - b.id);
  }

  // Reading Progress
  async addReadingProgress(progress: InsertReadingProgress): Promise<ReadingProgress> {
    const id = this.nextId++;
    const readingProgress: ReadingProgress = {
      id,
      ...progress,
      completedAt: new Date(),
      createdAt: new Date()
    };
    this.readingProgress.set(id, readingProgress);
    return readingProgress;
  }

  async getReadingProgress(userId: string, passageId?: number): Promise<ReadingProgress[]> {
    let progressList = Array.from(this.readingProgress.values())
      .filter(p => p.userId === userId);
    
    if (passageId) {
      progressList = progressList.filter(p => p.passageId === passageId);
    }
    
    return progressList.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }

  async getReadingStats(userId: string): Promise<{
    totalCompleted: number;
    averageScore: number;
    averageWPM: number;
    difficultyStats: { difficulty: number; count: number; avgScore: number }[];
    recentProgress: ReadingProgress[];
  }> {
    const progressList = await this.getReadingProgress(userId);
    const completed = progressList.filter(p => p.completed);
    
    const totalCompleted = completed.length;
    const averageScore = completed.length > 0
      ? completed.reduce((sum, p) => sum + (p.score || 0), 0) / completed.length
      : 0;
    const averageWPM = completed.length > 0
      ? completed.reduce((sum, p) => sum + (p.wpm || 0), 0) / completed.length
      : 0;
    
    // Difficulty stats
    const difficultyMap = new Map<number, { count: number; totalScore: number }>();
    for (const progress of completed) {
      const passage = await this.getReadingPassage(progress.passageId);
      if (passage && progress.score !== undefined) {
        const difficulty = passage.difficulty;
        const stats = difficultyMap.get(difficulty) || { count: 0, totalScore: 0 };
        stats.count++;
        stats.totalScore += progress.score;
        difficultyMap.set(difficulty, stats);
      }
    }
    
    const difficultyStats = Array.from(difficultyMap.entries()).map(([difficulty, stats]) => ({
      difficulty,
      count: stats.count,
      avgScore: stats.totalScore / stats.count
    })).sort((a, b) => a.difficulty - b.difficulty);
    
    const recentProgress = progressList.slice(0, 10);
    
    return {
      totalCompleted,
      averageScore,
      averageWPM,
      difficultyStats,
      recentProgress
    };
  }

  // Writing Topics - Initialize sample topics (난이도별, 카테고리별 2개씩)
  private initializeWritingTopics() {
    const topics: Omit<WritingTopic, 'id' | 'createdAt'>[] = [
      // Difficulty 1 Topics
      {
        title: "Introduce Yourself",
        description: "새로운 친구에게 자기소개 이메일 쓰기",
        category: "email",
        difficulty: 1,
        prompt: "Write an email to introduce yourself to a new friend. Include your name, age, hobbies, and where you are from.",
        guidelines: [
          "Start with a greeting (Dear friend, Hi, Hello)",
          "Introduce your name and age",
          "Tell about your hobbies",
          "Mention where you are from",
          "End with a friendly closing"
        ],
        wordCountMin: 50,
        wordCountMax: 100
      },
      {
        title: "Invitation Email",
        description: "친구를 생일 파티에 초대하는 이메일 쓰기",
        category: "email",
        difficulty: 1,
        prompt: "Write an email inviting a friend to your birthday party. Include the date, time, and place.",
        guidelines: [
          "Start with a friendly greeting",
          "Invite them to your party",
          "Tell them the date and time",
          "Tell them where it will be",
          "Ask them to confirm if they can come"
        ],
        wordCountMin: 50,
        wordCountMax: 100
      },
      {
        title: "My Favorite Day",
        description: "내가 가장 좋아하는 날에 대한 짧은 이야기",
        category: "story",
        difficulty: 1,
        prompt: "Write a short story about your favorite day. What happened? Why was it special?",
        guidelines: [
          "Start by saying when it was",
          "Describe what you did",
          "Explain why it was special",
          "Use simple past tense",
          "End with how you felt"
        ],
        wordCountMin: 60,
        wordCountMax: 120
      },
      {
        title: "My Pet",
        description: "나의 반려동물에 대한 이야기",
        category: "story",
        difficulty: 1,
        prompt: "Write about your pet or a pet you would like to have. Describe what it looks like and what you do together.",
        guidelines: [
          "Introduce your pet (or dream pet)",
          "Describe its appearance",
          "Tell about its personality",
          "Explain what you do together",
          "Say why you love it"
        ],
        wordCountMin: 60,
        wordCountMax: 120
      },
      
      // Difficulty 2 Topics
      {
        title: "Thank You Letter",
        description: "선물을 받은 것에 대한 감사 편지 쓰기",
        category: "letter",
        difficulty: 2,
        prompt: "Write a thank you letter to someone who gave you a gift. Explain what the gift was and why you like it.",
        guidelines: [
          'Start with "Dear [Name]"',
          "Say thank you for the gift",
          "Describe what the gift is",
          "Explain why you like it",
          "Mention how you will use it",
          'End with "Thank you again" or similar'
        ],
        wordCountMin: 80,
        wordCountMax: 150
      },
      {
        title: "Apology Letter",
        description: "친구에게 사과하는 편지 쓰기",
        category: "letter",
        difficulty: 2,
        prompt: "Write a letter to apologize to a friend for something you did wrong. Explain what happened and how you will fix it.",
        guidelines: [
          "Start with a respectful greeting",
          "Say you are sorry",
          "Explain what you did wrong",
          "Tell them how you feel about it",
          "Promise to do better",
          "Ask for forgiveness"
        ],
        wordCountMin: 80,
        wordCountMax: 150
      },
      {
        title: "Restaurant Review",
        description: "최근에 방문한 식당 리뷰 쓰기",
        category: "review",
        difficulty: 2,
        prompt: "Write a review of a restaurant you visited recently. Describe the food, service, and atmosphere.",
        guidelines: [
          "Name the restaurant and location",
          "Describe what you ordered",
          "Comment on the taste and quality",
          "Mention the service",
          "Describe the atmosphere",
          "Give a rating and recommendation"
        ],
        wordCountMin: 100,
        wordCountMax: 180
      },
      {
        title: "Book Review",
        description: "읽은 책에 대한 간단한 리뷰",
        category: "review",
        difficulty: 2,
        prompt: "Write a review of a book you read. Include the title, author, main idea, and your opinion.",
        guidelines: [
          "Introduce the book title and author",
          "Briefly describe the story",
          "Mention your favorite part",
          "Say what you learned",
          "Recommend it to others (or not)",
          "Give a star rating"
        ],
        wordCountMin: 100,
        wordCountMax: 180
      },
      
      // Difficulty 3 Topics
      {
        title: "Job Application Email",
        description: "일자리 지원 이메일 작성하기",
        category: "email",
        difficulty: 3,
        prompt: "Write an email applying for a part-time job. Explain why you are interested and what skills you have.",
        guidelines: [
          "Use a formal greeting",
          "State which job you are applying for",
          "Explain why you want the job",
          "Describe your relevant skills and experience",
          "Request an interview",
          "Thank them for considering you"
        ],
        wordCountMin: 120,
        wordCountMax: 200
      },
      {
        title: "Complaint Email",
        description: "제품 불량에 대한 불만 이메일",
        category: "email",
        difficulty: 3,
        prompt: "Write an email to a company complaining about a faulty product. Explain the problem and what you want them to do.",
        guidelines: [
          "Be polite but firm",
          "Describe what product you bought",
          "Explain what is wrong with it",
          "Say when and where you bought it",
          "Request a refund or replacement",
          "Include any order numbers or receipts"
        ],
        wordCountMin: 120,
        wordCountMax: 200
      },
      {
        title: "Movie Review",
        description: "최근에 본 영화에 대한 리뷰 작성하기",
        category: "review",
        difficulty: 3,
        prompt: "Write a review of a movie you recently watched. Include the plot summary, your opinion, and a recommendation.",
        guidelines: [
          "Introduce the movie title and genre",
          "Write a brief plot summary (no spoilers)",
          "Explain what you liked or disliked",
          "Mention the acting, music, or visuals",
          "Give a rating (out of 5 stars or 10 points)",
          "Recommend whether others should watch it"
        ],
        wordCountMin: 150,
        wordCountMax: 250
      },
      {
        title: "A Memorable Trip",
        description: "기억에 남는 여행 이야기",
        category: "story",
        difficulty: 3,
        prompt: "Write about a memorable trip you took. Describe where you went, what you did, and why it was special.",
        guidelines: [
          "Introduce where and when you went",
          "Describe the journey there",
          "Tell about the main activities",
          "Include interesting or funny moments",
          "Explain why it was memorable",
          "Conclude with your overall feelings"
        ],
        wordCountMin: 150,
        wordCountMax: 250
      },
      {
        title: "Overcoming a Challenge",
        description: "어려움을 극복한 경험 이야기",
        category: "story",
        difficulty: 3,
        prompt: "Write a story about a time you faced a challenge and overcame it. What was the problem and how did you solve it?",
        guidelines: [
          "Set the scene and introduce the challenge",
          "Describe how you felt initially",
          "Explain what you tried to do",
          "Describe the turning point",
          "Tell how you finally solved it",
          "Reflect on what you learned"
        ],
        wordCountMin: 150,
        wordCountMax: 250
      },
      
      // Difficulty 4 Topics
      {
        title: "Social Media Impact",
        description: "소셜 미디어가 사회에 미치는 영향에 대한 의견 쓰기",
        category: "opinion",
        difficulty: 4,
        prompt: "Write an essay about the impact of social media on society. Discuss both positive and negative effects, and give your opinion.",
        guidelines: [
          "Introduction: Introduce the topic",
          "Body paragraph 1: Positive effects",
          "Body paragraph 2: Negative effects",
          "Body paragraph 3: Your personal opinion",
          "Conclusion: Summarize your main points",
          "Use transition words (however, moreover, in addition)",
          "Support your ideas with examples"
        ],
        wordCountMin: 200,
        wordCountMax: 300
      },
      {
        title: "Online Learning vs Traditional Learning",
        description: "온라인 학습과 전통적 학습 방식 비교",
        category: "opinion",
        difficulty: 4,
        prompt: "Compare online learning with traditional classroom learning. Which do you think is better and why?",
        guidelines: [
          "Introduction: Present both learning methods",
          "Advantages of online learning",
          "Advantages of traditional learning",
          "Disadvantages of each method",
          "Your personal preference with reasons",
          "Conclusion: Summarize your view",
          "Use comparative language"
        ],
        wordCountMin: 200,
        wordCountMax: 300
      },
      {
        title: "Technology and Family Life",
        description: "기술이 가족 생활에 미치는 영향 분석",
        category: "essay",
        difficulty: 4,
        prompt: "Write an essay analyzing how technology has changed family life. Include both benefits and drawbacks.",
        guidelines: [
          "Introduction: State the topic clearly",
          "How technology brings families together",
          "How technology creates distance",
          "Impact on children and parents",
          "Real-life examples",
          "Balanced conclusion",
          "Use formal essay structure"
        ],
        wordCountMin: 250,
        wordCountMax: 350
      },
      {
        title: "The Importance of Education",
        description: "교육의 중요성에 대한 에세이",
        category: "essay",
        difficulty: 4,
        prompt: "Write an essay about why education is important for individuals and society. Support your points with examples.",
        guidelines: [
          "Introduction: Define what education means",
          "Personal benefits of education",
          "Social benefits of education",
          "Economic impact",
          "Examples from real life or history",
          "Counter-arguments and responses",
          "Strong conclusion"
        ],
        wordCountMin: 250,
        wordCountMax: 350
      },
      
      // Difficulty 5 Topics
      {
        title: "Climate Change Solutions",
        description: "기후 변화 문제에 대한 해결책 제안하기",
        category: "essay",
        difficulty: 5,
        prompt: "Write an essay proposing solutions to climate change. Discuss the problem, suggest practical solutions, and explain how they can be implemented.",
        guidelines: [
          "Introduction: Explain why climate change is a serious problem",
          "Problem analysis: Describe the current situation and consequences",
          "Solution 1: Individual actions (with examples)",
          "Solution 2: Government policies (with examples)",
          "Solution 3: Technological innovations (with examples)",
          "Implementation: How these solutions can be put into practice",
          "Conclusion: Summarize and emphasize the urgency",
          "Use formal academic language",
          "Include specific examples and data when possible"
        ],
        wordCountMin: 300,
        wordCountMax: 500
      },
      {
        title: "Artificial Intelligence Ethics",
        description: "인공지능의 윤리적 문제에 대한 학술적 분석",
        category: "essay",
        difficulty: 5,
        prompt: "Write an academic essay discussing the ethical implications of artificial intelligence. Address privacy, job displacement, and decision-making.",
        guidelines: [
          "Abstract: Brief overview of the topic",
          "Introduction: Background and thesis statement",
          "Section 1: Privacy concerns with AI",
          "Section 2: Economic impact and job displacement",
          "Section 3: Ethical decision-making in AI systems",
          "Section 4: Regulatory frameworks and solutions",
          "Conclusion: Future outlook and recommendations",
          "Use academic tone and citations format",
          "Include real-world case studies"
        ],
        wordCountMin: 350,
        wordCountMax: 600
      },
      {
        title: "Universal Basic Income Debate",
        description: "기본소득제에 대한 찬반 논쟁",
        category: "opinion",
        difficulty: 5,
        prompt: "Write a well-reasoned opinion piece on Universal Basic Income. Present arguments from both sides and defend your position.",
        guidelines: [
          "Introduction: Define UBI and its context",
          "Arguments in favor (economic, social)",
          "Arguments against (economic, practical)",
          "Analysis of real-world pilot programs",
          "Address counter-arguments to your position",
          "Your reasoned opinion with evidence",
          "Conclusion: Policy recommendations",
          "Use persuasive yet balanced language",
          "Reference economic theories or studies"
        ],
        wordCountMin: 300,
        wordCountMax: 500
      },
      {
        title: "Research Proposal Letter",
        description: "연구 프로젝트 제안 편지 작성",
        category: "letter",
        difficulty: 5,
        prompt: "Write a formal letter proposing a research project to a professor or institution. Include your research question, methodology, and expected outcomes.",
        guidelines: [
          "Formal salutation and introduction",
          "State your research question clearly",
          "Explain the significance of the research",
          "Describe your proposed methodology",
          "Outline expected outcomes and timeline",
          "Budget considerations (if applicable)",
          "Request for approval or funding",
          "Professional closing",
          "Use academic formal language"
        ],
        wordCountMin: 300,
        wordCountMax: 500
      }
    ];

    topics.forEach(topic => {
      const id = this.nextId++;
      const writingTopic: WritingTopic = {
        id,
        ...topic,
        createdAt: new Date()
      };
      this.writingTopics.set(id, writingTopic);
    });
    console.log(`[Writing Topics] Initialized ${topics.length} writing topics. Map size: ${this.writingTopics.size}`);
  }

  // Writing Topics
  async getWritingTopics(filters?: { difficulty?: number; category?: string }): Promise<WritingTopic[]> {
    let topics = Array.from(this.writingTopics.values());
    
    if (filters?.difficulty) {
      topics = topics.filter(t => t.difficulty === filters.difficulty);
    }
    
    if (filters?.category) {
      topics = topics.filter(t => t.category === filters.category);
    }
    
    return topics.sort((a, b) => a.difficulty - b.difficulty);
  }

  async getWritingTopic(id: number): Promise<WritingTopic | undefined> {
    return this.writingTopics.get(id);
  }

  async addWritingTopic(topic: InsertWritingTopic): Promise<WritingTopic> {
    const id = this.nextId++;
    const writingTopic: WritingTopic = {
      id,
      ...topic,
      createdAt: new Date()
    };
    this.writingTopics.set(id, writingTopic);
    return writingTopic;
  }

  // Writing Submissions
  async saveWritingSubmission(submission: InsertWritingSubmission): Promise<WritingSubmission> {
    const id = this.nextId++;
    const writingSubmission: WritingSubmission = {
      id,
      ...submission,
      submittedAt: new Date(),
      createdAt: new Date()
    };
    this.writingSubmissions.set(id, writingSubmission);
    return writingSubmission;
  }

  async getWritingSubmissions(userId: string): Promise<WritingSubmission[]> {
    return Array.from(this.writingSubmissions.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  }

  async getWritingSubmission(id: number): Promise<WritingSubmission | undefined> {
    return this.writingSubmissions.get(id);
  }

  async updateWritingSubmission(id: number, updates: Partial<WritingSubmission>): Promise<WritingSubmission> {
    const submission = this.writingSubmissions.get(id);
    if (!submission) {
      throw new Error('Submission not found');
    }
    
    const updated = { ...submission, ...updates };
    this.writingSubmissions.set(id, updated);
    return updated;
  }

  async getWritingStats(userId: string): Promise<{
    totalSubmitted: number;
    averageScore: number;
    averageWordCount: number;
    recentSubmissions: WritingSubmission[];
  }> {
    const submissions = await this.getWritingSubmissions(userId);
    const totalSubmitted = submissions.length;
    
    const scoredSubmissions = submissions.filter(s => s.aiScore !== undefined);
    const averageScore = scoredSubmissions.length > 0
      ? scoredSubmissions.reduce((sum, s) => sum + (s.aiScore || 0), 0) / scoredSubmissions.length
      : 0;
    
    const averageWordCount = submissions.length > 0
      ? submissions.reduce((sum, s) => sum + s.wordCount, 0) / submissions.length
      : 0;
    
    const recentSubmissions = submissions.slice(0, 10);
    
    return {
      totalSubmitted,
      averageScore,
      averageWordCount,
      recentSubmissions
    };
  }

  // Get recent learning content for personalized writing topic suggestions
  async getRecentLearningContent(userId: string, language: string, limit: number = 20): Promise<{
    vocabulary: (UserVocabulary & { word: VocabularyWord })[];
    notes: Note[];
    recentTopics: string[];
  }> {
    // Get user's recently saved vocabulary
    const userVocab = await this.getUserVocabulary(userId);
    const recentVocab = userVocab
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    // Get user's recent notes from all skills
    const allNotes = await this.getNotes(userId, language);
    const recentNotes = allNotes
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    // Extract topics from reading/listening/speaking activities
    const recentTopics: string[] = [];
    
    // Get recent reading passages the user has completed
    const readingProgress = await this.getReadingProgress(userId);
    const recentReadingIds = readingProgress
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
      .slice(0, 5)
      .map(p => p.passageId);
    
    for (const passageId of recentReadingIds) {
      const passage = await this.getReadingPassage(passageId);
      if (passage) {
        recentTopics.push(passage.title);
      }
    }

    // Get recent listening lessons
    const listeningProgress = await this.getListeningProgress(userId);
    const recentListeningIds = listeningProgress
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
      .slice(0, 5)
      .map(p => p.lessonId);
    
    for (const lessonId of recentListeningIds) {
      const lesson = await this.getListeningLesson(lessonId);
      if (lesson) {
        recentTopics.push(lesson.category);
      }
    }

    return {
      vocabulary: recentVocab,
      notes: recentNotes,
      recentTopics: Array.from(new Set(recentTopics)) // Remove duplicates
    };
  }
}

export const storage = new MemStorage();
