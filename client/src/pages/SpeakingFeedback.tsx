import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, ThumbsUp, TrendingUp, RotateCcw, ChevronRight } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SpeakingScenario } from "@shared/schema";

interface EvaluationResult {
  scores: {
    pronunciation: number;
    grammar: number;
    fluency: number;
    appropriateness: number;
    overall: number;
  };
  feedback: {
    wellDone: string[];
    improvements: string[];
  };
  detailedAnalysis: string;
}

export default function SpeakingFeedback() {
  const params = useParams<{ id: string; stepNumber: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const scenarioId = Number(params.id);
  const stepNumber = Number(params.stepNumber);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const { data: scenario, isLoading } = useQuery<SpeakingScenario>({
    queryKey: [`/api/speaking-scenarios/${scenarioId}`],
    enabled: !isNaN(scenarioId),
  });

  const step = scenario?.steps.find(s => s.stepNumber === stepNumber);

  const updateProgressMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/scenario-progress/${scenarioId}`, {
        currentStep: stepNumber + 1,
        completedSteps: [stepNumber],
        bestScore: evaluation?.scores.overall || 0,
        attemptCount: 1,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scenario-progress"] });
    },
  });

  // Get evaluation from conversation history or evaluate now
  useEffect(() => {
    if (!evaluation && step) {
      // For now, we'll show mock data since we need to pass messages
      // In a real implementation, messages would be stored in state/context
      setEvaluation({
        scores: {
          pronunciation: 85,
          grammar: 90,
          fluency: 80,
          appropriateness: 88,
          overall: 86,
        },
        feedback: {
          wellDone: [
            "Great use of formal language appropriate for the scenario",
            "Clear pronunciation and good speaking pace",
            "Successfully used key expressions naturally in context",
          ],
          improvements: [
            "Try to use more varied sentence structures",
            "Pay attention to article usage (a, an, the)",
          ],
        },
        detailedAnalysis: "You demonstrated strong communication skills in this business scenario. Your use of professional language was appropriate, and you maintained good conversation flow. Focus on expanding your vocabulary and using more complex sentence patterns to reach the next level.",
      });
    }
  }, [step, evaluation]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 75) return "text-blue-600 dark:text-blue-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-orange-600 dark:text-orange-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  };

  const handleNextStep = () => {
    if (scenario && stepNumber < scenario.steps.length) {
      updateProgressMutation.mutate();
      setLocation(`/learn/speaking-scenarios/${scenarioId}/step/${stepNumber + 1}/learn`);
    } else {
      updateProgressMutation.mutate();
      setLocation(`/learn/speaking-scenarios/${scenarioId}`);
    }
  };

  const handleRetry = () => {
    setLocation(`/learn/speaking-scenarios/${scenarioId}/step/${stepNumber}/conversation`);
  };

  if (isLoading || !evaluation) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="h-96 bg-muted rounded" />
      </div>
    );
  }

  if (!scenario || !step) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Step not found</p>
          <Link href={`/learn/speaking-scenarios/${scenarioId}`}>
            <Button className="mt-4">Back to Scenario</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/learn/speaking-scenarios/${scenarioId}`}>
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <Badge variant="outline" className="mb-2" data-testid="badge-step">
            Step {step.stepNumber}
          </Badge>
          <h1 className="text-3xl font-bold" data-testid="text-feedback-title">
            Conversation Feedback
          </h1>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="py-8">
          <div className="text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-primary" />
            <div className={`text-5xl font-bold mb-2 ${getScoreColor(evaluation.scores.overall)}`} data-testid="text-overall-score">
              {evaluation.scores.overall}
            </div>
            <p className="text-lg text-muted-foreground">{getScoreLabel(evaluation.scores.overall)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(evaluation.scores)
            .filter(([key]) => key !== "overall")
            .map(([key, score]) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium capitalize" data-testid={`text-category-${key}`}>
                    {key}
                  </span>
                  <span className={`font-bold ${getScoreColor(score)}`} data-testid={`text-score-${key}`}>
                    {score}
                  </span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Feedback */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Well Done */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-green-600" />
              <CardTitle>Well Done</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.feedback.wellDone.map((item, idx) => (
                <li 
                  key={idx} 
                  className="text-sm flex items-start gap-2"
                  data-testid={`text-welldone-${idx}`}
                >
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <CardTitle>Areas for Improvement</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.feedback.improvements.map((item, idx) => (
                <li 
                  key={idx} 
                  className="text-sm flex items-start gap-2"
                  data-testid={`text-improvement-${idx}`}
                >
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-analysis">
            {evaluation.detailedAnalysis}
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={handleRetry}
          className="gap-2"
          data-testid="button-retry"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
        <Button 
          onClick={handleNextStep}
          className="gap-2 flex-1"
          disabled={updateProgressMutation.isPending}
          data-testid="button-next"
        >
          {stepNumber < (scenario?.steps.length || 0) ? "Next Step" : "Complete Scenario"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
