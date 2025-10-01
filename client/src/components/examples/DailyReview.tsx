import { DailyReview } from "../DailyReview";

const reviewItems = [
  { id: 1, question: "How do you say 'Good morning' in Spanish?", answer: "Buenos días" },
  { id: 2, question: "Translate: 'Where is the bathroom?'", answer: "¿Dónde está el baño?" },
  { id: 3, question: "What does 'gracias' mean?", answer: "Thank you" },
];

export default function DailyReviewExample() {
  return (
    <div className="p-8 max-w-3xl">
      <DailyReview items={reviewItems} />
    </div>
  );
}
