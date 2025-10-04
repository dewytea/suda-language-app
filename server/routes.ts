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
} from "@shared/schema";

// Using Gemini AI integration - see blueprint:javascript_gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

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
        message: `Gemini API 오류: ${error.message}`,
        configured: !!GEMINI_API_KEY
      });
    }
  });

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
      const { scenario } = req.query;
      const sentences = await storage.getKeySentences(language, scenario as string);
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
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
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
      res.status(500).json({ error: error.message });
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

  // Writing Feedback with Gemini
  app.post("/api/writing/evaluate", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
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
        model: "gemini-2.5-pro",
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
      res.status(500).json({ error: error.message });
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

  const httpServer = createServer(app);

  return httpServer;
}
