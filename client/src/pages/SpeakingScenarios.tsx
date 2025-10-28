import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Plane, Coffee, Users, Clock, BarChart, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import type { SpeakingScenario, ScenarioProgress } from "@shared/schema";

const categoryIcons = {
  business: Briefcase,
  travel: Plane,
  daily_life: Coffee,
  social: Users,
};

const categoryLabels = {
  business: "Business",
  travel: "Travel",
  daily_life: "Daily Life",
  social: "Social",
};

const categoryColors = {
  business: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  travel: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  daily_life: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  social: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
};

const difficultyLabels = {
  1: "Beginner",
  2: "Elementary",
  3: "Intermediate",
  4: "Upper-Intermediate",
  5: "Advanced",
};

export default function SpeakingScenarios() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: scenarios = [], isLoading } = useQuery<SpeakingScenario[]>({
    queryKey: ["/api/speaking-scenarios", selectedCategory !== "all" ? { category: selectedCategory } : {}],
  });

  const { data: progressData = [] } = useQuery<ScenarioProgress[]>({
    queryKey: ["/api/scenario-progress"],
  });

  const getProgress = (scenarioId: number) => {
    return progressData.find(p => p.scenarioId === scenarioId);
  };

  const filteredScenarios = selectedCategory === "all" 
    ? scenarios 
    : scenarios.filter(s => s.category === selectedCategory);

  const categories = [
    { value: "all", label: "All Scenarios" },
    { value: "business", label: "Business" },
    { value: "travel", label: "Travel" },
    { value: "daily_life", label: "Daily Life" },
    { value: "social", label: "Social" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
          Speaking Practice
        </h1>
        <p className="text-muted-foreground" data-testid="text-page-description">
          Practice real-world English conversations through interactive scenarios
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? "default" : "outline"}
            onClick={() => setSelectedCategory(cat.value)}
            data-testid={`button-category-${cat.value}`}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Scenarios Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover-elevate">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredScenarios.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground" data-testid="text-no-scenarios">
              No scenarios found for this category
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario) => {
            const Icon = categoryIcons[scenario.category];
            const progress = getProgress(scenario.id);
            const completedSteps = progress?.completedSteps.length || 0;
            const totalSteps = scenario.steps.length;
            const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

            return (
              <Card 
                key={scenario.id} 
                className="hover-elevate active-elevate-2 flex flex-col"
                data-testid={`card-scenario-${scenario.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg ${categoryColors[scenario.category]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" data-testid={`badge-difficulty-${scenario.id}`}>
                      Lv.{scenario.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2" data-testid={`text-title-${scenario.id}`}>
                    {scenario.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3" data-testid={`text-description-${scenario.id}`}>
                    {scenario.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{scenario.estimatedTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart className="w-4 h-4" />
                        <span>{totalSteps} steps</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {progress && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium" data-testid={`text-progress-${scenario.id}`}>
                            {completedSteps}/{totalSteps}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link href={`/learn/speaking-scenarios/${scenario.id}`}>
                    <Button 
                      className="w-full gap-2"
                      data-testid={`button-start-${scenario.id}`}
                    >
                      {progress && completedSteps > 0 ? "Continue" : "Start"}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
