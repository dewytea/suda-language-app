import { PronunciationScore } from "../PronunciationScore";

export default function PronunciationScoreExample() {
  return (
    <div className="p-8 max-w-sm">
      <PronunciationScore score={85} />
    </div>
  );
}
