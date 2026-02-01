import { useLocation } from 'wouter';
import { ArrowRight, BarChart3, Shield, Sparkles, TrendingUp, Upload, CheckCircle, Zap, Globe, PieChart } from 'lucide-react';
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
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Financial Health Scores',
    description: 'Get comprehensive scores for cash flow stability, expense ratio, working capital, and overall creditworthiness.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Insights',
    description: 'Receive personalized recommendations powered by advanced AI to improve your financial health.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: TrendingUp,
    title: 'Industry Benchmarking',
    description: 'Compare your metrics against industry averages to understand where you stand.',
    gradient: 'from-orange-500 to-amber-500',
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
    <div className="min-h-screen bg-background overflow-hidden">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
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

      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[hsl(var(--success))]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(var(--background))_70%)]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>AI-Powered Financial Analysis</span>
              <Zap className="h-4 w-4" />
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                Financial Health
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Assessment for SMEs
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Get instant insights into your business finances. Understand your creditworthiness, 
              identify risks, and receive AI-powered recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" onClick={handleGetStarted} data-testid="button-hero-get-started">
                {t('getStarted')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-learn-more">
                {t('learnMore')}
              </Button>
            </div>

          </div>

          <div className="mt-20 max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-50" />
              <Card className="relative overflow-hidden border-2 border-primary/20 bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-sidebar via-sidebar to-sidebar/90 text-sidebar-foreground p-4 flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
                      <div className="h-3 w-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                    </div>
                    <span className="text-sm font-medium">FINCHECK AI Dashboard</span>
                    <div className="ml-auto flex items-center gap-2 text-xs text-sidebar-foreground/60">
                      <Globe className="h-3 w-3" />
                      <span>Live Preview</span>
                    </div>
                  </div>
                  <div className="p-8 bg-gradient-to-br from-muted/30 via-background to-muted/30">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-lg">
                        <p className="text-sm text-muted-foreground mb-2">Credit Score</p>
                        <div className="flex items-end gap-2">
                          <p className="text-4xl font-bold bg-gradient-to-r from-[hsl(var(--success))] to-emerald-400 bg-clip-text text-transparent">78</p>
                          <TrendingUp className="h-5 w-5 text-[hsl(var(--success))] mb-1" />
                        </div>
                        <p className="text-xs text-[hsl(var(--success))] mt-1 font-medium">Grade B - Good</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-lg">
                        <p className="text-sm text-muted-foreground mb-2">Cash Flow</p>
                        <div className="flex items-end gap-2">
                          <p className="text-4xl font-bold">72%</p>
                          <div className="w-12 h-6 mb-1">
                            <div className="flex items-end h-full gap-0.5">
                              <div className="w-2 h-3 bg-primary/40 rounded-sm" />
                              <div className="w-2 h-4 bg-primary/60 rounded-sm" />
                              <div className="w-2 h-5 bg-primary/80 rounded-sm" />
                              <div className="w-2 h-6 bg-primary rounded-sm" />
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-[hsl(var(--success))] mt-1 font-medium">Stable</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-lg">
                        <p className="text-sm text-muted-foreground mb-2">Expense Ratio</p>
                        <div className="flex items-end gap-2">
                          <p className="text-4xl font-bold text-[hsl(var(--warning))]">68%</p>
                          <PieChart className="h-5 w-5 text-[hsl(var(--warning))] mb-1" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">Moderate</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-lg">
                        <p className="text-sm text-muted-foreground mb-2">Debt Burden</p>
                        <div className="flex items-end gap-2">
                          <p className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Low</p>
                        </div>
                        <p className="text-xs text-[hsl(var(--success))] mt-1 font-medium">Healthy</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Simple Process
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get comprehensive financial insights in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
            
            {[
              { icon: Upload, step: '01', title: 'Upload Your Data', desc: 'Upload your financial data in CSV or Excel format. We auto-detect revenue, expenses, and more.' },
              { icon: BarChart3, step: '02', title: 'Get Analysis', desc: 'Our engine calculates key financial metrics and generates your creditworthiness score.' },
              { icon: Sparkles, step: '03', title: 'Receive Insights', desc: 'Get AI-powered recommendations to improve your financial health and grow your business.' },
            ].map((item, index) => (
              <div key={index} className="text-center relative group">
                <div className="relative mx-auto mb-8">
                  <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto border border-primary/20">
                    <item.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/50">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20 text-[hsl(var(--success))] text-sm font-medium mb-6">
                <CheckCircle className="h-4 w-4" />
                Complete Solution
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Everything You Need to
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Understand Your Finances</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                FINCHECK AI provides comprehensive financial analysis tailored for SMEs. 
                Make data-driven decisions with confidence.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover-elevate overflow-visible">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[hsl(var(--success))] to-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-[hsl(var(--success))]/30">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="hover-elevate overflow-visible border-border/50">
                  <CardContent className="p-6 flex gap-5">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-sidebar to-primary/20" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8">
            <Shield className="h-4 w-4" />
            Secure & Trusted
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Financial Health?</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Start analyzing your business finances today. 
            Get started in minutes, no credit card required.
          </p>
          <Button size="lg" variant="secondary" onClick={handleGetStarted} data-testid="button-cta-get-started">
            {t('getStarted')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo />
            <p className="text-sm text-muted-foreground">
              © 2026 FINCHECK AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
