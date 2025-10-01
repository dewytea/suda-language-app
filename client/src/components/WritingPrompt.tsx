import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PenLine, Send } from "lucide-react";
import { useState } from "react";

interface WritingPromptProps {
  prompt: string;
  example: string;
  onSubmit: (text: string) => void;
}

export function WritingPrompt({ prompt, example, onSubmit }: WritingPromptProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    onSubmit(text);
    console.log("Submitted:", text);
  };

  return (
    <Card className="p-6 space-y-4" data-testid="card-writing-prompt">
      <div className="flex items-center gap-3">
        <PenLine className="h-6 w-6 text-skill-writing" />
        <div>
          <h3 className="font-semibold text-lg">{prompt}</h3>
          <p className="text-sm text-muted-foreground">Example: {example}</p>
        </div>
      </div>
      <Textarea
        placeholder="Write your answer here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-32 resize-none"
        data-testid="textarea-writing"
      />
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{text.length} characters</p>
        <Button onClick={handleSubmit} disabled={!text.trim()} data-testid="button-submit-writing">
          <Send className="h-4 w-4 mr-2" />
          Submit
        </Button>
      </div>
    </Card>
  );
}
