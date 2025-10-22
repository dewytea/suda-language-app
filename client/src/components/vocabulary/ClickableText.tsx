import { useState } from "react";
import { Volume2, BookmarkPlus, BookmarkCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { VocabularyWord, UserVocabulary } from "@shared/schema";

interface WordPopupProps {
  word: string;
  position: { x: number; y: number };
  onClose: () => void;
}

function WordPopup({ word, position, onClose }: WordPopupProps) {
  const { toast } = useToast();
  const [externalData, setExternalData] = useState<any>(null);
  const [loadingExternal, setLoadingExternal] = useState(false);

  // Query for local vocabulary word
  const { data: wordData, isLoading } = useQuery<VocabularyWord>({
    queryKey: ["/api/vocabulary/word", word],
    enabled: !!word,
  });

  // Check if word is saved
  const { data: isSaved, refetch: refetchSaved } = useQuery<boolean>({
    queryKey: ["/api/vocabulary/saved", word],
    enabled: !!wordData,
  });

  // Save word mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!wordData) return;
      return apiRequest("POST", "/api/vocabulary/save", { wordId: wordData.id });
    },
    onSuccess: () => {
      toast({
        title: "단어 저장됨",
        description: `"${word}" 단어를 내 단어장에 추가했습니다.`,
      });
      refetchSaved();
      queryClient.invalidateQueries({ queryKey: ["/api/vocabulary/user"] });
    },
  });

  // Delete word mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!wordData) return;
      return apiRequest("DELETE", `/api/vocabulary/delete/${wordData.id}`);
    },
    onSuccess: () => {
      toast({
        title: "단어 삭제됨",
        description: `"${word}" 단어를 내 단어장에서 제거했습니다.`,
      });
      refetchSaved();
      queryClient.invalidateQueries({ queryKey: ["/api/vocabulary/user"] });
    },
  });

  // Fetch external dictionary data as fallback
  const fetchExternalDictionary = async () => {
    if (loadingExternal || externalData) return;
    setLoadingExternal(true);
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
      );
      if (response.ok) {
        const data = await response.json();
        setExternalData(data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch external dictionary:", error);
    } finally {
      setLoadingExternal(false);
    }
  };

  // Load external dictionary if no local data
  if (!isLoading && !wordData && !externalData && !loadingExternal) {
    fetchExternalDictionary();
  }

  // Pronounce word using Web Speech API
  const pronounceWord = () => {
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

  const displayData = wordData || (externalData && {
    word: externalData.word,
    phonetic: externalData.phonetic || externalData.phonetics?.[0]?.text || "",
    partOfSpeech: externalData.meanings?.[0]?.partOfSpeech || "",
    definition: externalData.meanings?.[0]?.definitions?.[0]?.definition || "",
    exampleSentence: externalData.meanings?.[0]?.definitions?.[0]?.example || "",
  });

  return (
    <div
      className="fixed z-50 bg-card border border-border rounded-md shadow-lg p-4 max-w-sm"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translateY(8px)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold" data-testid="text-word">
              {word}
            </h3>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={pronounceWord}
              data-testid="button-pronounce"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          {displayData?.phonetic && (
            <p className="text-sm text-muted-foreground" data-testid="text-phonetic">
              {displayData.phonetic}
            </p>
          )}
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={onClose}
          data-testid="button-close-popup"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {isLoading || loadingExternal ? (
        <div className="text-sm text-muted-foreground" data-testid="text-loading">
          로딩 중...
        </div>
      ) : displayData ? (
        <div className="space-y-3">
          {displayData.partOfSpeech && (
            <Badge variant="secondary" data-testid="badge-part-of-speech">
              {displayData.partOfSpeech}
            </Badge>
          )}
          
          <div>
            <p className="text-sm font-medium mb-1">정의:</p>
            <p className="text-sm text-foreground" data-testid="text-definition">
              {displayData.definition}
            </p>
          </div>

          {displayData.exampleSentence && (
            <div>
              <p className="text-sm font-medium mb-1">예문:</p>
              <p className="text-sm text-muted-foreground italic" data-testid="text-example">
                "{displayData.exampleSentence}"
              </p>
            </div>
          )}

          {wordData && (
            <div className="pt-2 border-t">
              {isSaved ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                  data-testid="button-remove-word"
                >
                  <BookmarkCheck className="h-4 w-4 mr-2" />
                  저장됨
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  data-testid="button-save-word"
                >
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  내 단어장에 추가
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground" data-testid="text-not-found">
          단어를 찾을 수 없습니다.
        </div>
      )}
    </div>
  );
}

interface ClickableTextProps {
  text: string;
  className?: string;
}

export default function ClickableText({ text, className = "" }: ClickableTextProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const handleWordClick = (word: string, event: React.MouseEvent) => {
    // Remove punctuation and convert to lowercase
    const cleanWord = word.replace(/[.,!?;:"""''()]/g, "").toLowerCase();
    if (cleanWord.length === 0) return;

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setPopupPosition({
      x: rect.left,
      y: rect.bottom,
    });
    setSelectedWord(cleanWord);
  };

  const handleClosePopup = () => {
    setSelectedWord(null);
  };

  // Close popup when clicking outside
  const handleBackdropClick = () => {
    handleClosePopup();
  };

  // Split text into words and make them clickable
  const words = text.split(/(\s+)/);

  return (
    <>
      <div className={className} data-testid="clickable-text-container">
        {words.map((word, index) => {
          if (word.trim().length === 0) {
            return <span key={index}>{word}</span>;
          }
          return (
            <span
              key={index}
              className="cursor-pointer hover-elevate px-0.5 rounded"
              onClick={(e) => handleWordClick(word, e)}
              data-testid={`clickable-word-${index}`}
            >
              {word}
            </span>
          );
        })}
      </div>

      {selectedWord && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={handleBackdropClick}
            data-testid="popup-backdrop"
          />
          <WordPopup
            word={selectedWord}
            position={popupPosition}
            onClose={handleClosePopup}
          />
        </>
      )}
    </>
  );
}
