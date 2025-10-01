import { WritingPrompt } from "@/components/WritingPrompt";
import { WritingFeedback } from "@/components/WritingFeedback";
import { LevelGuide } from "@/components/LevelGuide";
import { PenLine } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { WritingResult, UserProgress } from "@shared/schema";

export default function Writing() {
  const [selectedLanguage] = useState("en");
  const [latestResult, setLatestResult] = useState<WritingResult | null>(null);

  const { data: progress } = useQuery<UserProgress>({
    queryKey: ["/api/progress", selectedLanguage],
  });

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

  const handleSubmit = (prompt: string, text: string) => {
    evaluateWriting.mutate({ prompt, userText: text });
  };

  const currentPrompt = "Describe your typical morning routine";
  const currentExample = "I wake up at 7 AM, brush my teeth, and have breakfast.";

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
            />
          </div>
        )}
      </div>
    </div>
  );
}
