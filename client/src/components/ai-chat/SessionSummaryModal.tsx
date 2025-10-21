import { Clock, MessageCircle, Award, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

interface SessionSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  summary: {
    duration: number;
    messageCount: number;
    xpEarned: number;
  };
}

export default function SessionSummaryModal({ isOpen, onClose, summary }: SessionSummaryProps) {
  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  const getMessage = () => {
    if (summary.duration >= 600) {
      return '10분 이상 집중해서 대화했어요! 꾸준한 연습이 실력을 만들어요.';
    } else if (summary.messageCount >= 20) {
      return '활발하게 대화했어요! 많이 말할수록 실력이 늘어요.';
    } else {
      return '좋아요! 매일 조금씩 연습하면 큰 변화를 느낄 수 있어요.';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        data-testid="overlay-session-summary"
      />
      
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 border">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mb-3">
            <Sparkles className="w-8 h-8 text-white" data-testid="icon-session-complete" />
          </div>
          <h3 className="text-2xl font-bold text-foreground" data-testid="text-session-title">
            수고하셨어요!
          </h3>
          <p className="text-muted-foreground mt-2">
            오늘도 한 걸음 성장했어요
          </p>
        </div>
        
        {/* 통계 */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-foreground">대화 시간</span>
            </div>
            <span className="font-semibold" data-testid="text-session-duration">
              {formatDuration(summary.duration)}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <span className="text-foreground">메시지 수</span>
            </div>
            <span className="font-semibold" data-testid="text-session-messages">
              {summary.messageCount}개
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-500" />
              <span className="text-foreground font-medium">획득 XP</span>
            </div>
            <span className="font-bold text-primary" data-testid="text-session-xp">
              +{summary.xpEarned} XP
            </span>
          </div>
        </div>
        
        {/* 격려 메시지 */}
        <div className="bg-primary/10 rounded-lg p-4 mb-6">
          <p className="text-sm text-foreground text-center">
            {getMessage()}
          </p>
        </div>
        
        {/* 버튼 */}
        <div className="flex gap-3">
          <Link
            href="/learn/ai-chat/stats"
            className="flex-1 py-3 border border-border text-foreground rounded-lg hover-elevate active-elevate-2 text-center font-medium"
            data-testid="button-view-stats"
          >
            통계 보기
          </Link>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover-elevate active-elevate-2 font-medium"
            data-testid="button-continue-chatting"
          >
            계속하기
          </button>
        </div>
      </div>
    </div>
  );
}
