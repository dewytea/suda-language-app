import { DailyReview } from "@/components/DailyReview";
import { NotesSection } from "@/components/NotesSection";
import { RotateCcw } from "lucide-react";

const reviewItems = [
  { id: 1, question: "How do you say 'Good morning' in Spanish?", answer: "Buenos días" },
  { id: 2, question: "Translate: 'Where is the bathroom?'", answer: "¿Dónde está el baño?" },
  { id: 3, question: "What does 'gracias' mean?", answer: "Thank you" },
  { id: 4, question: "How do you say 'Please' in Spanish?", answer: "Por favor" },
  { id: 5, question: "What is the Spanish word for 'water'?", answer: "Agua" },
];

export default function Review() {
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
          <DailyReview items={reviewItems} />
        </div>
        
        <div>
          <NotesSection
            initialNotes=""
            onSave={(notes) => console.log("Notes saved:", notes)}
          />
        </div>
      </div>
    </div>
  );
}
