import { AudioPlayer } from "@/components/AudioPlayer";
import { ListeningTranscript } from "@/components/ListeningTranscript";
import { Headphones } from "lucide-react";

const sentences = [
  { id: 1, text: "Good morning, how are you today?", translation: "좋은 아침입니다, 오늘 어떻게 지내세요?" },
  { id: 2, text: "I'm doing well, thank you for asking.", translation: "잘 지내고 있습니다, 물어봐 주셔서 감사합니다." },
  { id: 3, text: "What are your plans for the weekend?", translation: "주말 계획이 무엇인가요?" },
  { id: 4, text: "I'm planning to visit the museum.", translation: "박물관을 방문할 계획입니다." },
  { id: 5, text: "That sounds like a great idea!", translation: "정말 좋은 생각이네요!" },
];

export default function Listening() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Headphones className="h-8 w-8 text-skill-listening" />
        <div>
          <h1 className="font-serif font-bold text-4xl">Listening Practice</h1>
          <p className="text-muted-foreground mt-1">10 minutes • Train your ear</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <AudioPlayer title="Daily Conversation" duration="5:30" />
        </div>
        <div>
          <ListeningTranscript sentences={sentences} currentSentence={1} />
        </div>
      </div>
    </div>
  );
}
