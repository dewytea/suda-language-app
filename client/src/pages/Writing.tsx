import { WritingPrompt } from "@/components/WritingPrompt";
import { WritingFeedback } from "@/components/WritingFeedback";
import { LevelGuide } from "@/components/LevelGuide";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PenLine } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { WritingResult, UserProgress, KeySentence } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Writing() {
  const [selectedLanguage] = useState("en");
  const [latestResult, setLatestResult] = useState<WritingResult | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState("Describe your typical morning routine");
  const [currentExample, setCurrentExample] = useState("I wake up at 7 AM, brush my teeth, and have breakfast.");
  const { toast } = useToast();

  const { data: progress } = useQuery<UserProgress>({
    queryKey: ["/api/progress", selectedLanguage],
  });

  const { data: sentences = [] } = useQuery<KeySentence[]>({
    queryKey: ["/api/sentences", selectedLanguage],
  });

  const { data: savedWritings = [] } = useQuery<WritingResult[]>({
    queryKey: ["/api/writing", selectedLanguage],
  });

  // Generate writing prompt based on today's key sentences
  useEffect(() => {
    if (sentences.length > 0) {
      const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
      const prompts = [
        `Write a short paragraph using the sentence: "${randomSentence.sentence}"`,
        `Create a dialogue that includes: "${randomSentence.sentence}"`,
        `Write about a situation where you would say: "${randomSentence.sentence}"`,
        `Describe a scenario using this phrase: "${randomSentence.sentence}"`,
      ];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setCurrentPrompt(randomPrompt);
      setCurrentExample(randomSentence.sentence);
    }
  }, [sentences]);

  const evaluateWriting = useMutation({
    mutationFn: async ({ prompt, userText }: { prompt: string; userText: string }) => {
      const res = await apiRequest("POST", "/api/writing/evaluate", {
        prompt,
        userText,
        language: selectedLanguage,
      });
      return await res.json();
    },
    onSuccess: (data: WritingResult) => {
      setLatestResult(data);
    },
  });

  const saveWriting = useMutation({
    mutationFn: async (writingId: number) => {
      const res = await apiRequest("POST", "/api/writing/save", {
        writingId,
      });
      return await res.json();
    },
    onSuccess: (data) => {
      setLatestResult(data);
      toast({
        title: "저장 완료",
        description: "작성한 글이 성공적으로 저장되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/writing", selectedLanguage] });
    },
  });

  const handleSubmit = (prompt: string, text: string) => {
    evaluateWriting.mutate({ prompt, userText: text });
  };

  const handleSaveWriting = () => {
    if (latestResult?.id) {
      saveWriting.mutate(latestResult.id);
    }
  };

  const handleDiscardWriting = () => {
    setLatestResult(null);
    toast({
      title: "삭제됨",
      description: "평가 결과가 삭제되었습니다.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <PenLine className="h-8 w-8 text-skill-writing" />
        <div>
          <h1 className="font-serif font-bold text-4xl">쓰기 연습</h1>
          <p className="text-muted-foreground mt-1">10분 • 생각을 글로 표현하세요</p>
        </div>
      </div>

      <LevelGuide level={progress?.level || 1} skill="writing" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <WritingPrompt
            prompt={currentPrompt}
            example={currentExample}
            onSubmit={(text) => handleSubmit(currentPrompt, text)}
            isEvaluating={evaluateWriting.isPending}
          />
        </div>

        {latestResult && (
          <div>
            <WritingFeedback
              score={latestResult.score}
              corrections={latestResult.corrections}
              suggestions={latestResult.suggestions}
              onSave={handleSaveWriting}
              onDiscard={handleDiscardWriting}
              isSaving={saveWriting.isPending}
              isSaved={latestResult.saved}
            />
          </div>
        )}
      </div>

      {savedWritings.filter(w => w.saved).length > 0 && (
        <div className="space-y-6">
          <h2 className="font-serif font-semibold text-2xl">저장된 글</h2>
          <div className="grid grid-cols-1 gap-4">
            {savedWritings
              .filter(w => w.saved)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((writing) => (
                <Card key={writing.id} className="p-6 space-y-4" data-testid={`card-saved-writing-${writing.id}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">점수: {writing.score}/100</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(writing.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <p className="font-medium text-sm text-muted-foreground">{writing.prompt}</p>
                      <p className="text-sm whitespace-pre-wrap">{writing.userText}</p>
                    </div>
                  </div>
                  {writing.corrections.length > 0 && (
                    <div className="pt-3 border-t">
                      <p className="text-sm font-medium mb-2">수정사항:</p>
                      <div className="space-y-1">
                        {writing.corrections.map((correction, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="line-through text-muted-foreground">{correction.original}</span>
                            <span className="mx-2">→</span>
                            <span className="text-primary font-medium">{correction.corrected}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
