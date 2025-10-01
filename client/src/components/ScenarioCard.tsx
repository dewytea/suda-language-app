import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface ScenarioCardProps {
  title: string;
  description: string;
  imageUrl: string;
  onClick: () => void;
}

export function ScenarioCard({ title, description, imageUrl, onClick }: ScenarioCardProps) {
  return (
    <Card 
      className="overflow-hidden hover-elevate active-elevate-2 transition-all cursor-pointer group"
      onClick={onClick}
      data-testid={`card-scenario-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10" />
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
          <h3 className="font-serif font-semibold text-xl mb-1">{title}</h3>
          <p className="text-sm text-white/90">{description}</p>
        </div>
      </div>
      <div className="p-4">
        <Button variant="ghost" className="w-full justify-between" data-testid={`button-start-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          Start Practice
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
