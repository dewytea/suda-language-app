import { VoiceRecorder } from "@/components/VoiceRecorder";
import { PronunciationScore } from "@/components/PronunciationScore";
import { KeySentenceCard } from "@/components/KeySentenceCard";
import { Card } from "@/components/ui/card";
import { Mic } from "lucide-react";

export default function Speaking() {
  const keySentences = [
    { sentence: "Where is the boarding gate?", translation: "탑승구가 어디에 있나요?" },
    { sentence: "I would like to check in, please.", translation: "체크인하고 싶습니다." },
    { sentence: "Can I see your passport?", translation: "여권을 보여주시겠습니까?" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Mic className="h-8 w-8 text-skill-speaking" />
        <div>
          <h1 className="font-serif font-bold text-4xl">Speaking Practice</h1>
          <p className="text-muted-foreground mt-1">30 minutes • Focus on pronunciation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-semibold text-xl mb-4">Record Your Voice</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Repeat the sentence below and get instant feedback
            </p>
            <div className="p-4 bg-muted rounded-md mb-6">
              <p className="text-lg font-medium text-center">
                "Where is the boarding gate?"
              </p>
            </div>
            <VoiceRecorder />
          </Card>
        </div>

        <div className="space-y-6">
          <PronunciationScore score={85} />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="font-serif font-semibold text-2xl">Today's Key Sentences</h2>
        <p className="text-muted-foreground">Memorize these essential phrases</p>
        <div className="grid grid-cols-1 gap-4">
          {keySentences.map((item, idx) => (
            <KeySentenceCard
              key={idx}
              sentence={item.sentence}
              translation={item.translation}
              index={idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
