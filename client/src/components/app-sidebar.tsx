import { Home, Mic, BookOpen, Headphones, PenLine, BookMarked, Award, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LevelBadge } from "./LevelBadge";
import { StreakDisplay } from "./StreakDisplay";
import { PointsDisplay } from "./PointsDisplay";
import { useQuery } from "@tanstack/react-query";
import type { UserProgress } from "@shared/schema";
import { useState } from "react";
import { Link } from "wouter";

const menuItems = [
  { title: "대시보드", url: "/", icon: Home },
  { title: "말하기", url: "/speaking", icon: Mic },
  { title: "읽기", url: "/reading", icon: BookOpen },
  { title: "듣기", url: "/listening", icon: Headphones },
  { title: "쓰기", url: "/writing", icon: PenLine },
  { title: "어휘", url: "/vocabulary", icon: BookMarked },
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
                  <SidebarMenuButton asChild>
                    <Link href={item.url} data-testid={`link-${item.url === '/' ? 'dashboard' : item.url.slice(1)}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
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
