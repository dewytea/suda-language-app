import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GoogleGenAI } from "@google/genai";
import { requireAuth } from "./middleware/auth";
import {
  insertUserProgressSchema,
  insertVocabularySchema,
  insertKeySentenceSchema,
  insertNoteSchema,
  insertReviewItemSchema,
  insertPronunciationResultSchema,
  insertWritingResultSchema,
  insertSpeakingProgressSchema,
} from "@shared/schema";

// Using Gemini AI integration - see blueprint:javascript_gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Map API errors to Korean messages
function getKoreanErrorMessage(error: any): string {
  const errorMsg = (error.message || "").toLowerCase();
  
  if (errorMsg.includes("api key") || errorMsg.includes("api_key")) {
    return "API 키가 유효하지 않습니다. 올바른 키를 설정해주세요.";
  } else if (errorMsg.includes("quota") || errorMsg.includes("limit") || errorMsg.includes("exceeded")) {
    return "API 사용 한도를 초과했습니다. Google AI Studio에서 할당량을 확인해주세요.";
  } else if (errorMsg.includes("permission") || errorMsg.includes("403") || errorMsg.includes("denied")) {
    return "API 키 권한이 부족합니다. Google AI Studio에서 권한을 확인해주세요.";
  } else if (errorMsg.includes("network") || errorMsg.includes("enotfound")) {
    return "네트워크 연결을 확인해주세요.";
  } else if (errorMsg.includes("timeout")) {
    return "API 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.";
  } else {
    return "AI 평가 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API Key Health Check
  app.get("/api/health/gemini", async (req, res) => {
    try {
      if (!GEMINI_API_KEY) {
        return res.status(503).json({ 
          status: "error",
          message: "Gemini API 키가 설정되지 않았습니다. 환경 변수에서 GEMINI_API_KEY를 설정해주세요.",
          configured: false
        });
      }

      // Test API key validity with a simple request
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: "Hello",
      });

      if (response.text) {
        return res.json({ 
          status: "ok",
          message: "Gemini API가 정상적으로 작동합니다.",
          configured: true
        });
      } else {
        return res.status(503).json({ 
          status: "error",
          message: "Gemini API 응답이 올바르지 않습니다.",
          configured: true
        });
      }
    } catch (error: any) {
      return res.status(503).json({ 
        status: "error",
        message: getKoreanErrorMessage(error),
        configured: !!GEMINI_API_KEY
      });
    }
  });

  // Translation API using Gemini
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguage, sourceLanguage } = req.body;
      
      if (!text || !targetLanguage) {
        return res.status(400).json({ error: "텍스트와 목표 언어를 입력해주세요." });
      }

      const prompt = sourceLanguage 
        ? `Translate the following ${sourceLanguage} text to ${targetLanguage}. Only provide the translation, no explanations:\n\n${text}`
        : `Translate the following text to ${targetLanguage}. Only provide the translation, no explanations:\n\n${text}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt,
      });

      const translation = response.text?.trim() || "";
      res.json({ translation });
    } catch (error: any) {
      res.status(500).json({ error: getKoreanErrorMessage(error) });
    }
  });

  // Text-to-Speech API using Gemini TTS
  app.post("/api/text-to-speech", async (req, res) => {
    try {
      const { text, language = "en", voiceName = "Puck" } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "음성으로 변환할 텍스트를 입력해주세요." });
      }

      const prompt = `Say in a clear, natural voice: ${text}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName }
            }
          }
        }
      });

      // Extract audio data and mime type from response
      const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      const pcmData = inlineData?.data;
      
      if (!pcmData) {
        return res.status(500).json({ error: "음성 생성에 실패했습니다." });
      }

      // Convert PCM to WAV format for browser compatibility
      const pcmBuffer = Buffer.from(pcmData, 'base64');
      const wavBuffer = convertPCMToWAV(pcmBuffer);
      const audioData = wavBuffer.toString('base64');
      
      res.json({ audioData, mimeType: 'audio/wav' });
    } catch (error: any) {
      res.status(500).json({ error: getKoreanErrorMessage(error) });
    }
  });

  // Helper function to convert PCM to WAV
  function convertPCMToWAV(pcmBuffer: Buffer): Buffer {
    const sampleRate = 24000; // Gemini TTS uses 24kHz
    const numChannels = 1; // Mono
    const bitsPerSample = 16; // 16-bit PCM
    
    const byteRate = sampleRate * numChannels * bitsPerSample / 8;
    const blockAlign = numChannels * bitsPerSample / 8;
    const dataSize = pcmBuffer.length;
    const fileSize = 36 + dataSize;
    
    const header = Buffer.alloc(44);
    
    // RIFF chunk descriptor
    header.write('RIFF', 0);
    header.writeUInt32LE(fileSize, 4);
    header.write('WAVE', 8);
    
    // fmt sub-chunk
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
    header.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(byteRate, 28);
    header.writeUInt16LE(blockAlign, 32);
    header.writeUInt16LE(bitsPerSample, 34);
    
    // data sub-chunk
    header.write('data', 36);
    header.writeUInt32LE(dataSize, 40);
    
    return Buffer.concat([header, pcmBuffer]);
  }

  // User Progress Routes
  app.get("/api/progress/:language", requireAuth, async (req, res) => {
    try {
      const { language } = req.params;
      const userId = req.user!.id;
      let progress = await storage.getUserProgress(userId, language);
      
      if (!progress) {
        progress = await storage.createUserProgress({
          userId,
          language,
          level: 1,
          totalPoints: 0,
          streakDays: 0,
          speakingProgress: 0,
          readingProgress: 0,
          listeningProgress: 0,
          writingProgress: 0,
        });
      }
      
      res.json(progress);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/progress/:language", requireAuth, async (req, res) => {
    try {
      const { language } = req.params;
      const userId = req.user!.id;
      const updates = insertUserProgressSchema.partial().parse(req.body);
      const progress = await storage.updateUserProgress(userId, language, updates);
      res.json(progress);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Vocabulary Routes (specific routes must come before parameterized routes)
  
  app.post("/api/vocabulary", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const vocab = insertVocabularySchema.parse({ ...req.body, userId });
      const created = await storage.addVocabulary(vocab);
      res.json(created);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/vocabulary/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;
      await storage.deleteVocabulary(userId, id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Key Sentences Routes
  app.get("/api/sentences/:language", requireAuth, async (req, res) => {
    try {
      const { language } = req.params;
      const userId = req.user!.id;
      const { scenario, category, difficulty } = req.query;
      const filters: { scenario?: string; category?: string; difficulty?: number } = {};
      
      if (scenario) filters.scenario = scenario as string;
      if (category) filters.category = category as string;
      if (difficulty) filters.difficulty = parseInt(difficulty as string);
      
      const sentences = await storage.getKeySentences(userId, language, filters);
      res.json(sentences);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sentences", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const sentence = insertKeySentenceSchema.parse({ ...req.body, userId });
      const created = await storage.addKeySentence(sentence);
      res.json(created);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/sentences/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;
      const updates = insertKeySentenceSchema.partial().parse(req.body);
      const updated = await storage.updateKeySentence(userId, id, updates);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Notes Routes
  app.get("/api/notes/:language", requireAuth, async (req, res) => {
    try {
      const { language } = req.params;
      const { skill } = req.query;
      const userId = req.user!.id;
      const notes = await storage.getNotes(userId, language, skill as string);
      res.json(notes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/notes", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const note = insertNoteSchema.parse({ ...req.body, userId });
      const saved = await storage.saveNote(note);
      res.json(saved);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Review Items Routes
  app.get("/api/review/:language", requireAuth, async (req, res) => {
    try {
      const { language } = req.params;
      const userId = req.user!.id;
      const items = await storage.getReviewItems(userId, language);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/review", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const item = insertReviewItemSchema.parse({ ...req.body, userId });
      const created = await storage.addReviewItem(item);
      res.json(created);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/review/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;
      const { nextReview } = req.body;
      if (!nextReview || isNaN(new Date(nextReview).getTime())) {
        return res.status(400).json({ error: "Invalid nextReview date" });
      }
      const updated = await storage.updateReviewItem(userId, id, new Date(nextReview));
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Achievements Routes
  app.get("/api/achievements", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const achievements = await storage.getAchievements(userId);
      res.json(achievements);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/achievements/:id/unlock", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;
      const achievement = await storage.unlockAchievement(userId, id);
      res.json(achievement);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Pronunciation Evaluation with Gemini
  // NOTE: This is a simulated implementation. In production, you would:
  // 1. Accept audio data (base64 or file upload)
  // 2. Use Gemini's multimodal capabilities to analyze the audio
  // 3. Compare against the target sentence
  app.post("/api/pronunciation/evaluate", requireAuth, async (req, res) => {
    try {
      if (!GEMINI_API_KEY) {
        return res.status(503).json({ 
          error: "Gemini API 키가 설정되지 않았습니다. 설정 페이지에서 API 키를 확인하세요." 
        });
      }

      const { sentence, language, audioData } = req.body;
      
      if (!sentence || !language) {
        return res.status(400).json({ error: "sentence and language are required" });
      }

      // TODO: In production, process audioData with Gemini multimodal API
      // For now, providing simulated feedback based on sentence complexity
      const wordCount = sentence.split(' ').length;
      const simulatedScore = Math.min(95, 70 + Math.floor(Math.random() * 20));
      const simulatedFeedback = wordCount > 8 
        ? "Good effort on this longer sentence. Focus on pronunciation of longer words."
        : "Good pronunciation! Keep practicing for consistency.";
      
      const userId = req.user!.id;
      const pronunciationResult = insertPronunciationResultSchema.parse({
        userId,
        sentence,
        language,
        score: simulatedScore,
        feedback: simulatedFeedback,
      });
      
      const saved = await storage.savePronunciationResult(pronunciationResult);
      res.json(saved);
    } catch (error: any) {
      res.status(500).json({ error: getKoreanErrorMessage(error) });
    }
  });

  app.get("/api/pronunciation/:language", requireAuth, async (req, res) => {
    try {
      const { language } = req.params;
      const userId = req.user!.id;
      const results = await storage.getPronunciationResults(userId, language);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Speaking Feedback with Gemini AI
  app.post("/api/speaking/feedback", requireAuth, async (req, res) => {
    try {
      if (!GEMINI_API_KEY) {
        return res.status(503).json({ 
          error: "Gemini API 키가 설정되지 않았습니다. 설정 페이지에서 API 키를 확인하세요." 
        });
      }

      const { originalText, spokenText, score, missedWords = [], extraWords = [] } = req.body;
      
      if (!originalText || !spokenText || score === undefined) {
        return res.status(400).json({ error: "originalText, spokenText, and score are required" });
      }

      const prompt = `당신은 친근하고 격려적인 언어 학습 코치입니다.

학습자가 다음 문장을 연습했습니다:
원본: "${originalText}"
학습자가 말한 것: "${spokenText}"
점수: ${score}/100

놓친 단어: ${missedWords.length > 0 ? missedWords.join(', ') : '없음'}
추가된 단어: ${extraWords.length > 0 ? extraWords.join(', ') : '없음'}

다음 형식으로 짧고 격려적인 피드백을 3줄로 작성해주세요:

1. 칭찬 (한 줄) - 학습자가 잘한 점을 구체적으로 칭찬
2. 개선점 (한 줄) - 있으면 개선할 점, 없으면 추가 격려
3. 팁 (한 줄) - 💡로 시작하는 실용적인 연습 팁

예시:
발음이 명확했어요! 👍
"business"의 발음에 조금 더 신경 쓰면 완벽할 거예요.
💡 팁: 녹음을 들어보면서 원어민 발음과 비교해보세요!

위 형식을 정확히 따라주세요.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 200,
        }
      });

      const feedback = response.text?.trim() || "좋은 시도였어요! 💪\n계속 연습하면 발음이 더 좋아질 거예요!\n💡 팁: 천천히, 명확하게 발음하는 것이 중요해요!";
      
      res.json({ feedback });
    } catch (error: any) {
      console.error('Speaking feedback error:', error);
      res.status(500).json({ 
        error: getKoreanErrorMessage(error),
        fallbackFeedback: "좋은 시도였어요! 💪\n계속 연습하면 발음이 더 좋아질 거예요!\n💡 팁: 천천히, 명확하게 발음하는 것이 중요해요!"
      });
    }
  });

  // Writing Feedback with Gemini
  app.post("/api/writing/evaluate", requireAuth, async (req, res) => {
    try {
      if (!GEMINI_API_KEY) {
        return res.status(503).json({ 
          error: "Gemini API 키가 설정되지 않았습니다. 설정 페이지에서 API 키를 확인하세요." 
        });
      }

      const { prompt, userText, language } = req.body;
      
      if (!prompt || !userText || !language) {
        return res.status(400).json({ error: "prompt, userText, and language are required" });
      }
      
      const systemPrompt = `You are a language learning writing evaluator.
Analyze the student's writing and provide a score, corrections, and suggestions.
Respond with JSON in this format:
{'score': number, 'corrections': array, 'suggestions': array}`;

      const aiPrompt = `Prompt: "${prompt}"
Student's writing: "${userText}"
Language: ${language}

Provide: score (0-100), corrections array with {original, corrected, type}, and 2-3 suggestions.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              score: { type: "number" },
              corrections: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    original: { type: "string" },
                    corrected: { type: "string" },
                    type: { type: "string" },
                  },
                },
              },
              suggestions: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["score", "corrections", "suggestions"],
          },
        },
        contents: aiPrompt,
      });
      
      const evaluation = JSON.parse(response.text || "{}");
      
      const userId = req.user!.id;
      const writingResult = insertWritingResultSchema.parse({
        userId,
        prompt,
        userText,
        language,
        score: evaluation.score,
        corrections: evaluation.corrections || [],
        suggestions: evaluation.suggestions || [],
      });
      
      const saved = await storage.saveWritingResult(writingResult);
      res.json(saved);
    } catch (error: any) {
      console.error("Writing evaluation error:", error);
      res.status(500).json({ error: getKoreanErrorMessage(error) });
    }
  });

  app.get("/api/writing/:language", requireAuth, async (req, res) => {
    try {
      const { language } = req.params;
      const userId = req.user!.id;
      const results = await storage.getWritingResults(userId, language);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/writing/save", requireAuth, async (req, res) => {
    try {
      const { writingId } = req.body;
      const userId = req.user!.id;
      
      if (!writingId) {
        return res.status(400).json({ error: "writingId is required" });
      }

      const updated = await storage.updateWritingResult(userId, writingId, { saved: true });
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Speaking Progress Routes
  app.get("/api/speaking-progress/:language", requireAuth, async (req, res) => {
    try {
      const { language } = req.params;
      const userId = req.user!.id;
      let progress = await storage.getSpeakingProgress(userId, language);
      
      if (!progress) {
        progress = await storage.createSpeakingProgress({
          userId,
          language,
          completedSentences: 0,
          averageScore: 0,
          todayStudyTime: 0,
          lastStudyDate: new Date().toISOString().split('T')[0],
        });
      }
      
      res.json(progress);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/speaking-progress/:language", requireAuth, async (req, res) => {
    try {
      const { language } = req.params;
      const userId = req.user!.id;
      const updates = insertSpeakingProgressSchema.partial().parse(req.body);
      const progress = await storage.updateSpeakingProgress(userId, language, updates);
      res.json(progress);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Favorite Sentences Routes
  app.get("/api/favorites/:language", requireAuth, async (req, res) => {
    try {
      const { language } = req.params;
      const userId = req.user!.id;
      const favorites = await storage.getFavoriteSentences(userId, language);
      res.json(favorites);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/favorites", requireAuth, async (req, res) => {
    try {
      const { sentenceId, language } = req.body;
      const userId = req.user!.id;
      
      if (!sentenceId || !language) {
        return res.status(400).json({ error: "sentenceId and language are required" });
      }

      const favorite = await storage.addFavoriteSentence({ userId, sentenceId, language });
      res.json(favorite);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/favorites/:sentenceId/:language", requireAuth, async (req, res) => {
    try {
      const sentenceId = parseInt(req.params.sentenceId);
      const { language } = req.params;
      const userId = req.user!.id;
      
      await storage.removeFavoriteSentence(userId, sentenceId, language);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/favorites/check/:sentenceId/:language", requireAuth, async (req, res) => {
    try {
      const sentenceId = parseInt(req.params.sentenceId);
      const { language } = req.params;
      const userId = req.user!.id;
      
      const isFavorite = await storage.isFavoriteSentence(userId, sentenceId, language);
      res.json({ isFavorite });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Speaking History Routes
  app.get("/api/speaking-history/:language", requireAuth, async (req, res) => {
    try {
      const { language } = req.params;
      const userId = req.user!.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const history = await storage.getSpeakingHistory(userId, language, limit);
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/speaking-history", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const historyData = { ...req.body, userId };
      const history = await storage.addSpeakingHistory(historyData);
      res.json(history);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Speaking Stats Routes
  app.get("/api/speaking-stats/:language", requireAuth, async (req, res) => {
    try {
      const { language } = req.params;
      const userId = req.user!.id;
      const stats = await storage.getSpeakingStats(userId, language);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI Chat Routes
  
  // Create new chat session
  app.post("/api/ai-chat/session", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { scenario = 'free', language = 'en' } = req.body;

      const session = await storage.createAIChatSession({ 
        userId, 
        scenario,
        language,
        grammarCorrectionEnabled: false,
        messageCount: 0,
        duration: 0,
        completed: false
      });
      res.json(session);
    } catch (error: any) {
      console.error('AI Chat session creation error:', error);
      res.status(500).json({ error: 'Failed to create session' });
    }
  });

  // Get all sessions for user
  app.get("/api/ai-chat/sessions", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { language } = req.query;
      
      const sessions = await storage.getAIChatSessions(userId, language as string);
      res.json({ sessions });
    } catch (error: any) {
      console.error('AI Chat sessions fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  });

  // Get specific session
  app.get("/api/ai-chat/sessions/:id", requireAuth, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const session = await storage.getAIChatSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      
      res.json(session);
    } catch (error: any) {
      console.error('AI Chat session fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch session' });
    }
  });

  // Update session
  app.patch("/api/ai-chat/sessions/:id", requireAuth, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const updates = req.body;
      
      const session = await storage.updateAIChatSession(sessionId, updates);
      res.json(session);
    } catch (error: any) {
      console.error('AI Chat session update error:', error);
      res.status(500).json({ error: 'Failed to update session' });
    }
  });

  // Save message
  app.post("/api/ai-chat/messages", requireAuth, async (req, res) => {
    try {
      const { sessionId, role, content, correctedContent, hasGrammarErrors } = req.body;

      if (!sessionId || !role || !content) {
        return res.status(400).json({ error: 'Invalid request data' });
      }

      const message = await storage.saveAIChatMessage({
        sessionId: parseInt(sessionId),
        role,
        content,
        correctedContent,
        hasGrammarErrors
      });
      
      res.json(message);
    } catch (error: any) {
      console.error('AI Chat message save error:', error);
      res.status(500).json({ error: 'Failed to save message' });
    }
  });

  // Get messages for session
  app.get("/api/ai-chat/sessions/:id/messages", requireAuth, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const messages = await storage.getAIChatMessages(sessionId);
      res.json({ messages });
    } catch (error: any) {
      console.error('AI Chat messages fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  // Get stats
  app.get("/api/ai-chat/stats", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { language = 'en' } = req.query;
      
      const stats = await storage.getAIChatStats(userId, language as string);
      res.json(stats || {
        totalSessions: 0,
        totalMessages: 0,
        totalDuration: 0,
        longestStreak: 0,
        currentStreak: 0,
        achievements: []
      });
    } catch (error: any) {
      console.error('AI Chat stats fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // Update stats
  app.patch("/api/ai-chat/stats", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { language = 'en', ...updates } = req.body;
      
      const stats = await storage.updateAIChatStats(userId, language, updates);
      res.json(stats);
    } catch (error: any) {
      console.error('AI Chat stats update error:', error);
      res.status(500).json({ error: 'Failed to update stats' });
    }
  });

  // Chat with AI
  app.post("/api/ai-chat/chat", requireAuth, async (req, res) => {
    try {
      const { messages, scenario = 'free', learningMode = false } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages are required' });
      }

      const { getChatResponse } = await import('./openai');
      const aiResponse = await getChatResponse(messages, scenario, learningMode);
      
      res.json({ response: aiResponse });
    } catch (error: any) {
      console.error('AI Chat error:', error);
      
      if (error.message.includes('OPENAI_API_KEY')) {
        return res.status(500).json({ 
          error: 'OpenAI API 키가 설정되지 않았습니다. Settings 페이지에서 API 키를 확인해주세요.' 
        });
      }
      
      res.status(500).json({ 
        error: error.message || 'AI 응답을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.' 
      });
    }
  });

  // Listening Lessons API
  app.get("/api/listening/lessons", requireAuth, async (req, res) => {
    try {
      const { difficulty, category } = req.query;
      
      const filters: { difficulty?: number; category?: string } = {};
      if (difficulty) filters.difficulty = parseInt(difficulty as string);
      if (category) filters.category = category as string;
      
      const lessons = await storage.getListeningLessons(filters);
      res.json({ lessons });
    } catch (error: any) {
      console.error('Listening lessons fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch lessons' });
    }
  });

  app.get("/api/listening/lessons/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lesson = await storage.getListeningLesson(id);
      
      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }
      
      res.json(lesson);
    } catch (error: any) {
      console.error('Listening lesson fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch lesson' });
    }
  });

  // Listening Progress API
  app.post("/api/listening/progress", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { lessonId, userAnswer, score, accuracy } = req.body;
      
      if (!lessonId || score === undefined || accuracy === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const progress = await storage.addListeningProgress({
        userId,
        lessonId,
        userAnswer: userAnswer || '', // Allow empty string for long content lessons
        score,
        accuracy,
        completed: true
      });
      
      res.json(progress);
    } catch (error: any) {
      console.error('Listening progress save error:', error);
      res.status(500).json({ error: 'Failed to save progress' });
    }
  });

  app.get("/api/listening/progress", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { lessonId } = req.query;
      
      const progress = await storage.getListeningProgress(
        userId,
        lessonId ? parseInt(lessonId as string) : undefined
      );
      
      res.json({ progress });
    } catch (error: any) {
      console.error('Listening progress fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch progress' });
    }
  });

  app.get("/api/listening/stats", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const stats = await storage.getListeningStats(userId);
      res.json(stats);
    } catch (error: any) {
      console.error('Listening stats fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // Vocabulary Routes
  app.get("/api/vocabulary/word", requireAuth, async (req, res) => {
    try {
      const { word } = req.query;
      console.log('[DEBUG] Vocabulary word request:', { word, query: req.query });
      
      if (!word || typeof word !== 'string') {
        console.log('[DEBUG] Word validation failed:', word);
        return res.status(400).json({ error: 'Word is required' });
      }
      
      const wordData = await storage.getVocabularyWord(word);
      console.log('[DEBUG] Word data found:', wordData ? wordData.word : 'not found');
      
      if (!wordData) {
        return res.status(404).json({ error: 'Word not found' });
      }
      
      res.json(wordData);
    } catch (error: any) {
      console.error('Vocabulary word fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch word' });
    }
  });

  app.get("/api/vocabulary/saved", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { word } = req.query;
      
      if (!word || typeof word !== 'string') {
        return res.status(400).json({ error: 'Word is required' });
      }
      
      const wordData = await storage.getVocabularyWord(word);
      if (!wordData) {
        return res.json(false);
      }
      
      const isSaved = await storage.isWordSaved(userId, wordData.id);
      res.json(isSaved);
    } catch (error: any) {
      console.error('Check saved word error:', error);
      res.status(500).json({ error: 'Failed to check word status' });
    }
  });

  app.post("/api/vocabulary/save", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { wordId } = req.body;
      
      if (!wordId) {
        return res.status(400).json({ error: 'Word ID is required' });
      }
      
      const userVocab = await storage.saveUserVocabulary({
        userId,
        wordId,
        learned: false,
        timesReviewed: 0,
      });
      
      res.json(userVocab);
    } catch (error: any) {
      console.error('Save vocabulary error:', error);
      res.status(500).json({ error: 'Failed to save word' });
    }
  });

  app.get("/api/vocabulary/user", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const userVocabulary = await storage.getUserVocabulary(userId);
      res.json(userVocabulary);
    } catch (error: any) {
      console.error('Get user vocabulary error:', error);
      res.status(500).json({ error: 'Failed to fetch vocabulary' });
    }
  });

  app.post("/api/vocabulary/update", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { id, learned, notes } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      const updated = await storage.updateUserVocabulary(userId, id, {
        learned,
        notes,
        timesReviewed: (await storage.getUserVocabulary(userId))
          .find(v => v.id === id)?.timesReviewed ?? 0 + 1,
      });
      
      res.json(updated);
    } catch (error: any) {
      console.error('Update vocabulary error:', error);
      res.status(500).json({ error: 'Failed to update word' });
    }
  });

  app.delete("/api/vocabulary/delete/:wordId", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { wordId } = req.params;
      
      if (!wordId) {
        return res.status(400).json({ error: 'Word ID is required' });
      }
      
      // Find the user vocabulary entry for this word
      const userVocabulary = await storage.getUserVocabulary(userId);
      const entry = userVocabulary.find(v => v.wordId === parseInt(wordId));
      
      if (!entry) {
        return res.status(404).json({ error: 'Word not found in your vocabulary' });
      }
      
      await storage.deleteUserVocabulary(userId, entry.id);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Delete vocabulary error:', error);
      res.status(500).json({ error: 'Failed to delete word' });
    }
  });

  // Parameterized vocabulary route (must come after specific routes)
  app.get("/api/vocabulary/:language", requireAuth, async (req, res) => {
    try {
      const { language } = req.params;
      const userId = req.user!.id;
      const vocabulary = await storage.getVocabulary(userId, language);
      res.json(vocabulary);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Reading Passages API
  app.get("/api/reading/passages", requireAuth, async (req, res) => {
    try {
      const { difficulty, type } = req.query;
      
      const filters: { difficulty?: number; contentType?: string } = {};
      if (difficulty) filters.difficulty = parseInt(difficulty as string);
      if (type) filters.contentType = type as string;
      
      const passages = await storage.getReadingPassages(filters);
      res.json({ passages });
    } catch (error: any) {
      console.error('Reading passages fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch passages' });
    }
  });

  app.get("/api/reading/passages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const passage = await storage.getReadingPassage(id);
      
      if (!passage) {
        return res.status(404).json({ error: 'Passage not found' });
      }
      
      res.json(passage);
    } catch (error: any) {
      console.error('Reading passage fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch passage' });
    }
  });

  app.get("/api/reading/questions/:passageId", requireAuth, async (req, res) => {
    try {
      const passageId = parseInt(req.params.passageId);
      const questions = await storage.getReadingQuestions(passageId);
      
      res.json({ questions });
    } catch (error: any) {
      console.error('Reading questions fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  });

  // Reading Progress API
  app.post("/api/reading/progress", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { passageId, answers, score, correctCount, totalCount, readingTime, wpm } = req.body;
      
      if (!passageId) {
        return res.status(400).json({ error: 'Passage ID is required' });
      }
      
      const progress = await storage.addReadingProgress({
        userId,
        passageId,
        answers,
        score,
        correctCount,
        totalCount,
        readingTime,
        wpm,
        completed: true
      });
      
      res.json(progress);
    } catch (error: any) {
      console.error('Reading progress save error:', error);
      res.status(500).json({ error: 'Failed to save progress' });
    }
  });

  app.get("/api/reading/progress", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { passageId } = req.query;
      
      const progress = await storage.getReadingProgress(
        userId,
        passageId ? parseInt(passageId as string) : undefined
      );
      
      res.json({ progress });
    } catch (error: any) {
      console.error('Reading progress fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch progress' });
    }
  });

  app.get("/api/reading/stats", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const stats = await storage.getReadingStats(userId);
      res.json(stats);
    } catch (error: any) {
      console.error('Reading stats fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // Writing Topics API
  app.get("/api/writing/topics", requireAuth, async (req, res) => {
    try {
      const difficulty = req.query.difficulty ? parseInt(req.query.difficulty as string) : undefined;
      const category = req.query.category as string | undefined;
      
      const topics = await storage.getWritingTopics({ difficulty, category });
      res.json({ topics });
    } catch (error: any) {
      console.error('Writing topics fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch topics' });
    }
  });

  app.get("/api/writing/topics/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const topic = await storage.getWritingTopic(id);
      
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }
      
      res.json(topic);
    } catch (error: any) {
      console.error('Writing topic fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch topic' });
    }
  });

  // Writing Submissions API
  app.post("/api/writing/submit", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { topicId, content, wordCount, suggestedTopic } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }
      
      let actualTopicId = topicId;
      
      // If this is a suggested topic, save it as a real WritingTopic first
      if (suggestedTopic && !topicId) {
        const newTopic = await storage.addWritingTopic({
          title: suggestedTopic.title,
          description: suggestedTopic.description,
          category: suggestedTopic.category,
          difficulty: suggestedTopic.difficulty,
          prompt: suggestedTopic.prompt,
          guidelines: suggestedTopic.guidelines,
          wordCountMin: suggestedTopic.wordCountMin,
          wordCountMax: suggestedTopic.wordCountMax
        });
        actualTopicId = newTopic.id;
      } else if (!topicId) {
        return res.status(400).json({ error: 'Topic ID or suggested topic data is required' });
      }
      
      const submission = await storage.saveWritingSubmission({
        userId,
        topicId: actualTopicId,
        content,
        wordCount: wordCount || content.trim().split(/\s+/).length
      });
      
      res.json(submission);
    } catch (error: any) {
      console.error('Writing submission error:', error);
      res.status(500).json({ error: 'Failed to save submission' });
    }
  });

  app.get("/api/writing/submissions", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const submissions = await storage.getWritingSubmissions(userId);
      res.json({ submissions });
    } catch (error: any) {
      console.error('Writing submissions fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch submissions' });
    }
  });

  app.get("/api/writing/submissions/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const submission = await storage.getWritingSubmission(id);
      
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      // Get topic information
      const topic = await storage.getWritingTopic(submission.topicId);
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }
      
      res.json({
        ...submission,
        topic
      });
    } catch (error: any) {
      console.error('Writing submission fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch submission' });
    }
  });

  app.post("/api/writing/evaluate/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const submission = await storage.getWritingSubmission(id);
      
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      const topic = await storage.getWritingTopic(submission.topicId);
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }
      
      if (!GEMINI_API_KEY) {
        return res.status(503).json({ 
          error: "Gemini API 키가 설정되지 않았습니다. 환경 변수에서 GEMINI_API_KEY를 설정해주세요."
        });
      }
      
      const prompt = `You are an English writing teacher evaluating a student's essay. 

Topic: ${topic.title}
Prompt: ${topic.prompt}
Word Count Requirement: ${topic.wordCountMin} - ${topic.wordCountMax} words
Student's Word Count: ${submission.wordCount} words

Guidelines:
${topic.guidelines.map((g, i) => `${i + 1}. ${g}`).join('\n')}

Student's Essay:
${submission.content}

Please evaluate this essay and provide:
1. Overall Score (0-100)
2. Strengths (what the student did well)
3. Weaknesses (what needs improvement)
4. Specific Feedback (detailed comments on grammar, vocabulary, structure, and content)
5. Suggestions for Improvement

Respond in JSON format:
{
  "score": number,
  "strengths": string[],
  "weaknesses": string[],
  "feedback": string,
  "suggestions": string[]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt,
      });

      const text = response.text;
      if (!text) {
        throw new Error('No response from AI');
      }
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Invalid AI response format');
      }
      
      const evaluation = JSON.parse(jsonMatch[0]);
      
      const updatedSubmission = await storage.updateWritingSubmission(id, {
        aiScore: evaluation.score,
        aiStrengths: evaluation.strengths,
        aiWeaknesses: evaluation.weaknesses,
        aiFeedback: evaluation.feedback,
        aiSuggestions: evaluation.suggestions
      });
      
      res.json(updatedSubmission);
    } catch (error: any) {
      console.error('AI evaluation error:', error);
      res.status(500).json({ 
        error: getKoreanErrorMessage(error)
      });
    }
  });

  app.post("/api/writing/feedback/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const submission = await storage.getWritingSubmission(id);
      
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      const topic = await storage.getWritingTopic(submission.topicId);
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
          error: "OpenAI API 키가 설정되지 않았습니다. 환경 변수에서 OPENAI_API_KEY를 설정해주세요."
        });
      }
      
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert English writing tutor. Analyze the student's writing and provide detailed feedback in JSON format.

Your response must be a valid JSON object with this exact structure:
{
  "score": <number 0-100>,
  "grammar_errors": [
    {
      "original": "<incorrect text>",
      "corrected": "<corrected text>",
      "explanation": "<why it's wrong and how to fix it>",
      "type": "<error type: grammar/spelling/punctuation>"
    }
  ],
  "suggestions": [
    {
      "category": "<vocabulary/structure/clarity/style>",
      "issue": "<what needs improvement>",
      "suggestion": "<specific suggestion>",
      "example": "<example of improved version>"
    }
  ],
  "corrected_content": "<fully corrected version of the text>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "areas_for_improvement": ["<area 1>", "<area 2>", ...],
  "overall_feedback": "<2-3 sentences of encouraging overall feedback>"
}

Scoring guidelines:
- 90-100: Excellent - Very few errors, clear and natural expression
- 80-89: Good - Minor errors, generally clear communication
- 70-79: Satisfactory - Some errors but message is understandable
- 60-69: Needs improvement - Multiple errors affecting clarity
- Below 60: Significant revision needed

Be encouraging and constructive. Focus on helping the student improve.`
          },
          {
            role: "user",
            content: `Please analyze this writing:

Writing Prompt: ${topic.prompt}

Student's Writing:
${submission.content}

Provide detailed feedback in JSON format as specified.`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });
      
      const feedbackText = completion.choices[0].message.content;
      if (!feedbackText) {
        throw new Error('No feedback received from AI');
      }
      
      const feedback = JSON.parse(feedbackText);
      
      const updatedSubmission = await storage.updateWritingSubmission(id, {
        aiScore: feedback.score,
        grammarErrors: feedback.grammar_errors,
        suggestions: feedback.suggestions,
        correctedContent: feedback.corrected_content,
        aiStrengths: feedback.strengths,
        areasForImprovement: feedback.areas_for_improvement,
        aiFeedback: feedback.overall_feedback
      });
      
      res.json({
        success: true,
        feedback: {
          score: feedback.score,
          grammarErrors: feedback.grammar_errors,
          suggestions: feedback.suggestions,
          correctedContent: feedback.corrected_content,
          strengths: feedback.strengths,
          areasForImprovement: feedback.areas_for_improvement,
          overallFeedback: feedback.overall_feedback
        },
        submission: updatedSubmission
      });
    } catch (error: any) {
      console.error('GPT-4 feedback error:', error);
      
      if (error.status === 401) {
        return res.status(503).json({ 
          error: 'OpenAI API 키가 유효하지 않습니다.'
        });
      } else if (error.status === 429) {
        return res.status(503).json({ 
          error: 'OpenAI API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.'
        });
      }
      
      res.status(500).json({ 
        error: 'AI 첨삭 중 오류가 발생했습니다. 다시 시도해주세요.'
      });
    }
  });

  app.post("/api/writing/suggest-topics", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { language = 'en', count = 3 } = req.body;
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
          error: "OpenAI API 키가 설정되지 않았습니다. 환경 변수에서 OPENAI_API_KEY를 설정해주세요."
        });
      }
      
      // Get user's recent learning content
      const learningContent = await storage.getRecentLearningContent(userId, language, 20);
      
      // If user has no learning content, return empty
      if (learningContent.vocabulary.length === 0 && 
          learningContent.notes.length === 0 && 
          learningContent.recentTopics.length === 0) {
        return res.json({ topics: [] });
      }
      
      // Prepare context for AI
      const vocabularyWords = learningContent.vocabulary
        .map(v => v.word.word)
        .join(', ');
      
      const notesContent = learningContent.notes
        .map(n => n.content)
        .slice(0, 5)
        .join('\n');
      
      const topics = learningContent.recentTopics.join(', ');
      
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert language learning assistant. Based on the student's recent learning activity, suggest ${count} personalized writing topics that incorporate their learned vocabulary and topics.

