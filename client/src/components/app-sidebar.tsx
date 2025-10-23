import { Home, Mic, BookOpen, Headphones, PenLine, BookMarked, Award, Settings, History, BarChart3, ChevronRight, MessageCircle, BookText, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { LevelBadge } from "./LevelBadge";
import { StreakDisplay } from "./StreakDisplay";
import { PointsDisplay } from "./PointsDisplay";
import { useQuery } from "@tanstack/react-query";
import type { UserProgress } from "@shared/schema";
import { useState } from "react";
import { Link } from "wouter";

const menuItems = [
  { title: "대시보드", url: "/dashboard", icon: Home },
  { 
    title: "말하기", 
    url: "/learn/speaking", 
    icon: Mic,
    subItems: [
      { title: "학습 기록", url: "/learn/speaking/history", icon: History },
      { title: "통계", url: "/learn/speaking/stats", icon: BarChart3 },
    ]
  },
  { title: "읽기", url: "/learn/reading", icon: BookOpen },
  { title: "듣기", url: "/learn/listening", icon: Headphones },
  { 
    title: "쓰기", 
    url: "/learn/writing", 
    icon: PenLine,
    subItems: [
      { title: "내가 쓴 글", url: "/learn/writing/my-writings", icon: FileText },
    ]
  },
  { title: "AI 대화", url: "/learn/ai-chat", icon: MessageCircle },
  { title: "복습", url: "/learn/review", icon: BookMarked },
  { title: "내 단어장", url: "/learn/vocabulary", icon: BookText },
  { title: "업적", url: "/achievements", icon: Award },
];

export function AppSidebar() {
  const [selectedLanguage] = useState("en");

  const { data: progress } = useQuery<UserProgress>({
    queryKey: ["/api/progress", selectedLanguage],
  });

  return (
    <Sidebar>
      <SidebarHeader className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            S
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl">SUDA</h2>
            <p className="text-xs text-muted-foreground">당신의 언어 여정</p>
          </div>
        </div>
        <LevelBadge level={progress?.level || 1} showDescription={true} />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>학습</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {'subItems' in item ? (
                    <Collapsible className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={item.url} data-testid={`link-${item.url.slice(1)}`}>
                                <item.icon className="h-4 w-4" />
                                <span>연습하기</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          {item.subItems?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={subItem.url} data-testid={`link-${subItem.url.slice(1).replace('/', '-')}`}>
                                  <subItem.icon className="h-4 w-4" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link href={item.url} data-testid={`link-${item.url.slice(1).replace(/\//g, '-')}`}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 space-y-4">
        <div className="space-y-3">
          <StreakDisplay days={progress?.streakDays || 0} />
          <PointsDisplay points={progress?.totalPoints || 0} />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings" data-testid="link-settings">
                <Settings />
                <span>설정</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
