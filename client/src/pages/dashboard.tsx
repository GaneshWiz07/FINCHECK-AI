import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  LayoutDashboard, Upload, BarChart3, Sparkles, Building, FileText, 
  Settings, LogOut, TrendingUp, AlertTriangle, DollarSign, Wallet,
  ChevronRight, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { FileUpload } from '@/components/FileUpload';
import { ScoreGauge } from '@/components/ScoreGauge';
import { MetricCard } from '@/components/MetricCard';
import { InsightsPanel } from '@/components/InsightsPanel';
import { BenchmarkComparison } from '@/components/BenchmarkComparison';
import { uploadFile, api } from '@/lib/api';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';

interface AnalysisData {
  cash_flow_stability: { score: number; status: string; explanation: string };
  expense_ratio: { score: number; ratio: number; status: string; explanation: string };
  working_capital: { score: number; gap: number; status: string; explanation: string };
  debt_burden: { score: number; debt_service_ratio: number; debt_to_revenue: number; status: string; explanation: string };
  creditworthiness: { score: number; grade: string; status: string; explanation: string };
}

interface BenchmarkData {
  industry: string;
  industry_name: string;
  comparisons: Record<string, { actual: number; benchmark: number; difference: number; percentage_diff: number; status: string; comparison: string; is_better: boolean }>;
  overall_status: string;
  overall_message: string;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', value: 'dashboard' },
  { icon: Upload, label: 'Upload Data', value: 'upload' },
  { icon: BarChart3, label: 'Analysis', value: 'analysis' },
  { icon: Sparkles, label: 'AI Insights', value: 'insights' },
  { icon: Building, label: 'Benchmarks', value: 'benchmarks' },
  { icon: FileText, label: 'Reports', value: 'reports' },
];

