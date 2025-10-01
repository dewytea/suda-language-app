import { WritingFeedback } from "../WritingFeedback";

const corrections = [
  { original: "I goes to school", corrected: "I go to school", type: "grammar" as const },
  { original: "beautifull", corrected: "beautiful", type: "spelling" as const },
];

const suggestions = [
  "Try using more descriptive adjectives",
  "Consider adding transition words between sentences",
];

export default function WritingFeedbackExample() {
  return (
    <div className="p-8 max-w-2xl">
      <WritingFeedback score={85} corrections={corrections} suggestions={suggestions} />
    </div>
  );
}