Your response must be a valid JSON object with this exact structure:
{
  "topics": [
    {
      "title": "<engaging topic title>",
      "description": "<brief description in Korean>",
      "category": "<one of: email, essay, letter, review, story, opinion>",
      "difficulty": <1-5 based on complexity>,
      "prompt": "<clear writing prompt>",
      "guidelines": ["<guideline 1>", "<guideline 2>", ...],
      "wordCountMin": <minimum words>,
      "wordCountMax": <maximum words>,
      "vocabularyUsed": ["<word 1>", "<word 2>", ...],
      "basedOnContent": ["<topic or note that inspired this>"]
    }
  ]
}

Make topics engaging, relevant, and appropriate for the student's level. Ensure topics naturally incorporate their learned vocabulary.`
          },
          {
            role: "user",
            content: `Please suggest ${count} writing topics based on this student's recent learning:

Recently learned vocabulary: ${vocabularyWords || 'None yet'}

Recent study notes:
${notesContent || 'None yet'}

Recent topics studied: ${topics || 'None yet'}

Create topics that help the student practice using this vocabulary and explore these themes in their writing.`
          }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" }
      });
      
      const responseText = completion.choices[0].message.content;
      if (!responseText) {
        throw new Error('No response from AI');
      }
      
      const suggestedTopics = JSON.parse(responseText);
      
      res.json(suggestedTopics);
    } catch (error: any) {
      console.error('Topic suggestion error:', error);
      
      if (error.status === 401) {
        return res.status(503).json({ 
          error: 'OpenAI API 키가 유효하지 않습니다.'
        });
      } else if (error.status === 429) {
        return res.status(503).json({ 
          error: 'OpenAI API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.'
        });
      }
      
      res.status(500).json({ 
        error: 'AI 주제 생성 중 오류가 발생했습니다. 다시 시도해주세요.'
      });
    }
  });

  app.get("/api/writing/stats", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const stats = await storage.getWritingStats(userId);
      res.json(stats);
    } catch (error: any) {
      console.error('Writing stats fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  app.get("/api/health/openai", async (req, res) => {
    try {
      const { checkOpenAIHealth } = await import('./openai');
      const health = await checkOpenAIHealth();
      res.json(health);
    } catch (error: any) {
      res.json({ 
        status: 'error', 
        message: error.message || 'OpenAI 상태 확인 실패' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
