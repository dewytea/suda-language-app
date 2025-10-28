import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Volume2, MessageSquare, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { useState } from "react";
import type { SpeakingScenario, UsefulExpression } from "@shared/schema";

export default function SpeakingLesson() {
  const params = useParams<{ id: string; stepNumber: string }>();
  const [, setLocation] = useLocation();
  const scenarioId = Number(params.id);
  const stepNumber = Number(params.stepNumber);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const { data: scenario, isLoading } = useQuery<SpeakingScenario>({
    queryKey: [`/api/speaking-scenarios/${scenarioId}`],
    enabled: !isNaN(scenarioId),
  });

  const step = scenario?.steps.find(s => s.stepNumber === stepNumber);

  const playAudio = async (text: string, index: number) => {
    setPlayingIndex(index);
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onend = () => setPlayingIndex(null);
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS error:', error);
      setPlayingIndex(null);
    }
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    setPlayingIndex(null);
  };

  if (isLoading) {
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
          <h1 className="text-3xl font-bold" data-testid="text-step-title">
            {step.title}
          </h1>
          <p className="text-muted-foreground mt-1" data-testid="text-step-situation">
            {step.situation}
          </p>
        </div>
      </div>

      {/* Useful Expressions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Useful Expressions</h2>
        <div className="space-y-6">
          {step.usefulExpressions.map((expr: UsefulExpression, idx: number) => (
            <Card key={idx} data-testid={`card-expression-${idx}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2" data-testid={`text-expression-${idx}`}>
                      {expr.expression}
                    </CardTitle>
                    <p className="text-muted-foreground" data-testid={`text-meaning-${idx}`}>
                      {expr.meaning}
                    </p>
                    {expr.pronunciation && (
                      <p className="text-sm text-muted-foreground mt-1" data-testid={`text-pronunciation-${idx}`}>
                        Pronunciation: /{expr.pronunciation}/
                      </p>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      if (playingIndex === idx) {
                        stopAudio();
                      } else {
                        playAudio(expr.expression, idx);
                      }
                    }}
                    data-testid={`button-play-${idx}`}
                  >
                    {playingIndex === idx ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Examples:</h4>
                  <div className="space-y-3">
                    {expr.examples.map((example: string, exampleIdx: number) => (
                      <div
                        key={exampleIdx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <span 
                            className="text-sm"
                            data-testid={`text-example-${idx}-${exampleIdx}`}
                          >
                            {exampleIdx + 1}. {example}
                          </span>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => {
                            const audioIdx = idx * 10 + exampleIdx;
                            if (playingIndex === audioIdx) {
                              stopAudio();
                            } else {
                              playAudio(example, audioIdx);
                            }
                          }}
                          data-testid={`button-play-example-${idx}-${exampleIdx}`}
                        >
                          {playingIndex === idx * 10 + exampleIdx ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Start Conversation */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Ready to Practice?</h3>
              <p className="text-sm text-muted-foreground">
                Start a conversation with AI and use these expressions in context
              </p>
            </div>
            <Link href={`/learn/speaking-scenarios/${scenarioId}/step/${stepNumber}/conversation`}>
              <Button 
                size="lg" 
                className="gap-2"
                data-testid="button-start-conversation"
              >
                <MessageSquare className="w-5 h-5" />
                Start Conversation
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
