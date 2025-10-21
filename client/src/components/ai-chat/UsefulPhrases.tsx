import { useState } from 'react';
import { BookOpen, Copy, Check, Hand, Heart, MessageSquare, Lightbulb } from 'lucide-react';

const phrases = [
  {
    category: '인사',
    icon: Hand,
    items: [
      { english: 'How are you?', korean: '어떻게 지내세요?' },
      { english: 'Nice to meet you', korean: '만나서 반가워요' },
      { english: 'Long time no see', korean: '오랜만이에요' },
      { english: 'Have a great day', korean: '좋은 하루 보내세요' }
    ]
  },
  {
    category: '감사',
    icon: Heart,
    items: [
      { english: 'Thank you so much', korean: '정말 감사합니다' },
      { english: 'I appreciate it', korean: '감사하게 생각해요' },
      { english: 'Thanks for your help', korean: '도움 주셔서 감사해요' },
      { english: "You're welcome", korean: '천만에요' }
    ]
  },
  {
    category: '요청',
    icon: MessageSquare,
    items: [
      { english: 'Could you please...?', korean: '...해 주시겠어요?' },
      { english: 'Would you mind...?', korean: '...해도 될까요?' },
      { english: 'Can I ask you something?', korean: '질문 하나 해도 될까요?' },
      { english: 'May I...?', korean: '...해도 되나요?' }
    ]
  },
  {
    category: '의견',
    icon: Lightbulb,
    items: [
      { english: 'I think...', korean: '제 생각에는...' },
      { english: 'In my opinion...', korean: '제 의견으로는...' },
      { english: 'I agree with you', korean: '동의해요' },
      { english: 'I see your point', korean: '무슨 말인지 알겠어요' }
    ]
  }
];

export default function UsefulPhrases() {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  
  const handleCopy = (text: string, index: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" data-testid="icon-useful-phrases" />
        유용한 표현
      </h3>
      
      {phrases.map((category) => {
        const Icon = category.icon;
        return (
          <div key={category.category} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span>{category.category}</span>
            </h4>
            
            <div className="space-y-2">
              {category.items.map((item, idx) => {
                const uniqueKey = `${category.category}-${idx}`;
                const isCopied = copiedIndex === uniqueKey;
                
                return (
                  <div
                    key={idx}
                    className="p-2 bg-muted rounded-md hover-elevate transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground" data-testid={`text-phrase-${uniqueKey}`}>
                          {item.english}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.korean}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopy(item.english, uniqueKey)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover-elevate active-elevate-2 rounded transition-opacity"
                        title="복사"
                        data-testid={`button-copy-${uniqueKey}`}
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
