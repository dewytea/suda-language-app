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
    this.nextId = 1;

    this.initializeAchievementTemplates();
    this.initializeSentences();
    this.initializeListeningLessons();
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
}

export const storage = new MemStorage();
