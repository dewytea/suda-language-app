import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ReviewItem {
  id: number;
  question: string;
  answer: string;
}

interface DailyReviewProps {
  items: ReviewItem[];
}

export function DailyReview({ items }: DailyReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const currentItem = items[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-daily-review">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-semibold text-2xl">Daily Review</h3>
        <Badge variant="secondary">
          {currentIndex + 1} / {items.length}
        </Badge>
      </div>

      <div className="min-h-48 flex items-center justify-center p-8">
        <div className="text-center space-y-4 w-full">
          <p className="text-xl font-medium">{currentItem.question}</p>
          {showAnswer && (
            <div className="p-4 bg-primary/10 rounded-md mt-6">
              <p className="text-lg text-primary font-medium">{currentItem.answer}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          data-testid="button-previous"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {!showAnswer ? (
          <Button onClick={() => setShowAnswer(true)} data-testid="button-show-answer">
            Show Answer
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => setShowAnswer(false)} data-testid="button-hide-answer">
            Hide Answer
          </Button>
        )}

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === items.length - 1}
          data-testid="button-next"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
}

function Badge({ variant, children }: { variant: string; children: React.ReactNode }) {
  return (
    <span className={`px-3 py-1 rounded-md text-sm font-medium ${
      variant === "secondary" ? "bg-secondary text-secondary-foreground" : ""
    }`}>
      {children}
    </span>
  );
}
