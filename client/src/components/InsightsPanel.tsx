import { useState } from 'react';
import { Sparkles, Loader2, AlertTriangle, Lightbulb, TrendingUp, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface InsightsPanelProps {
  analysisData: Record<string, unknown> | null;
  businessName?: string;
  industry?: string;
  onGenerate?: () => Promise<string>;
  initialInsights?: string;
}

export function InsightsPanel({
  analysisData,
  businessName,
  industry,
  onGenerate,
  initialInsights,
}: InsightsPanelProps) {
  const { t, language } = useLanguage();
  const [insights, setInsights] = useState(initialInsights || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!onGenerate) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await onGenerate();
      setInsights(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
    } finally {
      setIsLoading(false);
    }
  };

  const parseInsights = (text: string) => {
    const sections: { title: string; icon: React.ReactNode; content: string[] }[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentSection: { title: string; icon: React.ReactNode; content: string[] } | null = null;
    
    for (const line of lines) {
      if (line.startsWith('**') && line.endsWith('**')) {
        if (currentSection) sections.push(currentSection);
        const title = line.replace(/\*\*/g, '').replace(/^#+\s*/, '');
        let icon: React.ReactNode = <Lightbulb className="h-5 w-5" />;
        
        if (title.toLowerCase().includes('risk')) {
          icon = <AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))]" />;
        } else if (title.toLowerCase().includes('cost') || title.toLowerCase().includes('optimization')) {
          icon = <TrendingUp className="h-5 w-5 text-[hsl(var(--success))]" />;
        } else if (title.toLowerCase().includes('product') || title.toLowerCase().includes('recommend')) {
          icon = <Building className="h-5 w-5 text-[hsl(var(--info))]" />;
        }
        
        currentSection = { title, icon, content: [] };
      } else if (line.startsWith('#')) {
        if (currentSection) sections.push(currentSection);
        const title = line.replace(/^#+\s*/, '').replace(/\*\*/g, '');
        currentSection = { title, icon: <Lightbulb className="h-5 w-5" />, content: [] };
      } else if (currentSection && line.trim().startsWith('-') || line.trim().match(/^\d+\./)) {
        currentSection.content.push(line.trim().replace(/^[-\d.]+\s*/, ''));
      } else if (currentSection && line.trim()) {
        currentSection.content.push(line.trim());
      }
    }
    
    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const parsedInsights = insights ? parseInsights(insights) : [];

  return (
    <Card className="h-full" data-testid="insights-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {t('insights')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!analysisData ? (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Upload financial data to generate AI insights</p>
          </div>
        ) : !insights && !isLoading ? (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary/50" />
            <p className="text-muted-foreground mb-4">
              Get personalized financial insights powered by AI
            </p>
            <Button onClick={handleGenerate} disabled={isLoading} data-testid="button-generate-insights">
              <Sparkles className="h-4 w-4 mr-2" />
              {t('generateInsights')}
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Analyzing your financial data...</p>
            <p className="text-xs text-muted-foreground mt-1">This may take a few moments</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <p>{error}</p>
            <Button variant="outline" onClick={handleGenerate} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {parsedInsights.map((section, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h4 className="font-semibold">{section.title}</h4>
                </div>
                <ul className="space-y-2 ml-7">
                  {section.content.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-sm text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              onClick={handleGenerate} 
              className="w-full mt-4"
              data-testid="button-regenerate-insights"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Regenerate Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
