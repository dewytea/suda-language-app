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
  type SpeakingScenario,
  type InsertSpeakingScenario,
  type ConversationHistory,
  type InsertConversationHistory,
  type ScenarioProgress,
  type InsertScenarioProgress,
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

  // Speaking Scenarios
  getSpeakingScenarios(filters?: { category?: string; difficulty?: number }): Promise<SpeakingScenario[]>;
  getSpeakingScenario(id: number): Promise<SpeakingScenario | undefined>;
  addSpeakingScenario(scenario: InsertSpeakingScenario): Promise<SpeakingScenario>;

  // Conversation History
  saveConversationHistory(history: InsertConversationHistory): Promise<ConversationHistory>;
  getConversationHistory(userId: string, scenarioId?: number): Promise<ConversationHistory[]>;
  getConversationById(id: number): Promise<ConversationHistory | undefined>;

  // Scenario Progress
  getScenarioProgress(userId: string, scenarioId?: number): Promise<ScenarioProgress[]>;
  saveScenarioProgress(progress: InsertScenarioProgress): Promise<ScenarioProgress>;
  updateScenarioProgress(userId: string, scenarioId: number, updates: Partial<ScenarioProgress>): Promise<ScenarioProgress>;
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
  private speakingScenarios: Map<number, SpeakingScenario>;
  private conversationHistory: Map<number, ConversationHistory>;
  private scenarioProgress: Map<number, ScenarioProgress>;
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
    this.speakingScenarios = new Map();
    this.conversationHistory = new Map();
    this.scenarioProgress = new Map();
    this.nextId = 1;

    this.initializeAchievementTemplates();
    this.initializeSentences();
    this.initializeListeningLessons();
    this.initializeVocabularyWords();
    this.initializeReadingPassages();
    this.initializeWritingTopics();
    this.initializeReadingQuestions();
    this.initializeSpeakingScenarios();
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
      
      // Additional Daily Conversation (Difficulty 1-2)
      { sentence: "How's the weather today?", translation: "오늘 날씨가 어때요?", language: "en", category: "daily" as const, difficulty: 1 },
      { sentence: "I'm doing great, thanks!", translation: "잘 지내요, 고마워요!", language: "en", category: "daily" as const, difficulty: 1 },
      { sentence: "See you tomorrow!", translation: "내일 봐요!", language: "en", category: "daily" as const, difficulty: 1 },
      { sentence: "Have a nice weekend!", translation: "좋은 주말 보내세요!", language: "en", category: "daily" as const, difficulty: 1 },
      { sentence: "What are you doing?", translation: "무엇을 하고 계세요?", language: "en", category: "daily" as const, difficulty: 1 },
      { sentence: "I'm sorry for being late.", translation: "늦어서 죄송합니다.", language: "en", category: "daily" as const, difficulty: 2 },
      { sentence: "Could you please wait a moment?", translation: "잠시만 기다려 주시겠어요?", language: "en", category: "daily" as const, difficulty: 2 },
      { sentence: "Let me check my schedule.", translation: "제 일정을 확인해볼게요.", language: "en", category: "daily" as const, difficulty: 2 },
      
      // Shopping & Dining (Difficulty 2-3)
      { sentence: "I'd like to try this on.", translation: "이것을 입어보고 싶어요.", language: "en", category: "shopping" as const, difficulty: 2 },
      { sentence: "Do you have this in a different size?", translation: "다른 사이즈가 있나요?", language: "en", category: "shopping" as const, difficulty: 2 },
      { sentence: "Can I pay by credit card?", translation: "신용카드로 결제할 수 있나요?", language: "en", category: "shopping" as const, difficulty: 2 },
      { sentence: "I'd like to make a reservation for two.", translation: "2명 예약하고 싶어요.", language: "en", category: "dining" as const, difficulty: 3 },
      { sentence: "Could I see the wine list?", translation: "와인 리스트를 볼 수 있을까요?", language: "en", category: "dining" as const, difficulty: 3 },
      { sentence: "The food was delicious!", translation: "음식이 정말 맛있었어요!", language: "en", category: "dining" as const, difficulty: 2 },
      
      // Travel & Hotel (Difficulty 3-4)
      { sentence: "I'd like to extend my stay.", translation: "체류 기간을 연장하고 싶습니다.", language: "en", category: "travel" as const, difficulty: 3 },
      { sentence: "Could you call a taxi for me?", translation: "택시를 불러주시겠어요?", language: "en", category: "travel" as const, difficulty: 3 },
      { sentence: "What time is check-out?", translation: "체크아웃 시간이 언제인가요?", language: "en", category: "travel" as const, difficulty: 2 },
      { sentence: "Is there a shuttle to the airport?", translation: "공항 셔틀이 있나요?", language: "en", category: "travel" as const, difficulty: 3 },
      { sentence: "I need to report a lost item.", translation: "분실물을 신고해야 합니다.", language: "en", category: "travel" as const, difficulty: 4 },
      
      // Academic (Difficulty 4-5)
      { sentence: "Could you explain this concept again?", translation: "이 개념을 다시 설명해 주시겠어요?", language: "en", category: "academic" as const, difficulty: 4 },
      { sentence: "When is the assignment due?", translation: "과제 마감일이 언제인가요?", language: "en", category: "academic" as const, difficulty: 3 },
      { sentence: "I need to reference several academic sources.", translation: "여러 학술 자료를 참조해야 합니다.", language: "en", category: "academic" as const, difficulty: 5 },
      { sentence: "The research methodology is quite comprehensive.", translation: "연구 방법론이 매우 포괄적입니다.", language: "en", category: "academic" as const, difficulty: 5 },
      { sentence: "We should analyze the data more thoroughly.", translation: "데이터를 더 철저히 분석해야 합니다.", language: "en", category: "academic" as const, difficulty: 5 },
      
      // Healthcare (Difficulty 3-4)
      { sentence: "I have an appointment with the doctor.", translation: "의사와 약속이 있습니다.", language: "en", category: "healthcare" as const, difficulty: 3 },
      { sentence: "I'm not feeling well.", translation: "몸이 좋지 않아요.", language: "en", category: "healthcare" as const, difficulty: 2 },
      { sentence: "Do I need a prescription for this?", translation: "이것은 처방전이 필요한가요?", language: "en", category: "healthcare" as const, difficulty: 3 },
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
      },
      // Additional passages
      {
        title: "A Trip to the Zoo",
        content: "Last Sunday, I went to the zoo with my family. We saw many animals. The lions were sleeping. The monkeys were playing. My little brother liked the elephants the most. We had ice cream for lunch. It was a fun day. I took many photos. I want to go back soon!",
        contentType: "story",
        difficulty: 1,
        wordCount: 57,
        estimatedTime: 35,
        paragraphs: [
          {
            text: "Last Sunday, I went to the zoo with my family. We saw many animals. The lions were sleeping. The monkeys were playing. My little brother liked the elephants the most. We had ice cream for lunch. It was a fun day. I took many photos. I want to go back soon!",
            translation: "지난 일요일, 저는 가족과 함께 동물원에 갔어요. 많은 동물들을 봤어요. 사자들은 자고 있었어요. 원숭이들은 놀고 있었어요. 제 남동생은 코끼리를 가장 좋아했어요. 점심으로 아이스크림을 먹었어요. 재미있는 하루였어요. 사진을 많이 찍었어요. 곧 다시 가고 싶어요!"
          }
        ]
      },
      {
        title: "Job Application Email",
        content: "Dear Hiring Manager,\n\nI am writing to apply for the Marketing Assistant position advertised on your website. I recently graduated with a degree in Marketing and have completed two internships in digital marketing. I am passionate about social media strategies and content creation. I would be excited to bring my skills to your team.\n\nThank you for considering my application. I have attached my resume for your review.\n\nBest regards,\nJohn Smith",
        contentType: "email",
        difficulty: 2,
        wordCount: 75,
        estimatedTime: 45,
        paragraphs: [
          {
            text: "Dear Hiring Manager,",
            translation: "채용 담당자님께,"
          },
          {
            text: "I am writing to apply for the Marketing Assistant position advertised on your website. I recently graduated with a degree in Marketing and have completed two internships in digital marketing. I am passionate about social media strategies and content creation. I would be excited to bring my skills to your team.",
            translation: "귀사 웹사이트에 게재된 마케팅 어시스턴트 직책에 지원하고자 합니다. 저는 최근 마케팅 학위를 취득했으며 디지털 마케팅 분야에서 두 차례 인턴십을 완료했습니다. 소셜 미디어 전략과 콘텐츠 제작에 열정을 가지고 있습니다. 제 기술을 귀사 팀에 기여할 수 있다면 기쁠 것입니다."
          },
          {
            text: "Thank you for considering my application. I have attached my resume for your review.\n\nBest regards,\nJohn Smith",
            translation: "제 지원서를 검토해 주셔서 감사합니다. 검토를 위해 이력서를 첨부했습니다.\n\n감사합니다,\n존 스미스"
          }
        ]
      },
      {
        title: "Weekend Weather Forecast",
        content: "This weekend will bring mixed weather conditions across the region. Saturday morning starts with cloudy skies and temperatures around 15 degrees Celsius. Rain is expected in the afternoon, so don't forget your umbrella if you're heading out. Sunday looks much brighter, with sunny intervals and highs of 22 degrees. Perfect weather for outdoor activities! Remember to apply sunscreen if spending time outside.",
        contentType: "news",
        difficulty: 2,
        wordCount: 70,
        estimatedTime: 42,
        paragraphs: [
          {
            text: "This weekend will bring mixed weather conditions across the region. Saturday morning starts with cloudy skies and temperatures around 15 degrees Celsius. Rain is expected in the afternoon, so don't forget your umbrella if you're heading out. Sunday looks much brighter, with sunny intervals and highs of 22 degrees. Perfect weather for outdoor activities! Remember to apply sunscreen if spending time outside.",
            translation: "이번 주말에는 지역 전체에 다양한 날씨가 예상됩니다. 토요일 아침은 흐린 하늘로 시작하며 기온은 섭씨 15도 정도입니다. 오후에는 비가 예상되니 외출하신다면 우산을 잊지 마세요. 일요일은 훨씬 화창하며 맑은 시간대가 있고 최고 기온은 22도입니다. 야외 활동하기 완벽한 날씨입니다! 밖에서 시간을 보내실 경우 자외선 차단제를 바르는 것을 잊지 마세요."
          }
        ]
      },
      {
        title: "The Importance of Exercise",
        content: "Regular physical exercise is essential for maintaining good health. Exercise strengthens our muscles, improves cardiovascular function, and helps control weight. Beyond physical benefits, it also enhances mental well-being by reducing stress and anxiety. Experts recommend at least 30 minutes of moderate exercise five days a week. This can include activities like walking, swimming, cycling, or dancing. Starting with small goals and gradually increasing intensity helps build sustainable habits. Remember, consistency is more important than intensity when beginning an exercise routine.",
        contentType: "essay",
        difficulty: 3,
        wordCount: 92,
        estimatedTime: 55,
        paragraphs: [
          {
            text: "Regular physical exercise is essential for maintaining good health. Exercise strengthens our muscles, improves cardiovascular function, and helps control weight. Beyond physical benefits, it also enhances mental well-being by reducing stress and anxiety. Experts recommend at least 30 minutes of moderate exercise five days a week. This can include activities like walking, swimming, cycling, or dancing. Starting with small goals and gradually increasing intensity helps build sustainable habits. Remember, consistency is more important than intensity when beginning an exercise routine.",
            translation: "규칙적인 신체 운동은 건강을 유지하는 데 필수적입니다. 운동은 근육을 강화하고 심혈관 기능을 향상시키며 체중 조절에 도움이 됩니다. 신체적 이점 외에도 스트레스와 불안을 줄여 정신 건강을 향상시킵니다. 전문가들은 일주일에 5일, 최소 30분의 적당한 운동을 권장합니다. 여기에는 걷기, 수영, 자전거 타기 또는 춤추기와 같은 활동이 포함될 수 있습니다. 작은 목표로 시작하여 점차 강도를 높이는 것이 지속 가능한 습관을 만드는 데 도움이 됩니다. 운동 루틴을 시작할 때는 강도보다 일관성이 더 중요하다는 것을 기억하세요."
          }
        ]
      },
      {
        title: "Online Shopping Trends",
        content: "E-commerce has transformed how people shop around the world. During the past decade, online shopping has grown exponentially, with more consumers choosing the convenience of shopping from home. Mobile shopping apps have made purchasing even easier, allowing customers to browse and buy products anytime, anywhere. However, concerns about product quality and delivery reliability remain. Many shoppers still prefer to see and touch items before buying. The future of retail likely involves a combination of online and in-store experiences.",
        contentType: "news",
        difficulty: 3,
        wordCount: 87,
        estimatedTime: 52,
        paragraphs: [
          {
            text: "E-commerce has transformed how people shop around the world. During the past decade, online shopping has grown exponentially, with more consumers choosing the convenience of shopping from home. Mobile shopping apps have made purchasing even easier, allowing customers to browse and buy products anytime, anywhere. However, concerns about product quality and delivery reliability remain. Many shoppers still prefer to see and touch items before buying. The future of retail likely involves a combination of online and in-store experiences.",
            translation: "전자상거래는 전 세계 사람들의 쇼핑 방식을 변화시켰습니다. 지난 10년 동안 온라인 쇼핑은 기하급수적으로 성장했으며, 더 많은 소비자들이 집에서 쇼핑하는 편리함을 선택하고 있습니다. 모바일 쇼핑 앱은 고객이 언제 어디서나 제품을 탐색하고 구매할 수 있게 하여 구매를 더욱 쉽게 만들었습니다. 그러나 제품 품질과 배송 신뢰성에 대한 우려는 여전히 남아 있습니다. 많은 쇼핑객들은 구매하기 전에 직접 보고 만져보는 것을 선호합니다. 소매업의 미래는 온라인과 매장 내 경험의 조합을 포함할 가능성이 높습니다."
          }
        ]
      },
      {
        title: "The Digital Divide",
        content: "The digital divide refers to the gap between those who have access to modern information technology and those who do not. This disparity exists both within and between countries, affecting education, employment opportunities, and access to essential services. In developed nations, the divide often correlates with income levels, age, and geographic location. Rural communities frequently face challenges in accessing high-speed internet.\n\nAddressing this issue requires coordinated efforts from governments, private sector companies, and civil society organizations. Infrastructure development, digital literacy programs, and affordable technology solutions are crucial components. As our world becomes increasingly digital, ensuring equitable access to technology is not just a matter of convenience but a fundamental aspect of social justice and economic opportunity.",
        contentType: "essay",
        difficulty: 4,
        wordCount: 125,
        estimatedTime: 72,
        paragraphs: [
          {
            text: "The digital divide refers to the gap between those who have access to modern information technology and those who do not. This disparity exists both within and between countries, affecting education, employment opportunities, and access to essential services. In developed nations, the divide often correlates with income levels, age, and geographic location. Rural communities frequently face challenges in accessing high-speed internet.",
            translation: "디지털 격차는 현대 정보 기술에 접근할 수 있는 사람들과 그렇지 못한 사람들 사이의 격차를 의미합니다. 이러한 불균형은 국가 내부와 국가 간에 존재하며, 교육, 고용 기회, 필수 서비스 이용에 영향을 미칩니다. 선진국에서는 이 격차가 소득 수준, 연령, 지리적 위치와 관련이 있는 경우가 많습니다. 농촌 지역 사회는 고속 인터넷 접근에 어려움을 자주 겪습니다."
          },
          {
            text: "Addressing this issue requires coordinated efforts from governments, private sector companies, and civil society organizations. Infrastructure development, digital literacy programs, and affordable technology solutions are crucial components. As our world becomes increasingly digital, ensuring equitable access to technology is not just a matter of convenience but a fundamental aspect of social justice and economic opportunity.",
            translation: "이 문제를 해결하려면 정부, 민간 부문 기업, 시민 사회 조직의 조율된 노력이 필요합니다. 인프라 개발, 디지털 리터러시 프로그램, 저렴한 기술 솔루션이 중요한 요소입니다. 우리 세계가 점점 더 디지털화됨에 따라 기술에 대한 공평한 접근을 보장하는 것은 단순히 편의성의 문제가 아니라 사회 정의와 경제적 기회의 근본적인 측면입니다."
          }
        ]
      },
      {
        title: "Climate Change and Agriculture",
        content: "Climate change poses significant challenges to global agriculture. Rising temperatures, changing precipitation patterns, and more frequent extreme weather events are affecting crop yields worldwide. Farmers must adapt their practices to these new conditions, which often requires substantial investment in new technologies and techniques. Some regions face water scarcity, while others experience flooding. Pest populations are shifting to new areas as temperatures change, requiring different pest management strategies. Scientists are developing drought-resistant crop varieties and more efficient irrigation systems to help farmers cope with these challenges.",
        contentType: "news",
        difficulty: 4,
        wordCount: 99,
        estimatedTime: 58,
        paragraphs: [
          {
            text: "Climate change poses significant challenges to global agriculture. Rising temperatures, changing precipitation patterns, and more frequent extreme weather events are affecting crop yields worldwide. Farmers must adapt their practices to these new conditions, which often requires substantial investment in new technologies and techniques. Some regions face water scarcity, while others experience flooding. Pest populations are shifting to new areas as temperatures change, requiring different pest management strategies. Scientists are developing drought-resistant crop varieties and more efficient irrigation systems to help farmers cope with these challenges.",
            translation: "기후 변화는 전 세계 농업에 심각한 도전을 제기하고 있습니다. 기온 상승, 강수 패턴 변화, 더 빈번한 극한 기상 현상이 전 세계 작물 수확량에 영향을 미치고 있습니다. 농부들은 새로운 조건에 적응해야 하며, 이는 종종 새로운 기술과 방법에 대한 상당한 투자를 필요로 합니다. 일부 지역은 물 부족에 직면하고, 다른 지역은 홍수를 경험합니다. 기온 변화로 인해 해충 개체군이 새로운 지역으로 이동하고 있어 다른 해충 관리 전략이 필요합니다. 과학자들은 농부들이 이러한 도전에 대처할 수 있도록 가뭄에 강한 작물 품종과 더 효율적인 관개 시스템을 개발하고 있습니다."
          }
        ]
      },
      {
        title: "Quantum Computing: The Next Frontier",
        content: "Quantum computing represents a paradigm shift in computational technology, leveraging the principles of quantum mechanics to perform calculations that would be impossible for classical computers. Unlike traditional computers that use bits representing either 0 or 1, quantum computers use quantum bits, or qubits, which can exist in multiple states simultaneously through a phenomenon called superposition. This capability, combined with quantum entanglement, enables quantum computers to process vast amounts of information in parallel.\n\nThe potential applications of quantum computing are transformative across numerous fields. In cryptography, quantum computers could break current encryption methods but also enable unhackable quantum communication networks. Drug discovery could be revolutionized through the ability to simulate molecular interactions at unprecedented scales. Complex optimization problems in logistics, finance, and climate modeling could be solved exponentially faster.\n\nHowever, significant technical challenges remain. Quantum computers require extreme conditions to operate, including temperatures near absolute zero. Quantum decoherence, where quantum states collapse due to environmental interference, limits computation time. Despite these hurdles, major technology companies and research institutions are investing heavily in quantum computing development, anticipating that overcoming these challenges will unlock computational capabilities that fundamentally transform science, industry, and society.",
        contentType: "essay",
        difficulty: 5,
        wordCount: 198,
        estimatedTime: 115,
        paragraphs: [
          {
            text: "Quantum computing represents a paradigm shift in computational technology, leveraging the principles of quantum mechanics to perform calculations that would be impossible for classical computers. Unlike traditional computers that use bits representing either 0 or 1, quantum computers use quantum bits, or qubits, which can exist in multiple states simultaneously through a phenomenon called superposition. This capability, combined with quantum entanglement, enables quantum computers to process vast amounts of information in parallel.",
            translation: "양자 컴퓨팅은 고전적인 컴퓨터로는 불가능한 계산을 수행하기 위해 양자역학의 원리를 활용하는 컴퓨터 기술의 패러다임 전환을 나타냅니다. 0 또는 1을 나타내는 비트를 사용하는 기존 컴퓨터와 달리, 양자 컴퓨터는 중첩이라는 현상을 통해 동시에 여러 상태로 존재할 수 있는 양자 비트 또는 큐비트를 사용합니다. 이 기능은 양자 얽힘과 결합되어 양자 컴퓨터가 방대한 양의 정보를 병렬로 처리할 수 있게 합니다."
          },
          {
            text: "The potential applications of quantum computing are transformative across numerous fields. In cryptography, quantum computers could break current encryption methods but also enable unhackable quantum communication networks. Drug discovery could be revolutionized through the ability to simulate molecular interactions at unprecedented scales. Complex optimization problems in logistics, finance, and climate modeling could be solved exponentially faster.",
            translation: "양자 컴퓨팅의 잠재적 응용 분야는 다양한 분야에서 혁신적입니다. 암호학에서 양자 컴퓨터는 현재의 암호화 방법을 깨뜨릴 수 있지만, 해킹이 불가능한 양자 통신 네트워크도 가능하게 할 수 있습니다. 전례 없는 규모의 분자 상호작용 시뮬레이션 능력을 통해 신약 발견이 혁명을 일으킬 수 있습니다. 물류, 금융, 기후 모델링의 복잡한 최적화 문제를 기하급수적으로 빠르게 해결할 수 있습니다."
          },
          {
            text: "However, significant technical challenges remain. Quantum computers require extreme conditions to operate, including temperatures near absolute zero. Quantum decoherence, where quantum states collapse due to environmental interference, limits computation time. Despite these hurdles, major technology companies and research institutions are investing heavily in quantum computing development, anticipating that overcoming these challenges will unlock computational capabilities that fundamentally transform science, industry, and society.",
            translation: "그러나 중요한 기술적 도전 과제가 남아 있습니다. 양자 컴퓨터는 절대 영도에 가까운 온도를 포함한 극한 조건에서 작동해야 합니다. 환경 간섭으로 인해 양자 상태가 붕괴하는 양자 결맞음 상실은 계산 시간을 제한합니다. 이러한 장애물에도 불구하고, 주요 기술 기업과 연구 기관들은 이러한 도전을 극복하면 과학, 산업, 사회를 근본적으로 변화시킬 계산 능력이 열릴 것으로 예상하며 양자 컴퓨팅 개발에 막대한 투자를 하고 있습니다."
          }
        ]
      },
      {
        title: "Sustainable Urban Development",
        content: "As global urbanization accelerates, with projections indicating that nearly 70% of the world's population will reside in cities by 2050, the imperative for sustainable urban development has never been more critical. Modern cities face a complex array of challenges: greenhouse gas emissions, resource depletion, inadequate infrastructure, and social inequality. Addressing these issues requires integrated approaches that consider environmental, economic, and social sustainability simultaneously.\n\nInnovative solutions are emerging worldwide. Green architecture incorporating energy-efficient design and renewable energy sources reduces buildings' carbon footprints. Urban planning strategies emphasizing mixed-use development, public transportation networks, and pedestrian-friendly infrastructure decrease reliance on private vehicles. Smart city technologies optimize resource utilization through data analytics, improving everything from traffic flow to waste management.\n\nCommunity engagement proves essential for sustainable urban development's success. Top-down planning initiatives often fail without local buy-in and participation. Empowering communities to shape their neighborhoods creates more equitable, livable cities. Furthermore, nature-based solutions—such as urban forests, green roofs, and wetland restoration—provide multiple benefits: mitigating heat island effects, managing stormwater, enhancing biodiversity, and improving residents' well-being. The cities of tomorrow must balance growth with sustainability, innovation with tradition, and progress with preservation of our planet's finite resources.",
        contentType: "news",
        difficulty: 5,
        wordCount: 208,
        estimatedTime: 120,
        paragraphs: [
          {
            text: "As global urbanization accelerates, with projections indicating that nearly 70% of the world's population will reside in cities by 2050, the imperative for sustainable urban development has never been more critical. Modern cities face a complex array of challenges: greenhouse gas emissions, resource depletion, inadequate infrastructure, and social inequality. Addressing these issues requires integrated approaches that consider environmental, economic, and social sustainability simultaneously.",
            translation: "전 세계 도시화가 가속화되면서 2050년까지 세계 인구의 거의 70%가 도시에 거주할 것으로 예상되는 가운데, 지속 가능한 도시 개발의 필요성은 그 어느 때보다 중요해졌습니다. 현대 도시는 온실가스 배출, 자원 고갈, 불충분한 인프라, 사회적 불평등 등 복잡한 일련의 도전에 직면해 있습니다. 이러한 문제를 해결하려면 환경적, 경제적, 사회적 지속 가능성을 동시에 고려하는 통합적 접근 방식이 필요합니다."
          },
          {
            text: "Innovative solutions are emerging worldwide. Green architecture incorporating energy-efficient design and renewable energy sources reduces buildings' carbon footprints. Urban planning strategies emphasizing mixed-use development, public transportation networks, and pedestrian-friendly infrastructure decrease reliance on private vehicles. Smart city technologies optimize resource utilization through data analytics, improving everything from traffic flow to waste management.",
            translation: "혁신적인 솔루션이 전 세계적으로 등장하고 있습니다. 에너지 효율적인 디자인과 재생 가능 에너지원을 통합한 녹색 건축은 건물의 탄소 발자국을 줄입니다. 복합 용도 개발, 대중교통 네트워크, 보행자 친화적 인프라를 강조하는 도시 계획 전략은 개인 차량에 대한 의존도를 낮춥니다. 스마트 시티 기술은 데이터 분석을 통해 자원 활용을 최적화하여 교통 흐름에서 폐기물 관리에 이르기까지 모든 것을 개선합니다."
          },
          {
            text: "Community engagement proves essential for sustainable urban development's success. Top-down planning initiatives often fail without local buy-in and participation. Empowering communities to shape their neighborhoods creates more equitable, livable cities. Furthermore, nature-based solutions—such as urban forests, green roofs, and wetland restoration—provide multiple benefits: mitigating heat island effects, managing stormwater, enhancing biodiversity, and improving residents' well-being. The cities of tomorrow must balance growth with sustainability, innovation with tradition, and progress with preservation of our planet's finite resources.",
            translation: "커뮤니티 참여는 지속 가능한 도시 개발의 성공에 필수적입니다. 하향식 계획 이니셔티브는 지역 주민의 동의와 참여 없이는 종종 실패합니다. 커뮤니티가 자신의 이웃을 형성할 수 있도록 권한을 부여하면 더 공평하고 살기 좋은 도시가 만들어집니다. 또한 도시 숲, 녹색 지붕, 습지 복원과 같은 자연 기반 솔루션은 여러 이점을 제공합니다: 열섬 효과 완화, 빗물 관리, 생물 다양성 향상, 주민의 웰빙 개선. 내일의 도시는 성장과 지속 가능성, 혁신과 전통, 그리고 진보와 우리 행성의 한정된 자원 보존 사이의 균형을 맞춰야 합니다."
          }
        ]
      },
      {
        title: "The Psychology of Decision Making",
        content: "Human decision-making is a fascinating interplay between rational analysis and emotional intuition, shaped by cognitive biases, past experiences, and contextual factors. While we like to believe our choices stem from logical reasoning, research in behavioral economics and cognitive psychology reveals that numerous unconscious influences affect our decisions. Understanding these mechanisms can help individuals make better choices and organizations design more effective policies.\n\nCognitive biases systematically affect our judgment. Confirmation bias leads us to seek information supporting existing beliefs while dismissing contradictory evidence. The availability heuristic causes us to overestimate the probability of events that come easily to mind, often due to recent exposure or emotional impact. Anchoring bias demonstrates how initial information disproportionately influences subsequent judgments, even when that information is arbitrary or irrelevant.\n\nEmotions play a crucial role in decision-making, sometimes beneficially, sometimes detrimentally. The somatic marker hypothesis suggests that emotional responses to previous outcomes guide future choices, enabling quick decisions in familiar situations. However, strong emotions can also cloud judgment, leading to impulsive decisions that prioritize short-term satisfaction over long-term goals. Stress particularly impairs decision quality, narrowing our focus and reducing cognitive flexibility. Recognizing these patterns allows for implementing strategies—such as structured decision frameworks, diverse perspectives, and temporal distance—that can mitigate biases and improve the quality of our choices across personal and professional contexts.",
        contentType: "essay",
        difficulty: 5,
        wordCount: 232,
        estimatedTime: 135,
        paragraphs: [
          {
            text: "Human decision-making is a fascinating interplay between rational analysis and emotional intuition, shaped by cognitive biases, past experiences, and contextual factors. While we like to believe our choices stem from logical reasoning, research in behavioral economics and cognitive psychology reveals that numerous unconscious influences affect our decisions. Understanding these mechanisms can help individuals make better choices and organizations design more effective policies.",
            translation: "인간의 의사결정은 인지 편향, 과거 경험, 맥락적 요인에 의해 형성되는 합리적 분석과 감정적 직관 사이의 흥미로운 상호작용입니다. 우리는 우리의 선택이 논리적 추론에서 비롯된다고 믿고 싶지만, 행동경제학과 인지심리학의 연구는 수많은 무의식적 영향이 우리의 결정에 영향을 미친다는 것을 보여줍니다. 이러한 메커니즘을 이해하면 개인이 더 나은 선택을 하고 조직이 더 효과적인 정책을 설계하는 데 도움이 될 수 있습니다."
          },
          {
            text: "Cognitive biases systematically affect our judgment. Confirmation bias leads us to seek information supporting existing beliefs while dismissing contradictory evidence. The availability heuristic causes us to overestimate the probability of events that come easily to mind, often due to recent exposure or emotional impact. Anchoring bias demonstrates how initial information disproportionately influences subsequent judgments, even when that information is arbitrary or irrelevant.",
            translation: "인지 편향은 체계적으로 우리의 판단에 영향을 미칩니다. 확증 편향은 모순되는 증거를 무시하면서 기존 신념을 뒷받침하는 정보를 찾도록 합니다. 가용성 휴리스틱은 최근의 노출이나 정서적 영향으로 인해 쉽게 떠오르는 사건의 확률을 과대평가하게 만듭니다. 앵커링 편향은 초기 정보가 임의적이거나 관련이 없더라도 후속 판단에 불균형적으로 영향을 미치는 방식을 보여줍니다."
          },
          {
            text: "Emotions play a crucial role in decision-making, sometimes beneficially, sometimes detrimentally. The somatic marker hypothesis suggests that emotional responses to previous outcomes guide future choices, enabling quick decisions in familiar situations. However, strong emotions can also cloud judgment, leading to impulsive decisions that prioritize short-term satisfaction over long-term goals. Stress particularly impairs decision quality, narrowing our focus and reducing cognitive flexibility. Recognizing these patterns allows for implementing strategies—such as structured decision frameworks, diverse perspectives, and temporal distance—that can mitigate biases and improve the quality of our choices across personal and professional contexts.",
            translation: "감정은 의사결정에서 중요한 역할을 하며, 때로는 유익하게, 때로는 해롭게 작용합니다. 신체 마커 가설은 이전 결과에 대한 감정적 반응이 미래의 선택을 안내하여 익숙한 상황에서 빠른 결정을 가능하게 한다고 제안합니다. 그러나 강한 감정은 판단을 흐리게 하여 장기 목표보다 단기 만족을 우선시하는 충동적인 결정으로 이어질 수 있습니다. 특히 스트레스는 우리의 초점을 좁히고 인지적 유연성을 감소시켜 의사결정의 질을 손상시킵니다. 이러한 패턴을 인식하면 구조화된 의사결정 프레임워크, 다양한 관점, 시간적 거리와 같은 전략을 구현하여 편향을 완화하고 개인적 및 전문적 맥락에서 우리의 선택의 질을 개선할 수 있습니다."
          }
        ]
      },
      // === LEVEL 1 ADDITIONS (8 more passages) ===
      {
        title: "My Family",
        content: "I have a small family. There are four people in my family: my father, my mother, my sister, and me. My father is a teacher. He teaches English. My mother is a nurse. She works at a hospital. My sister is younger than me. She is in elementary school. We live in a house near the park. On weekends, we like to have dinner together. I love my family very much.",
        contentType: "story",
        difficulty: 1,
        wordCount: 75,
        estimatedTime: 45,
        paragraphs: [
          {
            text: "I have a small family. There are four people in my family: my father, my mother, my sister, and me. My father is a teacher. He teaches English. My mother is a nurse. She works at a hospital. My sister is younger than me. She is in elementary school. We live in a house near the park. On weekends, we like to have dinner together. I love my family very much.",
            translation: "저는 작은 가족이 있습니다. 우리 가족은 네 명입니다: 아버지, 어머니, 여동생, 그리고 저. 아버지는 선생님이십니다. 영어를 가르치세요. 어머니는 간호사이십니다. 병원에서 일하세요. 여동생은 저보다 어립니다. 초등학생이에요. 우리는 공원 근처 집에 살아요. 주말에는 함께 저녁을 먹는 것을 좋아해요. 저는 우리 가족을 매우 사랑합니다."
          }
        ]
      },
      {
        title: "My Pet Dog",
        content: "I have a pet dog. His name is Max. Max is three years old. He is a golden retriever. Max has brown fur and big eyes. Every morning, I take Max for a walk in the park. He loves to run and play with other dogs. Max is very friendly. When I come home from school, Max is always happy to see me. He is my best friend.",
        contentType: "story",
        difficulty: 1,
        wordCount: 72,
        estimatedTime: 43,
        paragraphs: [
          {
            text: "I have a pet dog. His name is Max. Max is three years old. He is a golden retriever. Max has brown fur and big eyes. Every morning, I take Max for a walk in the park. He loves to run and play with other dogs. Max is very friendly. When I come home from school, Max is always happy to see me. He is my best friend.",
            translation: "저는 반려견이 있습니다. 이름은 맥스예요. 맥스는 세 살입니다. 골든 리트리버예요. 맥스는 갈색 털과 큰 눈을 가졌어요. 매일 아침, 저는 맥스를 데리고 공원을 산책해요. 다른 개들과 뛰놀기를 좋아해요. 맥스는 아주 친근해요. 제가 학교에서 집에 오면, 맥스는 항상 저를 보고 기뻐해요. 제 가장 친한 친구예요."
          }
        ]
      },
      {
        title: "My Favorite Food",
        content: "My favorite food is pizza. I like pizza because it tastes delicious. My favorite pizza has cheese, tomatoes, and mushrooms. Every Friday, my family orders pizza for dinner. Sometimes we make pizza at home. It is fun to make pizza. I put the sauce on the dough. Then I add cheese and vegetables. The pizza smells good when it is cooking. Pizza is the best!",
        contentType: "story",
        difficulty: 1,
        wordCount: 70,
        estimatedTime: 42,
        paragraphs: [
          {
            text: "My favorite food is pizza. I like pizza because it tastes delicious. My favorite pizza has cheese, tomatoes, and mushrooms. Every Friday, my family orders pizza for dinner. Sometimes we make pizza at home. It is fun to make pizza. I put the sauce on the dough. Then I add cheese and vegetables. The pizza smells good when it is cooking. Pizza is the best!",
            translation: "제가 가장 좋아하는 음식은 피자예요. 피자가 맛있어서 좋아해요. 제가 좋아하는 피자에는 치즈, 토마토, 버섯이 들어가요. 매주 금요일, 우리 가족은 저녁으로 피자를 주문해요. 가끔 집에서 피자를 만들어요. 피자 만드는 것은 재미있어요. 도우에 소스를 바르고, 치즈와 야채를 올려요. 피자가 요리될 때 냄새가 좋아요. 피자가 최고예요!"
          }
        ]
      },
      {
        title: "A Day at the Beach",
        content: "Last summer, I went to the beach with my family. The weather was sunny and hot. The water was blue and clean. I played in the sand and built a sandcastle. My brother and I swam in the ocean. The water was cold but fun. We found some seashells. In the afternoon, we ate sandwiches. I had a great time at the beach!",
        contentType: "story",
        difficulty: 1,
        wordCount: 68,
        estimatedTime: 41,
        paragraphs: [
          {
            text: "Last summer, I went to the beach with my family. The weather was sunny and hot. The water was blue and clean. I played in the sand and built a sandcastle. My brother and I swam in the ocean. The water was cold but fun. We found some seashells. In the afternoon, we ate sandwiches. I had a great time at the beach!",
            translation: "지난 여름, 저는 가족과 함께 해변에 갔어요. 날씨가 맑고 더웠어요. 물은 파랗고 깨끗했어요. 모래에서 놀고 모래성을 쌓았어요. 남동생과 저는 바다에서 수영했어요. 물은 차가웠지만 재미있었어요. 조개껍데기를 몇 개 찾았어요. 오후에는 샌드위치를 먹었어요. 해변에서 정말 즐거운 시간을 보냈어요!"
          }
        ]
      },
      {
        title: "My Bedroom",
        content: "My bedroom is my favorite place in the house. It is small but comfortable. My bed is next to the window. I have a desk for studying. On my desk, there are books and pencils. I have a blue chair. My closet is full of clothes. There are posters on the wall. My room is always clean. I like to spend time in my bedroom.",
        contentType: "story",
        difficulty: 1,
        wordCount: 68,
        estimatedTime: 41,
        paragraphs: [
          {
            text: "My bedroom is my favorite place in the house. It is small but comfortable. My bed is next to the window. I have a desk for studying. On my desk, there are books and pencils. I have a blue chair. My closet is full of clothes. There are posters on the wall. My room is always clean. I like to spend time in my bedroom.",
            translation: "제 침실은 집에서 제가 가장 좋아하는 장소예요. 작지만 편안해요. 제 침대는 창문 옆에 있어요. 공부하는 책상이 있어요. 책상 위에는 책과 연필이 있어요. 파란 의자가 있어요. 옷장에는 옷이 가득해요. 벽에는 포스터가 붙어 있어요. 제 방은 항상 깨끗해요. 제 침실에서 시간 보내는 것을 좋아해요."
          }
        ]
      },
      {
        title: "Going to the Library",
        content: "I go to the library every Saturday. The library is near my school. It is a big building with many books. I like to read story books. Sometimes I borrow books to take home. The librarian is very nice. She helps me find books. The library is quiet. I can study there. Reading makes me happy. I love the library!",
        contentType: "story",
        difficulty: 1,
        wordCount: 65,
        estimatedTime: 39,
        paragraphs: [
          {
            text: "I go to the library every Saturday. The library is near my school. It is a big building with many books. I like to read story books. Sometimes I borrow books to take home. The librarian is very nice. She helps me find books. The library is quiet. I can study there. Reading makes me happy. I love the library!",
            translation: "저는 매주 토요일마다 도서관에 가요. 도서관은 제 학교 근처에 있어요. 많은 책이 있는 큰 건물이에요. 저는 동화책 읽는 것을 좋아해요. 가끔 집으로 가져갈 책을 빌려요. 사서님이 아주 친절해요. 책 찾는 것을 도와주세요. 도서관은 조용해요. 거기서 공부할 수 있어요. 독서는 저를 행복하게 해요. 도서관을 사랑해요!"
          }
        ]
      },
      {
        title: "My Best Friend",
        content: "My best friend's name is Tom. We are in the same class at school. Tom is funny and kind. We like to play soccer together after school. Sometimes we do homework together. Tom helps me with math. I help him with English. On weekends, we go to the park or watch movies. Tom is a good friend. I am lucky to have him.",
        contentType: "story",
        difficulty: 1,
        wordCount: 69,
        estimatedTime: 41,
        paragraphs: [
          {
            text: "My best friend's name is Tom. We are in the same class at school. Tom is funny and kind. We like to play soccer together after school. Sometimes we do homework together. Tom helps me with math. I help him with English. On weekends, we go to the park or watch movies. Tom is a good friend. I am lucky to have him.",
            translation: "제 가장 친한 친구 이름은 톰이에요. 우리는 학교에서 같은 반이에요. 톰은 재미있고 친절해요. 방과 후에 함께 축구하는 것을 좋아해요. 가끔 함께 숙제를 해요. 톰은 수학을 도와줘요. 저는 영어를 도와줘요. 주말에는 공원에 가거나 영화를 봐요. 톰은 좋은 친구예요. 그를 가진 것이 행운이에요."
          }
        ]
      },
      {
        title: "Making Breakfast",
        content: "I like to make breakfast on Sunday mornings. First, I make toast. I put butter on the toast. Then I pour a glass of orange juice. Sometimes I make scrambled eggs. It is easy to cook. I crack the eggs into a bowl. Then I cook them in a pan. My family likes my breakfast. Making breakfast is fun!",
        contentType: "story",
        difficulty: 1,
        wordCount: 65,
        estimatedTime: 39,
        paragraphs: [
          {
            text: "I like to make breakfast on Sunday mornings. First, I make toast. I put butter on the toast. Then I pour a glass of orange juice. Sometimes I make scrambled eggs. It is easy to cook. I crack the eggs into a bowl. Then I cook them in a pan. My family likes my breakfast. Making breakfast is fun!",
            translation: "저는 일요일 아침에 아침식사 만드는 것을 좋아해요. 먼저 토스트를 만들어요. 토스트에 버터를 바르고, 오렌지 주스를 따라요. 가끔 스크램블 에그를 만들어요. 요리하기 쉬워요. 그릇에 계란을 깨뜨리고, 팬에서 요리해요. 우리 가족은 제가 만든 아침식사를 좋아해요. 아침식사 만들기는 재미있어요!"
          }
        ]
      },
      // === LEVEL 2 ADDITIONS (7 more passages) ===
      {
        title: "My First Day at School",
        content: "I remember my first day at middle school. I was nervous but excited. The school building looked very big. I walked into my classroom and saw many new faces. My teacher was friendly and welcomed everyone. She told us about the school rules and our schedule. At lunch, I sat with a group of students. We introduced ourselves and talked about our hobbies. By the end of the day, I had made three new friends. I wasn't nervous anymore. I was looking forward to the next day!",
        contentType: "story",
        difficulty: 2,
        wordCount: 95,
        estimatedTime: 57,
        paragraphs: [
          {
            text: "I remember my first day at middle school. I was nervous but excited. The school building looked very big. I walked into my classroom and saw many new faces. My teacher was friendly and welcomed everyone. She told us about the school rules and our schedule. At lunch, I sat with a group of students. We introduced ourselves and talked about our hobbies. By the end of the day, I had made three new friends. I wasn't nervous anymore. I was looking forward to the next day!",
            translation: "중학교 첫날을 기억해요. 긴장되었지만 설레었어요. 학교 건물이 아주 커 보였어요. 교실에 들어가니 많은 새로운 얼굴들이 보였어요. 선생님은 친절하셨고 모두를 환영해주셨어요. 학교 규칙과 일정에 대해 말씀해주셨어요. 점심시간에 학생들과 함께 앉았어요. 서로 소개하고 취미에 대해 이야기했어요. 하루가 끝날 무렵, 새로운 친구 세 명을 사귀었어요. 더 이상 긴장되지 않았어요. 다음 날이 기대되었어요!"
          }
        ]
      },
      {
        title: "Learning to Ride a Bike",
        content: "Last year, I learned how to ride a bike. At first, it was difficult. I fell down many times. My dad helped me practice every weekend. He held the back of the bike while I pedaled. After two weeks, I could balance on my own. One day, my dad let go without telling me. I was riding by myself! I felt proud and happy. Now I ride my bike to school every day. It's faster than walking and better for the environment. Learning to ride a bike taught me that practice makes perfect.",
        contentType: "story",
        difficulty: 2,
        wordCount: 102,
        estimatedTime: 61,
        paragraphs: [
          {
            text: "Last year, I learned how to ride a bike. At first, it was difficult. I fell down many times. My dad helped me practice every weekend. He held the back of the bike while I pedaled. After two weeks, I could balance on my own. One day, my dad let go without telling me. I was riding by myself! I felt proud and happy. Now I ride my bike to school every day. It's faster than walking and better for the environment. Learning to ride a bike taught me that practice makes perfect.",
            translation: "작년에 자전거 타는 법을 배웠어요. 처음에는 어려웠어요. 여러 번 넘어졌어요. 아빠가 매주 주말마다 연습을 도와주셨어요. 제가 페달을 밟는 동안 자전거 뒤를 잡아주셨어요. 2주 후에는 혼자 균형을 잡을 수 있었어요. 어느 날 아빠가 말씀하지 않고 놓으셨어요. 제가 혼자 타고 있었어요! 자랑스럽고 행복했어요. 이제 매일 자전거를 타고 학교에 가요. 걷는 것보다 빠르고 환경에도 더 좋아요. 자전거 타기를 배우면서 연습이 완벽을 만든다는 것을 배웠어요."
          }
        ]
      },
      {
        title: "A Visit to the Museum",
        content: "Last month, our class went on a field trip to the science museum. We took a bus there. The museum had many interesting exhibits. We saw dinosaur fossils and learned about how they lived millions of years ago. There was also a planetarium show about the solar system. I learned that Jupiter is the biggest planet. The most exciting part was the robot demonstration. The robots could dance and play music. Our teacher gave us worksheets to complete. At the gift shop, I bought a small telescope. The museum trip made me more interested in science.",
        contentType: "story",
        difficulty: 2,
        wordCount: 104,
        estimatedTime: 62,
        paragraphs: [
          {
            text: "Last month, our class went on a field trip to the science museum. We took a bus there. The museum had many interesting exhibits. We saw dinosaur fossils and learned about how they lived millions of years ago. There was also a planetarium show about the solar system. I learned that Jupiter is the biggest planet. The most exciting part was the robot demonstration. The robots could dance and play music. Our teacher gave us worksheets to complete. At the gift shop, I bought a small telescope. The museum trip made me more interested in science.",
            translation: "지난달 우리 반은 과학 박물관으로 현장학습을 갔어요. 버스를 타고 갔어요. 박물관에는 많은 흥미로운 전시물이 있었어요. 공룡 화석을 보고 수백만 년 전 그들이 어떻게 살았는지 배웠어요. 태양계에 관한 플라네타리움 쇼도 있었어요. 목성이 가장 큰 행성이라는 것을 배웠어요. 가장 신나는 부분은 로봇 시연이었어요. 로봇들이 춤추고 음악을 연주할 수 있었어요. 선생님이 작성할 워크시트를 주셨어요. 기념품 가게에서 작은 망원경을 샀어요. 박물관 여행은 저를 과학에 더 관심 갖게 만들었어요."
          }
        ]
      },
      {
        title: "Helping at Home",
        content: "In my family, everyone has chores to do at home. My job is to set the table before dinner and wash the dishes afterward. At first, I didn't like doing chores because I wanted to play games instead. But my parents explained that sharing housework is important. Now I understand that helping makes our home cleaner and gives my parents more free time. My sister vacuums the floors, and my brother takes out the trash. On Saturdays, we all clean together. It goes faster when everyone helps. Doing chores has taught me to be more responsible.",
        contentType: "story",
        difficulty: 2,
        wordCount: 104,
        estimatedTime: 62,
        paragraphs: [
          {
            text: "In my family, everyone has chores to do at home. My job is to set the table before dinner and wash the dishes afterward. At first, I didn't like doing chores because I wanted to play games instead. But my parents explained that sharing housework is important. Now I understand that helping makes our home cleaner and gives my parents more free time. My sister vacuums the floors, and my brother takes out the trash. On Saturdays, we all clean together. It goes faster when everyone helps. Doing chores has taught me to be more responsible.",
            translation: "우리 가족에서는 모두가 집안일을 해요. 제 일은 저녁 전에 식탁을 차리고 그 후에 설거지하는 거예요. 처음에는 게임하고 싶어서 집안일을 좋아하지 않았어요. 하지만 부모님이 집안일을 나누는 것이 중요하다고 설명해주셨어요. 이제 돕는 것이 집을 더 깨끗하게 만들고 부모님께 더 많은 자유 시간을 준다는 것을 이해해요. 여동생은 바닥을 청소기로 청소하고, 남동생은 쓰레기를 버려요. 토요일에는 모두 함께 청소해요. 모두가 도우면 더 빨리 끝나요. 집안일하는 것이 저를 더 책임감 있게 만들었어요."
          }
        ]
      },
      {
        title: "My Favorite Season",
        content: "Autumn is my favorite season of the year. I love how the leaves change color from green to red, orange, and yellow. The weather is cool and comfortable—not too hot and not too cold. During autumn, my family goes hiking in the mountains to see the beautiful scenery. We take pictures of the colorful trees. Autumn is also harvest time. We visit apple orchards and pick fresh apples. My mom makes apple pie with them. The smell fills our house. Another thing I enjoy is wearing cozy sweaters. Autumn makes me feel happy and peaceful.",
        contentType: "story",
        difficulty: 2,
        wordCount: 107,
        estimatedTime: 64,
        paragraphs: [
          {
            text: "Autumn is my favorite season of the year. I love how the leaves change color from green to red, orange, and yellow. The weather is cool and comfortable—not too hot and not too cold. During autumn, my family goes hiking in the mountains to see the beautiful scenery. We take pictures of the colorful trees. Autumn is also harvest time. We visit apple orchards and pick fresh apples. My mom makes apple pie with them. The smell fills our house. Another thing I enjoy is wearing cozy sweaters. Autumn makes me feel happy and peaceful.",
            translation: "가을은 제가 가장 좋아하는 계절이에요. 나뭇잎이 초록색에서 빨강, 주황, 노랑으로 색이 변하는 것을 좋아해요. 날씨가 시원하고 편안해요—너무 덥지도 춥지도 않아요. 가을에 우리 가족은 아름다운 경치를 보러 산에 하이킹을 가요. 화려한 나무들의 사진을 찍어요. 가을은 수확의 시기이기도 해요. 사과 과수원을 방문해서 신선한 사과를 따요. 엄마가 사과 파이를 만들어요. 향기가 집 안을 가득 채워요. 또 다른 즐거움은 아늑한 스웨터를 입는 거예요. 가을은 저를 행복하고 평화롭게 만들어요."
          }
        ]
      },
      {
        title: "School Lunch Program",
        content: "Our school started a new lunch program this year. The cafeteria now offers healthier food choices. Instead of fried foods every day, we have fresh salads, grilled chicken, and whole wheat bread. There's also a vegetarian option for students who don't eat meat. The school nutritionist planned the menus to include more fruits and vegetables. Some students complained at first because they missed pizza and burgers. However, after trying the new food, most students agree it tastes good. The school also started a recycling program for lunch trays and bottles. These changes are better for our health and the environment.",
        contentType: "news",
        difficulty: 2,
        wordCount: 110,
        estimatedTime: 66,
        paragraphs: [
          {
            text: "Our school started a new lunch program this year. The cafeteria now offers healthier food choices. Instead of fried foods every day, we have fresh salads, grilled chicken, and whole wheat bread. There's also a vegetarian option for students who don't eat meat. The school nutritionist planned the menus to include more fruits and vegetables. Some students complained at first because they missed pizza and burgers. However, after trying the new food, most students agree it tastes good. The school also started a recycling program for lunch trays and bottles. These changes are better for our health and the environment.",
            translation: "우리 학교는 올해 새로운 급식 프로그램을 시작했어요. 구내식당이 이제 더 건강한 음식 선택을 제공해요. 매일 튀긴 음식 대신에, 신선한 샐러드, 구운 닭고기, 통밀 빵이 있어요. 고기를 먹지 않는 학생들을 위한 채식 옵션도 있어요. 학교 영양사가 과일과 채소를 더 많이 포함하도록 메뉴를 계획했어요. 일부 학생들은 피자와 햄버거가 그리워서 처음에는 불평했어요. 하지만 새 음식을 먹어본 후, 대부분의 학생들이 맛있다는 데 동의해요. 학교는 또한 급식 쟁반과 병을 위한 재활용 프로그램을 시작했어요. 이러한 변화는 우리 건강과 환경에 더 좋아요."
          }
        ]
      },
      {
        title: "Video Games and Study Time",
        content: "Many students enjoy playing video games, but finding balance between gaming and studying can be challenging. Video games are fun and can help develop problem-solving skills. However, spending too much time gaming can affect schoolwork and sleep. Experts recommend limiting game time to one or two hours per day. It's important to finish homework first before playing games. Some parents set rules about when their children can play. Taking breaks from screens is also healthy for your eyes. Playing outdoor games or sports provides exercise and social interaction. The key is moderation—enjoying games while maintaining good study habits.",
        contentType: "essay",
        difficulty: 2,
        wordCount: 108,
        estimatedTime: 65,
        paragraphs: [
          {
            text: "Many students enjoy playing video games, but finding balance between gaming and studying can be challenging. Video games are fun and can help develop problem-solving skills. However, spending too much time gaming can affect schoolwork and sleep. Experts recommend limiting game time to one or two hours per day. It's important to finish homework first before playing games. Some parents set rules about when their children can play. Taking breaks from screens is also healthy for your eyes. Playing outdoor games or sports provides exercise and social interaction. The key is moderation—enjoying games while maintaining good study habits.",
            translation: "많은 학생들이 비디오 게임을 즐기지만, 게임과 공부 사이의 균형을 찾는 것은 어려울 수 있어요. 비디오 게임은 재미있고 문제 해결 능력을 개발하는 데 도움이 될 수 있어요. 그러나 게임에 너무 많은 시간을 쓰면 학업과 수면에 영향을 줄 수 있어요. 전문가들은 게임 시간을 하루에 한두 시간으로 제한할 것을 권장해요. 게임하기 전에 먼저 숙제를 끝내는 것이 중요해요. 일부 부모님들은 자녀가 언제 게임할 수 있는지 규칙을 정해요. 화면에서 휴식을 취하는 것도 눈 건강에 좋아요. 야외 게임이나 스포츠를 하면 운동과 사회적 교류를 할 수 있어요. 핵심은 절제예요—좋은 학습 습관을 유지하면서 게임을 즐기는 거예요."
          }
        ]
      },
      // === LEVEL 3 ADDITIONS (7 more passages) ===
      {
        title: "The Benefits of Meditation",
        content: "Meditation has become increasingly popular in recent years as people search for ways to manage stress and improve their mental health. This ancient practice involves focusing the mind and eliminating distractions to achieve a state of calm awareness. Regular meditation offers numerous benefits for both mental and physical well-being.\n\nScientific research has shown that meditation can reduce anxiety and depression while improving concentration and emotional regulation. When we meditate, our brain waves slow down, promoting relaxation. Studies using brain imaging have revealed that regular meditation can actually change brain structure, increasing gray matter in areas associated with learning and memory.\n\nPhysically, meditation has been linked to lower blood pressure, improved immune function, and better sleep quality. Many practitioners report feeling more energized and focused throughout the day. Starting a meditation practice doesn't require special equipment or extensive time commitment. Even five to ten minutes daily can make a difference. Various meditation techniques exist, from mindfulness meditation to guided visualization, allowing individuals to find an approach that suits their preferences and lifestyle.",
        contentType: "essay",
        difficulty: 3,
        wordCount: 175,
        estimatedTime: 105,
        paragraphs: [
          {
            text: "Meditation has become increasingly popular in recent years as people search for ways to manage stress and improve their mental health. This ancient practice involves focusing the mind and eliminating distractions to achieve a state of calm awareness. Regular meditation offers numerous benefits for both mental and physical well-being.",
            translation: "명상은 사람들이 스트레스를 관리하고 정신 건강을 개선하는 방법을 찾으면서 최근 몇 년 동안 점점 더 인기를 얻고 있습니다. 이 고대 수련법은 마음을 집중하고 주의를 산만하게 하는 것들을 제거하여 차분한 인식 상태에 도달하는 것을 포함합니다. 규칙적인 명상은 정신적, 신체적 웰빙 모두에 수많은 이점을 제공합니다."
          },
          {
            text: "Scientific research has shown that meditation can reduce anxiety and depression while improving concentration and emotional regulation. When we meditate, our brain waves slow down, promoting relaxation. Studies using brain imaging have revealed that regular meditation can actually change brain structure, increasing gray matter in areas associated with learning and memory.",
            translation: "과학적 연구는 명상이 집중력과 감정 조절을 향상시키면서 불안과 우울증을 줄일 수 있다는 것을 보여주었습니다. 명상할 때 우리의 뇌파가 느려지면서 이완을 촉진합니다. 뇌 영상을 사용한 연구는 규칙적인 명상이 실제로 뇌 구조를 변화시켜 학습과 기억과 관련된 영역의 회백질을 증가시킬 수 있다는 것을 밝혔습니다."
          },
          {
            text: "Physically, meditation has been linked to lower blood pressure, improved immune function, and better sleep quality. Many practitioners report feeling more energized and focused throughout the day. Starting a meditation practice doesn't require special equipment or extensive time commitment. Even five to ten minutes daily can make a difference. Various meditation techniques exist, from mindfulness meditation to guided visualization, allowing individuals to find an approach that suits their preferences and lifestyle.",
            translation: "신체적으로 명상은 혈압 저하, 면역 기능 개선, 수면의 질 향상과 연관이 있습니다. 많은 수련자들이 하루 종일 더 활력이 넘치고 집중된다고 보고합니다. 명상 수련을 시작하는 데는 특별한 장비나 많은 시간 투자가 필요하지 않습니다. 하루에 5~10분만 해도 차이를 만들 수 있습니다. 마음챙김 명상에서 안내된 시각화까지 다양한 명상 기법이 존재하여 개인이 자신의 선호도와 라이프스타일에 맞는 접근법을 찾을 수 있습니다."
          }
        ]
      },
      {
        title: "The Rise of Remote Work",
        content: "The COVID-19 pandemic accelerated a workplace trend that was already emerging: remote work. Millions of employees worldwide transitioned from office environments to working from home, and many companies have decided to make this arrangement permanent. This shift has fundamentally changed how we think about work and productivity.\n\nRemote work offers several advantages for both employees and employers. Workers save time and money by eliminating daily commutes, and they enjoy greater flexibility in managing their schedules. Companies can reduce costs associated with maintaining large office spaces and can access talent from a wider geographic area. Environmental benefits include reduced carbon emissions from fewer people traveling to work.\n\nHowever, remote work also presents challenges. Some employees struggle with isolation and miss the social interaction of office environments. Maintaining work-life boundaries can be difficult when your home is also your workplace. Communication and collaboration may require more effort when team members aren't physically present. Despite these challenges, remote work appears to be a lasting feature of modern professional life, with many organizations adopting hybrid models that combine remote and in-office work.",
        contentType: "news",
        difficulty: 3,
        wordCount: 192,
        estimatedTime: 115,
        paragraphs: [
          {
            text: "The COVID-19 pandemic accelerated a workplace trend that was already emerging: remote work. Millions of employees worldwide transitioned from office environments to working from home, and many companies have decided to make this arrangement permanent. This shift has fundamentally changed how we think about work and productivity.",
            translation: "코로나19 팬데믹은 이미 나타나고 있던 직장 트렌드인 원격 근무를 가속화했습니다. 전 세계 수백만 명의 직원들이 사무실 환경에서 재택근무로 전환했고, 많은 회사들이 이 방식을 영구적으로 만들기로 결정했습니다. 이러한 변화는 우리가 일과 생산성에 대해 생각하는 방식을 근본적으로 바꾸었습니다."
          },
          {
            text: "Remote work offers several advantages for both employees and employers. Workers save time and money by eliminating daily commutes, and they enjoy greater flexibility in managing their schedules. Companies can reduce costs associated with maintaining large office spaces and can access talent from a wider geographic area. Environmental benefits include reduced carbon emissions from fewer people traveling to work.",
            translation: "원격 근무는 직원과 고용주 모두에게 여러 이점을 제공합니다. 근로자들은 매일의 통근을 없애서 시간과 돈을 절약하고, 일정 관리에 있어 더 큰 유연성을 누립니다. 회사는 대규모 사무 공간 유지와 관련된 비용을 줄이고 더 넓은 지역에서 인재를 확보할 수 있습니다. 환경적 이점으로는 직장으로 출퇴근하는 사람이 줄어들면서 탄소 배출이 감소한다는 것이 있습니다."
          },
          {
            text: "However, remote work also presents challenges. Some employees struggle with isolation and miss the social interaction of office environments. Maintaining work-life boundaries can be difficult when your home is also your workplace. Communication and collaboration may require more effort when team members aren't physically present. Despite these challenges, remote work appears to be a lasting feature of modern professional life, with many organizations adopting hybrid models that combine remote and in-office work.",
            translation: "그러나 원격 근무는 도전 과제도 제시합니다. 일부 직원들은 고립감으로 어려움을 겪고 사무실 환경의 사회적 교류를 그리워합니다. 집이 직장이기도 할 때 일과 삶의 경계를 유지하는 것이 어려울 수 있습니다. 팀원들이 물리적으로 같은 장소에 있지 않을 때 의사소통과 협업에 더 많은 노력이 필요할 수 있습니다. 이러한 도전에도 불구하고, 많은 조직이 원격 근무와 사무실 근무를 결합한 하이브리드 모델을 채택하면서 원격 근무는 현대 직업 생활의 지속적인 특징으로 보입니다."
          }
        ]
      },
      {
        title: "Understanding Food Labels",
        content: "Reading and understanding food labels is an essential skill for making healthy dietary choices. Food labels provide detailed information about nutritional content, ingredients, and serving sizes. However, many consumers find these labels confusing and struggle to interpret the information correctly.\n\nThe nutrition facts panel lists key nutrients including calories, fats, carbohydrates, proteins, vitamins, and minerals. The serving size is crucial to understand because all nutritional information is based on this amount, which may differ from the amount you actually consume. For example, a bottle of soda might contain 2.5 servings, meaning you need to multiply the listed values if you drink the entire bottle.\n\nIngredient lists are arranged by weight, with the most abundant ingredient listed first. This helps identify what the product primarily contains. Pay attention to added sugars, which can appear under various names like corn syrup, dextrose, or fructose. Terms like \"natural,\" \"organic,\" or \"healthy\" aren't always regulated and can be misleading. Learning to read food labels empowers consumers to compare products and make informed decisions that support their health goals.",
        contentType: "essay",
        difficulty: 3,
        wordCount: 194,
        estimatedTime: 116,
        paragraphs: [
          {
            text: "Reading and understanding food labels is an essential skill for making healthy dietary choices. Food labels provide detailed information about nutritional content, ingredients, and serving sizes. However, many consumers find these labels confusing and struggle to interpret the information correctly.",
            translation: "식품 라벨을 읽고 이해하는 것은 건강한 식단을 선택하는 데 필수적인 기술입니다. 식품 라벨은 영양 성분, 재료, 제공량에 대한 상세한 정보를 제공합니다. 그러나 많은 소비자들이 이러한 라벨을 혼란스러워하고 정보를 올바르게 해석하는 데 어려움을 겪습니다."
          },
          {
            text: "The nutrition facts panel lists key nutrients including calories, fats, carbohydrates, proteins, vitamins, and minerals. The serving size is crucial to understand because all nutritional information is based on this amount, which may differ from the amount you actually consume. For example, a bottle of soda might contain 2.5 servings, meaning you need to multiply the listed values if you drink the entire bottle.",
            translation: "영양 성분표는 칼로리, 지방, 탄수화물, 단백질, 비타민, 미네랄을 포함한 주요 영양소를 나열합니다. 모든 영양 정보가 이 양을 기준으로 하기 때문에 제공량을 이해하는 것이 중요하며, 이는 실제로 섭취하는 양과 다를 수 있습니다. 예를 들어, 탄산음료 한 병에는 2.5인분이 들어있을 수 있으며, 이는 전체 병을 마시는 경우 나열된 값을 곱해야 한다는 것을 의미합니다."
          },
          {
            text: "Ingredient lists are arranged by weight, with the most abundant ingredient listed first. This helps identify what the product primarily contains. Pay attention to added sugars, which can appear under various names like corn syrup, dextrose, or fructose. Terms like \"natural,\" \"organic,\" or \"healthy\" aren't always regulated and can be misleading. Learning to read food labels empowers consumers to compare products and make informed decisions that support their health goals.",
            translation: "성분 목록은 무게순으로 배열되며, 가장 많이 함유된 성분이 먼저 나열됩니다. 이것은 제품이 주로 무엇을 포함하는지 식별하는 데 도움이 됩니다. 옥수수 시럽, 덱스트로스, 과당과 같은 다양한 이름으로 나타날 수 있는 첨가당에 주의를 기울이세요. \"천연\", \"유기농\", \"건강한\"과 같은 용어는 항상 규제되는 것이 아니며 오해의 소지가 있을 수 있습니다. 식품 라벨을 읽는 법을 배우면 소비자가 제품을 비교하고 건강 목표를 지원하는 정보에 입각한 결정을 내릴 수 있습니다."
          }
        ]
      },
      {
        title: "The Impact of Social Media on Teenagers",
        content: "Social media has become an integral part of teenagers' lives, shaping how they communicate, form relationships, and view themselves. Platforms like Instagram, TikTok, and Snapchat provide opportunities for self-expression and connection, but they also present significant challenges for adolescent development.\n\nPositive aspects of social media include staying connected with friends, discovering shared interests, and accessing educational content. Teenagers can find communities that support their identities and interests, which is particularly valuable for those who feel isolated in their immediate environment. Creative platforms allow young people to develop skills in photography, video editing, and writing.\n\nHowever, research has identified concerning effects of excessive social media use. Constant exposure to curated, idealized images can damage self-esteem and body image. The pressure to gain likes and followers can become addictive and anxiety-inducing. Cyberbullying has emerged as a serious problem, with harmful comments and messages affecting mental health. Sleep disruption is common when teenagers check their phones late into the night. Parents and educators should help teens develop healthy social media habits, including setting time limits and maintaining awareness of how these platforms affect their well-being.",
        contentType: "essay",
        difficulty: 3,
        wordCount: 197,
        estimatedTime: 118,
        paragraphs: [
          {
            text: "Social media has become an integral part of teenagers' lives, shaping how they communicate, form relationships, and view themselves. Platforms like Instagram, TikTok, and Snapchat provide opportunities for self-expression and connection, but they also present significant challenges for adolescent development.",
            translation: "소셜 미디어는 십대들의 삶에서 필수적인 부분이 되어 그들이 의사소통하고, 관계를 형성하며, 자신을 바라보는 방식을 형성하고 있습니다. 인스타그램, 틱톡, 스냅챗과 같은 플랫폼은 자기 표현과 연결의 기회를 제공하지만, 청소년 발달에 중요한 도전 과제도 제시합니다."
          },
          {
            text: "Positive aspects of social media include staying connected with friends, discovering shared interests, and accessing educational content. Teenagers can find communities that support their identities and interests, which is particularly valuable for those who feel isolated in their immediate environment. Creative platforms allow young people to develop skills in photography, video editing, and writing.",
            translation: "소셜 미디어의 긍정적인 측면에는 친구들과 연결 상태를 유지하고, 공유된 관심사를 발견하며, 교육 콘텐츠에 접근하는 것이 포함됩니다. 십대들은 자신의 정체성과 관심사를 지원하는 커뮤니티를 찾을 수 있으며, 이는 즉각적인 환경에서 고립감을 느끼는 사람들에게 특히 가치 있습니다. 창의적인 플랫폼은 젊은이들이 사진, 동영상 편집, 글쓰기 기술을 개발할 수 있게 합니다."
          },
          {
            text: "However, research has identified concerning effects of excessive social media use. Constant exposure to curated, idealized images can damage self-esteem and body image. The pressure to gain likes and followers can become addictive and anxiety-inducing. Cyberbullying has emerged as a serious problem, with harmful comments and messages affecting mental health. Sleep disruption is common when teenagers check their phones late into the night. Parents and educators should help teens develop healthy social media habits, including setting time limits and maintaining awareness of how these platforms affect their well-being.",
            translation: "그러나 연구는 과도한 소셜 미디어 사용의 우려스러운 영향을 확인했습니다. 선별되고 이상화된 이미지에 끊임없이 노출되면 자존감과 신체 이미지가 손상될 수 있습니다. 좋아요와 팔로워를 얻어야 한다는 압박감은 중독적이고 불안을 유발할 수 있습니다. 사이버 괴롭힘은 해로운 댓글과 메시지가 정신 건강에 영향을 미치면서 심각한 문제로 대두되었습니다. 십대들이 밤늦게까지 휴대폰을 확인할 때 수면 방해가 흔합니다. 부모와 교육자는 십대들이 시간 제한을 설정하고 이러한 플랫폼이 웰빙에 어떻게 영향을 미치는지 인식을 유지하는 것을 포함하여 건강한 소셜 미디어 습관을 개발하도록 도와야 합니다."
          }
        ]
      },
      {
        title: "Renewable Energy Sources",
        content: "As concerns about climate change and fossil fuel depletion grow, renewable energy sources have gained significant attention. Unlike coal, oil, and natural gas, renewable energy comes from sources that naturally replenish, such as sunlight, wind, and water. Transitioning to renewable energy is crucial for reducing greenhouse gas emissions and creating a sustainable future.\n\nSolar power harnesses energy from the sun using photovoltaic panels or solar thermal systems. The cost of solar technology has decreased dramatically in recent years, making it more accessible to homeowners and businesses. Wind energy utilizes turbines to convert wind into electricity, with both onshore and offshore wind farms contributing to power grids. Hydroelectric power, generated by flowing water, has been used for decades and remains one of the most reliable renewable sources.\n\nWhile renewable energy offers environmental benefits, challenges remain. Solar and wind power are intermittent, dependent on weather conditions, which requires energy storage solutions or backup power sources. Initial installation costs can be high, though long-term savings and environmental benefits often justify the investment. Grid infrastructure must be updated to accommodate distributed renewable energy sources. Despite these obstacles, technological advances continue to improve efficiency and reduce costs, making renewable energy increasingly competitive with traditional fossil fuels.",
        contentType: "news",
        difficulty: 3,
        wordCount: 212,
        estimatedTime: 127,
        paragraphs: [
          {
            text: "As concerns about climate change and fossil fuel depletion grow, renewable energy sources have gained significant attention. Unlike coal, oil, and natural gas, renewable energy comes from sources that naturally replenish, such as sunlight, wind, and water. Transitioning to renewable energy is crucial for reducing greenhouse gas emissions and creating a sustainable future.",
            translation: "기후 변화와 화석 연료 고갈에 대한 우려가 커지면서 재생 가능 에너지원이 상당한 주목을 받고 있습니다. 석탄, 석유, 천연가스와 달리 재생 가능 에너지는 햇빛, 바람, 물과 같이 자연적으로 보충되는 원천에서 나옵니다. 재생 가능 에너지로의 전환은 온실가스 배출을 줄이고 지속 가능한 미래를 만드는 데 중요합니다."
          },
          {
            text: "Solar power harnesses energy from the sun using photovoltaic panels or solar thermal systems. The cost of solar technology has decreased dramatically in recent years, making it more accessible to homeowners and businesses. Wind energy utilizes turbines to convert wind into electricity, with both onshore and offshore wind farms contributing to power grids. Hydroelectric power, generated by flowing water, has been used for decades and remains one of the most reliable renewable sources.",
            translation: "태양광 발전은 광전지 패널이나 태양열 시스템을 사용하여 태양으로부터 에너지를 활용합니다. 최근 몇 년 동안 태양광 기술 비용이 급격히 감소하여 주택 소유자와 기업이 더 쉽게 접근할 수 있게 되었습니다. 풍력 에너지는 터빈을 사용하여 바람을 전기로 변환하며, 육상 및 해상 풍력 발전소 모두 전력망에 기여합니다. 흐르는 물에서 생성되는 수력 발전은 수십 년 동안 사용되어 왔으며 가장 신뢰할 수 있는 재생 가능 에너지원 중 하나로 남아 있습니다."
          },
          {
            text: "While renewable energy offers environmental benefits, challenges remain. Solar and wind power are intermittent, dependent on weather conditions, which requires energy storage solutions or backup power sources. Initial installation costs can be high, though long-term savings and environmental benefits often justify the investment. Grid infrastructure must be updated to accommodate distributed renewable energy sources. Despite these obstacles, technological advances continue to improve efficiency and reduce costs, making renewable energy increasingly competitive with traditional fossil fuels.",
            translation: "재생 가능 에너지가 환경적 이점을 제공하지만, 과제는 여전히 남아 있습니다. 태양광과 풍력은 날씨 조건에 따라 간헐적이어서 에너지 저장 솔루션이나 백업 전력원이 필요합니다. 초기 설치 비용이 높을 수 있지만, 장기적인 절감과 환경적 이점이 종종 투자를 정당화합니다. 분산된 재생 가능 에너지원을 수용하려면 전력망 인프라를 업데이트해야 합니다. 이러한 장애물에도 불구하고 기술 발전은 효율성을 계속 개선하고 비용을 줄여 재생 가능 에너지를 전통적인 화석 연료와 점점 더 경쟁력 있게 만들고 있습니다."
          }
        ]
      },
      {
        title: "The Importance of Sleep",
        content: "Sleep is one of the most fundamental aspects of human health, yet many people don't get enough of it. In our fast-paced modern society, sleep is often sacrificed for work, entertainment, or social activities. However, chronic sleep deprivation can have serious consequences for both physical and mental health.\n\nDuring sleep, the body performs essential maintenance functions. The immune system strengthens, muscles repair themselves, and the brain consolidates memories and processes information from the day. Different sleep stages serve different purposes—deep sleep promotes physical restoration while REM sleep supports cognitive functions and emotional regulation. Adults typically need 7-9 hours of sleep per night, though individual requirements may vary.\n\nLack of adequate sleep affects concentration, decision-making abilities, and emotional stability. It increases the risk of accidents and impairs work performance. Long-term sleep deprivation has been linked to serious health conditions including obesity, diabetes, cardiovascular disease, and depression. To improve sleep quality, experts recommend maintaining a consistent sleep schedule, creating a comfortable sleep environment, limiting screen time before bed, and avoiding caffeine in the evening. Prioritizing sleep is not a luxury but a necessity for overall well-being and optimal functioning.",
        contentType: "essay",
        difficulty: 3,
        wordCount: 213,
        estimatedTime: 128,
        paragraphs: [
          {
            text: "Sleep is one of the most fundamental aspects of human health, yet many people don't get enough of it. In our fast-paced modern society, sleep is often sacrificed for work, entertainment, or social activities. However, chronic sleep deprivation can have serious consequences for both physical and mental health.",
            translation: "수면은 인간 건강의 가장 기본적인 측면 중 하나이지만, 많은 사람들이 충분한 수면을 취하지 못합니다. 빠르게 변화하는 현대 사회에서 수면은 종종 일, 오락, 또는 사회적 활동을 위해 희생됩니다. 그러나 만성적인 수면 부족은 신체적, 정신적 건강 모두에 심각한 결과를 초래할 수 있습니다."
          },
          {
            text: "During sleep, the body performs essential maintenance functions. The immune system strengthens, muscles repair themselves, and the brain consolidates memories and processes information from the day. Different sleep stages serve different purposes—deep sleep promotes physical restoration while REM sleep supports cognitive functions and emotional regulation. Adults typically need 7-9 hours of sleep per night, though individual requirements may vary.",
            translation: "수면 중에 신체는 필수적인 유지 기능을 수행합니다. 면역 체계가 강화되고, 근육이 스스로 회복하며, 뇌는 하루의 기억을 통합하고 정보를 처리합니다. 다른 수면 단계는 다른 목적을 제공합니다—깊은 수면은 신체적 회복을 촉진하는 반면 REM 수면은 인지 기능과 감정 조절을 지원합니다. 성인은 일반적으로 밤에 7~9시간의 수면이 필요하지만, 개인의 요구 사항은 다를 수 있습니다."
          },
          {
            text: "Lack of adequate sleep affects concentration, decision-making abilities, and emotional stability. It increases the risk of accidents and impairs work performance. Long-term sleep deprivation has been linked to serious health conditions including obesity, diabetes, cardiovascular disease, and depression. To improve sleep quality, experts recommend maintaining a consistent sleep schedule, creating a comfortable sleep environment, limiting screen time before bed, and avoiding caffeine in the evening. Prioritizing sleep is not a luxury but a necessity for overall well-being and optimal functioning.",
            translation: "충분한 수면 부족은 집중력, 의사 결정 능력, 감정적 안정성에 영향을 미칩니다. 사고 위험을 증가시키고 업무 성과를 저해합니다. 장기적인 수면 부족은 비만, 당뇨병, 심혈관 질환, 우울증을 포함한 심각한 건강 상태와 연관되어 왔습니다. 수면의 질을 개선하기 위해 전문가들은 일관된 수면 일정 유지, 편안한 수면 환경 조성, 취침 전 화면 시간 제한, 저녁 카페인 피하기를 권장합니다. 수면을 우선시하는 것은 사치가 아니라 전반적인 웰빙과 최적의 기능을 위한 필수입니다."
          }
        ]
      },
      {
        title: "Community Gardens and Urban Agriculture",
        content: "Community gardens are flourishing in cities around the world as people rediscover the benefits of growing their own food. These shared spaces transform vacant lots and unused urban land into productive gardens where neighbors come together to cultivate vegetables, fruits, and flowers. The movement represents more than just food production—it fosters community connections and environmental awareness.\n\nUrban agriculture provides fresh, locally grown produce in areas that may lack access to healthy food options, known as food deserts. Gardeners learn about nutrition, sustainable agriculture practices, and seasonal eating. The physical activity involved in gardening promotes health, while time spent outdoors and working with plants can reduce stress and improve mental well-being. Community gardens also create green spaces that beautify neighborhoods and support local biodiversity by providing habitats for pollinators.\n\nThese gardens bring together people from diverse backgrounds, creating opportunities for social interaction and cultural exchange. Experienced gardeners share knowledge with beginners, and different cultural traditions of growing and preparing food enrich the community. Children who participate in community gardens develop appreciation for nature and healthy eating habits. While challenges include securing land, funding, and volunteer participation, successful community gardens demonstrate how urban spaces can be reimagined to support both ecological sustainability and social cohesion.",
        contentType: "news",
        difficulty: 3,
        wordCount: 226,
        estimatedTime: 136,
        paragraphs: [
          {
            text: "Community gardens are flourishing in cities around the world as people rediscover the benefits of growing their own food. These shared spaces transform vacant lots and unused urban land into productive gardens where neighbors come together to cultivate vegetables, fruits, and flowers. The movement represents more than just food production—it fosters community connections and environmental awareness.",
            translation: "사람들이 자신의 음식을 재배하는 이점을 재발견하면서 전 세계 도시에서 커뮤니티 정원이 번성하고 있습니다. 이러한 공유 공간은 빈 땅과 사용되지 않는 도시 토지를 이웃들이 함께 모여 채소, 과일, 꽃을 재배하는 생산적인 정원으로 변화시킵니다. 이 운동은 단순한 식량 생산 이상을 나타냅니다—커뮤니티 연결과 환경 인식을 촉진합니다."
          },
          {
            text: "Urban agriculture provides fresh, locally grown produce in areas that may lack access to healthy food options, known as food deserts. Gardeners learn about nutrition, sustainable agriculture practices, and seasonal eating. The physical activity involved in gardening promotes health, while time spent outdoors and working with plants can reduce stress and improve mental well-being. Community gardens also create green spaces that beautify neighborhoods and support local biodiversity by providing habitats for pollinators.",
            translation: "도시 농업은 식품 사막으로 알려진, 건강한 식품 옵션에 대한 접근이 부족할 수 있는 지역에서 신선하고 지역에서 재배된 농산물을 제공합니다. 정원사들은 영양, 지속 가능한 농업 관행, 계절별 식사에 대해 배웁니다. 원예에 포함된 신체 활동은 건강을 촉진하고, 야외에서 보내는 시간과 식물과 함께 일하는 것은 스트레스를 줄이고 정신적 웰빙을 향상시킬 수 있습니다. 커뮤니티 정원은 또한 이웃을 아름답게 하고 수분 매개자를 위한 서식지를 제공함으로써 지역 생물 다양성을 지원하는 녹지 공간을 만듭니다."
          },
          {
            text: "These gardens bring together people from diverse backgrounds, creating opportunities for social interaction and cultural exchange. Experienced gardeners share knowledge with beginners, and different cultural traditions of growing and preparing food enrich the community. Children who participate in community gardens develop appreciation for nature and healthy eating habits. While challenges include securing land, funding, and volunteer participation, successful community gardens demonstrate how urban spaces can be reimagined to support both ecological sustainability and social cohesion.",
            translation: "이러한 정원은 다양한 배경을 가진 사람들을 모아 사회적 상호작용과 문화 교류의 기회를 만듭니다. 경험 많은 정원사들은 초보자들과 지식을 공유하고, 음식을 재배하고 준비하는 다양한 문화 전통이 커뮤니티를 풍요롭게 합니다. 커뮤니티 정원에 참여하는 어린이들은 자연과 건강한 식습관에 대한 감사를 발전시킵니다. 도전 과제에는 토지 확보, 자금 조달, 자원 봉사 참여가 포함되지만, 성공적인 커뮤니티 정원은 도시 공간이 생태적 지속 가능성과 사회적 응집력을 모두 지원하도록 어떻게 재구상될 수 있는지 보여줍니다."
          }
        ]
      },
      // === LEVEL 4 ADDITIONS (7 more passages) ===
      {
        title: "The Evolution of Communication Technology",
        content: "Throughout human history, the ability to communicate has been fundamental to societal development. From ancient cave paintings to modern smartphones, communication methods have evolved dramatically, each innovation reshaping how humans interact and share information. Understanding this evolution provides insight into how technology influences culture and human relationships.\n\nEarly forms of communication relied on physical presence or simple tools. Smoke signals, messenger pigeons, and written letters enabled communication across distances but were slow and limited in reach. The printing press, invented in the 15th century, revolutionized information dissemination, making books and newspapers accessible to broader populations. This democratization of knowledge contributed significantly to the Renaissance and Enlightenment periods.\n\nThe 19th and 20th centuries witnessed rapid technological advances. The telegraph allowed near-instantaneous long-distance communication, followed by the telephone, which added the human voice. Radio and television brought audio and visual content to millions simultaneously. However, these were primarily one-way communication channels, with limited audience participation.\n\nThe internet represents perhaps the most transformative communication technology. It enables instant, global, two-way communication through email, social media, and video conferencing. Unlike previous innovations, the internet allows individuals not merely to consume information but to create and share it widely. This shift has democratized content creation but also raised concerns about misinformation and privacy. As communication technology continues evolving with artificial intelligence and virtual reality, society must navigate the balance between connectivity and thoughtful, meaningful interaction.",
        contentType: "essay",
        difficulty: 4,
        wordCount: 252,
        estimatedTime: 151,
        paragraphs: [
          {
            text: "Throughout human history, the ability to communicate has been fundamental to societal development. From ancient cave paintings to modern smartphones, communication methods have evolved dramatically, each innovation reshaping how humans interact and share information. Understanding this evolution provides insight into how technology influences culture and human relationships.",
            translation: "인류 역사를 통틀어 의사소통 능력은 사회 발전의 기본이었습니다. 고대 동굴 벽화에서 현대 스마트폰에 이르기까지 의사소통 방법은 극적으로 진화했으며, 각각의 혁신은 인간이 상호작용하고 정보를 공유하는 방식을 재구성했습니다. 이러한 진화를 이해하면 기술이 문화와 인간 관계에 어떻게 영향을 미치는지에 대한 통찰력을 얻을 수 있습니다."
          },
          {
            text: "Early forms of communication relied on physical presence or simple tools. Smoke signals, messenger pigeons, and written letters enabled communication across distances but were slow and limited in reach. The printing press, invented in the 15th century, revolutionized information dissemination, making books and newspapers accessible to broader populations. This democratization of knowledge contributed significantly to the Renaissance and Enlightenment periods.",
            translation: "초기 의사소통 형태는 물리적 존재나 간단한 도구에 의존했습니다. 연기 신호, 전서구, 편지는 거리를 넘어 의사소통을 가능하게 했지만 느리고 도달 범위가 제한적이었습니다. 15세기에 발명된 인쇄기는 책과 신문을 더 넓은 대중이 접근할 수 있게 하여 정보 전파에 혁명을 일으켰습니다. 이러한 지식의 민주화는 르네상스와 계몽주의 시대에 크게 기여했습니다."
          },
          {
            text: "The 19th and 20th centuries witnessed rapid technological advances. The telegraph allowed near-instantaneous long-distance communication, followed by the telephone, which added the human voice. Radio and television brought audio and visual content to millions simultaneously. However, these were primarily one-way communication channels, with limited audience participation.",
            translation: "19세기와 20세기는 급속한 기술 발전을 목격했습니다. 전신은 거의 즉각적인 장거리 통신을 가능하게 했고, 그 다음 전화가 인간의 목소리를 추가했습니다. 라디오와 텔레비전은 수백만 명에게 동시에 오디오와 비주얼 콘텐츠를 가져왔습니다. 그러나 이것들은 주로 일방향 통신 채널이었으며, 청중 참여가 제한적이었습니다."
          },
          {
            text: "The internet represents perhaps the most transformative communication technology. It enables instant, global, two-way communication through email, social media, and video conferencing. Unlike previous innovations, the internet allows individuals not merely to consume information but to create and share it widely. This shift has democratized content creation but also raised concerns about misinformation and privacy. As communication technology continues evolving with artificial intelligence and virtual reality, society must navigate the balance between connectivity and thoughtful, meaningful interaction.",
            translation: "인터넷은 아마도 가장 혁신적인 통신 기술을 나타냅니다. 이메일, 소셜 미디어, 화상 회의를 통해 즉각적이고 전 세계적인 양방향 통신을 가능하게 합니다. 이전 혁신과 달리 인터넷은 개인이 단순히 정보를 소비하는 것이 아니라 광범위하게 생성하고 공유할 수 있게 합니다. 이러한 변화는 콘텐츠 생성을 민주화했지만 잘못된 정보와 프라이버시에 대한 우려도 제기했습니다. 통신 기술이 인공지능과 가상 현실과 함께 계속 진화함에 따라 사회는 연결성과 사려 깊고 의미 있는 상호작용 사이의 균형을 탐색해야 합니다."
          }
        ]
      },
      {
        title: "The Gig Economy and the Future of Work",
        content: "The gig economy, characterized by short-term contracts and freelance work rather than permanent employment, has grown substantially in recent years. Platforms like Uber, TaskRabbit, and Upwork connect workers directly with customers needing specific services, fundamentally changing traditional employment relationships. This shift raises important questions about workers' rights, economic stability, and the nature of work itself.\n\nProponents argue that gig work offers unprecedented flexibility and autonomy. Workers can choose their hours, select assignments that match their skills and interests, and potentially earn more than in traditional jobs. For employers, hiring contractors reduces overhead costs associated with full-time employees, including benefits and workspace. The model can be particularly beneficial for students, retirees, or those with caregiving responsibilities who need flexible schedules.\n\nHowever, critics highlight significant drawbacks. Gig workers typically lack employment protections such as minimum wage guarantees, health insurance, paid leave, and unemployment benefits. Income can be unpredictable, making financial planning difficult. The absence of career advancement opportunities and skill development programs may limit long-term prospects. Additionally, gig workers often bear costs like vehicle maintenance or equipment that traditional employers would provide.\n\nThe regulatory landscape struggles to keep pace with these changes. Many labor laws were designed for traditional employment and don't address gig work's unique characteristics. Some jurisdictions have implemented new regulations requiring platform companies to classify workers as employees, granting them standard protections. As the gig economy continues expanding, finding balance between flexibility and security remains crucial for workers' well-being and economic sustainability.",
        contentType: "essay",
        difficulty: 4,
        wordCount: 275,
        estimatedTime: 165,
        paragraphs: [
          {
            text: "The gig economy, characterized by short-term contracts and freelance work rather than permanent employment, has grown substantially in recent years. Platforms like Uber, TaskRabbit, and Upwork connect workers directly with customers needing specific services, fundamentally changing traditional employment relationships. This shift raises important questions about workers' rights, economic stability, and the nature of work itself.",
            translation: "단기 계약과 정규직이 아닌 프리랜서 업무를 특징으로 하는 긱 경제는 최근 몇 년 동안 상당히 성장했습니다. 우버, 태스크래빗, 업워크와 같은 플랫폼은 특정 서비스를 필요로 하는 고객과 근로자를 직접 연결하여 전통적인 고용 관계를 근본적으로 변화시킵니다. 이러한 변화는 근로자의 권리, 경제적 안정성, 일의 본질 자체에 대한 중요한 질문을 제기합니다."
          },
          {
            text: "Proponents argue that gig work offers unprecedented flexibility and autonomy. Workers can choose their hours, select assignments that match their skills and interests, and potentially earn more than in traditional jobs. For employers, hiring contractors reduces overhead costs associated with full-time employees, including benefits and workspace. The model can be particularly beneficial for students, retirees, or those with caregiving responsibilities who need flexible schedules.",
            translation: "지지자들은 긱 워크가 전례 없는 유연성과 자율성을 제공한다고 주장합니다. 근로자는 근무 시간을 선택하고 자신의 기술과 관심사에 맞는 과제를 선택하며 전통적인 직업보다 더 많이 벌 수 있습니다. 고용주의 경우 계약자를 고용하면 복리후생 및 작업 공간을 포함하여 정규직 직원과 관련된 간접비를 줄일 수 있습니다. 이 모델은 유연한 일정이 필요한 학생, 은퇴자 또는 돌봄 책임이 있는 사람들에게 특히 유익할 수 있습니다."
          },
          {
            text: "However, critics highlight significant drawbacks. Gig workers typically lack employment protections such as minimum wage guarantees, health insurance, paid leave, and unemployment benefits. Income can be unpredictable, making financial planning difficult. The absence of career advancement opportunities and skill development programs may limit long-term prospects. Additionally, gig workers often bear costs like vehicle maintenance or equipment that traditional employers would provide.",
            translation: "그러나 비평가들은 중요한 단점을 강조합니다. 긱 워커는 일반적으로 최저 임금 보장, 건강 보험, 유급 휴가, 실업 수당과 같은 고용 보호가 부족합니다. 소득이 예측 불가능하여 재정 계획이 어려울 수 있습니다. 경력 발전 기회와 기술 개발 프로그램의 부재는 장기 전망을 제한할 수 있습니다. 또한 긱 워커는 전통적인 고용주가 제공할 차량 유지 보수 또는 장비와 같은 비용을 종종 부담합니다."
          },
          {
            text: "The regulatory landscape struggles to keep pace with these changes. Many labor laws were designed for traditional employment and don't address gig work's unique characteristics. Some jurisdictions have implemented new regulations requiring platform companies to classify workers as employees, granting them standard protections. As the gig economy continues expanding, finding balance between flexibility and security remains crucial for workers' well-being and economic sustainability.",
            translation: "규제 환경은 이러한 변화를 따라잡기 위해 고군분투하고 있습니다. 많은 노동법은 전통적인 고용을 위해 설계되었으며 긱 워크의 고유한 특성을 다루지 않습니다. 일부 관할권은 플랫폼 회사가 근로자를 직원으로 분류하도록 요구하는 새로운 규정을 시행하여 표준 보호를 부여했습니다. 긱 경제가 계속 확장됨에 따라 유연성과 보안 사이의 균형을 찾는 것은 근로자의 웰빙과 경제적 지속 가능성에 중요합니다."
          }
        ]
      },
      {
        title: "Plastic Pollution in the Oceans",
        content: "Plastic pollution has emerged as one of the most pressing environmental challenges of our time. Every year, millions of tons of plastic waste enter the world's oceans, creating massive garbage patches and threatening marine ecosystems. This crisis demands urgent attention and coordinated global action to prevent further damage and begin restoration efforts.\n\nPlastic's durability, one of its most valued properties, becomes problematic when it enters the environment. Unlike organic materials, plastic doesn't biodegrade but instead breaks down into smaller pieces called microplastics. These tiny particles persist for centuries, accumulating in ocean gyres and contaminating water throughout the marine environment. Marine animals often mistake plastic for food, leading to ingestion that can cause starvation, internal injuries, and death. Entanglement in larger plastic items, such as fishing nets, poses additional threats to sea turtles, seabirds, and marine mammals.\n\nThe impact extends beyond wildlife. Microplastics have entered the food chain, appearing in fish and seafood consumed by humans. Research is still determining the full health implications of microplastic ingestion, but early studies suggest potential risks. Furthermore, plastic pollution affects coastal communities economically, damaging fishing industries and tourism while requiring expensive cleanup efforts.\n\nAddressing ocean plastic pollution requires multiple approaches. Reducing single-use plastics through legislation and changing consumer behavior can decrease the amount entering waterways. Improving waste management infrastructure, particularly in developing nations where much ocean plastic originates, is essential. Innovation in biodegradable alternatives and plastic-eating bacteria offers promising solutions. Ocean cleanup technologies, while helpful, cannot solve the problem alone—prevention must be the priority. International cooperation and public awareness are crucial for meaningful progress in combating this global crisis.",
        contentType: "news",
        difficulty: 4,
        wordCount: 290,
        estimatedTime: 174,
        paragraphs: [
          {
            text: "Plastic pollution has emerged as one of the most pressing environmental challenges of our time. Every year, millions of tons of plastic waste enter the world's oceans, creating massive garbage patches and threatening marine ecosystems. This crisis demands urgent attention and coordinated global action to prevent further damage and begin restoration efforts.",
            translation: "플라스틱 오염은 우리 시대의 가장 시급한 환경 문제 중 하나로 대두되었습니다. 매년 수백만 톤의 플라스틱 쓰레기가 세계 해양에 유입되어 거대한 쓰레기 패치를 만들고 해양 생태계를 위협합니다. 이 위기는 추가 피해를 방지하고 복원 노력을 시작하기 위해 긴급한 관심과 조율된 글로벌 행동을 요구합니다."
          },
          {
            text: "Plastic's durability, one of its most valued properties, becomes problematic when it enters the environment. Unlike organic materials, plastic doesn't biodegrade but instead breaks down into smaller pieces called microplastics. These tiny particles persist for centuries, accumulating in ocean gyres and contaminating water throughout the marine environment. Marine animals often mistake plastic for food, leading to ingestion that can cause starvation, internal injuries, and death. Entanglement in larger plastic items, such as fishing nets, poses additional threats to sea turtles, seabirds, and marine mammals.",
            translation: "플라스틱의 내구성은 가장 가치 있는 특성 중 하나이지만 환경에 들어가면 문제가 됩니다. 유기 물질과 달리 플라스틱은 생분해되지 않고 대신 미세 플라스틱이라고 불리는 더 작은 조각으로 분해됩니다. 이 작은 입자들은 수세기 동안 지속되며 해양 환류에 축적되고 해양 환경 전체에 물을 오염시킵니다. 해양 동물은 종종 플라스틱을 음식으로 착각하여 섭취하게 되고 이는 기아, 내부 부상 및 사망을 초래할 수 있습니다. 어망과 같은 더 큰 플라스틱 물품에 얽히는 것은 바다거북, 바닷새 및 해양 포유류에 추가적인 위협을 제기합니다."
          },
          {
            text: "The impact extends beyond wildlife. Microplastics have entered the food chain, appearing in fish and seafood consumed by humans. Research is still determining the full health implications of microplastic ingestion, but early studies suggest potential risks. Furthermore, plastic pollution affects coastal communities economically, damaging fishing industries and tourism while requiring expensive cleanup efforts.",
            translation: "영향은 야생 동물을 넘어 확장됩니다. 미세 플라스틱은 먹이 사슬에 들어가 인간이 소비하는 생선과 해산물에 나타납니다. 연구는 여전히 미세 플라스틱 섭취의 전체 건강 영향을 결정하고 있지만 초기 연구는 잠재적인 위험을 시사합니다. 게다가 플라스틱 오염은 어업과 관광을 손상시키고 값비싼 청소 노력을 요구하면서 해안 지역 사회에 경제적으로 영향을 미칩니다."
          },
          {
            text: "Addressing ocean plastic pollution requires multiple approaches. Reducing single-use plastics through legislation and changing consumer behavior can decrease the amount entering waterways. Improving waste management infrastructure, particularly in developing nations where much ocean plastic originates, is essential. Innovation in biodegradable alternatives and plastic-eating bacteria offers promising solutions. Ocean cleanup technologies, while helpful, cannot solve the problem alone—prevention must be the priority. International cooperation and public awareness are crucial for meaningful progress in combating this global crisis.",
            translation: "해양 플라스틱 오염 해결에는 여러 가지 접근 방식이 필요합니다. 입법을 통해 일회용 플라스틱을 줄이고 소비자 행동을 변화시키면 수로에 유입되는 양을 줄일 수 있습니다. 특히 많은 해양 플라스틱이 발생하는 개발도상국에서 폐기물 관리 인프라를 개선하는 것이 필수적입니다. 생분해 가능한 대안과 플라스틱을 먹는 박테리아의 혁신은 유망한 솔루션을 제공합니다. 해양 청소 기술은 도움이 되지만 혼자서 문제를 해결할 수 없습니다. 예방이 우선순위여야 합니다. 이 글로벌 위기에 맞서 싸우는 데 의미 있는 진전을 이루려면 국제 협력과 대중의 인식이 중요합니다."
          }
        ]
      },
      {
        title: "The Science of Habit Formation",
        content: "Habits shape our daily lives more than we might realize. From brushing teeth to checking smartphones, habitual behaviors occur automatically with minimal conscious thought. Understanding the science behind habit formation empowers individuals to break unwanted patterns and establish beneficial routines that support their goals.\n\nNeurologically, habits form through a process called chunking, where the brain converts sequences of actions into automatic routines. This occurs in the basal ganglia, a brain structure involved in pattern recognition and procedural memory. The habit loop consists of three components: a cue that triggers the behavior, the routine or action itself, and a reward that reinforces the pattern. Once established, this loop operates largely subconsciously, freeing cognitive resources for other tasks.\n\nCharles Duhigg, in his book \"The Power of Habit,\" describes how understanding this loop enables habit modification. Identifying the cue and reward surrounding an unwanted habit allows individuals to substitute a different routine while maintaining the same cue-reward structure. For example, someone who snacks when stressed (cue) to feel comfort (reward) might substitute a short walk for the snacking routine, achieving similar stress relief without negative health consequences.\n\nEstablishing new habits requires consistency and patience. Research suggests it takes an average of 66 days for a behavior to become automatic, though this varies based on complexity. Starting small increases success rates—beginning with two minutes of daily exercise proves more sustainable than committing to an hour. Environmental design also plays a crucial role; making desired behaviors easier and unwanted behaviors more difficult can significantly influence outcomes. Understanding habit mechanics provides valuable tools for personal development and behavior change.",
        contentType: "essay",
        difficulty: 4,
        wordCount: 290,
        estimatedTime: 174,
        paragraphs: [
          {
            text: "Habits shape our daily lives more than we might realize. From brushing teeth to checking smartphones, habitual behaviors occur automatically with minimal conscious thought. Understanding the science behind habit formation empowers individuals to break unwanted patterns and establish beneficial routines that support their goals.",
            translation: "습관은 우리가 인식하는 것보다 더 많이 일상 생활을 형성합니다. 양치질부터 스마트폰 확인까지, 습관적 행동은 의식적 사고를 최소화하면서 자동으로 발생합니다. 습관 형성의 과학을 이해하면 개인이 원치 않는 패턴을 깨고 목표를 지원하는 유익한 루틴을 확립할 수 있습니다."
          },
          {
            text: "Neurologically, habits form through a process called chunking, where the brain converts sequences of actions into automatic routines. This occurs in the basal ganglia, a brain structure involved in pattern recognition and procedural memory. The habit loop consists of three components: a cue that triggers the behavior, the routine or action itself, and a reward that reinforces the pattern. Once established, this loop operates largely subconsciously, freeing cognitive resources for other tasks.",
            translation: "신경학적으로 습관은 청킹이라는 과정을 통해 형성되며, 뇌는 일련의 행동을 자동 루틴으로 변환합니다. 이것은 패턴 인식과 절차적 기억과 관련된 뇌 구조인 기저핵에서 발생합니다. 습관 루프는 세 가지 구성 요소로 구성됩니다: 행동을 촉발하는 신호, 루틴 또는 행동 자체, 패턴을 강화하는 보상. 일단 확립되면 이 루프는 주로 무의식적으로 작동하여 다른 작업을 위한 인지 자원을 해방시킵니다."
          },
          {
            text: "Charles Duhigg, in his book \"The Power of Habit,\" describes how understanding this loop enables habit modification. Identifying the cue and reward surrounding an unwanted habit allows individuals to substitute a different routine while maintaining the same cue-reward structure. For example, someone who snacks when stressed (cue) to feel comfort (reward) might substitute a short walk for the snacking routine, achieving similar stress relief without negative health consequences.",
            translation: "찰스 두히그는 그의 책 \"습관의 힘\"에서 이 루프를 이해하는 것이 어떻게 습관 수정을 가능하게 하는지 설명합니다. 원치 않는 습관을 둘러싼 신호와 보상을 식별하면 개인이 동일한 신호-보상 구조를 유지하면서 다른 루틴으로 대체할 수 있습니다. 예를 들어, 스트레스를 받을 때(신호) 편안함을 느끼기 위해(보상) 간식을 먹는 사람은 간식 루틴을 짧은 산책으로 대체하여 부정적인 건강 결과 없이 유사한 스트레스 해소를 달성할 수 있습니다."
          },
          {
            text: "Establishing new habits requires consistency and patience. Research suggests it takes an average of 66 days for a behavior to become automatic, though this varies based on complexity. Starting small increases success rates—beginning with two minutes of daily exercise proves more sustainable than committing to an hour. Environmental design also plays a crucial role; making desired behaviors easier and unwanted behaviors more difficult can significantly influence outcomes. Understanding habit mechanics provides valuable tools for personal development and behavior change.",
            translation: "새로운 습관을 확립하려면 일관성과 인내가 필요합니다. 연구에 따르면 행동이 자동화되기까지 평균 66일이 걸리지만 복잡성에 따라 다릅니다. 작게 시작하면 성공률이 높아집니다—매일 2분의 운동으로 시작하는 것이 한 시간을 약속하는 것보다 더 지속 가능합니다. 환경 설계도 중요한 역할을 합니다. 원하는 행동을 더 쉽게 하고 원치 않는 행동을 더 어렵게 만드는 것은 결과에 상당한 영향을 미칠 수 있습니다. 습관 메커니즘을 이해하면 개인 개발과 행동 변화를 위한 귀중한 도구를 제공합니다."
          }
        ]
      },
      {
        title: "Space Exploration and Human Curiosity",
        content: "Since ancient times, humans have gazed at the night sky with wonder, imagining what lies beyond Earth's atmosphere. Modern space exploration represents the culmination of this age-old curiosity, combining advanced technology with humanity's drive to explore the unknown. From the first satellites to potential Mars colonization, our ventures into space have expanded knowledge while raising profound questions about our place in the universe.\n\nThe space age began dramatically in 1957 with the Soviet Union's launch of Sputnik 1, sparking the Space Race between superpowers. This competition accelerated technological development, culminating in humanity's greatest achievement: landing on the Moon in 1969. Neil Armstrong's first steps on the lunar surface demonstrated what human ingenuity could accomplish. These early missions provided invaluable scientific data and developed technologies that later benefited everyday life, including satellite communications, GPS navigation, and medical imaging.\n\nContemporary space exploration has shifted toward international collaboration and commercial involvement. The International Space Station exemplifies peaceful cooperation among nations, hosting continuous human presence in orbit for over two decades. Private companies like SpaceX are revolutionizing space travel with reusable rockets, making space more accessible. Robotic missions continue exploring Mars, while telescopes like James Webb peer deep into the universe, observing distant galaxies and potentially habitable exoplanets.\n\nLooking forward, space exploration faces both challenges and opportunities. Establishing permanent human settlements requires solving complex problems related to radiation protection and sustainable life support. However, the potential rewards are enormous: accessing asteroid mining resources, establishing backup locations for civilization, and understanding whether life exists elsewhere. Space exploration embodies human nature's best qualities—curiosity, cooperation, and courage to venture into the unknown.",
        contentType: "essay",
        difficulty: 4,
        wordCount: 285,
        estimatedTime: 171,
        paragraphs: [
          {
            text: "Since ancient times, humans have gazed at the night sky with wonder, imagining what lies beyond Earth's atmosphere. Modern space exploration represents the culmination of this age-old curiosity, combining advanced technology with humanity's drive to explore the unknown. From the first satellites to potential Mars colonization, our ventures into space have expanded knowledge while raising profound questions about our place in the universe.",
            translation: "고대부터 인간은 경이로움으로 밤하늘을 바라보며 지구 대기권 너머에 무엇이 있는지 상상해왔습니다. 현대 우주 탐사는 미지의 세계를 탐험하려는 인류의 욕구와 첨단 기술을 결합한 이 오래된 호기심의 정점을 나타냅니다. 첫 번째 위성에서 잠재적인 화성 식민지화까지, 우주로의 우리의 모험은 지식을 확장하면서 우주에서 우리의 위치에 대한 심오한 질문을 제기했습니다."
          },
          {
            text: "The space age began dramatically in 1957 with the Soviet Union's launch of Sputnik 1, sparking the Space Race between superpowers. This competition accelerated technological development, culminating in humanity's greatest achievement: landing on the Moon in 1969. Neil Armstrong's first steps on the lunar surface demonstrated what human ingenuity could accomplish. These early missions provided invaluable scientific data and developed technologies that later benefited everyday life, including satellite communications, GPS navigation, and medical imaging.",
            translation: "우주 시대는 1957년 소련의 스푸트니크 1호 발사로 극적으로 시작되어 초강대국 간의 우주 경쟁을 촉발했습니다. 이 경쟁은 기술 개발을 가속화하여 인류의 가장 위대한 업적인 1969년 달 착륙으로 정점에 달했습니다. 닐 암스트롱의 달 표면 첫 발걸음은 인간의 독창성이 무엇을 달성할 수 있는지 보여주었습니다. 이러한 초기 임무는 귀중한 과학 데이터를 제공하고 위성 통신, GPS 내비게이션, 의료 영상을 포함하여 나중에 일상 생활에 도움이 된 기술을 개발했습니다."
          },
          {
            text: "Contemporary space exploration has shifted toward international collaboration and commercial involvement. The International Space Station exemplifies peaceful cooperation among nations, hosting continuous human presence in orbit for over two decades. Private companies like SpaceX are revolutionizing space travel with reusable rockets, making space more accessible. Robotic missions continue exploring Mars, while telescopes like James Webb peer deep into the universe, observing distant galaxies and potentially habitable exoplanets.",
            translation: "현대 우주 탐사는 국제 협력과 상업적 참여로 이동했습니다. 국제 우주 정거장은 20년 이상 궤도에서 지속적인 인간의 존재를 호스팅하면서 국가 간의 평화로운 협력을 예시합니다. 스페이스X와 같은 민간 기업은 재사용 가능한 로켓으로 우주 여행에 혁명을 일으키며 우주를 더 접근하기 쉽게 만들고 있습니다. 로봇 임무는 화성을 계속 탐험하고 있으며, 제임스 웹과 같은 망원경은 우주 깊숙이 들여다보며 먼 은하와 잠재적으로 거주 가능한 외계 행성을 관찰합니다."
          },
          {
            text: "Looking forward, space exploration faces both challenges and opportunities. Establishing permanent human settlements requires solving complex problems related to radiation protection and sustainable life support. However, the potential rewards are enormous: accessing asteroid mining resources, establishing backup locations for civilization, and understanding whether life exists elsewhere. Space exploration embodies human nature's best qualities—curiosity, cooperation, and courage to venture into the unknown.",
            translation: "앞으로 우주 탐사는 도전과 기회 모두에 직면해 있습니다. 영구적인 인간 정착지를 확립하려면 방사선 보호와 지속 가능한 생명 지원과 관련된 복잡한 문제를 해결해야 합니다. 그러나 잠재적인 보상은 엄청납니다: 소행성 채굴 자원 접근, 문명을 위한 백업 위치 확립, 다른 곳에 생명이 존재하는지 이해하는 것입니다. 우주 탐사는 호기심, 협력, 미지로 모험할 용기라는 인간 본성의 최고 자질을 구현합니다."
          }
        ]
      },
      {
        title: "Mental Health Awareness in Modern Society",
        content: "Mental health, once a taboo subject relegated to whispered conversations, has gradually moved toward mainstream discussion. This shift reflects growing recognition that psychological well-being is as essential as physical health. However, despite increased awareness, stigma persists, and many people still hesitate to seek help or discuss their struggles openly.\n\nSeveral factors contribute to mental health challenges in contemporary society. The fast-paced modern lifestyle, characterized by constant connectivity and information overload, creates chronic stress. Social media platforms, while enabling connection, often foster comparison and inadequacy feelings. Economic uncertainty and work-life balance difficulties add additional pressure. The COVID-19 pandemic dramatically highlighted mental health's importance, as isolation and uncertainty affected millions globally.\n\nMental health conditions, including depression, anxiety disorders, and PTSD, are remarkably common, affecting one in four people at some point in their lives. These conditions aren't signs of weakness but legitimate health issues requiring proper treatment. Biological factors, life experiences, and family history all influence mental health. Left untreated, mental health problems can severely impact relationships and quality of life.\n\nEncouragingly, effective treatments exist. Therapy approaches like cognitive-behavioral therapy help individuals develop coping strategies. Medications can manage symptoms for some conditions. Lifestyle modifications—regular exercise, adequate sleep, and social connections—provide significant benefits. Workplaces increasingly recognize mental health's importance, implementing employee assistance programs.\n\nMoving forward, continued destigmatization requires ongoing conversation and education. Sharing personal stories helps normalize mental health struggles. Schools teaching emotional literacy early can build resilience. Accessible mental health services must become available to all. By treating mental health with the same seriousness as physical health, society can create supportive environments for well-being.",
        contentType: "essay",
        difficulty: 4,
        wordCount: 280,
        estimatedTime: 168,
        paragraphs: [
          {
            text: "Mental health, once a taboo subject relegated to whispered conversations, has gradually moved toward mainstream discussion. This shift reflects growing recognition that psychological well-being is as essential as physical health. However, despite increased awareness, stigma persists, and many people still hesitate to seek help or discuss their struggles openly.",
            translation: "한때 속삭이는 대화에 국한된 금기 주제였던 정신 건강은 점차 주류 논의로 이동했습니다. 이러한 변화는 심리적 웰빙이 신체적 건강만큼 필수적이라는 인식이 커지고 있음을 반영합니다. 그러나 인식이 증가했음에도 불구하고 낙인은 지속되며, 많은 사람들은 여전히 도움을 구하거나 자신의 어려움을 공개적으로 논의하기를 주저합니다."
          },
          {
            text: "Several factors contribute to mental health challenges in contemporary society. The fast-paced modern lifestyle, characterized by constant connectivity and information overload, creates chronic stress. Social media platforms, while enabling connection, often foster comparison and inadequacy feelings. Economic uncertainty, job insecurity, and work-life balance difficulties add additional pressure. The COVID-19 pandemic dramatically highlighted mental health's importance, as isolation, grief, and uncertainty affected millions globally.",
            translation: "현대 사회에서 정신 건강 문제에 기여하는 여러 요인이 있습니다. 지속적인 연결성과 정보 과부하로 특징지어지는 빠르게 변화하는 현대 라이프스타일은 만성 스트레스를 만듭니다. 소셜 미디어 플랫폼은 연결을 가능하게 하지만 종종 비교와 부족함의 감정을 조장합니다. 경제적 불확실성, 고용 불안정, 일과 삶의 균형 어려움이 추가적인 압력을 더합니다. COVID-19 팬데믹은 고립, 슬픔, 불확실성이 전 세계적으로 수백만 명에게 영향을 미치면서 정신 건강의 중요성을 극적으로 강조했습니다."
          },
          {
            text: "Mental health conditions, including depression, anxiety disorders, and PTSD, are remarkably common, affecting one in four people at some point in their lives. These conditions aren't signs of weakness or character flaws but legitimate health issues requiring proper treatment. Biological factors, life experiences, and family history all influence mental health. Left untreated, mental health problems can severely impact relationships, productivity, and overall quality of life.",
            translation: "우울증, 불안 장애, PTSD를 포함한 정신 건강 상태는 놀랍도록 흔하며, 인생의 어느 시점에서 4명 중 1명에게 영향을 미칩니다. 이러한 상태는 약점이나 성격 결함의 징후가 아니라 적절한 치료가 필요한 정당한 건강 문제입니다. 생물학적 요인, 삶의 경험, 가족력이 모두 정신 건강에 영향을 미칩니다. 치료하지 않으면 정신 건강 문제는 관계, 생산성 및 전반적인 삶의 질에 심각한 영향을 미칠 수 있습니다."
          },
          {
            text: "Encouragingly, effective treatments exist. Therapy approaches like cognitive-behavioral therapy help individuals develop coping strategies and address underlying issues. Medications can manage symptoms for some conditions. Lifestyle modifications—regular exercise, adequate sleep, social connections, and stress management techniques—provide significant benefits. Workplaces increasingly recognize mental health's importance, implementing employee assistance programs and promoting supportive cultures.",
            translation: "다행히도 효과적인 치료법이 존재합니다. 인지 행동 치료와 같은 치료 접근법은 개인이 대처 전략을 개발하고 근본적인 문제를 해결하는 데 도움이 됩니다. 약물은 일부 상태의 증상을 관리할 수 있습니다. 규칙적인 운동, 충분한 수면, 사회적 연결, 스트레스 관리 기법과 같은 생활 방식 수정은 상당한 이점을 제공합니다. 직장은 정신 건강의 중요성을 점점 더 인식하고 직원 지원 프로그램을 시행하며 지원적인 문화를 촉진합니다."
          },
          {
            text: "Moving forward, continued destigmatization requires ongoing conversation, education, and advocacy. Sharing personal stories helps normalize mental health struggles. Schools teaching emotional literacy and coping skills early can build resilience. Accessible, affordable mental health services must become available to all, not just those with adequate insurance or resources. By treating mental health with the same seriousness as physical health, society can create environments where everyone feels supported in seeking help and prioritizing their well-being.",
            translation: "앞으로 나아가면서 지속적인 탈낙인화는 지속적인 대화, 교육 및 옹호를 요구합니다. 개인적인 이야기를 공유하면 정신 건강 어려움을 정상화하는 데 도움이 됩니다. 감정적 리터러시와 대처 기술을 조기에 가르치는 학교는 회복력을 구축할 수 있습니다. 접근 가능하고 저렴한 정신 건강 서비스는 적절한 보험이나 자원이 있는 사람뿐만 아니라 모든 사람에게 제공되어야 합니다. 신체적 건강과 동일한 진지함으로 정신 건강을 다루면 사회는 모든 사람이 도움을 구하고 웰빙을 우선시하는 데 지원을 받는다고 느끼는 환경을 만들 수 있습니다."
          }
        ]
      },
      {
        title: "The Future of Transportation",
        content: "Transportation systems are undergoing revolutionary changes as technology advances and environmental concerns intensify. From electric vehicles to hyperloop concepts, innovations promise to transform how people and goods move across cities and continents. These developments will reshape urban planning, energy consumption, and daily life in profound ways.\n\nElectric vehicles (EVs) represent the most immediate transformation. Major automotive manufacturers are committing to electric-only futures, with several countries planning to ban internal combustion engine sales within the next two decades. EVs produce zero tailpipe emissions, reducing air pollution in urban areas. As battery technology improves, range anxiety—fear of running out of charge—diminishes, while charging infrastructure expands globally. However, challenges remain: mining materials for batteries carries environmental costs, and electricity grid capacity must increase to support widespread adoption.\n\nAutonomous vehicles could revolutionize personal and public transportation. Self-driving cars promise increased safety by eliminating human error, which causes most accidents. They could optimize traffic flow, reducing congestion and commute times. Elderly individuals and people with disabilities would gain new mobility options. However, technical hurdles persist in handling unpredictable situations, and ethical questions about programming decision-making in unavoidable accidents remain unresolved.\n\nUrban areas are reimagining transportation through integrated multimodal systems. Bike-sharing programs, electric scooters, and improved public transit create alternatives to private car ownership. Some cities are redesigning streets to prioritize pedestrians and cyclists over vehicles. High-speed rail connects major population centers efficiently, offering environmentally friendly alternatives to short-haul flights.\n\nLooking further ahead, concepts like hyperloop—passenger pods traveling through vacuum tubes at near-supersonic speeds—could make long-distance travel dramatically faster. Flying taxis and drone delivery systems may become commonplace in urban skies. These innovations share common themes: reducing environmental impact, improving efficiency, and enhancing accessibility. Successfully implementing them requires coordinated policy, infrastructure investment, and public acceptance of changing mobility patterns.",
        contentType: "news",
        difficulty: 4,
        wordCount: 330,
        estimatedTime: 198,
        paragraphs: [
          {
            text: "Transportation systems are undergoing revolutionary changes as technology advances and environmental concerns intensify. From electric vehicles to hyperloop concepts, innovations promise to transform how people and goods move across cities and continents. These developments will reshape urban planning, energy consumption, and daily life in profound ways.",
            translation: "기술이 발전하고 환경 문제가 심화됨에 따라 교통 시스템은 혁명적인 변화를 겪고 있습니다. 전기 자동차에서 하이퍼루프 개념까지, 혁신은 사람과 물품이 도시와 대륙을 가로질러 이동하는 방식을 변화시킬 것을 약속합니다. 이러한 발전은 도시 계획, 에너지 소비 및 일상 생활을 심오한 방식으로 재구성할 것입니다."
          },
          {
            text: "Electric vehicles (EVs) represent the most immediate transformation. Major automotive manufacturers are committing to electric-only futures, with several countries planning to ban internal combustion engine sales within the next two decades. EVs produce zero tailpipe emissions, reducing air pollution in urban areas. As battery technology improves, range anxiety—fear of running out of charge—diminishes, while charging infrastructure expands globally. However, challenges remain: mining materials for batteries carries environmental costs, and electricity grid capacity must increase to support widespread adoption.",
            translation: "전기 자동차(EV)는 가장 즉각적인 변화를 나타냅니다. 주요 자동차 제조업체는 전기 전용 미래에 전념하고 있으며, 여러 국가가 향후 20년 내에 내연 기관 판매 금지를 계획하고 있습니다. EV는 배기 가스 배출이 전혀 없어 도시 지역의 대기 오염을 줄입니다. 배터리 기술이 향상됨에 따라 충전 부족에 대한 두려움인 주행 거리 불안이 감소하는 반면, 충전 인프라는 전 세계적으로 확장됩니다. 그러나 과제는 여전히 남아 있습니다: 배터리 재료 채굴은 환경 비용을 수반하며, 광범위한 채택을 지원하려면 전력망 용량이 증가해야 합니다."
          },
          {
            text: "Autonomous vehicles could revolutionize personal and public transportation. Self-driving cars promise increased safety by eliminating human error, which causes most accidents. They could optimize traffic flow, reducing congestion and commute times. Elderly individuals and people with disabilities would gain new mobility options. However, technical hurdles persist in handling unpredictable situations, and ethical questions about programming decision-making in unavoidable accidents remain unresolved.",
            translation: "자율 주행 차량은 개인 및 대중 교통에 혁명을 일으킬 수 있습니다. 자율 주행 차는 대부분의 사고를 일으키는 인간의 실수를 제거하여 안전성을 높일 것을 약속합니다. 교통 흐름을 최적화하여 혼잡과 통근 시간을 줄일 수 있습니다. 노인과 장애인은 새로운 이동 옵션을 얻을 것입니다. 그러나 예측할 수 없는 상황을 처리하는 데 있어 기술적 장애물이 지속되며, 불가피한 사고에서 의사 결정을 프로그래밍하는 것에 대한 윤리적 질문은 여전히 해결되지 않았습니다."
          },
          {
            text: "Urban areas are reimagining transportation through integrated multimodal systems. Bike-sharing programs, electric scooters, and improved public transit create alternatives to private car ownership. Some cities are redesigning streets to prioritize pedestrians and cyclists over vehicles. High-speed rail connects major population centers efficiently, offering environmentally friendly alternatives to short-haul flights.",
            translation: "도시 지역은 통합 다중 모드 시스템을 통해 교통을 재구상하고 있습니다. 자전거 공유 프로그램, 전기 스쿠터, 개선된 대중 교통이 개인 차량 소유에 대한 대안을 만듭니다. 일부 도시는 차량보다 보행자와 자전거 이용자를 우선시하도록 거리를 재설계하고 있습니다. 고속 철도는 주요 인구 중심지를 효율적으로 연결하여 단거리 항공편에 대한 환경 친화적인 대안을 제공합니다."
          },
          {
            text: "Looking further ahead, concepts like hyperloop—passenger pods traveling through vacuum tubes at near-supersonic speeds—could make long-distance travel dramatically faster. Flying taxis and drone delivery systems may become commonplace in urban skies. These innovations share common themes: reducing environmental impact, improving efficiency, and enhancing accessibility. Successfully implementing them requires coordinated policy, infrastructure investment, and public acceptance of changing mobility patterns.",
            translation: "더 앞을 내다보면, 하이퍼루프—진공관을 통해 거의 초음속으로 이동하는 승객 포드—와 같은 개념이 장거리 여행을 극적으로 빠르게 만들 수 있습니다. 플라잉 택시와 드론 배송 시스템은 도시 하늘에서 흔해질 수 있습니다. 이러한 혁신은 공통 주제를 공유합니다: 환경 영향 감소, 효율성 향상, 접근성 향상. 이를 성공적으로 구현하려면 조율된 정책, 인프라 투자, 변화하는 이동성 패턴에 대한 대중의 수용이 필요합니다."
          }
        ]
      },
      // === LEVEL 5 ADDITIONS (6 more passages) ===
      {
        title: "The Ethics of Artificial Intelligence",
        content: "As artificial intelligence systems become increasingly sophisticated and integrated into society, fundamental ethical questions demand careful consideration. AI technologies influence decisions affecting employment, criminal justice, healthcare, and even military applications. The algorithms underlying these systems can perpetuate biases, raise privacy concerns, and challenge traditional notions of accountability and responsibility.\n\nBias in AI systems represents a critical ethical challenge. Machine learning algorithms learn from historical data, and when that data reflects societal biases—whether related to race, gender, socioeconomic status, or other factors—the AI systems can amplify these prejudices. For instance, facial recognition technology has demonstrated lower accuracy rates for people with darker skin tones, primarily because training datasets contained disproportionately more images of lighter-skinned individuals. Similarly, hiring algorithms have shown gender bias when trained on historical hiring data from male-dominated industries. These biases aren't intentional but emerge from data that reflects historical inequalities. Addressing this requires diverse training data, algorithmic transparency, and ongoing monitoring for discriminatory outcomes.\n\nThe question of accountability in AI decision-making presents another ethical dilemma. When an autonomous vehicle causes an accident or an AI medical diagnosis proves incorrect, determining responsibility becomes complex. Traditional legal and ethical frameworks assign accountability to human decision-makers, but AI systems operate with varying degrees of autonomy. Should blame fall on developers who created the algorithm, companies deploying the technology, or the AI system itself? Some philosophers propose treating advanced AI systems as moral agents capable of bearing responsibility, while others argue that accountability must ultimately rest with humans. This debate has practical implications for regulation, insurance, and legal liability.\n\nPrivacy concerns intensify as AI systems collect and analyze vast amounts of personal data. Predictive algorithms can infer sensitive information—including health conditions, financial status, and political beliefs—from seemingly innocuous data points. Facial recognition technology enables unprecedented surveillance capabilities, raising questions about the balance between security and civil liberties. The aggregation of data across platforms creates comprehensive profiles of individuals, often without their explicit knowledge or meaningful consent. European regulations like GDPR attempt to address these issues through data protection requirements and rights to explanation for automated decisions, but global standards remain inconsistent.\n\nThe potential displacement of human labor through automation presents both economic and philosophical challenges. While technological unemployment has occurred throughout history, AI's versatility threatens a broader range of occupations, from routine manual labor to complex cognitive tasks. Beyond economic concerns, work provides many people with purpose, identity, and social connection. A future where AI performs an increasing share of productive activities requires rethinking education, social safety nets, and perhaps fundamental concepts like the relationship between labor and human value.\n\nNavigating these ethical challenges requires interdisciplinary collaboration among technologists, ethicists, policymakers, and affected communities. Principles like transparency, fairness, accountability, and privacy should guide AI development and deployment. However, implementing these abstract principles in practice involves difficult tradeoffs and contextual judgment. Establishing appropriate governance frameworks—whether through industry self-regulation, governmental oversight, or international cooperation—remains an ongoing process. As AI capabilities continue advancing, proactive ethical deliberation becomes increasingly urgent to ensure these powerful technologies serve human flourishing rather than undermining fundamental values.",
        contentType: "essay",
        difficulty: 5,
        wordCount: 500,
        estimatedTime: 300,
        paragraphs: [
          {
            text: "As artificial intelligence systems become increasingly sophisticated and integrated into society, fundamental ethical questions demand careful consideration. AI technologies influence decisions affecting employment, criminal justice, healthcare, and even military applications. The algorithms underlying these systems can perpetuate biases, raise privacy concerns, and challenge traditional notions of accountability and responsibility.",
            translation: "인공지능 시스템이 점점 더 정교해지고 사회에 통합됨에 따라 근본적인 윤리적 질문이 신중한 고려를 요구합니다. AI 기술은 고용, 형사 사법, 의료, 심지어 군사 응용에 영향을 미치는 결정에 영향을 미칩니다. 이러한 시스템의 기본 알고리즘은 편향을 영속화하고, 프라이버시 문제를 제기하며, 책임과 의무에 대한 전통적인 개념에 도전할 수 있습니다."
          },
          {
            text: "Bias in AI systems represents a critical ethical challenge. Machine learning algorithms learn from historical data, and when that data reflects societal biases—whether related to race, gender, socioeconomic status, or other factors—the AI systems can amplify these prejudices. For instance, facial recognition technology has demonstrated lower accuracy rates for people with darker skin tones, primarily because training datasets contained disproportionately more images of lighter-skinned individuals. Similarly, hiring algorithms have shown gender bias when trained on historical hiring data from male-dominated industries. These biases aren't intentional but emerge from data that reflects historical inequalities. Addressing this requires diverse training data, algorithmic transparency, and ongoing monitoring for discriminatory outcomes.",
            translation: "AI 시스템의 편향은 중요한 윤리적 과제를 나타냅니다. 머신러닝 알고리즘은 역사적 데이터로부터 학습하며, 그 데이터가 인종, 성별, 사회경제적 지위 또는 기타 요인과 관련된 사회적 편향을 반영할 때 AI 시스템은 이러한 편견을 증폭시킬 수 있습니다. 예를 들어, 안면 인식 기술은 주로 훈련 데이터 세트에 밝은 피부색의 개인 이미지가 불균형적으로 더 많이 포함되어 있기 때문에 어두운 피부색을 가진 사람들에 대해 낮은 정확도를 보였습니다. 마찬가지로 채용 알고리즘은 남성 지배적인 산업의 과거 채용 데이터로 훈련될 때 성별 편향을 보였습니다. 이러한 편향은 의도적이지 않지만 역사적 불평등을 반영하는 데이터에서 발생합니다. 이를 해결하려면 다양한 훈련 데이터, 알고리즘 투명성, 차별적 결과에 대한 지속적인 모니터링이 필요합니다."
          },
          {
            text: "The question of accountability in AI decision-making presents another ethical dilemma. When an autonomous vehicle causes an accident or an AI medical diagnosis proves incorrect, determining responsibility becomes complex. Traditional legal and ethical frameworks assign accountability to human decision-makers, but AI systems operate with varying degrees of autonomy. Should blame fall on developers who created the algorithm, companies deploying the technology, or the AI system itself? Some philosophers propose treating advanced AI systems as moral agents capable of bearing responsibility, while others argue that accountability must ultimately rest with humans. This debate has practical implications for regulation, insurance, and legal liability.",
            translation: "AI 의사결정에서 책임의 문제는 또 다른 윤리적 딜레마를 제시합니다. 자율 주행 차량이 사고를 일으키거나 AI 의료 진단이 잘못된 것으로 판명될 때 책임을 결정하는 것은 복잡해집니다. 전통적인 법적 및 윤리적 프레임워크는 인간 의사 결정자에게 책임을 할당하지만 AI 시스템은 다양한 수준의 자율성으로 작동합니다. 비난은 알고리즘을 만든 개발자, 기술을 배포하는 회사 또는 AI 시스템 자체에 떨어져야 할까요? 일부 철학자들은 고급 AI 시스템을 책임을 질 수 있는 도덕적 행위자로 취급할 것을 제안하는 반면, 다른 사람들은 책임이 궁극적으로 인간에게 있어야 한다고 주장합니다. 이 논쟁은 규제, 보험 및 법적 책임에 대한 실질적인 영향을 미칩니다."
          },
          {
            text: "Privacy concerns intensify as AI systems collect and analyze vast amounts of personal data. Predictive algorithms can infer sensitive information—including health conditions, financial status, and political beliefs—from seemingly innocuous data points. Facial recognition technology enables unprecedented surveillance capabilities, raising questions about the balance between security and civil liberties. The aggregation of data across platforms creates comprehensive profiles of individuals, often without their explicit knowledge or meaningful consent. European regulations like GDPR attempt to address these issues through data protection requirements and rights to explanation for automated decisions, but global standards remain inconsistent.",
            translation: "AI 시스템이 방대한 양의 개인 데이터를 수집하고 분석함에 따라 프라이버시 우려가 강화됩니다. 예측 알고리즘은 겉보기에 무해한 데이터 포인트에서 건강 상태, 재정 상태, 정치적 신념을 포함한 민감한 정보를 추론할 수 있습니다. 안면 인식 기술은 전례 없는 감시 기능을 가능하게 하여 보안과 시민적 자유 사이의 균형에 대한 질문을 제기합니다. 플랫폼 간 데이터 집계는 종종 명시적인 지식이나 의미 있는 동의 없이 개인의 포괄적인 프로필을 생성합니다. GDPR과 같은 유럽 규정은 데이터 보호 요구 사항과 자동화된 결정에 대한 설명권을 통해 이러한 문제를 해결하려고 시도하지만 글로벌 표준은 여전히 일관되지 않습니다."
          },
          {
            text: "The potential displacement of human labor through automation presents both economic and philosophical challenges. While technological unemployment has occurred throughout history, AI's versatility threatens a broader range of occupations, from routine manual labor to complex cognitive tasks. Beyond economic concerns, work provides many people with purpose, identity, and social connection. A future where AI performs an increasing share of productive activities requires rethinking education, social safety nets, and perhaps fundamental concepts like the relationship between labor and human value.",
            translation: "자동화를 통한 인간 노동의 잠재적 대체는 경제적 및 철학적 과제를 모두 제시합니다. 기술적 실업이 역사를 통해 발생했지만 AI의 다재다능함은 일상적인 육체 노동에서 복잡한 인지 작업까지 더 광범위한 직업을 위협합니다. 경제적 우려를 넘어 일은 많은 사람들에게 목적, 정체성 및 사회적 연결을 제공합니다. AI가 생산 활동의 증가하는 부분을 수행하는 미래는 교육, 사회 안전망, 그리고 아마도 노동과 인간 가치 사이의 관계와 같은 근본적인 개념을 재고하는 것을 요구합니다."
          },
          {
            text: "Navigating these ethical challenges requires interdisciplinary collaboration among technologists, ethicists, policymakers, and affected communities. Principles like transparency, fairness, accountability, and privacy should guide AI development and deployment. However, implementing these abstract principles in practice involves difficult tradeoffs and contextual judgment. Establishing appropriate governance frameworks—whether through industry self-regulation, governmental oversight, or international cooperation—remains an ongoing process. As AI capabilities continue advancing, proactive ethical deliberation becomes increasingly urgent to ensure these powerful technologies serve human flourishing rather than undermining fundamental values.",
            translation: "이러한 윤리적 과제를 탐색하려면 기술자, 윤리학자, 정책 입안자 및 영향을 받는 커뮤니티 간의 학제 간 협력이 필요합니다. 투명성, 공정성, 책임 및 프라이버시와 같은 원칙이 AI 개발 및 배포를 안내해야 합니다. 그러나 이러한 추상적 원칙을 실제로 구현하는 것은 어려운 트레이드오프와 맥락적 판단을 포함합니다. 산업 자체 규제, 정부 감독 또는 국제 협력을 통해 적절한 거버넌스 프레임워크를 수립하는 것은 계속 진행 중인 프로세스입니다. AI 기능이 계속 발전함에 따라 이러한 강력한 기술이 근본적인 가치를 훼손하기보다는 인간의 번영을 위해 봉사하도록 보장하기 위해 사전 윤리적 숙고가 점점 더 긴급해지고 있습니다."
          }
        ]
      },
      {
        title: "Globalization and Cultural Identity",
        content: "Globalization—the increasing interconnection of economies, cultures, and populations through trade, technology, and migration—has profoundly impacted how people understand and express their cultural identities. While fostering unprecedented access to diverse perspectives and opportunities, globalization simultaneously raises concerns about cultural homogenization and the loss of distinct traditions. This tension between global integration and local distinctiveness represents one of the defining challenges of the contemporary era.\n\nCultural exchange facilitated by globalization offers numerous benefits. Exposure to different worldviews, artistic expressions, and knowledge systems enriches societies by broadening perspectives and fostering creativity. International collaboration addresses global challenges like climate change and disease that transcend national boundaries. Economic integration through global trade has lifted millions from poverty, though benefits have been distributed unevenly. Digital technologies enable individuals to maintain connections across vast distances, creating transnational communities united by shared interests rather than geographic proximity. These developments have created possibilities unimaginable in previous historical periods.\n\nHowever, critics contend that globalization threatens cultural diversity by promoting a dominant, often Western-centric, model of modernity. Global media conglomerates disseminate homogenized content that may overshadow local artistic traditions. Commercial pressures favor products and practices that appeal to mass markets rather than preserving regional distinctiveness. Indigenous languages face extinction as global languages, particularly English, dominate international communication and commerce. Traditional knowledge systems and practices may be devalued when measured against globalized standards of progress and development.\n\nThe relationship between globalization and cultural identity proves more complex than simple narratives of homogenization suggest. Many communities actively negotiate their engagement with global influences, selectively adopting elements while maintaining core traditions. The concept of \"glocalization\" describes how global phenomena are adapted to local contexts, creating hybrid forms that blend external influences with indigenous elements. For instance, global food chains modify menus to accommodate local tastes and dietary restrictions, while musical genres evolve through cross-cultural exchange, producing innovative fusions that draw from multiple traditions.\n\nMoreover, globalization provides tools for marginalized groups to resist cultural domination. Digital platforms enable communities to document and share endangered languages and traditions with global audiences. Social movements can mobilize across borders to challenge unjust practices and policies. Diaspora communities maintain connections to cultural heritage while forging new identities in their adopted homes, enriching both their origin and destination societies with these hybrid perspectives.\n\nNavigating globalization's cultural dimensions requires acknowledging both its opportunities and risks. Policies promoting cultural diversity—through language preservation programs, support for local arts, and protection of traditional knowledge—can complement global integration rather than oppose it. Education systems that cultivate both global competence and deep appreciation for local heritage help individuals develop flexible identities capable of engaging meaningfully across cultural boundaries while maintaining rootedness in particular traditions. The challenge lies not in choosing between global integration and cultural preservation but in finding ways to pursue both simultaneously, recognizing that cultural identity remains dynamic rather than fixed, continuously evolving through encounter with difference while retaining connections to the past.",
        contentType: "essay",
        difficulty: 5,
        wordCount: 485,
        estimatedTime: 291,
        paragraphs: [
          {
            text: "Globalization—the increasing interconnection of economies, cultures, and populations through trade, technology, and migration—has profoundly impacted how people understand and express their cultural identities. While fostering unprecedented access to diverse perspectives and opportunities, globalization simultaneously raises concerns about cultural homogenization and the loss of distinct traditions. This tension between global integration and local distinctiveness represents one of the defining challenges of the contemporary era.",
            translation: "무역, 기술, 이주를 통한 경제, 문화, 인구의 증가하는 상호 연결인 세계화는 사람들이 문화적 정체성을 이해하고 표현하는 방식에 심오한 영향을 미쳤습니다. 다양한 관점과 기회에 대한 전례 없는 접근을 촉진하는 동시에, 세계화는 문화적 동질화와 독특한 전통의 상실에 대한 우려를 제기합니다. 글로벌 통합과 지역적 독특성 사이의 이러한 긴장은 현대 시대의 결정적인 과제 중 하나를 나타냅니다."
          },
          {
            text: "Cultural exchange facilitated by globalization offers numerous benefits. Exposure to different worldviews, artistic expressions, and knowledge systems enriches societies by broadening perspectives and fostering creativity. International collaboration addresses global challenges like climate change and disease that transcend national boundaries. Economic integration through global trade has lifted millions from poverty, though benefits have been distributed unevenly. Digital technologies enable individuals to maintain connections across vast distances, creating transnational communities united by shared interests rather than geographic proximity. These developments have created possibilities unimaginable in previous historical periods.",
            translation: "세계화가 촉진하는 문화 교류는 수많은 이점을 제공합니다. 다양한 세계관, 예술적 표현, 지식 체계에 대한 노출은 관점을 넓히고 창의성을 촉진함으로써 사회를 풍요롭게 합니다. 국제 협력은 국경을 초월하는 기후 변화 및 질병과 같은 글로벌 과제를 해결합니다. 글로벌 무역을 통한 경제 통합은 수백만 명을 빈곤에서 벗어나게 했지만 혜택은 불균등하게 분배되었습니다. 디지털 기술은 개인이 광대한 거리에 걸쳐 연결을 유지할 수 있게 하여 지리적 근접성보다는 공유된 관심사로 통합된 초국가적 커뮤니티를 만듭니다. 이러한 발전은 이전 역사 시대에는 상상할 수 없었던 가능성을 창출했습니다."
          },
          {
            text: "However, critics contend that globalization threatens cultural diversity by promoting a dominant, often Western-centric, model of modernity. Global media conglomerates disseminate homogenized content that may overshadow local artistic traditions. Commercial pressures favor products and practices that appeal to mass markets rather than preserving regional distinctiveness. Indigenous languages face extinction as global languages, particularly English, dominate international communication and commerce. Traditional knowledge systems and practices may be devalued when measured against globalized standards of progress and development.",
            translation: "그러나 비평가들은 세계화가 지배적이고 종종 서구 중심적인 근대성 모델을 촉진함으로써 문화적 다양성을 위협한다고 주장합니다. 글로벌 미디어 대기업은 지역 예술 전통을 가릴 수 있는 동질화된 콘텐츠를 배포합니다. 상업적 압력은 지역적 독특성을 보존하기보다는 대중 시장에 호소하는 제품과 관행을 선호합니다. 토착 언어는 특히 영어와 같은 글로벌 언어가 국제 통신과 상업을 지배함에 따라 멸종에 직면합니다. 전통적인 지식 시스템과 관행은 세계화된 진보와 발전 기준으로 측정될 때 평가절하될 수 있습니다."
          },
          {
            text: "The relationship between globalization and cultural identity proves more complex than simple narratives of homogenization suggest. Many communities actively negotiate their engagement with global influences, selectively adopting elements while maintaining core traditions. The concept of \"glocalization\" describes how global phenomena are adapted to local contexts, creating hybrid forms that blend external influences with indigenous elements. For instance, global food chains modify menus to accommodate local tastes and dietary restrictions, while musical genres evolve through cross-cultural exchange, producing innovative fusions that draw from multiple traditions.",
            translation: "세계화와 문화적 정체성 사이의 관계는 단순한 동질화 서사가 시사하는 것보다 더 복잡함이 입증됩니다. 많은 커뮤니티는 핵심 전통을 유지하면서 요소를 선택적으로 채택하면서 글로벌 영향력과의 참여를 적극적으로 협상합니다. \"글로컬라이제이션\"의 개념은 글로벌 현상이 지역 맥락에 어떻게 적응되어 외부 영향과 토착 요소를 혼합하는 하이브리드 형태를 만드는지를 설명합니다. 예를 들어, 글로벌 음식 체인은 지역 취향과 식이 제한을 수용하기 위해 메뉴를 수정하는 반면, 음악 장르는 여러 전통에서 가져온 혁신적인 융합을 생산하면서 문화 간 교류를 통해 진화합니다."
          },
          {
            text: "Moreover, globalization provides tools for marginalized groups to resist cultural domination. Digital platforms enable communities to document and share endangered languages and traditions with global audiences. Social movements can mobilize across borders to challenge unjust practices and policies. Diaspora communities maintain connections to cultural heritage while forging new identities in their adopted homes, enriching both their origin and destination societies with these hybrid perspectives.",
            translation: "게다가 세계화는 주변화된 그룹이 문화적 지배에 저항할 수 있는 도구를 제공합니다. 디지털 플랫폼은 커뮤니티가 멸종 위기에 처한 언어와 전통을 글로벌 청중과 문서화하고 공유할 수 있게 합니다. 사회 운동은 국경을 넘어 동원하여 부당한 관행과 정책에 도전할 수 있습니다. 디아스포라 커뮤니티는 문화 유산과의 연결을 유지하면서 채택된 집에서 새로운 정체성을 형성하여 이러한 하이브리드 관점으로 원산지와 목적지 사회 모두를 풍요롭게 합니다."
          },
          {
            text: "Navigating globalization's cultural dimensions requires acknowledging both its opportunities and risks. Policies promoting cultural diversity—through language preservation programs, support for local arts, and protection of traditional knowledge—can complement global integration rather than oppose it. Education systems that cultivate both global competence and deep appreciation for local heritage help individuals develop flexible identities capable of engaging meaningfully across cultural boundaries while maintaining rootedness in particular traditions. The challenge lies not in choosing between global integration and cultural preservation but in finding ways to pursue both simultaneously, recognizing that cultural identity remains dynamic rather than fixed, continuously evolving through encounter with difference while retaining connections to the past.",
            translation: "세계화의 문화적 차원을 탐색하려면 기회와 위험을 모두 인정해야 합니다. 언어 보존 프로그램, 지역 예술 지원, 전통 지식 보호를 통한 문화적 다양성을 촉진하는 정책은 글로벌 통합에 반대하기보다는 보완할 수 있습니다. 글로벌 역량과 지역 유산에 대한 깊은 감사를 모두 배양하는 교육 시스템은 개인이 특정 전통에 뿌리를 유지하면서 문화적 경계를 넘어 의미 있게 참여할 수 있는 유연한 정체성을 개발하도록 돕습니다. 과제는 글로벌 통합과 문화 보존 사이에서 선택하는 것이 아니라 두 가지를 동시에 추구하는 방법을 찾는 것이며, 문화적 정체성은 고정되어 있지 않고 과거와의 연결을 유지하면서 차이와의 만남을 통해 지속적으로 진화하는 역동적인 것임을 인식하는 것입니다."
          }
        ]
      },
      {
        title: "The Neuroscience of Memory and Learning",
        content: "Memory, the capacity to encode, store, and retrieve information, lies at the foundation of learning and personal identity. Neuroscience research over recent decades has dramatically advanced understanding of memory's biological mechanisms, revealing complex processes involving multiple brain regions and diverse cellular and molecular changes. This knowledge offers insights into how education can be optimized and provides hope for addressing memory-related disorders.\n\nMemory is not a unitary phenomenon but comprises several distinct systems. Declarative memory handles facts and events consciously recalled, subdividing into semantic memory for general knowledge and episodic memory for personal experiences. Procedural memory governs skills and habits performed automatically without conscious awareness, like riding a bicycle. Working memory temporarily holds and manipulates information during cognitive tasks. These systems involve different neural circuits, though they interact in complex ways.\n\nThe process begins with encoding, when sensory information transforms into neural representations. Attention plays a crucial role—information receiving focused attention encodes more effectively than information processed peripherally. The hippocampus, a seahorse-shaped structure deep within the temporal lobe, is essential for forming new declarative memories. Research on patient H.M., who underwent bilateral hippocampal removal to treat epilepsy, revealed that while he could form new procedural memories, he couldn't create new declarative memories, demonstrating these systems' anatomical separation.\n\nConsolidation, the process stabilizing newly encoded memories, unfolds across different timescales. Synaptic consolidation occurs within hours as connections between neurons strengthen through molecular changes. Systems consolidation, unfolding over weeks to years, involves gradual transfer of memory representations from the hippocampus to cortical areas, making them increasingly independent of hippocampal support. Sleep plays a vital role in consolidation, with particular sleep stages associated with different memory types—slow-wave sleep for declarative memories and REM sleep for procedural memories.\n\nAt the cellular level, learning induces long-term potentiation (LTP), a persistent strengthening of synaptic connections between neurons. When neurons fire together repeatedly, their connection strengthens, embodying Hebb's principle: \"neurons that fire together wire together.\" These changes involve complex cascades of molecular events, including altered gene expression and protein synthesis, ultimately modifying synaptic structure. Conversely, long-term depression (LTD) weakens synaptic connections, providing mechanisms for forgetting and memory refinement.\n\nMemory retrieval involves reactivating neural patterns established during encoding. Rather than passively reading stored information like accessing computer files, retrieval is an active reconstruction process. Each retrieval episode can modify the memory through reconsolidation, potentially strengthening it but also introducing distortions. This malleability explains why eyewitness testimony can be unreliable and why therapeutic interventions during reconsolidation might reduce traumatic memories' emotional intensity.\n\nUnderstanding memory's neurobiology informs educational practices. Spaced repetition—distributing learning episodes over time—proves more effective than massed practice because it exploits consolidation processes. Retrieval practice, testing oneself on material, strengthens memory more effectively than passive rereading through reconsolidation mechanisms. Emotional arousal modulates memory encoding via amygdala interactions with hippocampus, explaining why emotionally significant events are remembered more vividly.\n\nThis research also guides development of interventions for memory disorders. Alzheimer's disease, characterized by progressive memory loss, involves hippocampal and cortical degeneration. Understanding molecular mechanisms underlying memory formation and maintenance suggests potential therapeutic targets, though translating neuroscientific insights into effective treatments remains challenging. As techniques for studying the brain advance—from functional neuroimaging to optogenetics allowing precise neural circuit manipulation—our understanding of memory's complexities will deepen, potentially yielding new approaches to enhance learning and address memory dysfunction.",
        contentType: "essay",
        difficulty: 5,
        wordCount: 600,
        estimatedTime: 360,
        paragraphs: [
          {
            text: "Memory, the capacity to encode, store, and retrieve information, lies at the foundation of learning and personal identity. Neuroscience research over recent decades has dramatically advanced understanding of memory's biological mechanisms, revealing complex processes involving multiple brain regions and diverse cellular and molecular changes. This knowledge offers insights into how education can be optimized and provides hope for addressing memory-related disorders.",
            translation: "정보를 암호화, 저장 및 검색하는 능력인 기억은 학습과 개인 정체성의 기초에 있습니다. 최근 수십 년간의 신경과학 연구는 기억의 생물학적 메커니즘에 대한 이해를 극적으로 향상시켜 여러 뇌 영역과 다양한 세포 및 분자 변화를 포함하는 복잡한 과정을 밝혀냈습니다. 이 지식은 교육이 어떻게 최적화될 수 있는지에 대한 통찰력을 제공하고 기억 관련 장애를 해결하기 위한 희망을 제공합니다."
          },
          {
            text: "Memory is not a unitary phenomenon but comprises several distinct systems. Declarative memory handles facts and events consciously recalled, subdividing into semantic memory for general knowledge and episodic memory for personal experiences. Procedural memory governs skills and habits performed automatically without conscious awareness, like riding a bicycle. Working memory temporarily holds and manipulates information during cognitive tasks. These systems involve different neural circuits, though they interact in complex ways.",
            translation: "기억은 단일한 현상이 아니라 여러 독특한 시스템으로 구성됩니다. 선언적 기억은 의식적으로 회상되는 사실과 사건을 처리하며 일반 지식을 위한 의미 기억과 개인적 경험을 위한 일화 기억으로 세분화됩니다. 절차적 기억은 자전거 타기와 같이 의식적 인식 없이 자동으로 수행되는 기술과 습관을 지배합니다. 작업 기억은 인지 작업 중에 정보를 일시적으로 보유하고 조작합니다. 이러한 시스템은 복잡한 방식으로 상호 작용하지만 다른 신경 회로를 포함합니다."
          },
          {
            text: "The process begins with encoding, when sensory information transforms into neural representations. Attention plays a crucial role—information receiving focused attention encodes more effectively than information processed peripherally. The hippocampus, a seahorse-shaped structure deep within the temporal lobe, is essential for forming new declarative memories. Research on patient H.M., who underwent bilateral hippocampal removal to treat epilepsy, revealed that while he could form new procedural memories, he couldn't create new declarative memories, demonstrating these systems' anatomical separation.",
            translation: "과정은 감각 정보가 신경 표현으로 변환되는 인코딩으로 시작됩니다. 주의는 중요한 역할을 합니다—집중된 주의를 받는 정보는 주변에서 처리되는 정보보다 더 효과적으로 인코딩됩니다. 측두엽 깊숙이 있는 해마 모양의 구조인 해마는 새로운 선언적 기억을 형성하는 데 필수적입니다. 간질 치료를 위해 양측 해마 제거를 받은 환자 H.M.에 대한 연구는 그가 새로운 절차적 기억을 형성할 수 있었지만 새로운 선언적 기억을 만들 수 없었음을 밝혀 이러한 시스템의 해부학적 분리를 보여주었습니다."
          },
          {
            text: "Consolidation, the process stabilizing newly encoded memories, unfolds across different timescales. Synaptic consolidation occurs within hours as connections between neurons strengthen through molecular changes. Systems consolidation, unfolding over weeks to years, involves gradual transfer of memory representations from the hippocampus to cortical areas, making them increasingly independent of hippocampal support. Sleep plays a vital role in consolidation, with particular sleep stages associated with different memory types—slow-wave sleep for declarative memories and REM sleep for procedural memories.",
            translation: "새로 인코딩된 기억을 안정화하는 과정인 통합은 다양한 시간대에 걸쳐 전개됩니다. 시냅스 통합은 분자 변화를 통해 뉴런 간의 연결이 강화되면서 몇 시간 내에 발생합니다. 몇 주에서 몇 년에 걸쳐 전개되는 시스템 통합은 해마에서 피질 영역으로 기억 표현을 점진적으로 전달하여 해마 지원으로부터 점점 더 독립적으로 만듭니다. 수면은 통합에서 중요한 역할을 하며 특정 수면 단계는 다양한 기억 유형과 관련이 있습니다—선언적 기억을 위한 서파 수면과 절차적 기억을 위한 REM 수면."
          },
          {
            text: "At the cellular level, learning induces long-term potentiation (LTP), a persistent strengthening of synaptic connections between neurons. When neurons fire together repeatedly, their connection strengthens, embodying Hebb's principle: \"neurons that fire together wire together.\" These changes involve complex cascades of molecular events, including altered gene expression and protein synthesis, ultimately modifying synaptic structure. Conversely, long-term depression (LTD) weakens synaptic connections, providing mechanisms for forgetting and memory refinement.",
            translation: "세포 수준에서 학습은 뉴런 간의 시냅스 연결의 지속적인 강화인 장기 강화(LTP)를 유도합니다. 뉴런이 반복적으로 함께 발화할 때 연결이 강화되며, 헵의 원칙을 구현합니다: \"함께 발화하는 뉴런은 함께 배선됩니다.\" 이러한 변화는 변경된 유전자 발현과 단백질 합성을 포함하는 복잡한 분자 사건의 연쇄를 포함하며 궁극적으로 시냅스 구조를 수정합니다. 반대로 장기 억제(LTD)는 시냅스 연결을 약화시켜 망각과 기억 정제를 위한 메커니즘을 제공합니다."
          },
          {
            text: "Memory retrieval involves reactivating neural patterns established during encoding. Rather than passively reading stored information like accessing computer files, retrieval is an active reconstruction process. Each retrieval episode can modify the memory through reconsolidation, potentially strengthening it but also introducing distortions. This malleability explains why eyewitness testimony can be unreliable and why therapeutic interventions during reconsolidation might reduce traumatic memories' emotional intensity.",
            translation: "기억 검색은 인코딩 중에 확립된 신경 패턴을 재활성화하는 것을 포함합니다. 컴퓨터 파일에 액세스하는 것처럼 저장된 정보를 수동적으로 읽는 것이 아니라 검색은 능동적인 재구성 과정입니다. 각 검색 에피소드는 재통합을 통해 기억을 수정하여 잠재적으로 강화할 수 있지만 왜곡을 도입할 수도 있습니다. 이러한 가소성은 목격자 증언이 신뢰할 수 없는 이유와 재통합 중 치료적 개입이 외상 기억의 감정적 강도를 줄일 수 있는 이유를 설명합니다."
          },
          {
            text: "Understanding memory's neurobiology informs educational practices. Spaced repetition—distributing learning episodes over time—proves more effective than massed practice because it exploits consolidation processes. Retrieval practice, testing oneself on material, strengthens memory more effectively than passive rereading through reconsolidation mechanisms. Emotional arousal modulates memory encoding via amygdala interactions with hippocampus, explaining why emotionally significant events are remembered more vividly.",
            translation: "기억의 신경생물학을 이해하면 교육 관행에 정보를 제공합니다. 학습 에피소드를 시간에 걸쳐 분산시키는 간격 반복은 통합 과정을 활용하기 때문에 집중 연습보다 더 효과적임이 입증되었습니다. 재료에 대해 스스로를 테스트하는 검색 연습은 재통합 메커니즘을 통해 수동적인 재독보다 기억을 더 효과적으로 강화합니다. 감정적 각성은 해마와의 편도체 상호 작용을 통해 기억 인코딩을 조절하여 감정적으로 중요한 사건이 더 생생하게 기억되는 이유를 설명합니다."
          },
          {
            text: "This research also guides development of interventions for memory disorders. Alzheimer's disease, characterized by progressive memory loss, involves hippocampal and cortical degeneration. Understanding molecular mechanisms underlying memory formation and maintenance suggests potential therapeutic targets, though translating neuroscientific insights into effective treatments remains challenging. As techniques for studying the brain advance—from functional neuroimaging to optogenetics allowing precise neural circuit manipulation—our understanding of memory's complexities will deepen, potentially yielding new approaches to enhance learning and address memory dysfunction.",
            translation: "이 연구는 또한 기억 장애에 대한 개입 개발을 안내합니다. 진행성 기억 상실을 특징으로 하는 알츠하이머병은 해마 및 피질 퇴행을 포함합니다. 기억 형성 및 유지의 기본 분자 메커니즘을 이해하면 잠재적인 치료 표적을 제안하지만 신경과학적 통찰력을 효과적인 치료로 번역하는 것은 여전히 ​​어렵습니다. 뇌를 연구하는 기술이 발전함에 따라—기능적 신경 영상에서 정확한 신경 회로 조작을 허용하는 광유전학에 이르기까지—기억의 복잡성에 대한 우리의 이해는 깊어질 것이며 학습을 향상시키고 기억 장애를 해결하는 새로운 접근 방식을 잠재적으로 제공할 것입니다."
          }
        ]
      },
      {
        title: "Climate Change: Science, Politics, and Action",
        content: "Climate change represents one of humanity's most pressing challenges, demanding coordinated global action informed by scientific understanding. The evidence for anthropogenic climate change—warming driven by human activities—has become overwhelming, yet translating scientific consensus into effective policy remains fraught with political, economic, and social complexities.\n\nThe scientific foundation is robust. Atmospheric carbon dioxide concentrations have risen from pre-industrial levels of approximately 280 parts per million to over 420 ppm today, primarily from burning fossil fuels and deforestation. This greenhouse gas traps heat, increasing global average temperatures by more than 1.1°C since the late 19th century. Multiple independent data sources confirm this warming trend: surface temperature measurements, ocean heat content, shrinking ice sheets and glaciers, and shifting patterns in plant and animal ranges. Climate models, though imperfect, have successfully predicted observed trends and project continued warming absent significant emissions reductions.\n\nThe consequences extend beyond rising temperatures. Increased frequency and intensity of extreme weather events—heat waves, droughts, floods, and hurricanes—exact mounting human and economic tolls. Sea level rise threatens coastal communities through increased flooding and eventual displacement of populations. Ocean acidification, caused by absorbed atmospheric CO2, endangers marine ecosystems, particularly coral reefs and shellfish. Changing precipitation patterns affect agriculture and water resources, potentially exacerbating conflicts and migration pressures. These impacts fall disproportionately on vulnerable populations and developing nations with limited adaptive capacity, raising profound questions of environmental justice.\n\nAddressing climate change requires transitioning from fossil fuels to renewable energy sources, improving energy efficiency, and developing carbon capture technologies. However, implementation faces substantial obstacles. Fossil fuel interests wield significant political influence, often funding disinformation campaigns questioning climate science. Economic concerns about transition costs generate resistance, particularly in regions dependent on fossil fuel industries. International cooperation proves difficult given unequal historical contributions to emissions and current development needs—developed nations bear primary responsibility for accumulated emissions yet demand developing nations also curtail growth.\n\nPolitical polarization, particularly in the United States, has transformed climate change into a partisan issue rather than a scientific question. This politicization hampers policy development as parties prioritize ideological positions over empirical evidence. Short political cycles incentivize focus on immediate concerns over long-term risks, while diffuse benefits of emissions reduction contrast with concentrated costs borne by specific industries and communities.\n\nDespite these challenges, progress emerges. Renewable energy costs have plummeted, making solar and wind competitive with fossil fuels in many contexts. Electric vehicle adoption accelerates as technology improves and prices decline. Hundreds of cities and numerous countries have pledged carbon neutrality targets. Youth-led movements and growing public awareness pressure governments and corporations toward climate action.\n\nUltimately, addressing climate change requires acknowledging its fundamentally interdisciplinary nature—scientific understanding must inform policy, but implementation depends on navigating political realities, economic transitions, and social values. The window for preventing most severe impacts narrows, demanding urgent action balancing ambitious emissions reductions with adaptation to unavoidable changes. Success requires both technological innovation and societal transformation—shifting energy systems, consumption patterns, and perhaps fundamental assumptions about perpetual economic growth. The challenge is immense, but the costs of inaction far exceed those of decisive response.",
        contentType: "essay",
        difficulty: 5,
        wordCount: 520,
        estimatedTime: 312,
        paragraphs: [
          {
            text: "Climate change represents one of humanity's most pressing challenges, demanding coordinated global action informed by scientific understanding. The evidence for anthropogenic climate change—warming driven by human activities—has become overwhelming, yet translating scientific consensus into effective policy remains fraught with political, economic, and social complexities.",
            translation: "기후 변화는 인류의 가장 시급한 과제 중 하나를 나타내며 과학적 이해에 기반한 조율된 글로벌 행동을 요구합니다. 인간 활동에 의해 주도되는 인위적 기후 변화에 대한 증거는 압도적이 되었지만 과학적 합의를 효과적인 정책으로 변환하는 것은 정치적, 경제적, 사회적 복잡성으로 가득 차 있습니다."
          },
          {
            text: "The scientific foundation is robust. Atmospheric carbon dioxide concentrations have risen from pre-industrial levels of approximately 280 parts per million to over 420 ppm today, primarily from burning fossil fuels and deforestation. This greenhouse gas traps heat, increasing global average temperatures by more than 1.1°C since the late 19th century. Multiple independent data sources confirm this warming trend: surface temperature measurements, ocean heat content, shrinking ice sheets and glaciers, and shifting patterns in plant and animal ranges. Climate models, though imperfect, have successfully predicted observed trends and project continued warming absent significant emissions reductions.",
            translation: "과학적 기초는 견고합니다. 대기 이산화탄소 농도는 주로 화석 연료 연소와 삼림 벌채로 인해 산업화 이전 수준인 약 280ppm에서 오늘날 420ppm 이상으로 증가했습니다. 이 온실 가스는 열을 가두어 19세기 후반 이후 지구 평균 기온을 1.1°C 이상 증가시켰습니다. 여러 독립적인 데이터 소스가 이러한 온난화 추세를 확인합니다: 표면 온도 측정, 해양 열 함량, 감소하는 빙상과 빙하, 식물과 동물 범위의 변화 패턴. 기후 모델은 불완전하지만 관찰된 추세를 성공적으로 예측했으며 상당한 배출 감소가 없으면 지속적인 온난화를 예측합니다."
          },
          {
            text: "The consequences extend beyond rising temperatures. Increased frequency and intensity of extreme weather events—heat waves, droughts, floods, and hurricanes—exact mounting human and economic tolls. Sea level rise threatens coastal communities through increased flooding and eventual displacement of populations. Ocean acidification, caused by absorbed atmospheric CO2, endangers marine ecosystems, particularly coral reefs and shellfish. Changing precipitation patterns affect agriculture and water resources, potentially exacerbating conflicts and migration pressures. These impacts fall disproportionately on vulnerable populations and developing nations with limited adaptive capacity, raising profound questions of environmental justice.",
            translation: "결과는 상승하는 온도를 넘어 확장됩니다. 열파, 가뭄, 홍수, 허리케인과 같은 극심한 기상 현상의 빈도와 강도 증가는 증가하는 인간 및 경제적 피해를 정확하게 나타냅니다. 해수면 상승은 증가하는 홍수와 결국 인구의 이동을 통해 해안 지역 사회를 위협합니다. 흡수된 대기 CO2로 인한 해양 산성화는 특히 산호초와 조개류와 같은 해양 생태계를 위협합니다. 강수 패턴의 변화는 농업과 수자원에 영향을 미치며 잠재적으로 갈등과 이주 압력을 악화시킵니다. 이러한 영향은 제한된 적응 능력을 가진 취약한 인구와 개발도상국에 불균형적으로 떨어지며 환경 정의에 대한 심오한 질문을 제기합니다."
          },
          {
            text: "Addressing climate change requires transitioning from fossil fuels to renewable energy sources, improving energy efficiency, and developing carbon capture technologies. However, implementation faces substantial obstacles. Fossil fuel interests wield significant political influence, often funding disinformation campaigns questioning climate science. Economic concerns about transition costs generate resistance, particularly in regions dependent on fossil fuel industries. International cooperation proves difficult given unequal historical contributions to emissions and current development needs—developed nations bear primary responsibility for accumulated emissions yet demand developing nations also curtail growth.",
            translation: "기후 변화를 해결하려면 화석 연료에서 재생 에너지원으로 전환하고 에너지 효율성을 개선하며 탄소 포집 기술을 개발해야 합니다. 그러나 구현은 상당한 장애물에 직면합니다. 화석 연료 이익은 종종 기후 과학에 의문을 제기하는 허위 정보 캠페인에 자금을 지원하면서 상당한 정치적 영향력을 행사합니다. 전환 비용에 대한 경제적 우려는 특히 화석 연료 산업에 의존하는 지역에서 저항을 생성합니다. 국제 협력은 배출에 대한 불평등한 역사적 기여와 현재 개발 요구를 고려할 때 어려운 것으로 입증됩니다—선진국은 축적된 배출에 대한 주요 책임을 지지만 개발도상국도 성장을 줄이도록 요구합니다."
          },
          {
            text: "Political polarization, particularly in the United States, has transformed climate change into a partisan issue rather than a scientific question. This politicization hampers policy development as parties prioritize ideological positions over empirical evidence. Short political cycles incentivize focus on immediate concerns over long-term risks, while diffuse benefits of emissions reduction contrast with concentrated costs borne by specific industries and communities.",
            translation: "특히 미국에서의 정치적 양극화는 기후 변화를 과학적 질문이 아닌 당파적 문제로 변화시켰습니다. 이러한 정치화는 정당이 경험적 증거보다 이념적 입장을 우선시함에 따라 정책 개발을 방해합니다. 짧은 정치 주기는 장기 위험보다 즉각적인 우려에 집중하도록 장려하는 반면, 배출 감소의 확산된 이익은 특정 산업과 커뮤니티가 부담하는 집중된 비용과 대조됩니다."
          },
          {
            text: "Despite these challenges, progress emerges. Renewable energy costs have plummeted, making solar and wind competitive with fossil fuels in many contexts. Electric vehicle adoption accelerates as technology improves and prices decline. Hundreds of cities and numerous countries have pledged carbon neutrality targets. Youth-led movements and growing public awareness pressure governments and corporations toward climate action.",
            translation: "이러한 과제에도 불구하고 진전이 나타납니다. 재생 에너지 비용이 급락하여 많은 맥락에서 태양광과 풍력이 화석 연료와 경쟁력을 갖추게 되었습니다. 기술이 개선되고 가격이 하락함에 따라 전기 자동차 채택이 가속화됩니다. 수백 개의 도시와 수많은 국가가 탄소 중립 목표를 약속했습니다. 청년 주도 운동과 증가하는 대중의 인식은 정부와 기업에 기후 행동을 향한 압력을 가합니다."
          },
          {
            text: "Ultimately, addressing climate change requires acknowledging its fundamentally interdisciplinary nature—scientific understanding must inform policy, but implementation depends on navigating political realities, economic transitions, and social values. The window for preventing most severe impacts narrows, demanding urgent action balancing ambitious emissions reductions with adaptation to unavoidable changes. Success requires both technological innovation and societal transformation—shifting energy systems, consumption patterns, and perhaps fundamental assumptions about perpetual economic growth. The challenge is immense, but the costs of inaction far exceed those of decisive response.",
            translation: "궁극적으로 기후 변화를 해결하려면 근본적으로 학제적 성격을 인정해야 합니다—과학적 이해는 정책에 정보를 제공해야 하지만 구현은 정치적 현실, 경제적 전환 및 사회적 가치를 탐색하는 데 달려 있습니다. 가장 심각한 영향을 방지하기 위한 창은 좁아지고 있으며 야심찬 배출 감소와 불가피한 변화에 대한 적응의 균형을 맞추는 긴급한 행동을 요구합니다. 성공에는 기술 혁신과 사회적 변화가 모두 필요합니다—에너지 시스템, 소비 패턴, 그리고 아마도 영구적인 경제 성장에 대한 근본적인 가정을 바꾸는 것. 도전은 엄청나지만 무행동의 비용은 결정적인 대응의 비용을 훨씬 초과합니다."
          }
        ]
      },
      {
        title: "The Philosophy of Consciousness",
        content: "Consciousness—the subjective experience of awareness, thoughts, and sensations—remains one of philosophy's and neuroscience's most profound mysteries. Despite remarkable advances in understanding brain function, explaining how physical processes in neural tissue give rise to subjective experiences, often called qualia, continues to perplex researchers and philosophers. This explanatory gap between objective brain states and subjective experiences constitutes what David Chalmers termed the \"hard problem\" of consciousness.\n\nPhilosophical approaches to consciousness vary dramatically. Dualism, famously associated with René Descartes, posits that mind and matter represent fundamentally different substances—the mental realm of thoughts and experiences exists independently from physical reality. This view faces the interaction problem: if mental and physical are truly separate, how do they causally influence each other, as they clearly seem to do when we decide to move our arm and our arm moves?\n\nMaterialism or physicalism asserts that consciousness emerges from purely physical processes. According to this view, mental states are identical to brain states, or supervene upon them—consciousness arises from neural activity without requiring any non-physical substance. However, critics argue that even complete knowledge of brain function wouldn't necessarily explain subjective experience. Frank Jackson's thought experiment about Mary, a scientist who knows everything about color vision's physics and neuroscience but has lived in a black-and-white room, asks whether she learns something new when experiencing color for the first time. If so, the argument goes, knowledge of physical facts doesn't exhaust knowledge about consciousness.\n\nFunctionalism suggests that mental states should be understood not by their physical composition but by their functional roles—the patterns of inputs, outputs, and relationships to other mental states. Multiple physical systems could implement the same functional organization and thereby have the same mental states. This view supports the theoretical possibility of conscious artificial intelligence if the right functional organization can be replicated in non-biological substrates, though whether this is actually possible remains hotly debated.\n\nPanpsychism offers a radical alternative, proposing that consciousness, or at least proto-conscious properties, exists as a fundamental feature of matter itself. Rather than emerging at some threshold of complexity, consciousness would be ubiquitous, with human consciousness representing a particularly organized instance. While avoiding the emergence problem, panpsychism faces the combination problem: how do micro-level conscious properties combine to create unified macro-level consciousness?\n\nEmpirical neuroscience continues illuminating consciousness's neural correlates—the brain activities associated with conscious experiences. The Global Workspace Theory proposes that consciousness involves information becoming globally available across brain systems through broadcast mechanisms. Integrated Information Theory mathematically characterizes consciousness in terms of how integrated and differentiated a system's information structure is. However, even if we identify all neural correlates, this might not solve the hard problem—correlation doesn't necessarily equal explanation.\n\nThe philosophical puzzle of consciousness has practical implications. Understanding consciousness bears on medical questions about who requires anesthesia or when life support can be ethically withdrawn. It informs debates about animal welfare—which creatures have conscious experiences deserving moral consideration? As artificial intelligence advances, questions about machine consciousness become increasingly urgent, with potential implications for rights and moral status.\n\nSome philosophers question whether the hard problem is genuinely unsolvable or merely reflects limitations in current conceptual frameworks. Perhaps future scientific paradigms will make consciousness seem less mysterious, just as biological understanding demystified life's nature. Others argue consciousness's irreducibly subjective character renders it permanently inaccessible to objective third-person science. This debate touches fundamental questions about knowledge's limits and science's scope—can the methods that successfully explain physical phenomena capture consciousness's first-person dimension, or does consciousness represent a domain where scientific methodology necessarily falls short?",
        contentType: "essay",
        difficulty: 5,
        wordCount: 580,
        estimatedTime: 348,
        paragraphs: [
          {
            text: "Consciousness—the subjective experience of awareness, thoughts, and sensations—remains one of philosophy's and neuroscience's most profound mysteries. Despite remarkable advances in understanding brain function, explaining how physical processes in neural tissue give rise to subjective experiences, often called qualia, continues to perplex researchers and philosophers. This explanatory gap between objective brain states and subjective experiences constitutes what David Chalmers termed the \"hard problem\" of consciousness.",
            translation: "의식—인식, 생각, 감각의 주관적 경험—은 철학과 신경과학의 가장 심오한 미스터리 중 하나로 남아 있습니다. 뇌 기능 이해에 대한 놀라운 진전에도 불구하고 신경 조직의 물리적 과정이 종종 퀄리아라고 불리는 주관적 경험을 어떻게 발생시키는지 설명하는 것은 연구자와 철학자를 계속 당혹스럽게 합니다. 객관적 뇌 상태와 주관적 경험 사이의 이러한 설명 간격은 데이비드 챌머스가 의식의 \"어려운 문제\"라고 명명한 것을 구성합니다."
          },
          {
            text: "Philosophical approaches to consciousness vary dramatically. Dualism, famously associated with René Descartes, posits that mind and matter represent fundamentally different substances—the mental realm of thoughts and experiences exists independently from physical reality. This view faces the interaction problem: if mental and physical are truly separate, how do they causally influence each other, as they clearly seem to do when we decide to move our arm and our arm moves?",
            translation: "의식에 대한 철학적 접근법은 극적으로 다양합니다. 르네 데카르트와 유명하게 연관된 이원론은 마음과 물질이 근본적으로 다른 물질을 나타낸다고 가정합니다—생각과 경험의 정신적 영역은 물리적 현실과 독립적으로 존재합니다. 이 견해는 상호 작용 문제에 직면합니다: 만약 정신과 물리가 진정으로 분리되어 있다면, 우리가 팔을 움직이기로 결정할 때 팔이 움직이는 것처럼 명백히 보이는 것처럼 그들은 어떻게 서로에게 인과적으로 영향을 미칩니까?"
          },
          {
            text: "Materialism or physicalism asserts that consciousness emerges from purely physical processes. According to this view, mental states are identical to brain states, or supervene upon them—consciousness arises from neural activity without requiring any non-physical substance. However, critics argue that even complete knowledge of brain function wouldn't necessarily explain subjective experience. Frank Jackson's thought experiment about Mary, a scientist who knows everything about color vision's physics and neuroscience but has lived in a black-and-white room, asks whether she learns something new when experiencing color for the first time. If so, the argument goes, knowledge of physical facts doesn't exhaust knowledge about consciousness.",
            translation: "유물론 또는 물리주의는 의식이 순전히 물리적 과정에서 나온다고 주장합니다. 이 견해에 따르면 정신 상태는 뇌 상태와 동일하거나 그 위에 있습니다—의식은 비물리적 물질을 필요로 하지 않고 신경 활동에서 발생합니다. 그러나 비평가들은 뇌 기능에 대한 완전한 지식조차도 주관적 경험을 반드시 설명하지는 않을 것이라고 주장합니다. 색각의 물리학과 신경과학에 대해 모든 것을 알고 있지만 흑백 방에서 살았던 과학자 메리에 대한 프랭크 잭슨의 사고 실험은 그녀가 처음으로 색을 경험할 때 새로운 것을 배우는지 묻습니다. 그렇다면, 물리적 사실에 대한 지식은 의식에 대한 지식을 소진하지 않는다는 주장이 나옵니다."
          },
          {
            text: "Functionalism suggests that mental states should be understood not by their physical composition but by their functional roles—the patterns of inputs, outputs, and relationships to other mental states. Multiple physical systems could implement the same functional organization and thereby have the same mental states. This view supports the theoretical possibility of conscious artificial intelligence if the right functional organization can be replicated in non-biological substrates, though whether this is actually possible remains hotly debated.",
            translation: "기능주의는 정신 상태가 물리적 구성이 아니라 기능적 역할—입력, 출력 및 다른 정신 상태와의 관계 패턴으로 이해되어야 한다고 제안합니다. 여러 물리적 시스템이 동일한 기능적 조직을 구현할 수 있으며 따라서 동일한 정신 상태를 가질 수 있습니다. 이 견해는 올바른 기능적 조직이 비생물학적 기질에서 복제될 수 있다면 의식 있는 인공지능의 이론적 가능성을 지원하지만, 이것이 실제로 가능한지는 여전히 뜨겁게 논쟁되고 있습니다."
          },
          {
            text: "Panpsychism offers a radical alternative, proposing that consciousness, or at least proto-conscious properties, exists as a fundamental feature of matter itself. Rather than emerging at some threshold of complexity, consciousness would be ubiquitous, with human consciousness representing a particularly organized instance. While avoiding the emergence problem, panpsychism faces the combination problem: how do micro-level conscious properties combine to create unified macro-level consciousness?",
            translation: "범심론은 의식 또는 적어도 원의식 특성이 물질 자체의 근본적인 특징으로 존재한다고 제안하는 급진적인 대안을 제공합니다. 어떤 복잡성의 임계값에서 나타나는 대신 의식은 어디에나 존재할 것이며 인간의 의식은 특히 조직화된 사례를 나타냅니다. 출현 문제를 피하는 동안 범심론은 결합 문제에 직면합니다: 미시 수준의 의식 특성이 어떻게 결합하여 통합된 거시 수준의 의식을 만드는가?"
          },
          {
            text: "Empirical neuroscience continues illuminating consciousness's neural correlates—the brain activities associated with conscious experiences. The Global Workspace Theory proposes that consciousness involves information becoming globally available across brain systems through broadcast mechanisms. Integrated Information Theory mathematically characterizes consciousness in terms of how integrated and differentiated a system's information structure is. However, even if we identify all neural correlates, this might not solve the hard problem—correlation doesn't necessarily equal explanation.",
            translation: "경험적 신경과학은 의식의 신경 상관물—의식 경험과 관련된 뇌 활동을 계속 조명합니다. 글로벌 작업 공간 이론은 의식이 방송 메커니즘을 통해 뇌 시스템 전체에서 정보가 전 세계적으로 사용 가능하게 되는 것을 포함한다고 제안합니다. 통합 정보 이론은 시스템의 정보 구조가 얼마나 통합되고 차별화되어 있는지에 대해 의식을 수학적으로 특성화합니다. 그러나 우리가 모든 신경 상관물을 식별하더라도 이것은 어려운 문제를 해결하지 못할 수 있습니다—상관 관계는 반드시 설명과 같지 않습니다."
          },
          {
            text: "The philosophical puzzle of consciousness has practical implications. Understanding consciousness bears on medical questions about who requires anesthesia or when life support can be ethically withdrawn. It informs debates about animal welfare—which creatures have conscious experiences deserving moral consideration? As artificial intelligence advances, questions about machine consciousness become increasingly urgent, with potential implications for rights and moral status.",
            translation: "의식의 철학적 퍼즐은 실질적인 함의를 가지고 있습니다. 의식을 이해하는 것은 누가 마취가 필요한지 또는 생명 유지 장치를 윤리적으로 철회할 수 있는지에 대한 의학적 질문과 관련이 있습니다. 동물 복지에 대한 논쟁에 정보를 제공합니다—어떤 생물이 도덕적 고려를 받을 만한 의식 경험을 가지고 있습니까? 인공지능이 발전함에 따라 기계 의식에 대한 질문은 권리와 도덕적 지위에 대한 잠재적 함의와 함께 점점 더 긴급해지고 있습니다."
          },
          {
            text: "Some philosophers question whether the hard problem is genuinely unsolvable or merely reflects limitations in current conceptual frameworks. Perhaps future scientific paradigms will make consciousness seem less mysterious, just as biological understanding demystified life's nature. Others argue consciousness's irreducibly subjective character renders it permanently inaccessible to objective third-person science. This debate touches fundamental questions about knowledge's limits and science's scope—can the methods that successfully explain physical phenomena capture consciousness's first-person dimension, or does consciousness represent a domain where scientific methodology necessarily falls short?",
            translation: "일부 철학자들은 어려운 문제가 진정으로 해결 불가능한지 아니면 단순히 현재 개념적 틀의 한계를 반영하는지 의문을 제기합니다. 아마도 미래의 과학적 패러다임은 생물학적 이해가 생명의 본질을 신비롭지 않게 만든 것처럼 의식을 덜 신비롭게 보이게 할 것입니다. 다른 사람들은 의식의 환원 불가능하게 주관적인 특성이 객관적인 3인칭 과학에 영구적으로 접근할 수 없게 만든다고 주장합니다. 이 논쟁은 지식의 한계와 과학의 범위에 대한 근본적인 질문을 다룹니다—물리적 현상을 성공적으로 설명하는 방법이 의식의 1인칭 차원을 포착할 수 있습니까, 아니면 의식은 과학적 방법론이 반드시 부족한 영역을 나타냅니까?"
          }
        ]
      },
      {
        title: "Economic Inequality and Social Mobility",
        content: "Economic inequality—the uneven distribution of wealth and income within populations—has intensified in many countries over recent decades, prompting debates about its causes, consequences, and appropriate policy responses. Understanding inequality requires examining not just disparities at single points in time but also patterns of social mobility—the ability of individuals to move between economic strata across their lifetimes or across generations.\n\nMultiple factors contribute to rising inequality. Technological change has increased demand for skilled workers while automating routine tasks, widening wage gaps between educational levels. Globalization enables corporations to source labor globally, intensifying competition for jobs while concentrating profits among capital owners and executives. Union membership's decline has weakened workers' bargaining power. Tax policies in many jurisdictions have become less progressive, reducing redistribution's effectiveness. Financial deregulation facilitated wealth accumulation among top earners while contributing to instability that disproportionately harms lower-income populations during economic crises.\n\nInequality's consequences extend beyond material disparities. Health outcomes correlate strongly with socioeconomic status, with lower-income individuals experiencing higher rates of chronic disease, lower life expectancy, and reduced access to quality healthcare. Educational opportunities, despite meritocratic ideals, remain stratified—children from wealthy families access better schools, supplementary resources, and social networks facilitating success. Political influence increasingly concentrates among the wealthy through campaign contributions and lobbying, potentially skewing policy toward elite interests. High inequality may also erode social cohesion, fostering resentment and reducing trust across groups.\n\nSocial mobility—the prospect that individual effort and talent can overcome initial disadvantages—represents a crucial dimension of inequality's impact. Perfect equality of outcomes may be neither achievable nor desirable, but equality of opportunity remains a widely endorsed principle. However, evidence suggests mobility has stagnated or declined in many developed nations. Parental income increasingly predicts children's economic outcomes, suggesting structural barriers impede movement. Geographic segregation by income means children grow up in vastly different environments with unequal access to quality education, safe neighborhoods, and employment networks.\n\nDebates about addressing inequality involve competing philosophical frameworks and practical considerations. Libertarian perspectives emphasize individual freedom and property rights, viewing redistribution as unjust coercion. If wealth was acquired legitimately through voluntary exchange, what justifies forcible transfer to others? From this view, inequality matters less than ensuring fair processes—protecting property rights, preventing fraud, and maintaining competitive markets.\n\nEgalitarian approaches prioritize reducing disparities themselves, arguing that extreme inequality undermines fundamental equality among persons. John Rawls's influential theory suggests just institutions should benefit the least advantaged. If inequalities don't improve everyone's position—particularly those at the bottom—they lack justification. Capabilities approaches, associated with Amartya Sen and Martha Nussbaum, focus not on resources per se but on what resources enable people to do and become. Inequality becomes problematic when it prevents people from developing essential human capabilities.\n\nPolicy interventions addressing inequality include progressive taxation, where higher earners pay larger percentage shares; robust social safety nets providing healthcare, education, and income support; minimum wage laws; investment in public education and early childhood programs; antitrust enforcement preventing excessive market concentration; and labor regulations strengthening worker bargaining power. However, each faces challenges. High taxation may reduce work incentives or drive capital to lower-tax jurisdictions. Generous welfare systems risk creating dependency. Minimum wages might decrease employment. These tradeoffs require careful empirical analysis and value judgments about acceptable balances.\n\nMoreover, effective policy depends on accurate diagnosis. If inequality primarily reflects technological trends, education and training investments might help. If market power concentration drives it, antitrust enforcement becomes crucial. If inheritance of wealth and advantage across generations limits mobility, estate taxes and universal early education could address root causes. As economic structures continue evolving, particularly with artificial intelligence's potential labor market impacts, questions about distribution, fairness, and opportunity will remain central to political economy and social policy.",
        contentType: "essay",
        difficulty: 5,
        wordCount: 650,
        estimatedTime: 390,
        paragraphs: [
          {
            text: "Economic inequality—the uneven distribution of wealth and income within populations—has intensified in many countries over recent decades, prompting debates about its causes, consequences, and appropriate policy responses. Understanding inequality requires examining not just disparities at single points in time but also patterns of social mobility—the ability of individuals to move between economic strata across their lifetimes or across generations.",
            translation: "경제적 불평등—인구 내 부와 소득의 불균등한 분배—은 최근 수십 년 동안 많은 국가에서 심화되어 그 원인, 결과 및 적절한 정책 대응에 대한 논쟁을 촉발했습니다. 불평등을 이해하려면 단일 시점의 격차뿐만 아니라 사회적 이동성의 패턴—개인이 평생 동안 또는 세대 간에 경제적 계층 사이를 이동할 수 있는 능력도 조사해야 합니다."
          },
          {
            text: "Multiple factors contribute to rising inequality. Technological change has increased demand for skilled workers while automating routine tasks, widening wage gaps between educational levels. Globalization enables corporations to source labor globally, intensifying competition for jobs while concentrating profits among capital owners and executives. Union membership's decline has weakened workers' bargaining power. Tax policies in many jurisdictions have become less progressive, reducing redistribution's effectiveness. Financial deregulation facilitated wealth accumulation among top earners while contributing to instability that disproportionately harms lower-income populations during economic crises.",
            translation: "여러 요인이 증가하는 불평등에 기여합니다. 기술 변화는 일상적인 작업을 자동화하면서 숙련된 근로자에 대한 수요를 증가시켜 교육 수준 간 임금 격차를 넓혔습니다. 세계화는 기업이 전 세계적으로 노동력을 조달할 수 있게 하여 일자리 경쟁을 강화하는 동시에 자본 소유자와 임원들 사이에 이익을 집중시킵니다. 노조 회원 수의 감소는 근로자의 교섭력을 약화시켰습니다. 많은 관할권의 세금 정책은 덜 진보적이 되어 재분배의 효과를 감소시켰습니다. 금융 규제 완화는 최고 소득자들 사이에서 부의 축적을 촉진하는 동시에 경제 위기 동안 저소득층에 불균형적으로 해를 끼치는 불안정에 기여했습니다."
          },
          {
            text: "Inequality's consequences extend beyond material disparities. Health outcomes correlate strongly with socioeconomic status, with lower-income individuals experiencing higher rates of chronic disease, lower life expectancy, and reduced access to quality healthcare. Educational opportunities, despite meritocratic ideals, remain stratified—children from wealthy families access better schools, supplementary resources, and social networks facilitating success. Political influence increasingly concentrates among the wealthy through campaign contributions and lobbying, potentially skewing policy toward elite interests. High inequality may also erode social cohesion, fostering resentment and reducing trust across groups.",
            translation: "불평등의 결과는 물질적 격차를 넘어 확장됩니다. 건강 결과는 사회경제적 지위와 강하게 상관관계가 있으며, 저소득 개인은 만성 질환의 비율이 높고 기대 수명이 낮으며 양질의 의료 서비스에 대한 접근이 줄어듭니다. 교육 기회는 능력주의 이상에도 불구하고 계층화된 상태로 남아 있습니다—부유한 가정의 자녀들은 더 나은 학교, 보충 자원, 성공을 촉진하는 사회적 네트워크에 접근합니다. 정치적 영향력은 캠페인 기부와 로비를 통해 부유한 사람들 사이에 점점 더 집중되어 잠재적으로 정책을 엘리트 이익으로 기울게 합니다. 높은 불평등은 또한 사회적 응집력을 침식하여 그룹 간에 분노를 조장하고 신뢰를 줄일 수 있습니다."
          },
          {
            text: "Social mobility—the prospect that individual effort and talent can overcome initial disadvantages—represents a crucial dimension of inequality's impact. Perfect equality of outcomes may be neither achievable nor desirable, but equality of opportunity remains a widely endorsed principle. However, evidence suggests mobility has stagnated or declined in many developed nations. Parental income increasingly predicts children's economic outcomes, suggesting structural barriers impede movement. Geographic segregation by income means children grow up in vastly different environments with unequal access to quality education, safe neighborhoods, and employment networks.",
            translation: "사회적 이동성—개인의 노력과 재능이 초기 불이익을 극복할 수 있다는 전망—은 불평등의 영향의 중요한 차원을 나타냅니다. 결과의 완벽한 평등은 달성 가능하지도 바람직하지도 않을 수 있지만, 기회의 평등은 널리 지지받는 원칙으로 남아 있습니다. 그러나 증거는 많은 선진국에서 이동성이 정체되거나 감소했음을 시사합니다. 부모의 소득은 점점 더 자녀의 경제적 결과를 예측하며, 구조적 장벽이 이동을 방해한다는 것을 시사합니다. 소득에 의한 지리적 분리는 자녀들이 양질의 교육, 안전한 이웃, 고용 네트워크에 대한 불평등한 접근으로 매우 다른 환경에서 성장한다는 것을 의미합니다."
          },
          {
            text: "Debates about addressing inequality involve competing philosophical frameworks and practical considerations. Libertarian perspectives emphasize individual freedom and property rights, viewing redistribution as unjust coercion. If wealth was acquired legitimately through voluntary exchange, what justifies forcible transfer to others? From this view, inequality matters less than ensuring fair processes—protecting property rights, preventing fraud, and maintaining competitive markets.",
            translation: "불평등을 해결하는 것에 대한 논쟁은 경쟁하는 철학적 틀과 실질적 고려 사항을 포함합니다. 자유주의적 관점은 개인의 자유와 재산권을 강조하며 재분배를 부당한 강압으로 봅니다. 만약 부가 자발적 교환을 통해 합법적으로 획득되었다면, 다른 사람에게 강제 이전을 정당화하는 것은 무엇입니까? 이 관점에서 불평등은 공정한 과정을 보장하는 것보다 덜 중요합니다—재산권 보호, 사기 방지, 경쟁 시장 유지."
          },
          {
            text: "Egalitarian approaches prioritize reducing disparities themselves, arguing that extreme inequality undermines fundamental equality among persons. John Rawls's influential theory suggests just institutions should benefit the least advantaged. If inequalities don't improve everyone's position—particularly those at the bottom—they lack justification. Capabilities approaches, associated with Amartya Sen and Martha Nussbaum, focus not on resources per se but on what resources enable people to do and become. Inequality becomes problematic when it prevents people from developing essential human capabilities.",
            translation: "평등주의적 접근법은 극단적인 불평등이 사람들 사이의 근본적인 평등을 훼손한다고 주장하면서 격차 자체를 줄이는 것을 우선시합니다. 존 롤스의 영향력 있는 이론은 정의로운 제도가 가장 불리한 사람들에게 이익이 되어야 한다고 제안합니다. 불평등이 모든 사람의 위치를 개선하지 않으면—특히 맨 아래에 있는 사람들—정당화가 부족합니다. 아마티아 센과 마르타 누스바움과 관련된 역량 접근법은 자원 자체가 아니라 자원이 사람들이 무엇을 할 수 있고 무엇이 될 수 있게 하는지에 초점을 맞춥니다. 불평등은 사람들이 필수적인 인간 역량을 개발하는 것을 방해할 때 문제가 됩니다."
          },
          {
            text: "Policy interventions addressing inequality include progressive taxation, where higher earners pay larger percentage shares; robust social safety nets providing healthcare, education, and income support; minimum wage laws; investment in public education and early childhood programs; antitrust enforcement preventing excessive market concentration; and labor regulations strengthening worker bargaining power. However, each faces challenges. High taxation may reduce work incentives or drive capital to lower-tax jurisdictions. Generous welfare systems risk creating dependency. Minimum wages might decrease employment. These tradeoffs require careful empirical analysis and value judgments about acceptable balances.",
            translation: "불평등을 해결하는 정책 개입에는 고소득자가 더 큰 비율의 몫을 지불하는 누진세가 포함됩니다. 의료, 교육 및 소득 지원을 제공하는 강력한 사회 안전망; 최저 임금법; 공교육 및 조기 아동 프로그램에 대한 투자; 과도한 시장 집중을 방지하는 독점 금지 집행; 그리고 근로자 교섭력을 강화하는 노동 규제. 그러나 각각은 과제에 직면합니다. 높은 세금은 근로 인센티브를 줄이거나 자본을 낮은 세금 관할권으로 몰아갈 수 있습니다. 관대한 복지 시스템은 의존성을 만들 위험이 있습니다. 최저 임금은 고용을 줄일 수 있습니다. 이러한 트레이드오프는 신중한 경험적 분석과 허용 가능한 균형에 대한 가치 판단이 필요합니다."
          },
          {
            text: "Moreover, effective policy depends on accurate diagnosis. If inequality primarily reflects technological trends, education and training investments might help. If market power concentration drives it, antitrust enforcement becomes crucial. If inheritance of wealth and advantage across generations limits mobility, estate taxes and universal early education could address root causes. As economic structures continue evolving, particularly with artificial intelligence's potential labor market impacts, questions about distribution, fairness, and opportunity will remain central to political economy and social policy.",
            translation: "게다가 효과적인 정책은 정확한 진단에 달려 있습니다. 불평등이 주로 기술 동향을 반영한다면 교육 및 훈련 투자가 도움이 될 수 있습니다. 시장 권력 집중이 이를 주도한다면 독점 금지 집행이 중요해집니다. 세대 간 부와 이점의 상속이 이동성을 제한한다면 상속세와 보편적인 조기 교육이 근본 원인을 해결할 수 있습니다. 경제 구조가 계속 진화함에 따라 특히 인공지능의 잠재적인 노동 시장 영향과 함께 분배, 공정성 및 기회에 대한 질문은 정치 경제와 사회 정책의 중심으로 남을 것입니다."
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
      },
      
      // Additional Topics - 난이도별/카테고리별 추가
      {
        title: "Brief Self-Introduction",
        description: "매우 간단한 자기소개 작성하기 (10단어 이내)",
        category: "story",
        difficulty: 1,
        prompt: "Write a very brief self-introduction in 10 words or less. Include your name and occupation.",
        guidelines: [
          "State your name clearly",
          "Mention your job or role",
          "Use simple, short words",
          "Maximum 10 words",
          "Keep each sentence short"
        ],
        wordCountMin: 5,
        wordCountMax: 10
      },
      {
        title: "Meeting Schedule Email",
        description: "직장 동료에게 미팅 일정 연락하기",
        category: "email",
        difficulty: 2,
        prompt: "Write an email to a colleague to schedule a meeting. Include the purpose, suggested date and time, and ask for confirmation.",
        guidelines: [
          "Use a professional greeting",
          "State the purpose of the meeting",
          "Suggest 2-3 possible times",
          "Mention the meeting location or link",
          "Ask them to confirm their availability",
          "End with a polite closing"
        ],
        wordCountMin: 80,
        wordCountMax: 150
      },
      {
        title: "My Favorite Place",
        description: "내가 가장 좋아하는 장소에 대한 짧은 에세이",
        category: "essay",
        difficulty: 2,
        prompt: "Write a short essay about your favorite place. Describe what it looks like, why you like it, and what you do there.",
        guidelines: [
          "Introduction: Name the place",
          "Body: Describe what it looks like",
          "Explain why it is special to you",
          "Tell what you do there",
          "Conclusion: Sum up your feelings",
          "Use descriptive language"
        ],
        wordCountMin: 100,
        wordCountMax: 180
      },
      {
        title: "Recommendation Letter",
        description: "동료나 학생을 위한 추천서 작성하기",
        category: "letter",
        difficulty: 3,
        prompt: "Write a letter of recommendation for a colleague or student. Describe their strengths, achievements, and why you recommend them.",
        guidelines: [
          "Use formal letter format",
          "Introduce your relationship to the person",
          "Describe their key strengths and skills",
          "Give specific examples of achievements",
          "Explain why you recommend them",
          "Offer to provide more information",
          "Use professional tone"
        ],
        wordCountMin: 150,
        wordCountMax: 250
      },
      {
        title: "Product Review",
        description: "최근 구매한 제품에 대한 리뷰 작성하기",
        category: "review",
        difficulty: 4,
        prompt: "Write a detailed review of a product you recently purchased. Discuss features, pros and cons, value for money, and whether you recommend it.",
        guidelines: [
          "Introduction: Name the product and category",
          "Describe key features and specifications",
          "Discuss what you liked (pros)",
          "Mention any drawbacks (cons)",
          "Compare with similar products if possible",
          "Evaluate value for money",
          "Give a rating and clear recommendation",
          "Use balanced, informative tone"
        ],
        wordCountMin: 200,
        wordCountMax: 300
      },
      {
        title: "Remote Work Opinion",
        description: "재택근무의 장단점에 대한 의견 제시하기",
        category: "opinion",
        difficulty: 5,
        prompt: "Write an opinion essay on remote work. Analyze its benefits and challenges, consider different perspectives, and present your well-reasoned position.",
        guidelines: [
          "Introduction: Define remote work and its growing prevalence",
          "Benefits: Flexibility, work-life balance, reduced commuting",
          "Challenges: Isolation, communication issues, productivity concerns",
          "Impact on different stakeholders (employees, employers, society)",
          "Consider various industries and job types",
          "Present your position with supporting evidence",
          "Conclusion: Future outlook and recommendations",
          "Use persuasive yet balanced language",
          "Support arguments with examples or research"
        ],
        wordCountMin: 300,
        wordCountMax: 500
      },
      
      // Additional topics to reach 40
      {
        title: "Daily Routine Description",
        description: "나의 일상적인 하루 일과 설명하기",
        category: "story",
        difficulty: 1,
        prompt: "Write about your daily routine. Describe what you do from morning to evening.",
        guidelines: [
          "Start with when you wake up",
          "Describe your morning activities",
          "Tell about your afternoon",
          "Mention your evening routine",
          "Use simple present tense",
          "Keep sentences short and clear"
        ],
        wordCountMin: 50,
        wordCountMax: 100
      },
      {
        title: "Favorite Food Description",
        description: "가장 좋아하는 음식에 대한 설명",
        category: "story",
        difficulty: 1,
        prompt: "Write about your favorite food. Describe what it is, how it tastes, and why you like it.",
        guidelines: [
          "Name your favorite food",
          "Describe how it looks",
          "Tell how it tastes",
          "Explain when you eat it",
          "Say why you like it"
        ],
        wordCountMin: 60,
        wordCountMax: 120
      },
      {
        title: "Weekend Plans Email",
        description: "친구에게 주말 계획 알리는 이메일",
        category: "email",
        difficulty: 2,
        prompt: "Write an email to a friend telling them about your weekend plans. Ask if they want to join you.",
        guidelines: [
          "Start with a friendly greeting",
          "Tell them what you plan to do",
          "Mention when and where",
          "Invite them to join",
          "Ask for their response",
          "End with a warm closing"
        ],
        wordCountMin: 80,
        wordCountMax: 150
      },
      {
        title: "Hobby Description",
        description: "취미에 대한 설명",
        category: "story",
        difficulty: 2,
        prompt: "Write about your hobby. Explain what it is, how you got interested, and what you enjoy about it.",
        guidelines: [
          "Introduce your hobby",
          "Tell when you started",
          "Describe what you do",
          "Explain what you enjoy",
          "Mention how often you do it",
          "Conclude with future plans"
        ],
        wordCountMin: 100,
        wordCountMax: 180
      },
      {
        title: "App or Website Review",
        description: "앱이나 웹사이트 리뷰 작성하기",
        category: "review",
        difficulty: 3,
        prompt: "Write a review of an app or website you use regularly. Discuss its features, usability, and value.",
        guidelines: [
          "Name the app/website and its purpose",
          "Describe main features",
          "Discuss ease of use",
          "Mention pros and cons",
          "Compare to alternatives",
          "Give a recommendation and rating"
        ],
        wordCountMin: 150,
        wordCountMax: 250
      },
      {
        title: "Future Career Goals",
        description: "미래 직업 목표에 대한 에세이",
        category: "essay",
        difficulty: 3,
        prompt: "Write an essay about your future career goals. Explain what you want to do and why, and describe the steps you will take to achieve it.",
        guidelines: [
          "Introduction: State your career goal",
          "Explain why you chose this career",
          "Describe required skills and education",
          "Outline your action plan",
          "Discuss potential challenges",
          "Conclusion: Express your commitment"
        ],
        wordCountMin: 150,
        wordCountMax: 250
      },
      {
        title: "Environmental Protection",
        description: "환경 보호의 중요성에 대한 에세이",
        category: "essay",
        difficulty: 4,
        prompt: "Write an essay about the importance of environmental protection. Discuss current issues, why it matters, and what individuals can do.",
        guidelines: [
          "Introduction: State the importance of environment",
          "Current environmental issues",
          "Consequences if we do not act",
          "What individuals can do",
          "What governments should do",
          "Conclusion: Call to action",
          "Support with examples and facts"
        ],
        wordCountMin: 250,
        wordCountMax: 350
      },
      {
        title: "Work-Life Balance",
        description: "일과 삶의 균형에 대한 의견",
        category: "opinion",
        difficulty: 4,
        prompt: "Write an opinion essay about achieving work-life balance in modern society. Discuss challenges and propose solutions.",
        guidelines: [
          "Introduction: Define work-life balance",
          "Why it is important",
          "Current challenges in achieving it",
          "Personal strategies that work",
          "Employer responsibilities",
          "Societal changes needed",
          "Conclusion: Your perspective"
        ],
        wordCountMin: 200,
        wordCountMax: 300
      },
      {
        title: "Digital Privacy Concerns",
        description: "디지털 시대의 개인정보 보호 문제",
        category: "essay",
        difficulty: 5,
        prompt: "Write an analytical essay on digital privacy in the modern age. Examine the threats, analyze trade-offs between convenience and privacy, and propose solutions.",
        guidelines: [
          "Introduction: Context of digital privacy",
          "Current threats (data breaches, surveillance, tracking)",
          "Privacy vs. convenience trade-offs",
          "Analysis of existing regulations (GDPR, etc.)",
          "Corporate responsibilities",
          "Individual protective measures",
          "Conclusion: Future of digital privacy",
          "Use formal academic tone",
          "Reference real examples and cases"
        ],
        wordCountMin: 350,
        wordCountMax: 600
      },
      {
        title: "Healthcare System Reform",
        description: "의료 시스템 개혁에 대한 제안",
        category: "opinion",
        difficulty: 5,
        prompt: "Write a comprehensive opinion essay on healthcare system reform. Compare different models, analyze challenges, and present your reasoned recommendations.",
        guidelines: [
          "Introduction: Current state of healthcare",
          "Different healthcare models (universal, private, mixed)",
          "Strengths and weaknesses of each",
          "Accessibility and affordability issues",
          "Quality of care considerations",
          "Economic implications",
          "Your recommendations with justification",
          "Conclusion: Vision for the future",
          "Use evidence-based arguments"
        ],
        wordCountMin: 300,
        wordCountMax: 500
      },
      {
        title: "Success Story",
        description: "성공한 사람의 이야기 쓰기",
        category: "story",
        difficulty: 3,
        prompt: "Write a story about someone who achieved success through hard work and determination. It can be someone you know or a historical figure.",
        guidelines: [
          "Introduce the person and their goal",
          "Describe the challenges they faced",
          "Tell about their efforts and strategies",
          "Include a turning point or key moment",
          "Describe their achievement",
          "Reflect on lessons learned from their story"
        ],
        wordCountMin: 150,
        wordCountMax: 250
      },
      {
        title: "Cultural Festival Description",
        description: "문화 축제에 대한 설명",
        category: "essay",
        difficulty: 3,
        prompt: "Write an essay describing a cultural festival or celebration from your country or another culture. Explain its significance and traditions.",
        guidelines: [
          "Introduction: Name and introduce the festival",
          "Historical background",
          "Traditional activities and customs",
          "Foods and decorations",
          "Cultural significance",
          "Personal experiences or observations",
          "Conclusion: Why it is important"
        ],
        wordCountMin: 150,
        wordCountMax: 250
      },
      {
        title: "Skills for the Future",
        description: "미래를 위해 필요한 기술들에 대한 에세이",
        category: "essay",
        difficulty: 4,
        prompt: "Write an essay discussing what skills will be most important in the future workplace. Support your arguments with reasoning and examples.",
        guidelines: [
          "Introduction: Changing nature of work",
          "Technical skills (AI, data analysis, etc.)",
          "Soft skills (communication, adaptability)",
          "Importance of continuous learning",
          "Examples from different industries",
          "How to develop these skills",
          "Conclusion: Preparing for the future",
          "Use specific examples"
        ],
        wordCountMin: 250,
        wordCountMax: 350
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

  // Initialize Speaking Scenarios
  private initializeSpeakingScenarios() {
    const scenarios: InsertSpeakingScenario[] = [
      // Scenario 1: Job Interview - Software Developer (Business, 4 steps)
      {
        category: "business",
        title: "Job Interview - Software Developer",
        difficulty: 4,
        estimatedTime: 15,
        description: "소프트웨어 개발자 면접 전 과정을 연습합니다.",
        learningObjectives: [
          "전문적인 자기소개 방법 습득",
          "기술 경험 효과적으로 설명하기",
          "면접 단골 질문에 대응하기"
        ],
        steps: [
          {
            stepNumber: 1,
            title: "면접장 도착 및 첫 인사",
            situation: "면접장에 도착했습니다. 리셉셔니스트가 당신을 맞이합니다.",
            aiRole: "receptionist",
            aiPrompt: "You are a friendly receptionist greeting a job candidate. Welcome them warmly, confirm their appointment, and guide them through check-in process.",
            usefulExpressions: [
              {
                expression: "I have an interview scheduled with...",
                meaning: "...와 면접 약속이 있습니다",
                examples: [
                  "I have an interview scheduled with Mr. Kim at 2 PM.",
                  "I have an interview scheduled with the HR department.",
                  "I have an interview scheduled with your team today."
                ],
                pronunciation: "/aɪ hæv ən ˈɪntərvjuː ˈʃɛdjuːld wɪð/"
              },
              {
                expression: "Thank you for having me.",
                meaning: "초대해 주셔서 감사합니다",
                examples: [
                  "Thank you for having me today.",
                  "Thank you for having me here for this opportunity.",
                  "Thank you for having me, I'm excited to be here."
                ],
                pronunciation: "/θæŋk juː fɔːr ˈhævɪŋ miː/"
              },
              {
                expression: "I'm looking forward to...",
                meaning: "...을 기대하고 있습니다",
                examples: [
                  "I'm looking forward to our discussion.",
                  "I'm looking forward to learning more about the role.",
                  "I'm looking forward to meeting the team."
                ],
                pronunciation: "/aɪm ˈlʊkɪŋ ˈfɔːrwərd tuː/"
              }
            ],
            expectedQuestions: [
              "Good morning! Do you have an appointment?",
              "May I have your name, please?",
              "The interviewer will be with you shortly. Would you like some water?"
            ],
            evaluationCriteria: {
              pronunciation: 30,
              grammar: 20,
              fluency: 20,
              appropriateness: 30
            }
          },
          {
            stepNumber: 2,
            title: "자기소개",
            situation: "면접관이 당신에게 자기소개를 요청합니다.",
            aiRole: "interviewer",
            aiPrompt: "You are a professional interviewer. Ask the candidate to introduce themselves and their background. Listen attentively and ask follow-up questions about their experience.",
            usefulExpressions: [
              {
                expression: "I'd be happy to tell you about myself.",
                meaning: "기꺼이 제 소개를 하겠습니다",
                examples: [
                  "I'd be happy to tell you about myself and my experience.",
                  "I'd be happy to tell you about my background.",
                  "I'd be happy to tell you about my career journey."
                ],
                pronunciation: "/aɪd biː ˈhæpi tuː tɛl juː əˈbaʊt maɪˈsɛlf/"
              },
              {
                expression: "I have X years of experience in...",
                meaning: "...분야에서 X년의 경험이 있습니다",
                examples: [
                  "I have 5 years of experience in software development.",
                  "I have 3 years of experience in frontend technologies.",
                  "I have extensive experience in building scalable applications."
                ],
                pronunciation: "/aɪ hæv ... jɪrz ʌv ɪkˈspɪriəns ɪn/"
              },
              {
                expression: "I specialize in...",
                meaning: "...을 전문으로 합니다",
                examples: [
                  "I specialize in React and TypeScript.",
                  "I specialize in backend development with Node.js.",
                  "I specialize in building user-friendly interfaces."
                ],
                pronunciation: "/aɪ ˈspɛʃəˌlaɪz ɪn/"
              }
            ],
            expectedQuestions: [
              "Tell me about yourself.",
              "What makes you interested in this position?",
              "What are your strongest technical skills?"
            ],
            evaluationCriteria: {
              pronunciation: 25,
              grammar: 25,
              fluency: 25,
              appropriateness: 25
            }
          },
          {
            stepNumber: 3,
            title: "기술 경험 설명",
            situation: "면접관이 당신의 프로젝트 경험에 대해 물어봅니다.",
            aiRole: "interviewer",
            aiPrompt: "You are a technical interviewer. Ask about specific projects they've worked on, technologies used, and challenges faced. Probe deeper into technical details.",
            usefulExpressions: [
              {
                expression: "In my previous role, I worked on...",
                meaning: "이전 직장에서 ...을 진행했습니다",
                examples: [
                  "In my previous role, I worked on a large-scale e-commerce platform.",
                  "In my previous role, I worked on optimizing database performance.",
                  "In my previous role, I worked on implementing new features."
                ],
                pronunciation: "/ɪn maɪ ˈpriviəs roʊl aɪ wɜrkt ɒn/"
              },
              {
                expression: "One of the challenges we faced was...",
                meaning: "우리가 직면한 과제 중 하나는 ...였습니다",
                examples: [
                  "One of the challenges we faced was handling high traffic volumes.",
                  "One of the challenges we faced was integrating legacy systems.",
                  "One of the challenges we faced was meeting tight deadlines."
                ],
                pronunciation: "/wʌn ʌv ðə ˈʧælɪnʤɪz wi feɪst wɒz/"
              },
              {
                expression: "We successfully implemented...",
                meaning: "우리는 성공적으로 ...를 구현했습니다",
                examples: [
                  "We successfully implemented a microservices architecture.",
                  "We successfully implemented real-time notifications.",
                  "We successfully implemented automated testing."
                ],
                pronunciation: "/wi səkˈsɛsfəli ˈɪmpləˌmɛntɪd/"
              }
            ],
            expectedQuestions: [
              "Can you describe a challenging project you've worked on?",
              "What technologies did you use?",
              "How did you overcome the technical challenges?"
            ],
            evaluationCriteria: {
              pronunciation: 20,
              grammar: 30,
              fluency: 25,
              appropriateness: 25
            }
          },
          {
            stepNumber: 4,
            title: "마무리 및 질문",
            situation: "면접이 거의 끝나가며, 면접관이 당신에게 질문할 것이 있는지 묻습니다.",
            aiRole: "interviewer",
            aiPrompt: "You are wrapping up the interview. Ask if the candidate has any questions. Answer their questions about the role, team, or company culture.",
            usefulExpressions: [
              {
                expression: "I have a few questions about...",
                meaning: "...에 대해 몇 가지 질문이 있습니다",
                examples: [
                  "I have a few questions about the team structure.",
                  "I have a few questions about the development process.",
                  "I have a few questions about growth opportunities."
                ],
                pronunciation: "/aɪ hæv ə fjuː ˈkwɛsʧənz əˈbaʊt/"
              },
              {
                expression: "What would a typical day look like?",
                meaning: "일반적인 하루 일과는 어떤가요?",
                examples: [
                  "What would a typical day look like in this role?",
                  "What would a typical day look like for the team?",
                  "What would a typical day look like during sprint planning?"
                ],
                pronunciation: "/wʌt wʊd ə ˈtɪpɪkəl deɪ lʊk laɪk/"
              },
              {
                expression: "Thank you for your time.",
                meaning: "시간 내주셔서 감사합니다",
                examples: [
                  "Thank you for your time today.",
                  "Thank you for your time and consideration.",
                  "Thank you for your time, I really enjoyed our conversation."
                ],
                pronunciation: "/θæŋk juː fɔːr jɔːr taɪm/"
              }
            ],
            expectedQuestions: [
              "Do you have any questions for me?",
              "Is there anything else you'd like to know?",
              "What are the next steps in the process?"
            ],
            evaluationCriteria: {
              pronunciation: 25,
              grammar: 25,
              fluency: 20,
              appropriateness: 30
            }
          }
        ]
      },

      // Scenario 2: Business Meeting (Business, 3 steps)
      {
        category: "business",
        title: "Business Meeting - Project Discussion",
        difficulty: 3,
        estimatedTime: 10,
        description: "프로젝트 진행 상황을 논의하는 비즈니스 미팅을 연습합니다.",
        learningObjectives: [
          "회의 시작과 안건 소개하기",
          "의견 제시 및 동의/반대 표현하기",
          "회의 마무리 및 다음 단계 정리하기"
        ],
        steps: [
          {
            stepNumber: 1,
            title: "회의 시작 및 안건 소개",
            situation: "당신이 프로젝트 리더로서 팀 회의를 시작합니다.",
            aiRole: "team_member",
            aiPrompt: "You are a team member attending a project meeting. Respond to the meeting leader's opening and be ready to discuss the agenda items.",
            usefulExpressions: [
              {
                expression: "Let's get started with...",
                meaning: "...로 시작하겠습니다",
                examples: [
                  "Let's get started with today's agenda.",
                  "Let's get started with the project updates.",
                  "Let's get started with discussing our progress."
                ],
                pronunciation: "/lɛts gɛt ˈstɑrtɪd wɪð/"
              },
              {
                expression: "The main goal of this meeting is...",
                meaning: "이 회의의 주요 목표는 ...입니다",
                examples: [
                  "The main goal of this meeting is to review our timeline.",
                  "The main goal of this meeting is to address current challenges.",
                  "The main goal of this meeting is to plan next quarter."
                ],
                pronunciation: "/ðə meɪn goʊl ʌv ðɪs ˈmitɪŋ ɪz/"
              },
              {
                expression: "Does everyone have the materials?",
                meaning: "모두 자료를 받으셨나요?",
                examples: [
                  "Does everyone have the materials we sent yesterday?",
                  "Does everyone have the presentation slides?",
                  "Does everyone have access to the shared documents?"
                ],
                pronunciation: "/dʌz ˈɛvriˌwʌn hæv ðə məˈtɪriəlz/"
              }
            ],
            expectedQuestions: [
              "Yes, I have all the materials ready.",
              "Could you clarify the first agenda item?",
              "How much time do we have for this meeting?"
            ],
            evaluationCriteria: {
              pronunciation: 25,
              grammar: 25,
              fluency: 25,
              appropriateness: 25
            }
          },
          {
            stepNumber: 2,
            title: "의견 제시 및 토론",
            situation: "팀원들이 프로젝트 진행 상황에 대해 의견을 나눕니다.",
            aiRole: "team_member",
            aiPrompt: "You are a team member sharing your opinion on the project. Express your views, agree or disagree with others professionally.",
            usefulExpressions: [
              {
                expression: "I'd like to suggest that...",
                meaning: "...를 제안하고 싶습니다",
                examples: [
                  "I'd like to suggest that we adjust the timeline.",
                  "I'd like to suggest that we add more resources.",
                  "I'd like to suggest that we try a different approach."
                ],
                pronunciation: "/aɪd laɪk tuː səgˈʤɛst ðæt/"
              },
              {
                expression: "I agree with you on...",
                meaning: "...에 대해 동의합니다",
                examples: [
                  "I agree with you on moving the deadline.",
                  "I agree with you on prioritizing this feature.",
                  "I agree with you on the budget concerns."
                ],
                pronunciation: "/aɪ əˈgri wɪð juː ɒn/"
              },
              {
                expression: "Have we considered...?",
                meaning: "...를 고려해 봤나요?",
                examples: [
                  "Have we considered the client's feedback?",
                  "Have we considered alternative solutions?",
                  "Have we considered the budget implications?"
                ],
                pronunciation: "/hæv wi kənˈsɪdərd/"
              }
            ],
            expectedQuestions: [
              "What do you think about this approach?",
              "Do you see any potential issues?",
              "How can we improve this?"
            ],
            evaluationCriteria: {
              pronunciation: 20,
              grammar: 30,
              fluency: 25,
              appropriateness: 25
            }
          },
          {
            stepNumber: 3,
            title: "회의 마무리 및 액션 아이템",
            situation: "회의를 마무리하며 다음 단계를 정리합니다.",
            aiRole: "team_member",
            aiPrompt: "You are a team member confirming action items and next steps. Make sure you understand your responsibilities.",
            usefulExpressions: [
              {
                expression: "To summarize, we've decided to...",
                meaning: "요약하자면, 우리는 ...로 결정했습니다",
                examples: [
                  "To summarize, we've decided to extend the deadline.",
                  "To summarize, we've decided to hire additional developers.",
                  "To summarize, we've decided to focus on core features first."
                ],
                pronunciation: "/tuː ˈsʌməˌraɪz wiv dɪˈsaɪdɪd tuː/"
              },
              {
                expression: "The next steps are...",
                meaning: "다음 단계는 ...입니다",
                examples: [
                  "The next steps are to review the requirements.",
                  "The next steps are to schedule a client call.",
                  "The next steps are to update the project plan."
                ],
                pronunciation: "/ðə nɛkst stɛps ɑːr/"
              },
              {
                expression: "I'll take care of...",
                meaning: "제가 ...를 처리하겠습니다",
                examples: [
                  "I'll take care of updating the documentation.",
                  "I'll take care of contacting the vendors.",
                  "I'll take care of scheduling the follow-up meeting."
                ],
                pronunciation: "/aɪl teɪk kɛr ʌv/"
              }
            ],
            expectedQuestions: [
              "When is our next meeting?",
              "Who will handle the client communication?",
              "What's the deadline for these action items?"
            ],
            evaluationCriteria: {
              pronunciation: 25,
              grammar: 25,
              fluency: 25,
              appropriateness: 25
            }
          }
        ]
      },

      // Scenario 3: Airport Check-in (Travel, 4 steps)
      {
        category: "travel",
        title: "Airport Check-in",
        difficulty: 2,
        estimatedTime: 12,
        description: "공항에서 체크인부터 탑승까지의 전 과정을 연습합니다.",
        learningObjectives: [
          "체크인 카운터에서 필요한 표현 익히기",
          "수하물 관련 대화하기",
          "보안 검색 및 탑승 절차 이해하기"
        ],
        steps: [
          {
            stepNumber: 1,
            title: "체크인 카운터",
            situation: "공항 체크인 카운터에 도착했습니다.",
            aiRole: "airline_staff",
            aiPrompt: "You are a friendly airline check-in agent. Help the passenger check in, ask for their documents, and provide boarding information.",
            usefulExpressions: [
              {
                expression: "I'd like to check in for...",
                meaning: "...로 체크인하고 싶습니다",
                examples: [
                  "I'd like to check in for flight AA123 to New York.",
                  "I'd like to check in for my flight to London.",
                  "I'd like to check in for the 3 PM flight."
                ],
                pronunciation: "/aɪd laɪk tuː ʧɛk ɪn fɔːr/"
              },
              {
                expression: "May I have a window seat?",
                meaning: "창가 좌석으로 주실 수 있나요?",
                examples: [
                  "May I have a window seat, please?",
                  "May I have an aisle seat?",
                  "May I have a seat near the front?"
                ],
                pronunciation: "/meɪ aɪ hæv ə ˈwɪndoʊ siːt/"
              },
              {
                expression: "How many bags can I check?",
                meaning: "몇 개의 가방을 체크인할 수 있나요?",
                examples: [
                  "How many bags can I check for free?",
                  "How many bags can I check in total?",
                  "How many bags can I bring as carry-on?"
                ],
                pronunciation: "/haʊ ˈmɛni bægz kæn aɪ ʧɛk/"
              }
            ],
            expectedQuestions: [
              "May I see your passport and ticket?",
              "Will you be checking any bags today?",
              "Would you prefer a window or aisle seat?"
            ],
            evaluationCriteria: {
              pronunciation: 30,
              grammar: 20,
              fluency: 25,
              appropriateness: 25
            }
          },
          {
            stepNumber: 2,
            title: "수하물 처리",
            situation: "수하물을 체크인하고 규정을 확인합니다.",
            aiRole: "airline_staff",
            aiPrompt: "You are handling baggage check-in. Ask about the contents, weight, and provide baggage tags. Inform about restrictions if needed.",
            usefulExpressions: [
              {
                expression: "I have one bag to check.",
                meaning: "체크인할 가방이 하나 있습니다",
                examples: [
                  "I have one bag to check in.",
                  "I have two bags to check.",
                  "I have one suitcase and one carry-on."
                ],
                pronunciation: "/aɪ hæv wʌn bæg tuː ʧɛk/"
              },
              {
                expression: "Does this count as carry-on?",
                meaning: "이것은 기내 수하물로 계산되나요?",
                examples: [
                  "Does this count as carry-on luggage?",
                  "Does this count as a personal item?",
                  "Does this count towards my baggage allowance?"
                ],
                pronunciation: "/dʌz ðɪs kaʊnt æz ˈkæri ɒn/"
              },
              {
                expression: "Are there any restrictions on...?",
                meaning: "...에 대한 제한 사항이 있나요?",
                examples: [
                  "Are there any restrictions on liquids?",
                  "Are there any restrictions on electronics?",
                  "Are there any restrictions on food items?"
                ],
                pronunciation: "/ɑːr ðɛr ˈɛni rɪˈstrɪkʃənz ɒn/"
              }
            ],
            expectedQuestions: [
              "Did you pack these bags yourself?",
              "Are you carrying any liquids or sharp objects?",
              "Please place your bag on the scale."
            ],
            evaluationCriteria: {
              pronunciation: 30,
              grammar: 25,
              fluency: 20,
              appropriateness: 25
            }
          },
          {
            stepNumber: 3,
            title: "보안 검색대",
            situation: "보안 검색대를 통과합니다.",
            aiRole: "security_officer",
            aiPrompt: "You are a security officer. Give clear instructions about removing items, going through the scanner, and collecting belongings.",
            usefulExpressions: [
              {
                expression: "Do I need to remove...?",
                meaning: "...를 벗어야 하나요?",
                examples: [
                  "Do I need to remove my shoes?",
                  "Do I need to remove my belt?",
                  "Do I need to remove my laptop from the bag?"
                ],
                pronunciation: "/duː aɪ niːd tuː rɪˈmuːv/"
              },
              {
                expression: "Where should I put...?",
                meaning: "...를 어디에 놓아야 하나요?",
                examples: [
                  "Where should I put my phone?",
                  "Where should I put my jacket?",
                  "Where should I put my carry-on bag?"
                ],
                pronunciation: "/wɛr ʃʊd aɪ pʊt/"
              },
              {
                expression: "Can I collect my things now?",
                meaning: "이제 제 물건을 가져가도 되나요?",
                examples: [
                  "Can I collect my things now?",
                  "Can I collect my bag from the belt?",
                  "Can I pick up my belongings?"
                ],
                pronunciation: "/kæn aɪ kəˈlɛkt maɪ θɪŋz naʊ/"
              }
            ],
            expectedQuestions: [
              "Please remove your laptop and liquids.",
              "Step through the metal detector.",
              "We need to do a quick bag check."
            ],
            evaluationCriteria: {
              pronunciation: 30,
              grammar: 20,
              fluency: 25,
              appropriateness: 25
            }
          },
          {
            stepNumber: 4,
            title: "탑승 게이트",
            situation: "탑승 게이트에서 탑승을 준비합니다.",
            aiRole: "gate_agent",
            aiPrompt: "You are a gate agent making boarding announcements and checking boarding passes. Be helpful and provide clear information.",
            usefulExpressions: [
              {
                expression: "Which gate is for...?",
                meaning: "...는 몇 번 게이트인가요?",
                examples: [
                  "Which gate is for flight AA123?",
                  "Which gate is for the New York flight?",
                  "Which gate is for my connecting flight?"
                ],
                pronunciation: "/wɪʧ geɪt ɪz fɔːr/"
              },
              {
                expression: "When does boarding start?",
                meaning: "탑승은 언제 시작하나요?",
                examples: [
                  "When does boarding start for my flight?",
                  "When does boarding start for first class?",
                  "When does boarding start for families?"
                ],
                pronunciation: "/wɛn dʌz ˈbɔrdɪŋ stɑrt/"
              },
              {
                expression: "Is this the line for...?",
                meaning: "이것이 ...줄인가요?",
                examples: [
                  "Is this the line for economy class?",
                  "Is this the line for priority boarding?",
                  "Is this the line for group 3?"
                ],
                pronunciation: "/ɪz ðɪs ðə laɪn fɔːr/"
              }
            ],
            expectedQuestions: [
              "May I see your boarding pass?",
              "Are you traveling with any checked baggage?",
              "Enjoy your flight!"
            ],
            evaluationCriteria: {
              pronunciation: 30,
              grammar: 20,
              fluency: 25,
              appropriateness: 25
            }
          }
        ]
      },

      // Scenario 4: Hotel Reservation (Travel, 3 steps)
      {
        category: "travel",
        title: "Hotel Reservation",
        difficulty: 2,
        estimatedTime: 10,
        description: "호텔 예약부터 체크인, 문의까지 연습합니다.",
        learningObjectives: [
          "호텔 예약하기",
          "체크인 절차 익히기",
          "호텔 서비스 문의하기"
        ],
        steps: [
          {
            stepNumber: 1,
            title: "전화로 예약하기",
            situation: "호텔에 전화해서 방을 예약합니다.",
            aiRole: "hotel_receptionist",
            aiPrompt: "You are a hotel receptionist taking a reservation over the phone. Ask about dates, room preferences, and guest information.",
            usefulExpressions: [
              {
                expression: "I'd like to make a reservation for...",
                meaning: "...에 대한 예약을 하고 싶습니다",
                examples: [
                  "I'd like to make a reservation for two nights.",
                  "I'd like to make a reservation for next weekend.",
                  "I'd like to make a reservation for a double room."
                ],
                pronunciation: "/aɪd laɪk tuː meɪk ə ˌrɛzərˈveɪʃən fɔːr/"
              },
              {
                expression: "Do you have any rooms available?",
                meaning: "이용 가능한 방이 있나요?",
                examples: [
                  "Do you have any rooms available for tonight?",
                  "Do you have any rooms available with a sea view?",
                  "Do you have any rooms available for four guests?"
                ],
                pronunciation: "/duː juː hæv ˈɛni ruːmz əˈveɪləbəl/"
              },
              {
                expression: "What's included in the price?",
                meaning: "가격에 무엇이 포함되나요?",
                examples: [
                  "What's included in the price per night?",
                  "What's included in the breakfast package?",
                  "What's included in the room rate?"
                ],
                pronunciation: "/wʌts ɪnˈkluːdɪd ɪn ðə praɪs/"
              }
            ],
            expectedQuestions: [
              "For what dates would you like to book?",
              "How many guests will be staying?",
              "Would you like a room with a king or twin beds?"
            ],
            evaluationCriteria: {
              pronunciation: 30,
              grammar: 25,
              fluency: 20,
              appropriateness: 25
            }
          },
          {
            stepNumber: 2,
            title: "체크인하기",
            situation: "호텔 프론트 데스크에서 체크인합니다.",
            aiRole: "hotel_receptionist",
            aiPrompt: "You are checking in a guest. Ask for ID, confirm reservation details, and explain hotel amenities.",
            usefulExpressions: [
              {
                expression: "I have a reservation under...",
                meaning: "... 이름으로 예약했습니다",
                examples: [
                  "I have a reservation under Smith.",
                  "I have a reservation under the name Kim.",
                  "I have a reservation under my company name."
                ],
                pronunciation: "/aɪ hæv ə ˌrɛzərˈveɪʃən ˈʌndər/"
              },
              {
                expression: "What time is checkout?",
                meaning: "체크아웃 시간은 몇 시인가요?",
                examples: [
                  "What time is checkout tomorrow?",
                  "What time is checkout on weekends?",
                  "What time is late checkout available until?"
                ],
                pronunciation: "/wʌt taɪm ɪz ˈʧɛkaʊt/"
              },
              {
                expression: "Is breakfast included?",
                meaning: "조식이 포함되어 있나요?",
                examples: [
                  "Is breakfast included in the room rate?",
                  "Is breakfast included for all guests?",
                  "Is breakfast included or is it extra?"
                ],
                pronunciation: "/ɪz ˈbrɛkfəst ɪnˈkluːdɪd/"
              }
            ],
            expectedQuestions: [
              "May I see your ID and credit card?",
              "Would you like a wake-up call?",
              "Here's your room key. You're in room 302."
            ],
            evaluationCriteria: {
              pronunciation: 30,
              grammar: 25,
              fluency: 20,
              appropriateness: 25
            }
          },
          {
            stepNumber: 3,
            title: "호텔 서비스 문의",
            situation: "컨시어지에게 호텔 시설과 주변 정보를 문의합니다.",
            aiRole: "concierge",
            aiPrompt: "You are a helpful hotel concierge. Provide information about hotel facilities, local attractions, and make recommendations.",
            usefulExpressions: [
              {
                expression: "Could you recommend...?",
                meaning: "...를 추천해 주실 수 있나요?",
                examples: [
                  "Could you recommend a good restaurant nearby?",
                  "Could you recommend some local attractions?",
                  "Could you recommend a place to shop?"
                ],
                pronunciation: "/kʊd juː ˌrɛkəˈmɛnd/"
              },
              {
                expression: "How can I get to...?",
                meaning: "...에 어떻게 가나요?",
                examples: [
                  "How can I get to the city center?",
                  "How can I get to the airport from here?",
                  "How can I get to the museum?"
                ],
                pronunciation: "/haʊ kæn aɪ gɛt tuː/"
              },
              {
                expression: "Is there a ... in the hotel?",
                meaning: "호텔에 ...가 있나요?",
                examples: [
                  "Is there a gym in the hotel?",
                  "Is there a swimming pool in the hotel?",
                  "Is there a business center in the hotel?"
                ],
                pronunciation: "/ɪz ðɛr ə ... ɪn ðə hoʊˈtɛl/"
              }
            ],
            expectedQuestions: [
              "What kind of cuisine are you interested in?",
              "Would you like me to book a table?",
              "Would you like directions or should I call you a taxi?"
            ],
            evaluationCriteria: {
              pronunciation: 25,
              grammar: 25,
              fluency: 25,
              appropriateness: 25
            }
          }
        ]
      },

      // Scenario 5: Restaurant Ordering (Daily Life, 3 steps)
      {
        category: "daily_life",
        title: "Restaurant Ordering",
        difficulty: 2,
        estimatedTime: 10,
        description: "레스토랑에서 주문하고 식사하는 전 과정을 연습합니다.",
        learningObjectives: [
          "메뉴 이해하고 주문하기",
          "음식 관련 질문하기",
          "계산 및 팁 주기"
        ],
        steps: [
          {
            stepNumber: 1,
            title: "자리 안내 및 메뉴 주문",
            situation: "레스토랑에 도착하여 자리에 앉아 메뉴를 봅니다.",
            aiRole: "waiter",
            aiPrompt: "You are a friendly waiter. Greet the customer, show them to their table, and take their drink order while they look at the menu.",
            usefulExpressions: [
              {
                expression: "A table for..., please.",
                meaning: "...명 자리 부탁합니다",
                examples: [
                  "A table for two, please.",
                  "A table for four, please.",
                  "A table for one, please."
                ],
                pronunciation: "/ə ˈteɪbəl fɔːr ... pliːz/"
              },
              {
                expression: "Could I see the menu?",
                meaning: "메뉴를 볼 수 있을까요?",
                examples: [
                  "Could I see the menu, please?",
                  "Could I see the wine list?",
                  "Could I see the dessert menu?"
                ],
                pronunciation: "/kʊd aɪ siː ðə ˈmɛnjuː/"
              },
              {
                expression: "I'll start with...",
                meaning: "...로 시작하겠습니다",
                examples: [
                  "I'll start with a glass of water.",
                  "I'll start with the soup of the day.",
                  "I'll start with an appetizer."
                ],
                pronunciation: "/aɪl stɑrt wɪð/"
              }
            ],
            expectedQuestions: [
              "Welcome! How many in your party?",
              "Can I get you something to drink while you look at the menu?",
              "Are you ready to order, or do you need a few minutes?"
            ],
            evaluationCriteria: {
              pronunciation: 30,
              grammar: 20,
              fluency: 25,
              appropriateness: 25
            }
          },
          {
            stepNumber: 2,
            title: "음식 주문 및 문의",
            situation: "메뉴를 보고 음식을 주문합니다.",
            aiRole: "waiter",
            aiPrompt: "You are taking the food order. Answer questions about menu items, make suggestions, and confirm the order.",
            usefulExpressions: [
              {
                expression: "What do you recommend?",
                meaning: "무엇을 추천하시나요?",
                examples: [
                  "What do you recommend from the menu?",
                  "What do you recommend for seafood?",
                  "What do you recommend as a house special?"
                ],
                pronunciation: "/wʌt duː juː ˌrɛkəˈmɛnd/"
              },
              {
                expression: "Does this come with...?",
                meaning: "이것은 ...와 함께 나오나요?",
                examples: [
                  "Does this come with a side salad?",
                  "Does this come with fries or rice?",
                  "Does this come with any vegetables?"
                ],
                pronunciation: "/dʌz ðɪs kʌm wɪð/"
              },
              {
                expression: "I'll have the...",
                meaning: "...로 주문하겠습니다",
                examples: [
                  "I'll have the grilled salmon.",
                  "I'll have the chicken pasta.",
                  "I'll have the vegetarian option."
                ],
                pronunciation: "/aɪl hæv ðə/"
              }
            ],
            expectedQuestions: [
              "How would you like that cooked?",
              "Would you like any sides with that?",
              "Any allergies I should know about?"
            ],
            evaluationCriteria: {
              pronunciation: 25,
              grammar: 25,
              fluency: 25,
              appropriateness: 25
            }
          },
          {
            stepNumber: 3,
            title: "계산 및 마무리",
            situation: "식사를 마치고 계산을 요청합니다.",
            aiRole: "waiter",
            aiPrompt: "You are bringing the check. Ask if everything was satisfactory and process the payment.",
            usefulExpressions: [
              {
                expression: "Could I get the check, please?",
                meaning: "계산서를 받을 수 있을까요?",
                examples: [
                  "Could I get the check, please?",
                  "Could I get the bill, please?",
                  "Could we have the check when you get a chance?"
                ],
                pronunciation: "/kʊd aɪ gɛt ðə ʧɛk pliːz/"
              },
              {
                expression: "Can I pay by card?",
                meaning: "카드로 계산할 수 있나요?",
                examples: [
                  "Can I pay by card?",
                  "Can I pay by credit card?",
                  "Can I split the bill?"
                ],
                pronunciation: "/kæn aɪ peɪ baɪ kɑrd/"
              },
              {
                expression: "Everything was delicious.",
                meaning: "모든 것이 맛있었습니다",
                examples: [
                  "Everything was delicious, thank you.",
                  "Everything was perfect.",
                  "Everything was wonderful."
                ],
                pronunciation: "/ˈɛvriˌθɪŋ wʌz dɪˈlɪʃəs/"
              }
            ],
            expectedQuestions: [
              "How was everything?",
              "Would you like the check now?",
              "Cash or card today?"
            ],
            evaluationCriteria: {
              pronunciation: 30,
              grammar: 20,
              fluency: 25,
              appropriateness: 25
            }
          }
        ]
      },

      // Scenario 6: Shopping at Store (Daily Life, 3 steps)
      {
        category: "daily_life",
        title: "Shopping at Store",
        difficulty: 1,
        estimatedTime: 8,
        description: "상점에서 쇼핑하는 전 과정을 연습합니다.",
        learningObjectives: [
          "상품 찾기 및 문의하기",
          "사이즈와 색상 확인하기",
          "계산 및 교환/환불 정책 이해하기"
        ],
        steps: [
          {
            stepNumber: 1,
            title: "상품 찾기",
            situation: "옷가게에서 원하는 상품을 찾고 있습니다.",
            aiRole: "sales_associate",
            aiPrompt: "You are a helpful sales associate. Greet the customer and help them find what they're looking for.",
            usefulExpressions: [
              {
                expression: "I'm looking for...",
                meaning: "...를 찾고 있습니다",
                examples: [
                  "I'm looking for a winter jacket.",
                  "I'm looking for running shoes.",
                  "I'm looking for a gift for my friend."
                ],
                pronunciation: "/aɪm ˈlʊkɪŋ fɔːr/"
              },
              {
                expression: "Do you have this in...?",
                meaning: "이것을 ...로 가지고 있나요?",
                examples: [
                  "Do you have this in a medium?",
                  "Do you have this in blue?",
                  "Do you have this in a larger size?"
                ],
                pronunciation: "/duː juː hæv ðɪs ɪn/"
              },
              {
                expression: "Where can I find...?",
                meaning: "...를 어디서 찾을 수 있나요?",
                examples: [
                  "Where can I find the fitting rooms?",
                  "Where can I find men's clothing?",
                  "Where can I find the sale items?"
                ],
                pronunciation: "/wɛr kæn aɪ faɪnd/"
              }
            ],
            expectedQuestions: [
              "Can I help you find something?",
              "What size are you looking for?",
              "We have similar items over here."
            ],
            evaluationCriteria: {
              pronunciation: 30,
              grammar: 20,
              fluency: 25,
              appropriateness: 25
            }
          },
          {
            stepNumber: 2,
            title: "피팅 및 선택",
            situation: "옷을 입어보고 점원에게 조언을 구합니다.",
            aiRole: "sales_associate",
            aiPrompt: "You are helping a customer try on clothes. Give honest feedback and suggest alternatives if needed.",
            usefulExpressions: [
              {
                expression: "Can I try this on?",
                meaning: "이것을 입어봐도 될까요?",
                examples: [
                  "Can I try this on?",
                  "Can I try these on?",
                  "Can I try on a different size?"
                ],
                pronunciation: "/kæn aɪ traɪ ðɪs ɒn/"
              },
              {
                expression: "How does this look?",
                meaning: "이것이 어떻게 보이나요?",
                examples: [
                  "How does this look on me?",
                  "How does this color look?",
                  "How does this fit look?"
                ],
                pronunciation: "/haʊ dʌz ðɪs lʊk/"
              },
              {
                expression: "It's a bit too...",
                meaning: "약간 너무 ...합니다",
                examples: [
                  "It's a bit too tight.",
                  "It's a bit too long.",
                  "It's a bit too expensive."
                ],
                pronunciation: "/ɪts ə bɪt tuː/"
              }
            ],
            expectedQuestions: [
              "The fitting rooms are right over there.",
              "That looks great on you!",
              "Would you like to try a different size?"
            ],
            evaluationCriteria: {
              pronunciation: 25,
              grammar: 25,
              fluency: 25,
              appropriateness: 25
            }
          },
          {
            stepNumber: 3,
            title: "계산 및 정책 문의",
            situation: "상품을 구매하고 교환/환불 정책을 확인합니다.",
            aiRole: "cashier",
            aiPrompt: "You are a cashier processing a purchase. Explain the return policy and ask about payment method.",
            usefulExpressions: [
              {
                expression: "I'll take this.",
                meaning: "이것으로 하겠습니다",
                examples: [
                  "I'll take this one.",
                  "I'll take these two.",
                  "I'll take it."
                ],
                pronunciation: "/aɪl teɪk ðɪs/"
              },
              {
                expression: "What's your return policy?",
                meaning: "환불 정책이 어떻게 되나요?",
                examples: [
                  "What's your return policy?",
                  "What's your exchange policy?",
                  "What's your refund policy?"
                ],
                pronunciation: "/wʌts jɔːr rɪˈtɜrn ˈpɒləsi/"
              },
              {
                expression: "Do you accept...?",
                meaning: "...를 받으시나요?",
                examples: [
                  "Do you accept credit cards?",
                  "Do you accept Apple Pay?",
                  "Do you accept gift cards?"
                ],
                pronunciation: "/duː juː əkˈsɛpt/"
              }
            ],
            expectedQuestions: [
              "Did you find everything you were looking for?",
              "How would you like to pay?",
              "Would you like a bag?"
            ],
            evaluationCriteria: {
              pronunciation: 30,
              grammar: 20,
              fluency: 25,
              appropriateness: 25
            }
          }
        ]
      },

      // Scenario 7: Making New Friends (Social, 3 steps)
      {
        category: "social",
        title: "Making New Friends",
        difficulty: 2,
        estimatedTime: 10,
        description: "새로운 사람을 만나 친구가 되는 과정을 연습합니다.",
        learningObjectives: [
          "자연스러운 인사와 소개하기",
          "공통 관심사 찾기",
          "연락처 교환하기"
        ],
        steps: [
          {
            stepNumber: 1,
            title: "첫 만남과 인사",
            situation: "파티에서 새로운 사람을 만났습니다.",
            aiRole: "new_acquaintance",
            aiPrompt: "You are a friendly person at a social gathering. Engage in casual conversation and show interest in getting to know the other person.",
            usefulExpressions: [
              {
                expression: "Hi, I'm...",
                meaning: "안녕하세요, 저는 ...입니다",
                examples: [
                  "Hi, I'm Sarah. Nice to meet you.",
                  "Hi, I'm John from the marketing team.",
                  "Hi, I'm Kim. I just moved here."
                ],
                pronunciation: "/haɪ aɪm/"
              },
              {
                expression: "How do you know...?",
                meaning: "...를 어떻게 아시나요?",
                examples: [
                  "How do you know the host?",
                  "How do you know Sarah?",
                  "How do you know about this event?"
                ],
                pronunciation: "/haʊ duː juː noʊ/"
              },
              {
                expression: "What brings you here?",
                meaning: "여기는 어떻게 오셨어요?",
                examples: [
                  "What brings you here today?",
                  "What brings you to this event?",
                  "What brings you to the city?"
                ],
                pronunciation: "/wʌt brɪŋz juː hɪr/"
              }
            ],
            expectedQuestions: [
              "Nice to meet you! What's your name?",
              "Are you from around here?",
              "Is this your first time at one of these events?"
            ],
            evaluationCriteria: {
              pronunciation: 25,
              grammar: 25,
              fluency: 25,
              appropriateness: 25
            }
          },
          {
            stepNumber: 2,
            title: "대화와 공통점 찾기",
            situation: "대화를 이어가며 공통 관심사를 찾습니다.",
            aiRole: "new_acquaintance",
            aiPrompt: "You are having a friendly conversation. Share about your interests and ask about theirs. Find common ground.",
            usefulExpressions: [
              {
                expression: "I'm really into...",
                meaning: "저는 ...에 정말 관심이 많습니다",
                examples: [
                  "I'm really into hiking and outdoor activities.",
                  "I'm really into photography.",
                  "I'm really into trying new restaurants."
                ],
                pronunciation: "/aɪm ˈrɪəli ˈɪntuː/"
              },
              {
                expression: "Have you ever...?",
                meaning: "...해본 적 있으세요?",
                examples: [
                  "Have you ever been to Japan?",
                  "Have you ever tried rock climbing?",
                  "Have you ever attended this conference before?"
                ],
                pronunciation: "/hæv juː ˈɛvər/"
              },
              {
                expression: "That sounds interesting!",
                meaning: "그거 흥미롭네요!",
                examples: [
                  "That sounds really interesting!",
                  "That sounds like fun!",
                  "That sounds amazing!"
                ],
                pronunciation: "/ðæt saʊndz ˈɪntrəstɪŋ/"
              }
            ],
            expectedQuestions: [
              "What do you do for fun?",
              "Do you have any hobbies?",
              "Oh, I love that too! How long have you been into it?"
            ],
            evaluationCriteria: {
              pronunciation: 20,
              grammar: 25,
              fluency: 30,
              appropriateness: 25
            }
          },
          {
            stepNumber: 3,
            title: "연락처 교환",
            situation: "즐거운 대화 후 연락처를 교환합니다.",
            aiRole: "new_acquaintance",
            aiPrompt: "You enjoyed the conversation and want to stay in touch. Exchange contact information naturally.",
            usefulExpressions: [
              {
                expression: "We should keep in touch.",
                meaning: "계속 연락하면 좋겠어요",
                examples: [
                  "We should keep in touch!",
                  "We should definitely stay in touch.",
                  "We should hang out sometime."
                ],
                pronunciation: "/wi ʃʊd kiːp ɪn tʌʧ/"
              },
              {
                expression: "Can I get your...?",
                meaning: "...를 받을 수 있을까요?",
                examples: [
                  "Can I get your number?",
                  "Can I get your Instagram?",
                  "Can I get your email address?"
                ],
                pronunciation: "/kæn aɪ gɛt jɔːr/"
              },
              {
                expression: "Let's grab coffee sometime.",
                meaning: "언젠가 커피 한잔 해요",
                examples: [
                  "Let's grab coffee sometime.",
                  "Let's get lunch next week.",
                  "Let's meet up again soon."
                ],
                pronunciation: "/lɛts græb ˈkɔfi ˈsʌmˌtaɪm/"
              }
            ],
            expectedQuestions: [
              "Sure! What's the best way to reach you?",
              "Do you use WhatsApp?",
              "I'd love to! I'll message you this week."
            ],
            evaluationCriteria: {
              pronunciation: 25,
              grammar: 20,
              fluency: 25,
              appropriateness: 30
            }
          }
        ]
      },

      // Scenario 8: Doctor's Appointment (Daily Life, 4 steps)
      {
        category: "daily_life",
        title: "Doctor's Appointment",
        difficulty: 3,
        estimatedTime: 12,
        description: "병원 예약부터 진료까지의 전 과정을 연습합니다.",
        learningObjectives: [
          "증상 설명하기",
          "의사의 질문 이해하고 답변하기",
          "처방전과 치료 지시 이해하기"
        ],
        steps: [
          {
            stepNumber: 1,
            title: "예약하기",
            situation: "병원에 전화해서 진료 예약을 합니다.",
            aiRole: "receptionist",
            aiPrompt: "You are a medical receptionist scheduling appointments. Ask about symptoms, preferred times, and insurance information.",
            usefulExpressions: [
              {
                expression: "I'd like to make an appointment.",
                meaning: "예약을 하고 싶습니다",
                examples: [
                  "I'd like to make an appointment with Dr. Smith.",
                  "I'd like to make an appointment for next week.",
                  "I'd like to make an appointment as soon as possible."
                ],
                pronunciation: "/aɪd laɪk tuː meɪk ən əˈpɔɪntmənt/"
              },
              {
                expression: "I'm not feeling well.",
                meaning: "몸이 좋지 않습니다",
                examples: [
                  "I'm not feeling well today.",
                  "I'm not feeling well and need to see a doctor.",
                  "I'm not feeling well since yesterday."
                ],
                pronunciation: "/aɪm nɒt ˈfiːlɪŋ wɛl/"
              },
              {
                expression: "What times are available?",
                meaning: "언제 시간이 되시나요?",
                examples: [
                  "What times are available this week?",
                  "What times are available on Monday?",
                  "What times are available in the morning?"
                ],
                pronunciation: "/wʌt taɪmz ɑːr əˈveɪləbəl/"
              }
            ],
            expectedQuestions: [
              "What seems to be the problem?",
              "When would you like to come in?",
              "Do you have insurance?"
            ],
            evaluationCriteria: {
              pronunciation: 30,
              grammar: 25,
              fluency: 20,
              appropriateness: 25
            }
          },
          {
            stepNumber: 2,
            title: "접수 및 대기",
            situation: "병원에 도착하여 접수를 합니다.",
            aiRole: "receptionist",
            aiPrompt: "You are checking in a patient. Ask for their information, insurance card, and have them fill out forms.",
            usefulExpressions: [
              {
                expression: "I have an appointment at...",
                meaning: "...에 예약이 있습니다",
                examples: [
                  "I have an appointment at 3 PM.",
                  "I have an appointment at two o'clock.",
                  "I have an appointment with Dr. Johnson."
                ],
                pronunciation: "/aɪ hæv ən əˈpɔɪntmənt æt/"
              },
              {
                expression: "This is my first visit.",
                meaning: "처음 방문입니다",
                examples: [
                  "This is my first visit here.",
                  "This is my first visit to this clinic.",
                  "This is my first time seeing this doctor."
                ],
                pronunciation: "/ðɪs ɪz maɪ fɜrst ˈvɪzɪt/"
              },
              {
                expression: "How long is the wait?",
                meaning: "얼마나 기다려야 하나요?",
                examples: [
                  "How long is the wait?",
                  "How long is the wait time?",
                  "How long do I need to wait?"
                ],
                pronunciation: "/haʊ lɒŋ ɪz ðə weɪt/"
              }
            ],
            expectedQuestions: [
              "Please fill out these forms.",
              "May I see your insurance card?",
              "The doctor will see you shortly. Please have a seat."
            ],
            evaluationCriteria: {
              pronunciation: 30,
              grammar: 25,
              fluency: 20,
              appropriateness: 25
            }
          },
          {
            stepNumber: 3,
            title: "진료 및 증상 설명",
            situation: "의사가 진료실로 들어와 증상을 물어봅니다.",
            aiRole: "doctor",
            aiPrompt: "You are a doctor examining a patient. Ask about symptoms, medical history, and perform a basic examination.",
            usefulExpressions: [
              {
                expression: "I've been having...",
                meaning: "...가 있었습니다",
                examples: [
                  "I've been having headaches for three days.",
                  "I've been having stomach pain.",
                  "I've been having trouble sleeping."
                ],
                pronunciation: "/aɪv bɪn ˈhævɪŋ/"
              },
              {
                expression: "It hurts when I...",
                meaning: "...할 때 아픕니다",
                examples: [
                  "It hurts when I swallow.",
                  "It hurts when I move my arm.",
                  "It hurts when I breathe deeply."
                ],
                pronunciation: "/ɪt hɜrts wɛn aɪ/"
              },
              {
                expression: "Is it serious?",
                meaning: "심각한가요?",
                examples: [
                  "Is it serious, doctor?",
                  "Is it serious or just a cold?",
                  "Is it something serious?"
                ],
                pronunciation: "/ɪz ɪt ˈsɪriəs/"
              }
            ],
            expectedQuestions: [
              "When did the symptoms start?",
              "On a scale of 1-10, how bad is the pain?",
              "Do you have any allergies to medication?"
            ],
            evaluationCriteria: {
              pronunciation: 25,
              grammar: 30,
              fluency: 20,
              appropriateness: 25
            }
          },
          {
            stepNumber: 4,
            title: "처방 및 지시 사항",
            situation: "의사가 진단 결과와 치료 방법을 설명합니다.",
            aiRole: "doctor",
            aiPrompt: "You are explaining the diagnosis and treatment plan. Prescribe medication and give care instructions.",
            usefulExpressions: [
              {
                expression: "How often should I take...?",
                meaning: "...를 얼마나 자주 복용해야 하나요?",
                examples: [
                  "How often should I take this medication?",
                  "How often should I take the pills?",
                  "How often should I apply the cream?"
                ],
                pronunciation: "/haʊ ˈɔfən ʃʊd aɪ teɪk/"
              },
              {
                expression: "When will I feel better?",
                meaning: "언제 나아질까요?",
                examples: [
                  "When will I feel better?",
                  "When will I start feeling better?",
                  "When should I expect to recover?"
                ],
                pronunciation: "/wɛn wɪl aɪ fiːl ˈbɛtər/"
              },
              {
                expression: "Do I need to come back?",
                meaning: "다시 와야 하나요?",
                examples: [
                  "Do I need to come back for a follow-up?",
                  "Do I need to come back next week?",
                  "Do I need to schedule another appointment?"
                ],
                pronunciation: "/duː aɪ niːd tuː kʌm bæk/"
              }
            ],
            expectedQuestions: [
              "Take this twice a day with food.",
              "You should feel better in a few days.",
              "Come back if symptoms don't improve in a week."
            ],
            evaluationCriteria: {
              pronunciation: 25,
              grammar: 25,
              fluency: 25,
              appropriateness: 25
            }
          }
        ]
      },

      // Scenario 9: Networking Event (Social, 4 steps)
      {
        category: "social",
        title: "Networking Event",
        difficulty: 3,
        estimatedTime: 12,
        description: "전문적인 네트워킹 이벤트에서 인맥을 쌓는 연습을 합니다.",
        learningObjectives: [
          "전문적인 자기소개하기",
          "비즈니스 대화 이어가기",
          "연락처 교환 및 후속 조치하기"
        ],
        steps: [
          {
            stepNumber: 1,
            title: "이벤트 도착 및 인사",
            situation: "네트워킹 이벤트에 도착하여 다른 참석자들과 인사합니다.",
            aiRole: "attendee",
            aiPrompt: "You are a professional at a networking event. Introduce yourself, ask about their work, and engage in professional small talk.",
            usefulExpressions: [
              {
                expression: "I work in...",
                meaning: "저는 ...분야에서 일합니다",
                examples: [
                  "I work in software development.",
                  "I work in marketing and communications.",
                  "I work in the finance industry."
                ],
                pronunciation: "/aɪ wɜrk ɪn/"
              },
              {
                expression: "What line of work are you in?",
                meaning: "어떤 분야에서 일하시나요?",
                examples: [
                  "What line of work are you in?",
                  "What line of business are you in?",
                  "What field do you work in?"
                ],
                pronunciation: "/wʌt laɪn ʌv wɜrk ɑːr juː ɪn/"
              },
              {
                expression: "I'm here to...",
                meaning: "저는 ...하러 왔습니다",
                examples: [
                  "I'm here to meet other professionals.",
                  "I'm here to learn about new opportunities.",
                  "I'm here to expand my network."
                ],
                pronunciation: "/aɪm hɪr tuː/"
              }
            ],
            expectedQuestions: [
              "What brings you to this event?",
              "How long have you been in your field?",
              "Have you been to this event before?"
            ],
            evaluationCriteria: {
              pronunciation: 25,
              grammar: 25,
              fluency: 25,
              appropriateness: 25
            }
          },
          {
            stepNumber: 2,
            title: "전문 분야 대화",
            situation: "당신의 전문 분야와 프로젝트에 대해 이야기합니다.",
            aiRole: "attendee",
            aiPrompt: "You are discussing professional topics. Share insights about your industry and ask thoughtful questions.",
            usefulExpressions: [
              {
                expression: "I specialize in...",
                meaning: "저는 ...을 전문으로 합니다",
                examples: [
                  "I specialize in digital marketing strategies.",
                  "I specialize in data analytics.",
                  "I specialize in product design."
                ],
                pronunciation: "/aɪ ˈspɛʃəˌlaɪz ɪn/"
              },
              {
                expression: "We're currently working on...",
                meaning: "현재 ...를 진행하고 있습니다",
                examples: [
                  "We're currently working on a new product launch.",
                  "We're currently working on expanding to new markets.",
                  "We're currently working on improving customer experience."
                ],
                pronunciation: "/wɪr ˈkʌrəntli ˈwɜrkɪŋ ɒn/"
              },
              {
                expression: "What challenges are you facing?",
                meaning: "어떤 어려움을 겪고 계시나요?",
                examples: [
                  "What challenges are you facing in your role?",
                  "What challenges are you facing this quarter?",
                  "What challenges are you facing with remote work?"
                ],
                pronunciation: "/wʌt ˈʧælɪnʤɪz ɑːr juː ˈfeɪsɪŋ/"
              }
            ],
            expectedQuestions: [
              "That sounds interesting. How did you get into that?",
              "What's been the most rewarding part of your work?",
              "Are you looking to expand your team?"
            ],
            evaluationCriteria: {
              pronunciation: 20,
              grammar: 30,
              fluency: 25,
              appropriateness: 25
            }
          },
          {
            stepNumber: 3,
            title: "협력 기회 탐색",
            situation: "잠재적인 협력 기회에 대해 논의합니다.",
            aiRole: "attendee",
            aiPrompt: "You are exploring potential collaboration. Express interest in working together and discuss possibilities.",
            usefulExpressions: [
              {
                expression: "There might be an opportunity to...",
                meaning: "...할 기회가 있을 것 같습니다",
                examples: [
                  "There might be an opportunity to collaborate.",
                  "There might be an opportunity to partner on this project.",
                  "There might be an opportunity to share resources."
                ],
                pronunciation: "/ðɛr maɪt biː ən ˌɒpərˈtuːnɪti tuː/"
              },
              {
                expression: "I'd be interested in learning more about...",
                meaning: "...에 대해 더 알아보고 싶습니다",
                examples: [
                  "I'd be interested in learning more about your services.",
                  "I'd be interested in learning more about that approach.",
                  "I'd be interested in learning more about potential partnerships."
                ],
                pronunciation: "/aɪd biː ˈɪntrəstɪd ɪn ˈlɜrnɪŋ mɔːr əˈbaʊt/"
              },
              {
                expression: "We should set up a meeting.",
                meaning: "회의를 잡아야겠습니다",
                examples: [
                  "We should set up a meeting to discuss this further.",
                  "We should set up a meeting next week.",
                  "We should set up a meeting with our teams."
                ],
                pronunciation: "/wi ʃʊd sɛt ʌp ə ˈmitɪŋ/"
              }
            ],
            expectedQuestions: [
              "What kind of partnership are you thinking about?",
              "When would be a good time to connect?",
              "What's your timeline for this project?"
            ],
            evaluationCriteria: {
              pronunciation: 25,
              grammar: 25,
              fluency: 25,
              appropriateness: 25
            }
          },
          {
            stepNumber: 4,
            title: "연락처 교환 및 후속 조치",
            situation: "명함을 교환하고 후속 연락을 약속합니다.",
            aiRole: "attendee",
            aiPrompt: "You are wrapping up the conversation. Exchange business cards and discuss next steps for staying in touch.",
            usefulExpressions: [
              {
                expression: "Here's my business card.",
                meaning: "제 명함입니다",
                examples: [
                  "Here's my business card.",
                  "Here's my card with all my contact information.",
                  "Let me give you my business card."
                ],
                pronunciation: "/hɪrz maɪ ˈbɪznɪs kɑrd/"
              },
              {
                expression: "I'll follow up with you...",
                meaning: "...에 연락드리겠습니다",
                examples: [
                  "I'll follow up with you next week.",
                  "I'll follow up with you via email.",
                  "I'll follow up with you after the holidays."
                ],
                pronunciation: "/aɪl ˈfɒloʊ ʌp wɪð juː/"
              },
              {
                expression: "It was great meeting you.",
                meaning: "만나서 반가웠습니다",
                examples: [
                  "It was great meeting you today.",
                  "It was great meeting you and learning about your work.",
                  "It was a pleasure meeting you."
                ],
                pronunciation: "/ɪt wʌz greɪt ˈmitɪŋ juː/"
              }
            ],
            expectedQuestions: [
              "Do you have a business card?",
              "What's the best way to reach you?",
              "I look forward to hearing from you!"
            ],
            evaluationCriteria: {
              pronunciation: 25,
              grammar: 25,
              fluency: 20,
              appropriateness: 30
            }
          }
        ]
      },

      // Scenario 10: Phone Customer Service (Business, 3 steps)
      {
        category: "business",
        title: "Phone Customer Service",
        difficulty: 3,
        estimatedTime: 10,
        description: "전화로 고객 서비스에 문의하여 문제를 해결하는 과정을 연습합니다.",
        learningObjectives: [
          "문제 명확히 설명하기",
          "정보 요청 및 확인하기",
          "해결책 협의하기"
        ],
        steps: [
          {
            stepNumber: 1,
            title: "전화 연결 및 문제 설명",
            situation: "고객 서비스에 전화를 걸어 문제를 설명합니다.",
            aiRole: "customer_service",
            aiPrompt: "You are a customer service representative. Greet the caller, ask for account information, and listen to their issue.",
            usefulExpressions: [
              {
                expression: "I'm calling about...",
                meaning: "...에 대해 전화드렸습니다",
                examples: [
                  "I'm calling about my recent order.",
                  "I'm calling about a billing issue.",
                  "I'm calling about a problem with my account."
                ],
                pronunciation: "/aɪm ˈkɔlɪŋ əˈbaʊt/"
              },
              {
                expression: "I've been experiencing...",
                meaning: "...를 겪고 있습니다",
                examples: [
                  "I've been experiencing technical difficulties.",
                  "I've been experiencing issues with my service.",
                  "I've been experiencing problems since yesterday."
                ],
                pronunciation: "/aɪv bɪn ɪkˈspɪriənsɪŋ/"
              },
              {
                expression: "Could you help me with...?",
                meaning: "...를 도와주실 수 있나요?",
                examples: [
                  "Could you help me with this issue?",
                  "Could you help me with canceling my subscription?",
                  "Could you help me with tracking my order?"
                ],
                pronunciation: "/kʊd juː hɛlp miː wɪð/"
              }
            ],
            expectedQuestions: [
              "Thank you for calling. How can I help you today?",
              "Can I have your account number or email?",
              "I understand. Let me look into that for you."
            ],
            evaluationCriteria: {
              pronunciation: 30,
              grammar: 25,
              fluency: 20,
              appropriateness: 25
            }
          },
          {
            stepNumber: 2,
            title: "상세 정보 제공 및 확인",
            situation: "담당자가 추가 정보를 요청합니다.",
            aiRole: "customer_service",
            aiPrompt: "You are gathering information to resolve the issue. Ask clarifying questions and verify account details.",
            usefulExpressions: [
              {
                expression: "The order number is...",
                meaning: "주문 번호는 ...입니다",
                examples: [
                  "The order number is 123456.",
                  "The order number is on my confirmation email.",
                  "The reference number is ABC789."
                ],
                pronunciation: "/ði ˈɔrdər ˈnʌmbər ɪz/"
              },
              {
                expression: "Can you confirm...?",
                meaning: "...를 확인해 주실 수 있나요?",
                examples: [
                  "Can you confirm my shipping address?",
                  "Can you confirm the charge amount?",
                  "Can you confirm when this will be resolved?"
                ],
                pronunciation: "/kæn juː kənˈfɜrm/"
              },
              {
                expression: "I need to...",
                meaning: "저는 ...해야 합니다",
                examples: [
                  "I need to update my payment method.",
                  "I need to change my delivery address.",
                  "I need to cancel my order."
                ],
                pronunciation: "/aɪ niːd tuː/"
              }
            ],
            expectedQuestions: [
              "When did this problem start?",
              "Can you describe what happened?",
              "Let me verify your information."
            ],
            evaluationCriteria: {
              pronunciation: 25,
              grammar: 30,
              fluency: 20,
              appropriateness: 25
            }
          },
          {
            stepNumber: 3,
            title: "해결 및 마무리",
            situation: "담당자가 해결책을 제시하고 추가 도움을 제안합니다.",
            aiRole: "customer_service",
            aiPrompt: "You are resolving the issue. Explain the solution, next steps, and ask if there's anything else you can help with.",
            usefulExpressions: [
              {
                expression: "When can I expect...?",
                meaning: "언제 ...를 기대할 수 있나요?",
                examples: [
                  "When can I expect a refund?",
                  "When can I expect the replacement?",
                  "When can I expect this to be fixed?"
                ],
                pronunciation: "/wɛn kæn aɪ ɪkˈspɛkt/"
              },
              {
                expression: "Will I receive...?",
                meaning: "...를 받을 수 있나요?",
                examples: [
                  "Will I receive a confirmation email?",
                  "Will I receive a tracking number?",
                  "Will I receive any compensation?"
                ],
                pronunciation: "/wɪl aɪ rɪˈsiːv/"
              },
              {
                expression: "Thank you for your help.",
                meaning: "도와주셔서 감사합니다",
                examples: [
                  "Thank you for your help today.",
                  "Thank you for your help resolving this.",
                  "Thank you for your patience and assistance."
                ],
                pronunciation: "/θæŋk juː fɔːr jɔːr hɛlp/"
              }
            ],
            expectedQuestions: [
              "I've processed that for you.",
              "Is there anything else I can help you with?",
              "You should receive an email confirmation shortly."
            ],
            evaluationCriteria: {
              pronunciation: 25,
              grammar: 25,
              fluency: 25,
              appropriateness: 25
            }
          }
        ]
      }
    ];

    scenarios.forEach(scenario => {
      const id = this.nextId++;
      const speakingScenario: SpeakingScenario = {
        id,
        ...scenario,
        createdAt: new Date()
      };
      this.speakingScenarios.set(id, speakingScenario);
    });
    
    console.log(`[Speaking Scenarios] Initialized ${scenarios.length} scenarios`);
  }

  // Speaking Scenarios
  async getSpeakingScenarios(filters?: { category?: string; difficulty?: number }): Promise<SpeakingScenario[]> {
    let scenarios = Array.from(this.speakingScenarios.values());
    
    if (filters?.category) {
      scenarios = scenarios.filter(s => s.category === filters.category);
    }
    
    if (filters?.difficulty) {
      scenarios = scenarios.filter(s => s.difficulty === filters.difficulty);
    }
    
    return scenarios.sort((a, b) => a.difficulty - b.difficulty);
  }

  async getSpeakingScenario(id: number): Promise<SpeakingScenario | undefined> {
    return this.speakingScenarios.get(id);
  }

  async addSpeakingScenario(scenario: InsertSpeakingScenario): Promise<SpeakingScenario> {
    const id = this.nextId++;
    const speakingScenario: SpeakingScenario = {
      id,
      ...scenario,
      createdAt: new Date()
    };
    this.speakingScenarios.set(id, speakingScenario);
    return speakingScenario;
  }

  // Conversation History
  async saveConversationHistory(history: InsertConversationHistory): Promise<ConversationHistory> {
    const id = this.nextId++;
    const conversationHistory: ConversationHistory = {
      id,
      ...history,
      completedAt: new Date(),
      createdAt: new Date()
    };
    this.conversationHistory.set(id, conversationHistory);
    return conversationHistory;
  }

  async getConversationHistory(userId: string, scenarioId?: number): Promise<ConversationHistory[]> {
    let history = Array.from(this.conversationHistory.values()).filter(h => h.userId === userId);
    
    if (scenarioId) {
      history = history.filter(h => h.scenarioId === scenarioId);
    }
    
    return history.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }

  async getConversationById(id: number): Promise<ConversationHistory | undefined> {
    return this.conversationHistory.get(id);
  }

  // Scenario Progress
  async getScenarioProgress(userId: string, scenarioId?: number): Promise<ScenarioProgress[]> {
    let progress = Array.from(this.scenarioProgress.values()).filter(p => p.userId === userId);
    
    if (scenarioId) {
      progress = progress.filter(p => p.scenarioId === scenarioId);
    }
    
    return progress;
  }

  async saveScenarioProgress(progress: InsertScenarioProgress): Promise<ScenarioProgress> {
    // Check if progress already exists for this user and scenario
    const existing = Array.from(this.scenarioProgress.values()).find(
      p => p.userId === progress.userId && p.scenarioId === progress.scenarioId
    );

    if (existing) {
      return this.updateScenarioProgress(progress.userId, progress.scenarioId, progress);
    }

    const id = this.nextId++;
    const scenarioProgress: ScenarioProgress = {
      id,
      ...progress,
      lastPracticed: new Date(),
      createdAt: new Date()
    };
    this.scenarioProgress.set(id, scenarioProgress);
    return scenarioProgress;
  }

  async updateScenarioProgress(userId: string, scenarioId: number, updates: Partial<ScenarioProgress>): Promise<ScenarioProgress> {
    const existing = Array.from(this.scenarioProgress.values()).find(
      p => p.userId === userId && p.scenarioId === scenarioId
    );

    if (!existing) {
      throw new Error(`Scenario progress not found for user ${userId} and scenario ${scenarioId}`);
    }

    const updated: ScenarioProgress = {
      ...existing,
      ...updates,
      lastPracticed: new Date()
    };

    this.scenarioProgress.set(existing.id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
