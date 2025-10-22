import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, Trash2, BookmarkCheck, BookmarkX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { UserVocabulary, VocabularyWord } from "@db/schema";

type VocabularyFilter = "all" | "learning" | "learned";

type UserVocabularyWithWord = UserVocabulary & { word: VocabularyWord };

export default function Vocabulary() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<VocabularyFilter>("all");

  const { data: userVocabulary = [], isLoading } = useQuery<UserVocabularyWithWord[]>({
    queryKey: ["/api/vocabulary/user"],
  });

  const toggleLearnedMutation = useMutation({
    mutationFn: async ({ id, learned }: { id: number; learned: boolean }) => {
      return apiRequest("/api/vocabulary/update", {
        method: "POST",
        body: JSON.stringify({ id, learned }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vocabulary/user"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (wordId: number) => {
      return apiRequest(`/api/vocabulary/delete/${wordId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "단어 삭제됨",
        description: "단어를 내 단어장에서 제거했습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vocabulary/user"] });
    },
  });

  const pronounceWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "음성 재생 불가",
        description: "브라우저에서 음성 재생을 지원하지 않습니다.",
        variant: "destructive",
      });
    }
  };

  const filteredVocabulary = userVocabulary.filter((item) => {
    if (filter === "learned") return item.learned;
    if (filter === "learning") return !item.learned;
    return true;
  });

  const stats = {
    total: userVocabulary.length,
    learned: userVocabulary.filter((v) => v.learned).length,
    learning: userVocabulary.filter((v) => !v.learned).length,
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            내 단어장
          </h1>
          <p className="text-muted-foreground" data-testid="text-page-description">
            저장한 단어를 복습하고 관리하세요
          </p>
        </div>

        <Card className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary" data-testid="text-total-count">
                {stats.total}
              </div>
              <div className="text-sm text-muted-foreground">전체 단어</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600" data-testid="text-learning-count">
                {stats.learning}
              </div>
              <div className="text-sm text-muted-foreground">학습 중</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600" data-testid="text-learned-count">
                {stats.learned}
              </div>
              <div className="text-sm text-muted-foreground">외운 단어</div>
            </div>
          </div>
        </Card>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as VocabularyFilter)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" data-testid="tab-all">
              전체 ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="learning" data-testid="tab-learning">
              학습 중 ({stats.learning})
            </TabsTrigger>
            <TabsTrigger value="learned" data-testid="tab-learned">
              외운 단어 ({stats.learned})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground" data-testid="text-loading">
            로딩 중...
          </div>
        ) : filteredVocabulary.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-muted-foreground" data-testid="text-empty">
              {filter === "all" && "아직 저장한 단어가 없습니다. Listening 페이지에서 단어를 클릭하여 추가해보세요!"}
              {filter === "learning" && "학습 중인 단어가 없습니다."}
              {filter === "learned" && "외운 단어가 없습니다."}
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredVocabulary.map((item) => (
              <Card key={item.id} className="p-4" data-testid={`card-word-${item.id}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold" data-testid={`text-word-${item.id}`}>
                        {item.word.word}
                      </h3>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => pronounceWord(item.word.word)}
                        data-testid={`button-pronounce-${item.id}`}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      {item.word.phonetic && (
                        <span className="text-sm text-muted-foreground" data-testid={`text-phonetic-${item.id}`}>
                          {item.word.phonetic}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        {item.word.partOfSpeech && (
                          <Badge variant="secondary" className="shrink-0" data-testid={`badge-pos-${item.id}`}>
                            {item.word.partOfSpeech}
                          </Badge>
                        )}
                        <p className="text-sm" data-testid={`text-definition-${item.id}`}>
                          {item.word.definition}
                        </p>
                      </div>

                      {item.word.exampleSentence && (
                        <p className="text-sm text-muted-foreground italic" data-testid={`text-example-${item.id}`}>
                          "{item.word.exampleSentence}"
                        </p>
                      )}

                      {item.notes && (
                        <div className="mt-2 p-2 bg-muted rounded-sm">
                          <p className="text-sm" data-testid={`text-notes-${item.id}`}>
                            {item.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>복습 횟수: {item.timesReviewed || 0}</span>
                        {item.lastReviewedAt && (
                          <span>
                            • 마지막 복습: {new Date(item.lastReviewedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant={item.learned ? "default" : "outline"}
                      onClick={() =>
                        toggleLearnedMutation.mutate({
                          id: item.id,
                          learned: !item.learned,
                        })
                      }
                      disabled={toggleLearnedMutation.isPending}
                      data-testid={`button-toggle-learned-${item.id}`}
                    >
                      {item.learned ? (
                        <>
                          <BookmarkCheck className="h-4 w-4 mr-1" />
                          외움
                        </>
                      ) : (
                        <>
                          <BookmarkX className="h-4 w-4 mr-1" />
                          학습중
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(item.wordId)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      삭제
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
