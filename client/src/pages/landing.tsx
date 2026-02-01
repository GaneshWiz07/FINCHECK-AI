import { useLocation } from 'wouter';
import { ArrowRight, BarChart3, Shield, Sparkles, TrendingUp, Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

const features = [
  {
    icon: Upload,
    title: 'Easy Data Upload',
    description: 'Simply upload your CSV or Excel financial data. Our system auto-detects columns like revenue, expenses, and cash flow.',
  },
  {
    icon: BarChart3,
    title: 'Financial Health Scores',
    description: 'Get comprehensive scores for cash flow stability, expense ratio, working capital, and overall creditworthiness.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Insights',
    description: 'Receive personalized recommendations powered by advanced AI to improve your financial health.',
  },
  {
    icon: TrendingUp,
    title: 'Industry Benchmarking',
    description: 'Compare your metrics against industry averages to understand where you stand.',
  },
];

const benefits = [
  'Understand your creditworthiness score',
  'Identify financial risks early',
  'Get actionable cost optimization ideas',
  'Compare with industry benchmarks',
  'Generate investor-ready reports',
  'Available in English & Hindi',
];

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Button onClick={handleGetStarted} data-testid="button-header-get-started">
              {user ? t('dashboard') : t('getStarted')}
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 py-24 lg:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Financial Analysis
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Financial Health Assessment for{' '}
              <span className="text-primary">SMEs</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get instant insights into your business finances. Understand your creditworthiness, 
              identify risks, and receive AI-powered recommendations to grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted} data-testid="button-hero-get-started">
                {t('getStarted')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" data-testid="button-learn-more">
                {t('learnMore')}
              </Button>
            </div>
          </div>

          <div className="mt-16 max-w-5xl mx-auto">
            <Card className="overflow-hidden border-2">
              <CardContent className="p-0">
                <div className="bg-sidebar text-sidebar-foreground p-4 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm font-medium">FINCHECK AI Dashboard</span>
                </div>
                <div className="p-8 bg-muted/30">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-card border">
                      <p className="text-sm text-muted-foreground">Credit Score</p>
                      <p className="text-3xl font-bold text-[hsl(var(--success))]">78</p>
                      <p className="text-xs text-[hsl(var(--success))]">Grade B - Good</p>
                    </div>
                    <div className="p-4 rounded-lg bg-card border">
                      <p className="text-sm text-muted-foreground">Cash Flow</p>
                      <p className="text-3xl font-bold">72%</p>
                      <p className="text-xs text-[hsl(var(--success))]">Stable</p>
                    </div>
                    <div className="p-4 rounded-lg bg-card border">
                      <p className="text-sm text-muted-foreground">Expense Ratio</p>
                      <p className="text-3xl font-bold text-[hsl(var(--warning))]">68%</p>
                      <p className="text-xs text-muted-foreground">Moderate</p>
                    </div>
                    <div className="p-4 rounded-lg bg-card border">
                      <p className="text-sm text-muted-foreground">Debt Burden</p>
                      <p className="text-3xl font-bold">Low</p>
                      <p className="text-xs text-[hsl(var(--success))]">Healthy</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get comprehensive financial insights in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="text-5xl font-bold text-primary/20 mb-4">01</div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Data</h3>
              <p className="text-muted-foreground">
                Upload your financial data in CSV or Excel format. We auto-detect revenue, expenses, and more.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <div className="text-5xl font-bold text-primary/20 mb-4">02</div>
              <h3 className="text-xl font-semibold mb-2">Get Analysis</h3>
              <p className="text-muted-foreground">
                Our engine calculates key financial metrics and generates your creditworthiness score.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div className="text-5xl font-bold text-primary/20 mb-4">03</div>
              <h3 className="text-xl font-semibold mb-2">Receive Insights</h3>
              <p className="text-muted-foreground">
                Get AI-powered recommendations to improve your financial health and grow your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Everything You Need to Understand Your Finances
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                FINCHECK AI provides comprehensive financial analysis tailored for SMEs. 
                Make data-driven decisions with confidence.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-[hsl(var(--success))]/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--success))]" />
                    </div>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="hover-elevate">
                  <CardContent className="p-6 flex gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Secure & Trusted
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Financial Health?
          </h2>
          <p className="text-lg text-sidebar-foreground/70 max-w-2xl mx-auto mb-8">
            Join thousands of SMEs who trust FINCHECK AI for their financial analysis. 
            Get started in minutes, no credit card required.
          </p>
          <Button size="lg" onClick={handleGetStarted} data-testid="button-cta-get-started">
            {t('getStarted')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              © 2025 FINCHECK AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
