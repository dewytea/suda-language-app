import { useState, useEffect, useRef } from 'react';
import { Send, Mic, Settings2, MessageCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ScenarioSelector from './ScenarioSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  const [scenario, setScenario] = useState('free');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime] = useState<Date>(new Date());
  
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

  const createSession = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/ai-chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          scenario: scenario
        })
      });
      
      if (!response.ok) throw new Error('Failed to create session');
      
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
    } catch (error) {
      console.error('Failed to create session:', error);
      toast({
        title: '세션 생성 실패',
        description: '채팅 세션을 시작할 수 없습니다.',
        variant: 'destructive'
      });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      setTimeout(() => {
        const responses = [
          "That's interesting! Tell me more about it.",
          "I understand. Could you explain that in different words?",
          "Great! How do you feel about that?",
          "That sounds nice. What happened next?",
          "I see. Can you give me an example?",
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `${randomResponse}\n\n(This is a temporary response. AI integration coming next!)`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
        
        saveMessages(sessionId, [userMessage, aiMessage]);
      }, 1500);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
      toast({
        title: '메시지 전송 실패',
        description: '다시 시도해주세요.',
        variant: 'destructive'
      });
    }
  };

  const saveMessages = async (sessionId: string | null, messages: Message[]) => {
    if (!sessionId) return;
    
    try {
      await fetch('/api/ai-chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
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

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-background">
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
          <button 
            className="p-2 hover:bg-accent rounded-md transition-colors"
            title="설정"
            data-testid="button-settings"
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
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isLoading && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
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
              placeholder="메시지를 입력하세요..."
              className="w-full px-4 py-3 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
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
            className="p-3 hover:bg-accent rounded-md transition-colors"
            title="음성 입력 (곧 출시)"
            disabled
            data-testid="button-voice"
          >
            <Mic className="w-6 h-6 text-muted-foreground/40" />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
            data-testid="button-send"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
