import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, Lock, User, Globe } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const LANGUAGES = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: '영어' },
  { value: 'zh', label: '중국어' },
  { value: 'ja', label: '일본어' },
  { value: 'es', label: '스페인어' },
  { value: 'fr', label: '프랑스어' },
  { value: 'de', label: '독일어' },
  { value: 'ar', label: '아랍어' },
  { value: 'hi', label: '힌디어' },
  { value: 'pt', label: '포르투갈어' },
];

export default function Signup() {
  const [, setLocation] = useLocation();
  const { signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [learningLanguages, setLearningLanguages] = useState<string[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLanguageToggle = (languageValue: string) => {
    setLearningLanguages((prev) =>
      prev.includes(languageValue)
        ? prev.filter((lang) => lang !== languageValue)
        : [...prev, languageValue]
    );
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !fullName || !nativeLanguage || learningLanguages.length === 0) {
      toast({
        title: '입력 오류',
        description: '모든 필수 항목을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: '비밀번호 오류',
        description: '비밀번호는 최소 8자 이상이어야 합니다.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: '비밀번호 불일치',
        description: '비밀번호가 일치하지 않습니다.',
        variant: 'destructive',
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: '약관 동의 필요',
        description: '이용약관에 동의해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, {
      full_name: fullName,
      native_language: nativeLanguage,
      learning_languages: learningLanguages,
    });
    setLoading(false);

    if (error) {
      toast({
        title: '회원가입 실패',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: '회원가입 성공',
        description: '이메일을 확인하여 계정을 활성화해주세요.',
      });
      setLocation('/login');
    }
  };

  const handleGoogleSignup = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: 'Google 가입 실패',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-2xl">
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
          <CardTitle className="text-xl">회원가입</CardTitle>
          <CardDescription>
            새로운 계정을 만들어 학습을 시작하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignup}
            data-testid="button-google-signup"
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Google 계정으로 가입
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                또는
              </span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">이름</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="홍길동"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    data-testid="input-fullname"
                  />
                </div>
              </div>

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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="최소 8자"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    data-testid="input-password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호 재입력"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    data-testid="input-confirm-password"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nativeLanguage">모국어</Label>
              <Select value={nativeLanguage} onValueChange={setNativeLanguage}>
                <SelectTrigger data-testid="select-native-language">
                  <SelectValue placeholder="모국어를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>학습할 언어 (다중 선택 가능)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {LANGUAGES.map((lang) => (
                  <div key={lang.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`learning-${lang.value}`}
                      checked={learningLanguages.includes(lang.value)}
                      onCheckedChange={() => handleLanguageToggle(lang.value)}
                      data-testid={`checkbox-learning-${lang.value}`}
                    />
                    <Label
                      htmlFor={`learning-${lang.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {lang.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                data-testid="checkbox-terms"
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                이용약관 및 개인정보처리방침에 동의합니다
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              data-testid="button-signup"
            >
              {loading ? (
                <>처리 중...</>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  가입하기
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            이미 계정이 있나요?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium" data-testid="link-login">
              로그인
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
