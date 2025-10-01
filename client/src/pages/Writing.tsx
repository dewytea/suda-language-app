import { WritingPrompt } from "@/components/WritingPrompt";
import { WritingFeedback } from "@/components/WritingFeedback";
import { PenLine } from "lucide-react";
import { useState } from "react";

export default function Writing() {
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = (text: string) => {
    console.log("Submitted:", text);
    setShowFeedback(true);
  };

  const corrections = [
    { original: "I goes to school", corrected: "I go to school", type: "grammar" as const },
    { original: "beautifull", corrected: "beautiful", type: "spelling" as const },
  ];

  const suggestions = [
    "Try using more descriptive adjectives to make your writing more vivid",
    "Consider adding transition words between sentences for better flow",
    "Great job expressing your ideas clearly!",
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <PenLine className="h-8 w-8 text-skill-writing" />
        <div>
          <h1 className="font-serif font-bold text-4xl">Writing Practice</h1>
          <p className="text-muted-foreground mt-1">10 minutes • Express yourself</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <WritingPrompt
            prompt="Describe your typical morning routine"
            example="I wake up at 7 AM, brush my teeth, and have breakfast."
            onSubmit={handleSubmit}
          />
        </div>

        {showFeedback && (
          <div>
            <WritingFeedback
              score={85}
              corrections={corrections}
              suggestions={suggestions}
            />
          </div>
        )}
      </div>
    </div>
  );
}
