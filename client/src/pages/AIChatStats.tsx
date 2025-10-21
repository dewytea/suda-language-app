import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  ArrowLeft, 
  TrendingUp, 
  MessageCircle, 
  Clock, 
  Target, 
  Flame,
  Trophy,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ChatStats {
  totalSessions: number;
  totalMessages: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  favoriteScenario: string;
  achievements: number;
}

const scenarioNames: Record<string, string> = {
  free: '자유 대화',
  restaurant: '레스토랑',
  hotel: '호텔',
  shopping: '쇼핑',
  interview: '면접',
  travel: '여행'
};

export default function AIChatStats() {
  const { user } = useAuth();
  
  const { data: stats, isLoading } = useQuery<ChatStats>({
    queryKey: ['/api/ai-chat/stats'],
    enabled: !!user
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">통계를 불러오는 중...</p>
        </div>
      </div>
    );
  }
  
  const statCards = [
    {
      label: '총 대화 세션',
      value: stats?.totalSessions || 0,
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: '총 메시지',
      value: stats?.totalMessages || 0,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: '총 대화 시간',
      value: `${Math.floor((stats?.totalMinutes || 0) / 60)}시간 ${(stats?.totalMinutes || 0) % 60}분`,
      icon: Clock,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: '현재 연속 기록',
      value: `${stats?.currentStreak || 0}일`,
      icon: Flame,
      color: 'from-orange-500 to-red-500'
    },
    {
      label: '최장 연속 기록',
      value: `${stats?.longestStreak || 0}일`,
      icon: Target,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      label: '획득한 업적',
      value: stats?.achievements || 0,
      icon: Trophy,
      color: 'from-indigo-500 to-purple-500'
    }
  ];
  
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
            <h1 className="text-2xl font-bold text-foreground">통계</h1>
            <p className="text-sm text-muted-foreground mt-1">
              당신의 학습 성과를 확인하세요
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx}
                  className="bg-card border rounded-lg p-6 hover-elevate transition-all"
                  data-testid={`stat-card-${idx}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground" data-testid={`stat-value-${idx}`}>
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>
          
          {/* Favorite Scenario */}
          {stats?.favoriteScenario && (
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                선호하는 시나리오
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-2xl font-bold text-foreground">
                    {scenarioNames[stats.favoriteScenario] || stats.favoriteScenario}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    가장 많이 연습한 시나리오예요
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Weekly Progress */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              주간 활동
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {['월', '화', '수', '목', '금', '토', '일'].map((day, idx) => {
                const isActive = idx < (stats?.currentStreak || 0);
                return (
                  <div key={day} className="text-center">
                    <div 
                      className={`w-full aspect-square rounded-md mb-1 ${
                        isActive 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                          : 'bg-muted'
                      }`}
                    />
                    <p className="text-xs text-muted-foreground">{day}</p>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Encouragement Message */}
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-lg p-6 text-center">
            <p className="text-lg font-medium text-foreground mb-2">
              {(stats?.totalSessions || 0) === 0 
                ? '첫 대화를 시작해보세요!' 
                : (stats?.totalSessions || 0) < 10
                ? '좋아요! 꾸준히 연습하고 있어요!'
                : (stats?.totalSessions || 0) < 50
                ? '대단해요! 실력이 많이 늘었을 거예요!'
                : '놀라워요! 정말 열심히 하고 계시네요!'}
            </p>
            <p className="text-sm text-muted-foreground">
              매일 조금씩 연습하면 큰 변화를 느낄 수 있어요
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link href="/ai-chat/history" className="flex-1">
              <button className="w-full py-3 border border-border text-foreground rounded-lg hover-elevate active-elevate-2 font-medium">
                대화 기록 보기
              </button>
            </Link>
            <Link href="/ai-chat" className="flex-1">
              <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover-elevate active-elevate-2 font-medium">
                대화 시작하기
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
