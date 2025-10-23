import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { PenLine, TrendingUp, FileText, Mail, BookOpen, MessageSquare, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import type { WritingTopic } from '@shared/schema';

const categoryIcons = {
  email: Mail,
  essay: BookOpen,
  letter: FileText,
  review: Star,
  story: BookOpen,
  opinion: MessageSquare
};

const categoryNames = {
  email: '이메일',
  essay: '에세이',
  letter: '편지',
  review: '리뷰',
  story: '이야기',
  opinion: '의견'
};

const categoryColors = {
  email: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  essay: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  letter: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  review: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  story: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  opinion: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
};

export default function Writing() {
  const [, setLocation] = useLocation();
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: topicsData, isLoading } = useQuery<{ topics: WritingTopic[] }>({
    queryKey: ['/api/writing/topics', { difficulty: selectedDifficulty, category: selectedCategory }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty.toString());
      if (selectedCategory) params.append('category', selectedCategory);
      
      const url = params.toString() 
        ? `/api/writing/topics?${params}` 
        : '/api/writing/topics';
      
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
    queryKey: ['/api/writing/stats'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      
      const response = await fetch('/api/writing/stats', {
        credentials: 'include',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
  });

  const topics = topicsData?.topics || [];
  const stats = statsData || {
    totalSubmitted: 0,
    averageScore: 0,
    averageWordCount: 0
  };
  
  const categories = ['email', 'essay', 'letter', 'review', 'story', 'opinion'];
  const difficulties = [1, 2, 3, 4, 5];

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ['입문', '초급', '중급', '고급', '전문'];
    return labels[difficulty - 1] || '';
  };

  const getDifficultyColor = (difficulty: number) => {
    const colors = [
      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    ];
    return colors[difficulty - 1] || colors[0];
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <PenLine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Writing</h1>
              <p className="text-muted-foreground" data-testid="text-page-description">
                주제에 맞춰 글을 작성하고 AI 피드백을 받아요
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="hover-elevate" data-testid="card-total-submitted">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">제출한 글</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-submitted">
                    {stats.totalSubmitted}개
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
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
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-average-words">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">평균 단어 수</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-average-words">
                    {stats.averageWordCount > 0 ? `${Math.round(stats.averageWordCount)}` : '-'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <PenLine className="w-5 h-5 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6" data-testid="card-filters">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2 text-foreground">난이도</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedDifficulty === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(null)}
                    data-testid="button-difficulty-all"
                  >
                    전체
                  </Button>
                  {difficulties.map(level => (
                    <Button
                      key={level}
                      variant={selectedDifficulty === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(level)}
                      data-testid={`button-difficulty-${level}`}
                    >
                      {getDifficultyLabel(level)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2 text-foreground">카테고리</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    data-testid="button-category-all"
                  >
                    전체
                  </Button>
                  {categories.map(cat => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      data-testid={`button-category-${cat}`}
                    >
                      {categoryNames[cat as keyof typeof categoryNames]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground" data-testid="text-topics-title">
            글쓰기 주제 ({topics.length}개)
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse" data-testid={`skeleton-topic-${i}`}>
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-3"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : topics.length === 0 ? (
          <Card data-testid="card-no-topics">
            <CardContent className="p-12 text-center">
              <PenLine className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">선택한 조건에 맞는 주제가 없습니다</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map(topic => {
              const CategoryIcon = categoryIcons[topic.category as keyof typeof categoryIcons] || FileText;
              
              return (
                <Card 
                  key={topic.id} 
                  className="hover-elevate active-elevate-2 cursor-pointer" 
                  onClick={() => setLocation(`/learn/writing/editor/${topic.id}`)}
                  data-testid={`card-topic-${topic.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <CategoryIcon className="w-5 h-5 text-primary" />
                      </div>
                      <Badge 
                        className={getDifficultyColor(topic.difficulty)}
                        data-testid={`badge-difficulty-${topic.id}`}
                      >
                        Lv.{topic.difficulty}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 text-foreground" data-testid={`text-topic-title-${topic.id}`}>
                      {topic.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-testid={`text-topic-description-${topic.id}`}>
                      {topic.description}
                    </p>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge 
                        variant="outline" 
                        className={categoryColors[topic.category as keyof typeof categoryColors]}
                        data-testid={`badge-category-${topic.id}`}
                      >
                        {categoryNames[topic.category as keyof typeof categoryNames]}
                      </Badge>
                      {topic.wordCountMin && topic.wordCountMax && (
                        <Badge variant="outline" data-testid={`badge-wordcount-${topic.id}`}>
                          {topic.wordCountMin}-{topic.wordCountMax} 단어
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
