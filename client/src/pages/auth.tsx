import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, Lock, Building2, Factory, DollarSign } from 'lucide-react';
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
      <div className="hidden lg:flex lg:flex-1 bg-sidebar text-sidebar-foreground p-12 flex-col justify-between">
        <div>
          <Logo size="lg" />
          <h1 className="text-4xl font-bold mt-12 tracking-tight">
            Financial Health Assessment for SMEs
          </h1>
          <p className="text-lg text-sidebar-foreground/70 mt-4 max-w-md">
            Get AI-powered insights into your business finances. Understand your creditworthiness, 
            identify risks, and receive actionable recommendations.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Credit Score Analysis</h3>
              <p className="text-sm text-sidebar-foreground/70">
                Get a comprehensive creditworthiness score based on your financial data
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <Factory className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Industry Benchmarking</h3>
              <p className="text-sm text-sidebar-foreground/70">
                Compare your metrics against industry averages
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-sidebar-foreground/50">
          Trusted by 1000+ SMEs across India
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Logo size="lg" />
            <p className="text-muted-foreground mt-2">{t('tagline')}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{activeTab === 'signin' ? t('signIn') : t('signUp')}</CardTitle>
              <CardDescription>
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
                          placeholder="••••••••"
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
                          placeholder="••••••••"
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
