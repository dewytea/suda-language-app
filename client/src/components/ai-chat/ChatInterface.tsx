import { useState, useEffect, useRef } from 'react';
import { Send, Mic, Settings2, MessageCircle, GraduationCap, PanelRightClose, PanelRight } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ScenarioSelector from './ScenarioSelector';
import TopicSuggestions from './TopicSuggestions';
import UsefulPhrases from './UsefulPhrases';
import AchievementModal from './AchievementModal';
import SessionSummaryModal from './SessionSummaryModal';
import OnboardingTutorial from './OnboardingTutorial';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! 영어로 대화해볼까요? 무엇을 이야기하고 싶으세요?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [scenario, setScenario] = useState('free');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime] = useState<Date>(new Date());
  const [learningMode, setLearningMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  
  // Achievement tracking
  const [conversationStartTime, setConversationStartTime] = useState<Date>(new Date());
  const [achievementShown, setAchievementShown] = useState<{10: boolean; 20: boolean; 30: boolean}>({
    10: false,
    20: false,
    30: false
  });
  const [showAchievement, setShowAchievement] = useState<number | null>(null);
  
  // Session summary
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [sessionSummary, setSessionSummary] = useState({
    duration: 0,
    messageCount: 0,
    xpEarned: 0
  });
  
  // Onboarding
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      createSession();
    }
  }, [user, scenario]);
  
  // Check for onboarding on mount
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('ai_chat_tutorial_completed');
    if (!tutorialCompleted) {
      setShowOnboarding(true);
    }
  }, []);
  
  // Achievement tracking timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsedMinutes = Math.floor((now.getTime() - conversationStartTime.getTime()) / (1000 * 60));
      
      if (elapsedMinutes >= 10 && !achievementShown[10]) {
        setShowAchievement(10);
        setAchievementShown(prev => ({ ...prev, 10: true }));
      } else if (elapsedMinutes >= 20 && !achievementShown[20]) {
        setShowAchievement(20);
        setAchievementShown(prev => ({ ...prev, 20: true }));
      } else if (elapsedMinutes >= 30 && !achievementShown[30]) {
        setShowAchievement(30);
        setAchievementShown(prev => ({ ...prev, 30: true }));
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [conversationStartTime, achievementShown]);

  const createSession = async () => {
    if (!user) return;
    
    setIsCreatingSession(true);
    
    try {
      const response = await apiRequest('POST', '/api/ai-chat/session', {
        userId: user.id,
        scenario: scenario
      });
      
      const data = await response.json();
      setSessionId(data.sessionId);
      
      // Reset messages when scenario changes
      const scenarioMessages: Record<string, string> = {
        free: '안녕하세요! 영어로 대화해볼까요? 무엇을 이야기하고 싶으세요?',
        restaurant: 'Welcome to the restaurant! What would you like to order?',
        hotel: 'Hello! Welcome to our hotel. How may I assist you today?',
        shopping: 'Hi! Welcome to our store. What are you looking for?',
        interview: 'Good morning! Thank you for coming. Shall we start the interview?',
        travel: 'Hello! Planning a trip? Where would you like to go?'
      };
      
      setMessages([{
        id: '1',
        role: 'assistant',
        content: scenarioMessages[scenario] || scenarioMessages.free,
        timestamp: new Date()
      }]);
      
      // Reset conversation timer
      setConversationStartTime(new Date());
      setAchievementShown({ 10: false, 20: false, 30: false });
      
      setIsCreatingSession(false);
    } catch (error) {
      console.error('Failed to create session:', error);
      setIsCreatingSession(false);
      
      toast({
        title: '세션 생성 실패',
        description: '채팅 세션을 시작할 수 없습니다. 다시 시도해주세요.',
        variant: 'destructive'
      });
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await apiRequest('POST', '/api/ai-chat/chat', {
        messages: messages.concat(userMessage).map(m => ({
          role: m.role,
          content: m.content
        })),
        scenario: scenario,
        learningMode: learningMode
      });

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      
      saveMessages(sessionId, [userMessage, aiMessage]);
      
    } catch (error: any) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
      
      const errorMessage = error.message || '메시지 전송에 실패했습니다.';
      
      toast({
        title: 'AI 응답 실패',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const saveMessages = async (sessionId: string | null, messages: Message[]) => {
    if (!sessionId) return;
    
    try {
      await apiRequest('POST', '/api/ai-chat/messages', {
        sessionId,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      });
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  };
  
  const handleEndSession = () => {
    const now = new Date();
    const duration = Math.floor((now.getTime() - conversationStartTime.getTime()) / 1000);
    const messageCount = messages.filter(m => m.role === 'user').length;
    const xpEarned = messageCount * 5 + Math.floor(duration / 60) * 2;
    
    setSessionSummary({
      duration,
      messageCount,
      xpEarned
    });
    
    setShowSessionSummary(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };
  
  const handleTopicSelect = (topic: string) => {
    setInput(topic);
    textareaRef.current?.focus();
  };

  return (
    <>
      <div className="flex-1 flex h-full w-full bg-background overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          {/* Header */}
          <div className="bg-card border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">AI 대화 파트너</h1>
                <p className="text-sm text-muted-foreground">자유롭게 대화해보세요</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ScenarioSelector 
                value={scenario} 
                onChange={setScenario}
              />
              
              {/* Learning Mode Toggle */}
              <button
                onClick={() => setLearningMode(!learningMode)}
                className={`p-2 rounded-md transition-colors ${
                  learningMode 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover-elevate active-elevate-2'
                }`}
                title={learningMode ? '학습 모드 켜짐' : '학습 모드 꺼짐'}
                data-testid="button-learning-mode"
              >
                <GraduationCap className="w-5 h-5" />
              </button>
              
              {/* Sidebar Toggle */}
              <button 
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover-elevate active-elevate-2 rounded-md transition-colors"
                title={showSidebar ? '사이드바 숨기기' : '사이드바 표시'}
                data-testid="button-toggle-sidebar"
              >
                {showSidebar ? (
                  <PanelRightClose className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <PanelRight className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              
              <button 
                onClick={handleEndSession}
                className="p-2 hover-elevate active-elevate-2 rounded-md transition-colors"
                title="세션 종료"
                data-testid="button-end-session"
              >
                <Settings2 className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
          >
            {isCreatingSession ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-muted-foreground">세션을 준비하는 중...</p>
                </div>
              </div>
            ) : (
              <>
                {learningMode && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm text-foreground">
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">학습 모드가 켜져 있어요</p>
                        <p className="text-muted-foreground text-xs mt-1">
                          AI가 문법 실수를 교정하고 더 나은 표현을 제안해줘요.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                
                {isLoading && <TypingIndicator />}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-card border-t px-4 py-4 flex-shrink-0">
            <div className="max-w-4xl mx-auto flex items-end gap-2">
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={isCreatingSession ? "세션 준비 중..." : "메시지를 입력하세요..."}
                  disabled={isCreatingSession}
                  className="w-full px-4 py-3 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={1}
                  style={{
                    minHeight: '52px',
                    maxHeight: '200px'
                  }}
                  data-testid="input-message"
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground mt-1 px-1">
                  {input.length}/500 • Enter로 전송, Shift+Enter로 줄바꿈
                </div>
              </div>
              
              <button
                className="p-3 hover-elevate active-elevate-2 rounded-md transition-colors"
                title="음성 입력 (곧 출시)"
                disabled
                data-testid="button-voice"
              >
                <Mic className="w-6 h-6 text-muted-foreground/40" />
              </button>
              
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading || isCreatingSession}
                className="p-3 bg-primary text-primary-foreground rounded-md hover-elevate active-elevate-2 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
                data-testid="button-send"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 border-l bg-card overflow-y-auto p-4 space-y-6 flex-shrink-0">
            <TopicSuggestions onSelectTopic={handleTopicSelect} />
            <div className="border-t pt-6">
              <UsefulPhrases />
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <AchievementModal
        isOpen={showAchievement !== null}
        onClose={() => setShowAchievement(null)}
        minutes={showAchievement || 10}
      />
      
      <SessionSummaryModal
        isOpen={showSessionSummary}
        onClose={() => setShowSessionSummary(false)}
        summary={sessionSummary}
      />
      
      <OnboardingTutorial
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </>
  );
}
