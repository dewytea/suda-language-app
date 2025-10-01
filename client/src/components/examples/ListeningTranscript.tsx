import { ListeningTranscript } from "../ListeningTranscript";

const sentences = [
  { id: 1, text: "Good morning, how are you?", translation: "좋은 아침입니다, 어떻게 지내세요?" },
  { id: 2, text: "I'm doing well, thank you.", translation: "잘 지내고 있습니다, 감사합니다." },
  { id: 3, text: "What are your plans for today?", translation: "오늘 계획이 무엇인가요?" },
];

export default function ListeningTranscriptExample() {
  return (
    <div className="p-8 max-w-2xl">
      <ListeningTranscript sentences={sentences} currentSentence={1} />
    </div>
  );
}
