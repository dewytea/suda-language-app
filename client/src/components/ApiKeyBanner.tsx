import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { XCircle, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface GeminiHealthStatus {
  status: "ok" | "error";
  message: string;
  configured: boolean;
}

export function ApiKeyBanner() {
  const { data: healthStatus } = useQuery<GeminiHealthStatus>({
    queryKey: ["/api/health/gemini"],
    retry: false,
    staleTime: 60000,
  });

  if (!healthStatus || healthStatus.status === "ok") {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-6" data-testid="alert-api-key-error">
      <XCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-medium mb-1">Google Gemini API 키 오류</p>
          <p className="text-sm">{healthStatus.message}</p>
        </div>
        <Link href="/settings">
          <Button variant="outline" size="sm" data-testid="button-go-to-settings">
            <Settings className="h-4 w-4 mr-2" />
            설정으로 이동
          </Button>
        </Link>
      </AlertDescription>
    </Alert>
  );
}
