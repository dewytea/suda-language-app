import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Calendar, MessageCircle, Clock, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ChatSession {
  id: string;
  scenario: string;
  createdAt: string;
  messageCount?: number;
}

const scenarioNames: Record<string, string> = {
  free: '자유 대화',
  restaurant: '레스토랑',
  hotel: '호텔',
  shopping: '쇼핑',
  interview: '면접',
  travel: '여행'
};

export default function AIChatHistory() {
  const { user } = useAuth();
  
  const { data: sessions, isLoading } = useQuery<ChatSession[]>({
    queryKey: ['/api/ai-chat/sessions'],
    enabled: !!user
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">대화 기록을 불러오는 중...</p>
        </div>
      </div>
    );
  }
  
  const sortedSessions = sessions?.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ) || [];
  
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/ai-chat">
            <button 
              className="p-2 hover-elevate active-elevate-2 rounded-md"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">대화 기록</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {sortedSessions.length}개의 대화 세션
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {sortedSessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <MessageCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                아직 대화 기록이 없어요
              </h3>
              <p className="text-muted-foreground mb-6">
                AI와 대화를 시작하면 여기에 기록이 남아요
              </p>
              <Link href="/ai-chat">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover-elevate active-elevate-2">
                  대화 시작하기
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedSessions.map((session) => (
                <Link key={session.id} href={`/ai-chat/session/${session.id}`}>
                  <div 
                    className="bg-card border rounded-lg p-4 hover-elevate active-elevate-2 transition-all cursor-pointer group"
                    data-testid={`session-${session.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {scenarioNames[session.scenario] || session.scenario}
                          </h3>
                          <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                            {session.scenario}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDistanceToNow(new Date(session.createdAt), {
                                addSuffix: true,
                                locale: ko
                              })}
                            </span>
                          </div>
                          
                          {session.messageCount !== undefined && (
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{session.messageCount}개 메시지</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
