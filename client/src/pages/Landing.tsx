import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  MessageCircle,
  Mic,
  Sparkles,
  FileText,
  BarChart3,
  Users,
  ThumbsUp,
  Star,
  Check,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Landing() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setLocation('/dashboard');
      }
    };
    checkAuth();

    // Handle scroll for navbar
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setLocation]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleGetStarted = () => {
    if (email) {
      setLocation(`/signup?email=${encodeURIComponent(email)}`);
    } else {
      setLocation('/signup');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-md border-b'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-2xl font-bold text-primary"
              data-testid="button-logo"
            >
              Suda
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('features')}
                className="text-sm font-medium hover:text-primary transition-colors"
                data-testid="link-features"
              >
                기능
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-sm font-medium hover:text-primary transition-colors"
                data-testid="link-pricing"
              >
                가격
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-sm font-medium hover:text-primary transition-colors"
                data-testid="link-faq"
              >
                FAQ
              </button>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" data-testid="button-login">
                  로그인
                </Button>
              </Link>
              <Link href="/signup">
                <Button data-testid="button-signup-nav">
                  무료 시작하기
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b animate-in slide-in-from-top duration-300">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left py-2 font-medium hover:text-primary transition-colors"
              >
                기능
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="block w-full text-left py-2 font-medium hover:text-primary transition-colors"
              >
                가격
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="block w-full text-left py-2 font-medium hover:text-primary transition-colors"
              >
                FAQ
              </button>
              <div className="pt-3 border-t space-y-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    로그인
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full">무료 시작하기</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#2E5CFF] to-[#9D4EDD]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
            {/* Icon */}
            <div className="flex justify-center animate-in zoom-in duration-700 delay-200">
              <MessageCircle className="w-12 h-12 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white animate-in fade-in slide-in-from-bottom duration-700 delay-300">
              AI와 함께하는
              <br />
              언어 학습의 새로운 시작
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-white/80 animate-in fade-in slide-in-from-bottom duration-700 delay-400">
              발음 연습부터 실시간 피드백까지
              <br />
              Suda가 함께합니다
            </p>

            {/* Email Input + CTA */}
            <div className="max-w-md mx-auto space-y-4 animate-in fade-in duration-700 delay-600">
              <Input
                type="email"
                placeholder="이메일 주소 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-foreground h-12"
                data-testid="input-email-hero"
              />
              <Button
                onClick={handleGetStarted}
                size="lg"
                variant="secondary"
                className="w-full h-12 text-lg bg-white text-primary hover:bg-white/90"
                data-testid="button-get-started-hero"
              >
                무료로 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Benefits */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>신용카드 필요 없음</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>3분 만에 시작</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col items-center gap-2 text-white/60 text-sm">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p>이미 500명이 학습 중</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">믿을 수 있는 AI 기술</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover-elevate transition-all duration-300">
              <CardContent className="pt-6 text-center">
                <div className="text-5xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">학습자</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate transition-all duration-300">
              <CardContent className="pt-6 text-center">
                <div className="text-5xl font-bold text-primary mb-2">95%</div>
                <p className="text-muted-foreground">만족도</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate transition-all duration-300">
              <CardContent className="pt-6 text-center">
                <div className="text-5xl font-bold text-primary mb-2">4.9/5.0</div>
                <p className="text-muted-foreground">평점</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Suda가 특별한 이유</h2>
            <p className="text-xl text-muted-foreground">AI 기술로 더 효과적인 언어 학습</p>
          </div>

          <div className="space-y-24">
            {/* Feature 1: 실시간 발음 분석 */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-5 gap-8 items-center">
                  <div className="md:col-span-2 p-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 flex items-center justify-center min-h-[300px]">
                    <Mic className="w-32 h-32 text-primary" />
                  </div>
                  <div className="md:col-span-3 p-12 space-y-6">
                    <div className="flex items-center gap-3">
                      <Mic className="w-8 h-8 text-primary" />
                      <h3 className="text-3xl font-bold">실시간 발음 분석</h3>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      AI가 당신의 발음을 즉시 분석하고 정확한 점수와 피드백을 제공합니다
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">0-100점 정확한 점수</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">단어별 분석</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">개선 제안</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2: AI 대화 파트너 */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-5 gap-8 items-center">
                  <div className="md:col-span-3 p-12 space-y-6 order-2 md:order-1">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-8 h-8 text-primary" />
                      <h3 className="text-3xl font-bold">AI 대화 파트너</h3>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      24시간 언제든지 AI와 자유롭게 대화하며 실전 감각을 키우세요
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">자유 대화</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">시나리오 연습</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">실시간 교정</span>
                      </li>
                    </ul>
                    <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                      곧 출시
                    </div>
                  </div>
                  <div className="md:col-span-2 p-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 flex items-center justify-center min-h-[300px] order-1 md:order-2">
                    <MessageCircle className="w-32 h-32 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3: 개인화된 학습 추적 */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-5 gap-8 items-center">
                  <div className="md:col-span-2 p-12 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 flex items-center justify-center min-h-[300px]">
                    <BarChart3 className="w-32 h-32 text-primary" />
                  </div>
                  <div className="md:col-span-3 p-12 space-y-6">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-8 h-8 text-primary" />
                      <h3 className="text-3xl font-bold">개인화된 학습 추적</h3>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      당신만의 학습 통계와 성장 과정을 한눈에 확인하세요
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">XP & 레벨</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">학습 통계</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">성취 배지</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">3단계로 간단하게</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/50">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto">
                    1
                  </div>
                  <FileText className="w-12 h-12 text-primary mx-auto" />
                  <h3 className="text-2xl font-bold">문장 선택</h3>
                  <p className="text-muted-foreground">
                    관심 있는 주제의 문장을 고르세요
                  </p>
                </CardContent>
              </Card>
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/50">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto">
                    2
                  </div>
                  <Mic className="w-12 h-12 text-primary mx-auto" />
                  <h3 className="text-2xl font-bold">큰 소리로 읽기</h3>
                  <p className="text-muted-foreground">
                    마이크에 대고 자연스럽게 말하세요
                  </p>
                </CardContent>
              </Card>
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/50">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto">
                    3
                  </div>
                  <Sparkles className="w-12 h-12 text-primary mx-auto" />
                  <h3 className="text-2xl font-bold">즉시 피드백</h3>
                  <p className="text-muted-foreground">
                    AI 분석 결과와 개선 방법을 확인하세요
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">베타 테스터들의 후기</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="hover-elevate transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xl font-bold text-primary">
                  "발음에 자신감이 생겼어요!"
                </p>
                <p className="text-muted-foreground">
                  AI 분석이 정말 정확해서 어떤 부분을 개선해야 하는지 명확하게 알 수 있어요.
                </p>
                <div className="flex items-center gap-3 pt-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                    김
                  </div>
                  <div>
                    <p className="font-semibold">김*수</p>
                    <p className="text-sm text-muted-foreground">직장인</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="hover-elevate transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xl font-bold text-primary">
                  "학원 다니는 것보다 효과적이에요"
                </p>
                <p className="text-muted-foreground">
                  시간과 장소에 구애받지 않고 언제든 연습할 수 있어서 좋아요.
                </p>
                <div className="flex items-center gap-3 pt-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center text-white font-bold">
                    박
                  </div>
                  <div>
                    <p className="font-semibold">박*희</p>
                    <p className="text-sm text-muted-foreground">대학생</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="hover-elevate transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xl font-bold text-primary">
                  "시간 날 때마다 5분씩 연습해요"
                </p>
                <p className="text-muted-foreground">
                  짧은 시간에도 효과적으로 연습할 수 있어서 좋습니다.
                </p>
                <div className="flex items-center gap-3 pt-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                    이
                  </div>
                  <div>
                    <p className="font-semibold">이*준</p>
                    <p className="text-sm text-muted-foreground">프리랜서</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">지금은 완전 무료!</h2>
            <p className="text-xl text-muted-foreground">
              베타 기간 동안 모든 기능을 무료로 사용하세요
            </p>
          </div>

          <Card className="max-w-lg mx-auto bg-gradient-to-br from-[#2E5CFF] to-[#9D4EDD] text-white shadow-2xl">
            <CardContent className="p-12 space-y-8 text-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">베타 버전</h3>
                <p className="text-white/80">(한정 특별 혜택)</p>
              </div>

              <div>
                <div className="text-5xl font-bold">무료</div>
                <p className="text-white/60 line-through mt-2">(정가 ₩9,900/월)</p>
              </div>

              <div className="border-t border-white/20 pt-8 space-y-4 text-left">
                <p className="font-semibold text-lg">포함된 기능:</p>
                <ul className="space-y-3">
                  {[
                    'Speaking 무제한 연습',
                    'AI 발음 분석',
                    '개인화된 피드백',
                    '학습 통계',
                    'XP & 레벨 시스템',
                    '배지 시스템',
                    'AI 대화 (곧 출시)',
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/20 pt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
                  <p className="font-semibold flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    첫 1000명 한정!
                  </p>
                  <p>평생 무료 사용</p>
                </div>

                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full bg-white text-primary hover:bg-white/90"
                    data-testid="button-pricing-signup"
                  >
                    지금 시작하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <div className="mt-6 space-y-2 text-sm text-white/60">
                  <p className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    신용카드 불필요
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    언제든 취소 가능
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-[#F5F7FA]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">자주 묻는 질문</h2>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                정말 무료인가요?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                네! 베타 기간 동안 모든 기능을 무료로 사용할 수 있습니다. 첫 1000명은
                평생 무료입니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                어떤 언어를 지원하나요?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                현재 영어를 지원하며, 곧 중국어, 일본어, 스페인어 등 10개 언어로 확대할
                예정입니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                모바일에서도 사용 가능한가요?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                네! 웹 브라우저에서 모바일, 태블릿, 데스크톱 모두 사용 가능합니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                마이크가 필요한가요?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Speaking 연습을 위해서는 마이크가 필요합니다. 대부분의 기기에 내장된
                마이크를 사용하실 수 있습니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-background rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                환불이 가능한가요?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                현재는 무료 서비스이므로 환불 정책이 없습니다. 유료 전환 시 14일 환불
                정책을 제공할 예정입니다.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-gradient-to-br from-[#2E5CFF] to-[#9D4EDD] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold">오늘부터 시작하세요</h2>
            <p className="text-xl text-white/80">3분 만에 시작하는 언어 학습</p>

            <div className="max-w-md mx-auto space-y-4">
              <Input
                type="email"
                placeholder="이메일 주소 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-foreground h-12"
                data-testid="input-email-cta"
              />
              <Button
                onClick={handleGetStarted}
                size="lg"
                variant="secondary"
                className="w-full h-12 text-lg bg-white text-primary hover:bg-white/90"
                data-testid="button-get-started-cta"
              >
                무료로 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>신용카드 필요 없음</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>3분 만에 시작</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Column 1: Brand */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Suda</h3>
              <p className="text-white/60">AI 기반 언어 학습 플랫폼</p>
            </div>

            {/* Column 2: Product */}
            <div>
              <h4 className="font-semibold mb-4">제품</h4>
              <ul className="space-y-2 text-white/60">
                <li>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="hover:text-white transition-colors"
                  >
                    기능
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('pricing')}
                    className="hover:text-white transition-colors"
                  >
                    가격
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('faq')}
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 className="font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-white/60">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    소개
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    블로그
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    채용
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    문의
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/40 text-sm">
                © 2025 Suda. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-white/40">
                <a href="#" className="hover:text-white transition-colors">
                  이용약관
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  개인정보처리방침
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  문의하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
