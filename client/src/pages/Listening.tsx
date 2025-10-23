import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Volume2, Clock, BookOpen, FileText } from 'lucide-react';
import { ListeningCard } from '@/components/listening/ListeningCard';
import ListeningCardLong from '@/components/listening/ListeningCardLong';
import { Button } from '@/components/ui/button';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';
import type { ListeningLesson } from '@shared/schema';
import { useAuth } from '@/contexts/AuthContext';

export default function Listening() {
  const { user } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<ListeningLesson | null>(null);
  
  const { data: lessonsData, isLoading } = useQuery<{ lessons: ListeningLesson[] }>({
    queryKey: ['/api/listening/lessons', { difficulty: selectedDifficulty, category: selectedCategory }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty.toString());
      if (selectedCategory) params.append('category', selectedCategory);
      
      const url = params.toString() 
        ? `/api/listening/lessons?${params}` 
        : '/api/listening/lessons';
      
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

  const saveProgressMutation = useMutation({
    mutationFn: async (data: { lessonId: number; userAnswer: string; score: number; accuracy: number }) => {
      return apiRequest('POST', '/api/listening/progress', data);
    },
    onSuccess: () => {
      // Invalidate all lessons queries (including filtered ones)
      queryClient.invalidateQueries({ queryKey: ['/api/listening/lessons'] });
      queryClient.invalidateQueries({ queryKey: ['/api/listening/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/listening/stats'] });
    }
  });
  
  const handleComplete = async (score: number, accuracy: number, userAnswer: string) => {
    if (currentLesson) {
      try {
        await saveProgressMutation.mutateAsync({
          lessonId: currentLesson.id,
          userAnswer,
          score,
          accuracy
        });
        
        setCurrentLesson(null);
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  };
  
  const handleLongContentComplete = async (score: number, accuracy: number, userAnswer: string) => {
    if (currentLesson) {
      try {
        await saveProgressMutation.mutateAsync({
          lessonId: currentLesson.id,
          userAnswer,
          score,
          accuracy
        });
        
        setCurrentLesson(null);
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  };
  
  const lessons = lessonsData?.lessons || [];
  const categories = ['일상', '여행', '비즈니스', 'AI/테크', '명언', '역사', '문학', '환경/과학'];
  const difficulties = [1, 2, 3, 4, 5];
  
  if (currentLesson) {
    const isLongContent = currentLesson.contentType === 'long';
    
    if (isLongContent) {
      return (
        <ListeningCardLong
          lesson={currentLesson}
          onClose={() => setCurrentLesson(null)}
          onComplete={handleLongContentComplete}
        />
      );
    }
    
    return (
      <ListeningCard
        lesson={currentLesson}
        onClose={() => setCurrentLesson(null)}
        onComplete={handleComplete}
      />
    );
  }
  
  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
          <Volume2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-serif font-bold text-4xl text-foreground">듣기 연습</h1>
          <p className="text-muted-foreground mt-1">듣고 받아쓰며 청취력을 키워요</p>
        </div>
      </div>
      
      {/* 필터 */}
      <div className="bg-card rounded-xl border p-6">
        <div className="space-y-4">
          {/* 난이도 필터 */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">난이도</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedDifficulty === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(null)}
                data-testid="filter-difficulty-all"
              >
                전체
              </Button>
              {difficulties.map((diff) => (
                <Button
                  key={diff}
                  variant={selectedDifficulty === diff ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDifficulty(diff)}
                  data-testid={`filter-difficulty-${diff}`}
                >
                  Level {diff}
                </Button>
              ))}
            </div>
          </div>
          
          {/* 카테고리 필터 */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">카테고리</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                data-testid="filter-category-all"
              >
                전체
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  data-testid={`filter-category-${cat}`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 레슨 리스트 */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">선택한 조건의 레슨이 없어요</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => {
            const isLongContent = lesson.contentType === 'long';
            
            return (
              <button
                key={lesson.id}
                onClick={() => setCurrentLesson(lesson)}
                className="bg-card rounded-xl border p-5 hover-elevate active-elevate-2 transition-all text-left"
                data-testid={`lesson-card-${lesson.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isLongContent 
                        ? 'bg-gradient-to-br from-purple-400 to-indigo-500' 
                        : 'bg-gradient-to-br from-green-400 to-blue-500'
                    }`}>
                      {isLongContent ? (
                        <FileText className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">
                        Level {lesson.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {lesson.category}
                      </span>
                    </div>
                  </div>
                  
                  {isLongContent && (
                    <span className="text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                      긴 컨텐츠
                    </span>
                  )}
                </div>
                
                <p className="text-foreground font-medium mb-2 line-clamp-2">
                  {isLongContent ? lesson.text.substring(0, 100) + '...' : lesson.text}
                </p>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                  {lesson.translation.substring(0, 50) + (lesson.translation.length > 50 ? '...' : '')}
                </p>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.duration}초
                  </span>
                  {isLongContent && lesson.wordCount && (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {lesson.wordCount} 단어
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
