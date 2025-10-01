import { WritingPrompt } from "../WritingPrompt";

export default function WritingPromptExample() {
  return (
    <div className="p-8 max-w-2xl">
      <WritingPrompt
        prompt="Describe your morning routine"
        example="I wake up at 7 AM and have breakfast."
        onSubmit={(text) => console.log('Submitted:', text)}
      />
    </div>
  );
}
