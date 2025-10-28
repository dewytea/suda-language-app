import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Mic, MicOff, Loader2, Bot, User } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SpeakingScenario } from "@shared/schema";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function SpeakingConversation() {
  const params = useParams<{ id: string; stepNumber: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const scenarioId = Number(params.id);
  const stepNumber = Number(params.stepNumber);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: scenario, isLoading } = useQuery<SpeakingScenario>({
    queryKey: [`/api/speaking-scenarios/${scenarioId}`],
    enabled: !isNaN(scenarioId),
  });

  const step = scenario?.steps.find(s => s.stepNumber === stepNumber);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsRecording(false);
      };

      recognitionInstance.onerror = () => {
        setIsRecording(false);
        toast({
          title: "Speech recognition error",
          description: "Could not recognize speech. Please try again or type your message.",
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [toast]);

  // AI greeting when conversation starts
  useEffect(() => {
    if (step && messages.length === 0) {
      const greeting = step.expectedQuestions && step.expectedQuestions.length > 0 
        ? step.expectedQuestions[0] 
        : `Hello! I'm ${step.aiRole}. ${step.situation}`;
      
      setMessages([{ role: "assistant", content: greeting }]);
    }
  }, [step, messages.length]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const conversationMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const res = await apiRequest("POST", "/api/speaking/conversation", {
        scenarioId,
        stepNumber,
        messages: [
          ...messages,
          { role: "user", content: userMessage }
        ],
      });
      return await res.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    },
    onError: (error: any) => {
      toast({
        title: "Conversation error",
        description: error.message || "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInputText("");
    conversationMutation.mutate(userMessage);
  };

  const toggleRecording = () => {
    if (!recognition) {
      toast({
        title: "Speech recognition not available",
        description: "Your browser doesn't support speech recognition. Please type your message.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleFinishConversation = () => {
    if (messages.length < 4) {
      toast({
        title: "Continue the conversation",
        description: "Have at least a few exchanges before finishing.",
      });
      return;
    }
    setLocation(`/learn/speaking-scenarios/${scenarioId}/step/${stepNumber}/feedback`);
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
        <Link href={`/learn/speaking-scenarios/${scenarioId}/step/${stepNumber}/learn`}>
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <Badge variant="outline" className="mb-2" data-testid="badge-step">
            Step {step.stepNumber}
          </Badge>
          <h1 className="text-2xl font-bold" data-testid="text-conversation-title">
            Conversation: {step.title}
          </h1>
        </div>
        <Button
          variant="outline"
          onClick={handleFinishConversation}
          disabled={messages.length < 4}
          data-testid="button-finish"
        >
          Finish & Evaluate
        </Button>
      </div>

      {/* Conversation Area */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">
            Role: {step.aiRole}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {step.situation}
          </p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4" data-testid="conversation-messages">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`message-${idx}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap" data-testid={`message-content-${idx}`}>
                    {message.content}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {conversationMutation.isPending && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message or use the microphone..."
              disabled={conversationMutation.isPending}
              data-testid="input-message"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={toggleRecording}
              disabled={conversationMutation.isPending}
              data-testid="button-record"
            >
              {isRecording ? (
                <MicOff className="w-5 h-5 text-destructive" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || conversationMutation.isPending}
              data-testid="button-send"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
