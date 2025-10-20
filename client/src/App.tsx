import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserMenu } from "@/components/UserMenu";
import Dashboard from "@/pages/Dashboard";
import Speaking from "@/pages/Speaking";
import SpeakingHistory from "@/pages/SpeakingHistory";
import SpeakingStats from "@/pages/SpeakingStats";
import Reading from "@/pages/Reading";
import Listening from "@/pages/Listening";
import Writing from "@/pages/Writing";
import Review from "@/pages/Review";
import AIChat from "@/pages/AIChat";
import Achievements from "@/pages/Achievements";
import Settings from "@/pages/Settings";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/not-found";

function AuthRouter() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/learn/:rest*">
        {() => (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/achievements">
        {() => (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/settings">
        {() => (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-50">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-8">
            <div className="max-w-7xl mx-auto">
              <Switch>
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/learn/speaking" component={Speaking} />
                <Route path="/learn/speaking/history" component={SpeakingHistory} />
                <Route path="/learn/speaking/stats" component={SpeakingStats} />
                <Route path="/learn/reading" component={Reading} />
                <Route path="/learn/listening" component={Listening} />
                <Route path="/learn/writing" component={Writing} />
                <Route path="/learn/review" component={Review} />
                <Route path="/learn/ai-chat" component={AIChat} />
                <Route path="/achievements" component={Achievements} />
                <Route path="/settings" component={Settings} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <AuthRouter />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
