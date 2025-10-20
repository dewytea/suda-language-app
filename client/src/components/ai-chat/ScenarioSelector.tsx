import { useState } from 'react';
import { ChevronDown, MessageCircle, Utensils, Building2, ShoppingBag, Briefcase, Plane } from 'lucide-react';

const scenarios = [
  { id: 'free', name: '자유 대화', icon: MessageCircle },
  { id: 'restaurant', name: '식당', icon: Utensils },
  { id: 'hotel', name: '호텔', icon: Building2 },
  { id: 'shopping', name: '쇼핑', icon: ShoppingBag },
  { id: 'interview', name: '면접', icon: Briefcase },
  { id: 'travel', name: '여행', icon: Plane },
];

interface ScenarioSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ScenarioSelector({ value, onChange }: ScenarioSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selected = scenarios.find(s => s.id === value) || scenarios[0];
  const SelectedIcon = selected.icon;
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-md transition-colors"
        data-testid="button-scenario-selector"
      >
        <SelectedIcon className="w-4 h-4" />
        <span className="text-sm font-medium">{selected.name}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-popover rounded-md shadow-lg border z-20 py-1">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <button
                  key={scenario.id}
                  onClick={() => {
                    onChange(scenario.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2 hover:bg-accent flex items-center gap-2 transition-colors',
                    value === scenario.id && 'bg-accent text-accent-foreground'
                  )}
                  data-testid={`scenario-${scenario.id}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{scenario.name}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
