import { KeySentenceCard } from "../KeySentenceCard";

export default function KeySentenceCardExample() {
  return (
    <div className="p-8 max-w-2xl space-y-4">
      <KeySentenceCard
        sentence="Where is the boarding gate?"
        translation="탑승구가 어디에 있나요?"
        index={1}
      />
    </div>
  );
}
