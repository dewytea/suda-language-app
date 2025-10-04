import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings as SettingsIcon, Key, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface GeminiHealthStatus {
  status: "ok" | "error";
  message: string;
  configured: boolean;
}

export default function Settings() {
  const { data: healthStatus, isLoading, error, refetch } = useQuery<GeminiHealthStatus>({
    queryKey: ["/api/health/gemini"],
    retry: false,
    staleTime: 30000,
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleUpdateKey = () => {
    window.open('https://aistudio.google.com/app/apikey', '_blank');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-serif font-bold text-4xl">설정</h1>
          <p className="text-muted-foreground mt-1">API 키 및 앱 설정 관리</p>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="font-semibold text-xl flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Google Gemini API 키
            </h2>
            <p className="text-sm text-muted-foreground">
              AI 기능을 사용하려면 Google Gemini API 키가 필요합니다
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            data-testid="button-refresh-status"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            상태 확인
          </Button>
        </div>

        {isLoading && (
          <Alert>
            <AlertDescription>API 키 상태를 확인하는 중...</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              API 키 상태를 확인할 수 없습니다. 네트워크 연결을 확인해주세요.
            </AlertDescription>
          </Alert>
        )}

        {healthStatus && healthStatus.status === "ok" && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-300">
              {healthStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {healthStatus && healthStatus.status === "error" && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{healthStatus.message}</AlertDescription>
          </Alert>
        )}

        <div className="pt-4 border-t space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">API 키 설정 방법</h3>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Google AI Studio에서 API 키를 생성하세요</li>
              <li>Replit Secrets 탭에서 GEMINI_API_KEY를 추가하세요</li>
              <li>워크플로우를 다시 시작하세요</li>
              <li>"상태 확인" 버튼을 클릭하여 연결을 확인하세요</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleUpdateKey}
              data-testid="button-get-api-key"
            >
              <Key className="h-4 w-4 mr-2" />
              API 키 받기
            </Button>
            {healthStatus && healthStatus.status === "error" && !healthStatus.configured && (
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                data-testid="button-reload-app"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                앱 새로고침
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="space-y-1">
          <h2 className="font-semibold text-xl">보안 안내</h2>
          <p className="text-sm text-muted-foreground">
            API 키는 환경 변수로 안전하게 저장됩니다
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">암호화된 저장소</p>
              <p className="text-sm text-muted-foreground">
                API 키는 Replit의 Secrets 시스템에 안전하게 암호화되어 저장됩니다
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">코드에 노출되지 않음</p>
              <p className="text-sm text-muted-foreground">
                API 키는 환경 변수로만 접근되며, 클라이언트 코드에는 절대 노출되지 않습니다
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">서버 측 검증</p>
              <p className="text-sm text-muted-foreground">
                모든 API 호출은 서버에서만 이루어지며, 키의 유효성을 자동으로 검증합니다
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
