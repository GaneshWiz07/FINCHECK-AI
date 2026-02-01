import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, Lock, Building2, Factory, DollarSign, Sparkles, Shield, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  businessName: z.string().min(2, 'Business name is required'),
  industry: z.string().min(1, 'Please select an industry'),
  annualRevenue: z.string().min(1, 'Please select your revenue range'),
});

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;

const industries = [
  { value: 'retail', label: 'Retail Trade' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'services', label: 'Professional Services' },
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'construction', label: 'Construction' },
  { value: 'food_beverage', label: 'Food & Beverage' },
  { value: 'logistics', label: 'Logistics & Transport' },
  { value: 'education', label: 'Education' },
  { value: 'agriculture', label: 'Agriculture' },
];

const revenueRanges = [
  { value: '0-10L', label: 'Up to ₹10 Lakhs' },
  { value: '10L-50L', label: '₹10 - 50 Lakhs' },
  { value: '50L-1Cr', label: '₹50 Lakhs - 1 Crore' },
  { value: '1Cr-5Cr', label: '₹1 - 5 Crores' },
  { value: '5Cr-10Cr', label: '₹5 - 10 Crores' },
  { value: '10Cr+', label: 'Above ₹10 Crores' },
];

const features = [
  { icon: BarChart3, title: 'Credit Score Analysis', desc: 'Get a comprehensive creditworthiness score based on your financial data' },
  { icon: Factory, title: 'Industry Benchmarking', desc: 'Compare your metrics against industry averages' },
  { icon: Sparkles, title: 'AI Recommendations', desc: 'Receive personalized insights to grow your business' },
];

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      businessName: '',
      industry: '',
      annualRevenue: '',
    },
  });

  const handleSignIn = async (data: SignInForm) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      toast({ title: 'Welcome back!', description: 'Signed in successfully' });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Sign in failed',
        description: error instanceof Error ? error.message : 'Please check your credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpForm) => {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password, {
        business_name: data.businessName,
        industry: data.industry,
        annual_revenue: data.annualRevenue,
        language: language,
      });
      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account',
      });
      setActiveTab('signin');
    } catch (error) {
      toast({
        title: 'Sign up failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-sidebar to-primary/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative z-10 p-12 flex flex-col justify-between text-sidebar-foreground">
          <div>
            <Logo size="lg" />
            <h1 className="text-4xl lg:text-5xl font-bold mt-12 tracking-tight leading-tight">
              Financial Health
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Assessment for SMEs
              </span>
            </h1>
            <p className="text-lg text-sidebar-foreground/70 mt-6 max-w-md leading-relaxed">
              Get AI-powered insights into your business finances. Understand your creditworthiness, 
              identify risks, and receive actionable recommendations.
            </p>
          </div>
          
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover-elevate overflow-visible">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow-lg">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-sidebar-foreground/70 mt-1">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-sidebar-foreground/50">
            <Shield className="h-4 w-4" />
            <span>Trusted by 10,000+ SMEs across India</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden mb-8 text-center">
            <Logo size="lg" />
            <p className="text-muted-foreground mt-3">{t('tagline')}</p>
          </div>

          <Card className="border-border/50 shadow-2xl backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">{activeTab === 'signin' ? t('signIn') : t('signUp')}</CardTitle>
              <CardDescription className="text-base">
                {activeTab === 'signin' 
                  ? 'Enter your credentials to access your dashboard' 
                  : 'Create an account to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" data-testid="tab-signin">{t('signIn')}</TabsTrigger>
                  <TabsTrigger value="signup" data-testid="tab-signup">{t('signUp')}</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">{t('email')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="name@company.com"
                          className="pl-10"
                          {...signInForm.register('email')}
                          data-testid="input-signin-email"
                        />
                      </div>
                      {signInForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{signInForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password">{t('password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10"
                          {...signInForm.register('password')}
                          data-testid="input-signin-password"
                        />
                      </div>
                      {signInForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{signInForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-signin">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      {t('signIn')}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">{t('email')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="name@company.com"
                          className="pl-10"
                          {...signUpForm.register('email')}
                          data-testid="input-signup-email"
                        />
                      </div>
                      {signUpForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{signUpForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">{t('password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          className="pl-10"
                          {...signUpForm.register('password')}
                          data-testid="input-signup-password"
                        />
                      </div>
                      {signUpForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{signUpForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-name">{t('businessName')}</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="business-name"
                          placeholder="Your Business Name"
                          className="pl-10"
                          {...signUpForm.register('businessName')}
                          data-testid="input-business-name"
                        />
                      </div>
                      {signUpForm.formState.errors.businessName && (
                        <p className="text-sm text-destructive">{signUpForm.formState.errors.businessName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>{t('industry')}</Label>
                      <Select onValueChange={(value) => signUpForm.setValue('industry', value)}>
                        <SelectTrigger data-testid="select-industry">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((ind) => (
                            <SelectItem key={ind.value} value={ind.value}>
                              {ind.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {signUpForm.formState.errors.industry && (
                        <p className="text-sm text-destructive">{signUpForm.formState.errors.industry.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>{t('annualRevenue')}</Label>
                      <Select onValueChange={(value) => signUpForm.setValue('annualRevenue', value)}>
                        <SelectTrigger data-testid="select-revenue">
                          <SelectValue placeholder="Select revenue range" />
                        </SelectTrigger>
                        <SelectContent>
                          {revenueRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {signUpForm.formState.errors.annualRevenue && (
                        <p className="text-sm text-destructive">{signUpForm.formState.errors.annualRevenue.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-signup">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      {t('signUp')}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
