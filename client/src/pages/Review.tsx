import { DailyReview } from "@/components/DailyReview";
import { NotesSection } from "@/components/NotesSection";
import { RotateCcw } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ReviewItem, Note } from "@shared/schema";
import { useState, useEffect } from "react";

export default function Review() {
  const [selectedLanguage] = useState("en");

  const { data: reviewItems = [], status: reviewStatus } = useQuery<ReviewItem[]>({
    queryKey: ["/api/review", selectedLanguage],
  });

  const { data: notes = [] } = useQuery<Note[]>({
    queryKey: ["/api/notes", selectedLanguage],
  });

  const addReviewItem = useMutation({
    mutationFn: async (item: Omit<ReviewItem, "id" | "nextReview">) => {
      const res = await apiRequest("POST", "/api/review", item);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/review", selectedLanguage] });
    },
  });

  const saveNote = useMutation({
    mutationFn: async (note: Omit<Note, "id" | "createdAt">) => {
      const res = await apiRequest("POST", "/api/notes", note);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes", selectedLanguage] });
    },
  });

  useEffect(() => {
    if (reviewStatus === "success" && reviewItems.length === 0) {
      const defaultReviewItems = [
        { question: "How do you say 'Good morning' in Spanish?", answer: "Buenos días", language: "en", skill: "speaking" as const },
        { question: "Translate: 'Where is the bathroom?'", answer: "¿Dónde está el baño?", language: "en", skill: "speaking" as const },
        { question: "What does 'gracias' mean?", answer: "Thank you", language: "en", skill: "speaking" as const },
        { question: "How do you say 'Please' in Spanish?", answer: "Por favor", language: "en", skill: "speaking" as const },
        { question: "What is the Spanish word for 'water'?", answer: "Agua", language: "en", skill: "speaking" as const },
      ];
      
      defaultReviewItems.forEach(item => addReviewItem.mutate(item));
    }
  }, [reviewStatus, reviewItems.length]);

  const handleSaveNote = (content: string) => {
    saveNote.mutate({
      content,
      skill: "speaking",
      language: selectedLanguage,
    });
  };

  const displayItems = reviewItems.map(item => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));

  const latestNote = notes.length > 0 ? notes[notes.length - 1].content : "";

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <RotateCcw className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-serif font-bold text-4xl">Daily Review</h1>
          <p className="text-muted-foreground mt-1">10 minutes • Reinforce yesterday's learning</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {displayItems.length > 0 ? (
            <DailyReview items={displayItems} />
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Loading review items...
            </div>
          )}
        </div>
        
        <div>
          <NotesSection
            initialNotes={latestNote}
            onSave={handleSaveNote}
          />
        </div>
      </div>
    </div>
  );
}
