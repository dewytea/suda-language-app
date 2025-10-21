import { MessageCircle, Coffee, Palette, Plane, UtensilsCrossed } from 'lucide-react';

const topics = [
  {
    category: '일상',
    icon: Coffee,
    suggestions: [
      'Tell me about your morning routine',
      'What did you do last weekend?',
      'Do you have any hobbies?',
      'What kind of music do you like?'
    ]
  },
  {
    category: '취미',
    icon: Palette,
    suggestions: [
      'What do you do in your free time?',
      'Have you read any good books lately?',
      'Do you enjoy cooking?',
      'What sports do you like?'
    ]
  },
  {
    category: '여행',
    icon: Plane,
    suggestions: [
      'Where would you like to travel?',
      'What was your best vacation?',
      'Do you prefer beaches or mountains?',
      'Have you been abroad?'
    ]
  },
  {
    category: '음식',
    icon: UtensilsCrossed,
    suggestions: [
      'What is your favorite food?',
      'Can you cook well?',
      'Do you like trying new foods?',
      'What did you eat for breakfast?'
    ]
  }
];

interface TopicSuggestionsProps {
  onSelectTopic: (topic: string) => void;
}

export default function TopicSuggestions({ onSelectTopic }: TopicSuggestionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" data-testid="icon-topic-suggestions" />
        대화 주제
      </h3>
      
      {topics.map((topic) => {
        const Icon = topic.icon;
        return (
          <div key={topic.category} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span>{topic.category}</span>
            </h4>
            
            <div className="space-y-2">
              {topic.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectTopic(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm bg-muted hover-elevate active-elevate-2 rounded-md transition-colors"
                  data-testid={`button-topic-${topic.category}-${idx}`}
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
