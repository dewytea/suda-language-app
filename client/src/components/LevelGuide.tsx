import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

interface LevelGuideProps {
  level: number;
  skill: "speaking" | "reading" | "listening" | "writing";
}

export function LevelGuide({ level, skill }: LevelGuideProps) {
  const getGuideContent = () => {
    const guides = {
      speaking: {
        beginner: "간단한 인사말과 자기소개를 연습하세요. 천천히 또박또박 발음하는 것이 중요합니다.",
        intermediate: "일상 대화와 상황별 표현을 익히세요. 자연스러운 억양과 속도를 연습하세요.",
        advanced: "복잡한 주제에 대해 토론하고 뉘앙스를 살린 표현을 구사하세요."
      },
      reading: {
        beginner: "짧은 문장과 기본 어휘를 읽고 이해하세요. 모르는 단어는 클릭해서 저장하세요.",
        intermediate: "짧은 이야기와 뉴스 기사를 읽고 요약해보세요. 문맥을 통해 의미를 파악하세요.",
        advanced: "문학 작품과 전문 자료를 읽고 비평적으로 분석하세요."
      },
      listening: {
        beginner: "천천히 말하는 대화를 듣고 이해하세요. 반복해서 듣는 것이 도움됩니다.",
        intermediate: "일상 속도의 대화와 짧은 강연을 듣고 핵심을 파악하세요.",
        advanced: "빠른 대화, 방언, 전문 용어가 포함된 내용을 이해하세요."
      },
      writing: {
        beginner: "간단한 문장을 만들고 기본 문법을 연습하세요. 짧은 일기를 써보세요.",
        intermediate: "문단 구성과 다양한 표현을 사용해 에세이를 작성하세요.",
        advanced: "논리적이고 설득력 있는 글을 작성하고 스타일을 다듬으세요."
      }
    };

    if (level <= 5) return guides[skill].beginner;
    if (level <= 10) return guides[skill].intermediate;
    return guides[skill].advanced;
  };

  return (
    <Card className="p-4 bg-primary/5 border-primary/20" data-testid="card-level-guide">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium">레벨 {level} 학습 가이드</p>
          <p className="text-sm text-muted-foreground">{getGuideContent()}</p>
        </div>
      </div>
    </Card>
  );
}
