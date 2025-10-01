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

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Speaking", url: "/speaking", icon: Mic },
  { title: "Reading", url: "/reading", icon: BookOpen },
  { title: "Listening", url: "/listening", icon: Headphones },
  { title: "Writing", url: "/writing", icon: PenLine },
  { title: "Vocabulary", url: "/vocabulary", icon: BookMarked },
  { title: "Achievements", url: "/achievements", icon: Award },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            S
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl">SUDA</h2>
            <p className="text-xs text-muted-foreground">Your language journey</p>
          </div>
        </div>
        <LevelBadge level={5} />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Learning</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} data-testid={`link-${item.title.toLowerCase()}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 space-y-4">
        <div className="space-y-3">
          <StreakDisplay days={15} />
          <PointsDisplay points={1250} />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/settings" data-testid="link-settings">
                <Settings />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
