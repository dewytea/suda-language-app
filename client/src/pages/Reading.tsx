import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { BookOpen, Clock, TrendingUp, FileText, BookText, Mail, Newspaper, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import type { ReadingPassage } from '@shared/schema';

const contentTypeIcons = {
  news: Newspaper,
  story: BookText,
  essay: PenLine,
  email: Mail
};

const contentTypeNames = {
  news: '뉴스',
  story: '이야기',
  essay: '에세이',
  email: '이메일'
};

const contentTypeColors = {
  news: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  story: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  essay: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  email: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
};

export default function Reading() {
  const [, setLocation] = useLocation();
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const { data: passagesData, isLoading } = useQuery<{ passages: ReadingPassage[] }>({
    queryKey: ['/api/reading/passages', { difficulty: selectedDifficulty, type: selectedType }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty.toString());
      if (selectedType) params.append('type', selectedType);
      
      const url = params.toString() 
        ? `/api/reading/passages?${params}` 
        : '/api/reading/passages';
      
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      
      const response = await fetch(url, {
        credentials: 'include',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
  });

  const { data: statsData } = useQuery({
    queryKey: ['/api/reading/stats'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      
      const response = await fetch('/api/reading/stats', {
        credentials: 'include',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
  });

  const passages = passagesData?.passages || [];
  const stats = statsData || {
    totalCompleted: 0,
    averageScore: 0,
    averageWPM: 0
  };
  
  const contentTypes = ['news', 'story', 'essay', 'email'];
  const difficulties = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Reading</h1>
              <p className="text-muted-foreground" data-testid="text-page-description">
                영어 지문을 읽고 독해력을 키워요
              </p>
            </div>
          </div>
        </div>
        
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="hover-elevate" data-testid="card-total-completed">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">완료한 지문</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-completed">
                    {stats.totalCompleted}개
                  </p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-elevate" data-testid="card-average-score">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">평균 점수</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-average-score">
                    {stats.averageScore > 0 ? `${Math.round(stats.averageScore)}점` : '-'}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800" data-testid="card-average-wpm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">평균 읽기 속도</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100" data-testid="text-average-wpm">
                    {stats.averageWPM > 0 ? `${Math.round(stats.averageWPM)} WPM` : '- WPM'}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* 필터 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* 난이도 필터 */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">난이도</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedDifficulty === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(null)}
                    data-testid="button-difficulty-all"
                  >
                    전체
                  </Button>
                  {difficulties.map((diff) => (
                    <Button
                      key={diff}
                      variant={selectedDifficulty === diff ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(diff)}
                      data-testid={`button-difficulty-${diff}`}
                    >
                      Level {diff}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* 콘텐츠 타입 필터 */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">콘텐츠 타입</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedType === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(null)}
                    data-testid="button-type-all"
                  >
                    전체
                  </Button>
                  {contentTypes.map((type) => {
                    const Icon = contentTypeIcons[type as keyof typeof contentTypeIcons];
                    return (
                      <Button
                        key={type}
                        variant={selectedType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedType(type)}
                        data-testid={`button-type-${type}`}
                      >
                        <Icon className="w-4 h-4 mr-1" />
                        {contentTypeNames[type as keyof typeof contentTypeNames]}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* 지문 목록 */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4" data-testid="text-passages-title">
            {selectedDifficulty || selectedType ? '필터링된 ' : '모든 '}지문
            <span className="text-muted-foreground text-sm ml-2">
              ({passages.length}개)
            </span>
          </h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground" data-testid="text-loading">불러오는 중...</p>
            </div>
          ) : passages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground" data-testid="text-no-passages">
                조건에 맞는 지문이 없습니다
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {passages.map((passage) => {
                const Icon = contentTypeIcons[passage.contentType as keyof typeof contentTypeIcons];
                const colorClass = contentTypeColors[passage.contentType as keyof typeof contentTypeColors];
                
                return (
                  <Card
                    key={passage.id}
                    className="hover-elevate active-elevate-2 cursor-pointer"
                    onClick={() => setLocation(`/learn/reading/${passage.id}`)}
                    data-testid={`card-passage-${passage.id}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={colorClass} data-testid={`badge-type-${passage.id}`}>
                          <Icon className="w-3 h-3 mr-1" />
                          {contentTypeNames[passage.contentType as keyof typeof contentTypeNames]}
                        </Badge>
                        <Badge variant="secondary" data-testid={`badge-difficulty-${passage.id}`}>
                          Level {passage.difficulty}
                        </Badge>
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-2" data-testid={`text-title-${passage.id}`}>
                        {passage.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4" data-testid={`text-preview-${passage.id}`}>
                        {passage.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1" data-testid={`text-wordcount-${passage.id}`}>
                          <FileText className="w-3 h-3" />
                          {passage.wordCount} words
                        </span>
                        <span className="flex items-center gap-1" data-testid={`text-time-${passage.id}`}>
                          <Clock className="w-3 h-3" />
                          ~{passage.estimatedTime}초
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