const CHART_COLORS = ['hsl(217, 91%, 60%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(199, 89%, 48%)'];

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isUploading, setIsUploading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [financialData, setFinancialData] = useState<Record<string, number[]> | null>(null);
  const [insights, setInsights] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleFileUpload = async (file: File) => {
    if (!user) return;
    
    setIsUploading(true);
    try {
      const result = await uploadFile(file);
      setFinancialData(result.financial_data);
      
      toast({
        title: 'File uploaded successfully',
        description: `Detected ${result.summary.columns_detected.length} financial columns`,
      });
      
      await runAnalysis(result.financial_data);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const runAnalysis = async (data: Record<string, number[]>) => {
    if (!user) return;
    
    setIsAnalyzing(true);
    try {
      const result = await api.post<AnalysisData>('/analysis/calculate', {
        user_id: user.id,
        financial_data: data,
      });
      setAnalysisData(result);
      
      if (profile?.industry) {
        const benchmark = await api.post<BenchmarkData>('/benchmarks/compare', {
          industry: profile.industry,
          analysis_data: result,
        });
        setBenchmarkData(benchmark);
      }
      
      setActiveTab('analysis');
    } catch (error) {
      toast({
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateInsights = async (): Promise<string> => {
    if (!analysisData) throw new Error('No analysis data available');
    
    const result = await api.post<{ insights: string }>('/insights/generate', {
      analysis_data: analysisData,
      language,
      business_name: profile?.business_name,
      industry: profile?.industry,
    });
    
    setInsights(result.insights);
    return result.insights;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast({
        title: 'Sign out failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sampleChartData = financialData?.revenue?.map((rev, idx) => ({
    month: `Month ${idx + 1}`,
    revenue: rev,
    expenses: financialData?.expenses?.[idx] || 0,
  })) || [
    { month: 'Jan', revenue: 0, expenses: 0 },
    { month: 'Feb', revenue: 0, expenses: 0 },
  ];

  const cashFlowData = financialData?.cash_inflow?.map((inflow, idx) => ({
    month: `Month ${idx + 1}`,
    inflow,
    outflow: financialData?.cash_outflow?.[idx] || 0,
    net: inflow - (financialData?.cash_outflow?.[idx] || 0),
  })) || [];

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <Logo size="sm" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.value}>
                      <SidebarMenuButton
                        onClick={() => setActiveTab(item.value)}
                        isActive={activeTab === item.value}
                        data-testid={`sidebar-${item.value}`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} data-testid="button-signout">
                  <LogOut className="h-4 w-4" />
                  <span>{t('signOut')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
            <div className="flex h-14 items-center justify-between px-4 gap-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <div>
                  <h1 className="font-semibold">{t('welcome')}, {profile?.business_name || 'User'}</h1>
                  <p className="text-xs text-muted-foreground">{profile?.industry || 'SME'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {!analysisData ? (
                  <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Financial Data Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Upload your financial data to get started with analysis
                      </p>
                      <Button onClick={() => setActiveTab('upload')} data-testid="button-upload-data">
                        <Upload className="h-4 w-4 mr-2" />
                        {t('uploadData')}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <MetricCard
                        title={t('creditScore')}
                        value={`${analysisData.creditworthiness.score}/100`}
                        subtitle={`Grade ${analysisData.creditworthiness.grade}`}
                        status={analysisData.creditworthiness.score >= 70 ? 'positive' : analysisData.creditworthiness.score >= 50 ? 'neutral' : 'negative'}
                        explanation={analysisData.creditworthiness.explanation}
                        icon={<TrendingUp className="h-4 w-4 text-primary" />}
                        whyMatters="Your creditworthiness score determines your eligibility for loans and credit lines."
                      />
                      <MetricCard
                        title={t('cashFlowStability')}
                        value={`${analysisData.cash_flow_stability.score}%`}
                        subtitle={analysisData.cash_flow_stability.status}
                        status={analysisData.cash_flow_stability.score >= 70 ? 'positive' : analysisData.cash_flow_stability.score >= 50 ? 'neutral' : 'negative'}
                        explanation={analysisData.cash_flow_stability.explanation}
                        icon={<Wallet className="h-4 w-4 text-primary" />}
                        whyMatters="Stable cash flow ensures you can meet operational expenses and obligations."
                      />
                      <MetricCard
                        title={t('expenseRatio')}
                        value={`${analysisData.expense_ratio.ratio}%`}
                        subtitle={analysisData.expense_ratio.status}
                        status={analysisData.expense_ratio.ratio < 70 ? 'positive' : analysisData.expense_ratio.ratio < 85 ? 'neutral' : 'negative'}
                        explanation={analysisData.expense_ratio.explanation}
                        icon={<DollarSign className="h-4 w-4 text-primary" />}
                        whyMatters="Lower expense ratios mean higher profitability and financial flexibility."
                      />
                      <MetricCard
                        title={t('debtBurden')}
                        value={analysisData.debt_burden.status}
                        subtitle={`${analysisData.debt_burden.debt_service_ratio}% of revenue`}
                        status={analysisData.debt_burden.score >= 70 ? 'positive' : analysisData.debt_burden.score >= 50 ? 'neutral' : 'negative'}
                        explanation={analysisData.debt_burden.explanation}
                        icon={<AlertTriangle className="h-4 w-4 text-primary" />}
                        whyMatters="Managing debt burden ensures long-term financial sustainability."
                      />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Revenue vs Expenses</CardTitle>
                          <CardDescription>Monthly comparison of income and spending</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={sampleChartData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="month" className="text-xs" />
                                <YAxis className="text-xs" />
                                <RechartsTooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="hsl(217, 91%, 60%)" name="Revenue" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expenses" fill="hsl(38, 92%, 50%)" name="Expenses" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Cash Flow Trend</CardTitle>
                          <CardDescription>Net cash flow over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={cashFlowData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="month" className="text-xs" />
                                <YAxis className="text-xs" />
                                <RechartsTooltip />
                                <Area 
                                  type="monotone" 
                                  dataKey="net" 
                                  stroke="hsl(142, 71%, 45%)" 
                                  fill="hsl(142, 71%, 45%)" 
                                  fillOpacity={0.2}
                                  name="Net Cash Flow"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Quick Actions</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <Button 
                        variant="outline" 
                        className="h-auto p-4 justify-start"
                        onClick={() => setActiveTab('insights')}
                        data-testid="button-quick-insights"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Generate AI Insights</p>
                            <p className="text-xs text-muted-foreground">Get personalized recommendations</p>
                          </div>
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </div>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto p-4 justify-start"
                        onClick={() => setActiveTab('benchmarks')}
                        data-testid="button-quick-benchmarks"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Industry Benchmarks</p>
                            <p className="text-xs text-muted-foreground">Compare with peers</p>
                          </div>
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </div>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto p-4 justify-start"
                        onClick={() => setActiveTab('reports')}
                        data-testid="button-quick-reports"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Download Report</p>
                            <p className="text-xs text-muted-foreground">Investor-ready PDF</p>
                          </div>
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </div>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">{t('uploadFile')}</h2>
                  <p className="text-muted-foreground">
                    Upload your financial data in CSV or Excel format
                  </p>
                </div>
                <FileUpload onUpload={handleFileUpload} isLoading={isUploading || isAnalyzing} />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Expected Data Format</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>Your file should contain columns for:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Revenue / Sales / Income</li>
                      <li>Expenses / Costs / Expenditure</li>
                      <li>Cash Inflow / Receipts</li>
                      <li>Cash Outflow / Payments</li>
                      <li>Receivables / Accounts Receivable</li>
                      <li>Payables / Accounts Payable</li>
                      <li>Loans / Debt (optional)</li>
                      <li>EMI / Loan Payments (optional)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">{t('analysis')}</h2>
                  <p className="text-muted-foreground">
                    Detailed breakdown of your financial health metrics
                  </p>
                </div>

                {analysisData ? (
                  <>
                    <div className="flex justify-center">
                      <ScoreGauge
                        score={analysisData.creditworthiness.score}
                        label="Overall Creditworthiness"
                        status={analysisData.creditworthiness.status}
                        explanation={analysisData.creditworthiness.explanation}
                        size="lg"
                        whyMatters="This score determines your eligibility for bank loans and NBFC products"
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <ScoreGauge
                        score={analysisData.cash_flow_stability.score}
                        label={t('cashFlowStability')}
                        status={analysisData.cash_flow_stability.status}
                        explanation={analysisData.cash_flow_stability.explanation}
                        size="sm"
                        whyMatters="Stable cash flow ensures you can pay bills and employees on time"
                      />
                      <ScoreGauge
                        score={analysisData.expense_ratio.score}
                        label={t('expenseRatio')}
                        status={analysisData.expense_ratio.status}
                        explanation={analysisData.expense_ratio.explanation}
                        size="sm"
                        whyMatters="Lower ratios mean more profit margin for growth"
                      />
                      <ScoreGauge
                        score={analysisData.working_capital.score}
                        label={t('workingCapital')}
                        status={analysisData.working_capital.status}
                        explanation={analysisData.working_capital.explanation}
                        size="sm"
                        whyMatters="Good working capital means you can handle day-to-day operations smoothly"
                      />
                      <ScoreGauge
                        score={analysisData.debt_burden.score}
                        label={t('debtBurden')}
                        status={analysisData.debt_burden.status}
                        explanation={analysisData.debt_burden.explanation}
                        size="sm"
                        whyMatters="Low debt burden gives you flexibility to grow without stress"
                      />
                    </div>
                  </>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                      <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Analysis Available</h3>
                      <p className="text-muted-foreground mb-4">
                        Upload your financial data to see detailed analysis
                      </p>
                      <Button onClick={() => setActiveTab('upload')}>
                        <Upload className="h-4 w-4 mr-2" />
                        {t('uploadData')}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">{t('insights')}</h2>
                  <p className="text-muted-foreground">
                    AI-powered recommendations for your business
                  </p>
                </div>
                <InsightsPanel
                  analysisData={analysisData}
                  businessName={profile?.business_name}
                  industry={profile?.industry}
                  onGenerate={generateInsights}
                  initialInsights={insights}
                />
              </div>
            )}

            {activeTab === 'benchmarks' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">{t('benchmarks')}</h2>
                  <p className="text-muted-foreground">
                    See how your business compares to industry averages
                  </p>
                </div>

                {benchmarkData ? (
                  <BenchmarkComparison
                    industry={benchmarkData.industry}
                    industryName={benchmarkData.industry_name}
                    comparisons={benchmarkData.comparisons}
                    overallStatus={benchmarkData.overall_status}
                    overallMessage={benchmarkData.overall_message}
                  />
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                      <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Benchmark Data</h3>
                      <p className="text-muted-foreground mb-4">
                        Upload and analyze your financial data to compare with industry benchmarks
                      </p>
                      <Button onClick={() => setActiveTab('upload')}>
                        <Upload className="h-4 w-4 mr-2" />
                        {t('uploadData')}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">{t('reports')}</h2>
                  <p className="text-muted-foreground">
                    Download investor-ready reports
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Financial Health Report</CardTitle>
                    <CardDescription>
                      Comprehensive PDF report with all your metrics, insights, and benchmarks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      disabled={!analysisData}
                      onClick={() => toast({ title: 'Report Generation', description: 'PDF report will be downloaded shortly' })}
                      data-testid="button-download-report"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {t('downloadReport')}
                    </Button>
                    {!analysisData && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Upload and analyze your data first to generate a report
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
