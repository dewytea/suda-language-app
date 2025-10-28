import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Target, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import type { SpeakingScenario, ScenarioProgress } from "@shared/schema";

export default function SpeakingScenarioDetail() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const scenarioId = Number(params.id);

  const { data: scenario, isLoading } = useQuery<SpeakingScenario>({
    queryKey: [`/api/speaking-scenarios/${scenarioId}`],
    enabled: !isNaN(scenarioId),
  });

  const { data: progressData = [] } = useQuery<ScenarioProgress[]>({
    queryKey: ["/api/scenario-progress"],
  });

  const progress = progressData.find(p => p.scenarioId === scenarioId);
  const currentStep = progress?.currentStep || 1;
  const completedSteps = progress?.completedSteps || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="h-64 bg-muted rounded" />
      </div>
    );
  }

  if (!scenario) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Scenario not found</p>
          <Link href="/learn/speaking-scenarios">
            <Button className="mt-4">Back to Scenarios</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/learn/speaking-scenarios">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-scenario-title">
            {scenario.title}
          </h1>
          <p className="text-muted-foreground mt-1" data-testid="text-scenario-description">
            {scenario.description}
          </p>
        </div>
      </div>

      {/* Scenario Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Overview</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" data-testid="badge-difficulty">
                Lv.{scenario.difficulty}
              </Badge>
              <Badge variant="outline" data-testid="badge-time">
                <Clock className="w-3 h-3 mr-1" />
                {scenario.estimatedTime} min
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Learning Objectives */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Learning Objectives</h3>
            </div>
            <ul className="space-y-2 ml-7">
              {scenario.learningObjectives.map((objective, idx) => (
                <li 
                  key={idx} 
                  className="text-sm text-muted-foreground"
                  data-testid={`text-objective-${idx}`}
                >
                  • {objective}
                </li>
              ))}
            </ul>
          </div>

          {/* Progress */}
          {progress && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">Your Progress</span>
                <span className="text-muted-foreground" data-testid="text-overall-progress">
                  {completedSteps.length}/{scenario.steps.length} steps completed
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(completedSteps.length / scenario.steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Steps */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Steps</h2>
        <div className="space-y-3">
          {scenario.steps.map((step, idx) => {
            const isCompleted = completedSteps.includes(step.stepNumber);
            const isCurrent = step.stepNumber === currentStep;
            const isLocked = step.stepNumber > currentStep && !isCompleted;

            return (
              <Card 
                key={step.stepNumber}
                className={`hover-elevate ${!isLocked ? 'active-elevate-2' : 'opacity-60 cursor-not-allowed'}`}
                data-testid={`card-step-${step.stepNumber}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`mt-1 ${isCompleted ? 'text-green-600' : isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="mb-1" data-testid={`text-step-title-${step.stepNumber}`}>
                          Step {step.stepNumber}: {step.title}
                        </CardTitle>
                        <CardDescription data-testid={`text-step-situation-${step.stepNumber}`}>
                          {step.situation}
                        </CardDescription>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {step.usefulExpressions.slice(0, 3).map((expr, exprIdx) => (
                            <Badge 
                              key={exprIdx} 
                              variant="secondary"
                              data-testid={`badge-expression-${step.stepNumber}-${exprIdx}`}
                            >
                              {expr.expression}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {!isLocked && (
                      <Link href={`/learn/speaking-scenarios/${scenarioId}/step/${step.stepNumber}/learn`}>
                        <Button 
                          size="sm" 
                          className="gap-2"
                          data-testid={`button-start-step-${step.stepNumber}`}
                        >
                          {isCompleted ? "Review" : isCurrent ? "Continue" : "Start"}
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
