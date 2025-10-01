import { ReadingContent } from "@/components/ReadingContent";
import { VocabularyItem } from "@/components/VocabularyItem";
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Vocabulary } from "@shared/schema";
import { useState } from "react";

export default function Reading() {
  const [selectedLanguage] = useState("en");

  const { data: vocabulary = [] } = useQuery<Vocabulary[]>({
    queryKey: ["/api/vocabulary", selectedLanguage],
  });

  const deleteVocabulary = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/vocabulary/${id}`, undefined);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vocabulary", selectedLanguage] });
    },
  });

  const addVocabulary = useMutation({
    mutationFn: async (vocab: Omit<Vocabulary, "id">) => {
      const res = await apiRequest("POST", "/api/vocabulary", vocab);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vocabulary", selectedLanguage] });
    },
  });

  const handleDeleteWord = (id: number) => {
    deleteVocabulary.mutate(id);
  };

  const handleWordClick = (word: string) => {
    const newVocab = {
      word,
      translation: "Click to add translation",
      language: selectedLanguage,
    };
    addVocabulary.mutate(newVocab);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-skill-reading" />
        <div>
          <h1 className="font-serif font-bold text-4xl">Reading Practice</h1>
          <p className="text-muted-foreground mt-1">10 minutes • Build comprehension</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ReadingContent
            title="The Little Prince"
            content="Once when I was six years old I saw a magnificent picture in a book about the primeval forest. It was a picture of a boa constrictor swallowing an animal. In the book it said: 'Boa constrictors swallow their prey whole, without chewing it. After that they are not able to move, and they sleep through the six months that they need for digestion.'"
            translation="내가 여섯 살이었을 때, 원시림에 관한 책에서 멋진 그림을 보았습니다. 그것은 보아뱀이 동물을 삼키는 그림이었습니다. 책에는 이렇게 쓰여 있었습니다: '보아뱀은 먹이를 씹지 않고 통째로 삼킵니다. 그 후 그들은 움직일 수 없으며, 소화에 필요한 6개월 동안 잠을 잡니다.'"
            onWordClick={handleWordClick}
          />
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">My Vocabulary</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click on words in the text to add them here
            </p>
            {vocabulary.length === 0 ? (
              <p className="text-sm text-center text-muted-foreground py-8">
                No vocabulary yet. Click on words to add them!
              </p>
            ) : (
              <div className="space-y-3">
                {vocabulary.map((item) => (
                  <VocabularyItem
                    key={item.id}
                    word={item.word}
                    translation={item.translation}
                    example={item.example}
                    onDelete={() => handleDeleteWord(item.id)}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
