import { useState } from 'react';
import { Keyboard, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface DictationInputProps {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export function DictationInput({ onSubmit, disabled }: DictationInputProps) {
  const [input, setInput] = useState('');
  
  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input.trim());
    }
  };
  
  const handleClear = () => {
    setInput('');
  };
  
  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Keyboard className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">받아쓰기</h3>
      </div>
      
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        placeholder="들은 내용을 정확하게 입력하세요..."
        className="h-32 resize-none"
        data-testid="input-dictation"
      />
      
      <div className="flex items-center justify-between mt-3">
        <span className="text-sm text-muted-foreground">
          {input.length} 글자
        </span>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={disabled || !input}
            data-testid="button-clear"
          >
            <Eraser className="w-4 h-4 mr-2" />
            지우기
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={disabled || !input.trim()}
            data-testid="button-submit"
          >
            제출하기
          </Button>
        </div>
      </div>
    </div>
  );
}
