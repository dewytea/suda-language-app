import { SkillCard } from "@/components/SkillCard";
import { ScenarioCard } from "@/components/ScenarioCard";
import { LevelProgress } from "@/components/LevelProgress";
import { DailyGoalProgress } from "@/components/DailyGoalProgress";
import { ApiKeyBanner } from "@/components/ApiKeyBanner";
import { Mic, BookOpen, Headphones, PenLine } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { UserProgress } from "@shared/schema";
import { useLocation } from "wouter";
import heroImage from "@assets/generated_images/Language_learning_hero_image_466f9149.png";
import airportImage from "@assets/generated_images/Airport_scenario_background_e10f50e6.png";
import bankImage from "@assets/generated_images/Bank_scenario_background_57f59a83.png";
import schoolImage from "@assets/generated_images/School_scenario_background_7ea09a63.png";
import restaurantImage from "@assets/generated_images/Restaurant_scenario_background_35240a88.png";
import cinemaImage from "@assets/generated_images/Cinema_scenario_background_5615faa4.png";

export default function Dashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [, setLocation] = useLocation();

  const { data: progress } = useQuery<UserProgress>({
    queryKey: ["/api/progress", selectedLanguage],
  });

  const updateProgress = useMutation({
    mutationFn: async (updates: Partial<UserProgress>) => {
      const res = await apiRequest("PATCH", `/api/progress/${selectedLanguage}`, updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress", selectedLanguage] });
    },
  });

  const scenarios = [
    { title: "At the Airport", description: "Travel conversations", image: airportImage },
    { title: "At the Bank", description: "Financial transactions", image: bankImage },
    { title: "At School", description: "Academic discussions", image: schoolImage },
    { title: "At a Restaurant", description: "Dining conversations", image: restaurantImage },
    { title: "At the Cinema", description: "Entertainment talks", image: cinemaImage },
  ];

  const handleSkillClick = (skill: string) => {
    setLocation(`/learn/${skill.toLowerCase()}`);
  };

  return (
    <div className="space-y-12">
      <div className="relative h-[400px] md:h-[500px] -mx-8 -mt-8 mb-12">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20 z-10" />
        <img 
          src={heroImage} 
          alt="Language Learning" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <h1 className="font-serif font-bold text-4xl md:text-6xl text-white">
              모든 언어를 마스터하세요
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl">
              AI 기반 학습으로 말하기, 읽기, 듣기, 쓰기를 모두 향상시키세요
            </p>
          </div>
        </div>
      </div>

      <ApiKeyBanner />

      <section className="space-y-6">
        <h2 className="font-serif font-semibold text-3xl">언어 선택</h2>
        <LanguageSelector 
          selectedLanguage={selectedLanguage} 
          onSelect={setSelectedLanguage} 
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LevelProgress 
          currentLevel={progress?.level || 1}
          totalPoints={progress?.totalPoints || 0}
        />
        <DailyGoalProgress
          speakingProgress={progress?.speakingProgress || 0}
          readingProgress={progress?.readingProgress || 0}
          listeningProgress={progress?.listeningProgress || 0}
          writingProgress={progress?.writingProgress || 0}
        />
      </section>

      <section className="space-y-6">
        <h2 className="font-serif font-semibold text-3xl">학습 영역</h2>
        <p className="text-muted-foreground">네 가지 핵심 영역을 균형있게 연습하세요</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkillCard
            title="Speaking"
            icon={Mic}
            duration="30 min"
            progress={progress?.speakingProgress || 0}
            color="speaking"
            onClick={() => handleSkillClick("Speaking")}
          />
          <SkillCard
            title="Reading"
            icon={BookOpen}
            duration="10 min"
            progress={progress?.readingProgress || 0}
            color="reading"
            onClick={() => handleSkillClick("Reading")}
          />
          <SkillCard
            title="Listening"
            icon={Headphones}
            duration="10 min"
            progress={progress?.listeningProgress || 0}
            color="listening"
            onClick={() => handleSkillClick("Listening")}
          />
          <SkillCard
            title="Writing"
            icon={PenLine}
            duration="10 min"
            progress={progress?.writingProgress || 0}
            color="writing"
            onClick={() => handleSkillClick("Writing")}
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-serif font-semibold text-3xl">실생활 시나리오</h2>
        <p className="text-muted-foreground">실제 상황에서 사용할 수 있는 회화를 배워보세요</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.title}
              title={scenario.title}
              description={scenario.description}
              imageUrl={scenario.image}
              onClick={() => handleSkillClick("Speaking")}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
