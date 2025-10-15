import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: '입력 오류',
        description: '이메일을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      toast({
        title: '재설정 실패',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setSent(true);
      toast({
        title: '이메일 전송 완료',
        description: '비밀번호 재설정 링크를 이메일로 보냈습니다.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              S
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">SUDA</CardTitle>
              <CardDescription>당신의 언어 여정</CardDescription>
            </div>
          </div>
          <CardTitle className="text-xl">비밀번호 재설정</CardTitle>
          <CardDescription>
            {sent
              ? '이메일을 확인하여 비밀번호를 재설정하세요'
              : '가입한 이메일 주소를 입력하세요'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-center text-muted-foreground">
                <strong>{email}</strong>로 비밀번호 재설정 링크를 보냈습니다.
                <br />
                이메일을 확인해주세요.
              </p>
              <Link href="/login">
                <Button variant="outline" data-testid="button-back-to-login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  로그인 페이지로
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-testid="button-reset-password"
              >
                {loading ? '처리 중...' : '재설정 링크 보내기'}
              </Button>
            </form>
          )}
        </CardContent>
        {!sent && (
          <CardFooter className="flex justify-center">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-primary flex items-center" data-testid="link-back-to-login">
              <ArrowLeft className="mr-1 h-3 w-3" />
              로그인으로 돌아가기
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
