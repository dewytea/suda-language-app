import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GoogleGenAI } from "@google/genai";
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
  app.get("/api/progress/:language", async (req, res) => {
    try {
      const { language } = req.params;
      let progress = await storage.getUserProgress(language);
      
      if (!progress) {
        progress = await storage.createUserProgress({
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

  app.patch("/api/progress/:language", async (req, res) => {
    try {
      const { language } = req.params;
      const updates = insertUserProgressSchema.partial().parse(req.body);
      const progress = await storage.updateUserProgress(language, updates);
      res.json(progress);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Vocabulary Routes
  app.get("/api/vocabulary/:language", async (req, res) => {
    try {
      const { language } = req.params;
      const vocabulary = await storage.getVocabulary(language);
      res.json(vocabulary);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/vocabulary", async (req, res) => {
    try {
      const vocab = insertVocabularySchema.parse(req.body);
      const created = await storage.addVocabulary(vocab);
      res.json(created);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/vocabulary/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteVocabulary(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Key Sentences Routes
  app.get("/api/sentences/:language", async (req, res) => {
    try {
      const { language } = req.params;
      const { scenario, category, difficulty } = req.query;
      const filters: { scenario?: string; category?: string; difficulty?: number } = {};
      
      if (scenario) filters.scenario = scenario as string;
      if (category) filters.category = category as string;
      if (difficulty) filters.difficulty = parseInt(difficulty as string);
      
      const sentences = await storage.getKeySentences(language, filters);
      res.json(sentences);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sentences", async (req, res) => {
    try {
      const sentence = insertKeySentenceSchema.parse(req.body);
      const created = await storage.addKeySentence(sentence);
      res.json(created);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/sentences/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertKeySentenceSchema.partial().parse(req.body);
      const updated = await storage.updateKeySentence(id, updates);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Notes Routes
  app.get("/api/notes/:language", async (req, res) => {
    try {
      const { language } = req.params;
      const { skill } = req.query;
      const notes = await storage.getNotes(language, skill as string);
      res.json(notes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const note = insertNoteSchema.parse(req.body);
      const saved = await storage.saveNote(note);
      res.json(saved);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Review Items Routes
  app.get("/api/review/:language", async (req, res) => {
    try {
      const { language } = req.params;
      const items = await storage.getReviewItems(language);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/review", async (req, res) => {
    try {
      const item = insertReviewItemSchema.parse(req.body);
      const created = await storage.addReviewItem(item);
      res.json(created);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/review/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { nextReview } = req.body;
      if (!nextReview || isNaN(new Date(nextReview).getTime())) {
        return res.status(400).json({ error: "Invalid nextReview date" });
      }
      const updated = await storage.updateReviewItem(id, new Date(nextReview));
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Achievements Routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/achievements/:id/unlock", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const achievement = await storage.unlockAchievement(id);
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
  app.post("/api/pronunciation/evaluate", async (req, res) => {
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
      
      const pronunciationResult = insertPronunciationResultSchema.parse({
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

  app.get("/api/pronunciation/:language", async (req, res) => {
    try {
      const { language } = req.params;
      const results = await storage.getPronunciationResults(language);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Speaking Feedback with Gemini AI
  app.post("/api/speaking/feedback", async (req, res) => {
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
  app.post("/api/writing/evaluate", async (req, res) => {
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
      
      const writingResult = insertWritingResultSchema.parse({
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

  app.get("/api/writing/:language", async (req, res) => {
    try {
      const { language } = req.params;
      const results = await storage.getWritingResults(language);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/writing/save", async (req, res) => {
    try {
      const { writingId } = req.body;
      
      if (!writingId) {
        return res.status(400).json({ error: "writingId is required" });
      }

      const updated = await storage.updateWritingResult(writingId, { saved: true });
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Speaking Progress Routes
  app.get("/api/speaking-progress/:language", async (req, res) => {
    try {
      const { language } = req.params;
      let progress = await storage.getSpeakingProgress(language);
      
      if (!progress) {
        progress = await storage.createSpeakingProgress({
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

  app.patch("/api/speaking-progress/:language", async (req, res) => {
    try {
      const { language } = req.params;
      const updates = insertSpeakingProgressSchema.partial().parse(req.body);
      const progress = await storage.updateSpeakingProgress(language, updates);
      res.json(progress);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
