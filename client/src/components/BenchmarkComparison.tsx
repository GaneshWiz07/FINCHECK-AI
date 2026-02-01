import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ComparisonItem {
  actual: number;
  benchmark: number;
  difference: number;
  percentage_diff: number;
  status: string;
  comparison: string;
  is_better: boolean;
}

interface BenchmarkComparisonProps {
  industry: string;
  industryName: string;
  comparisons: {
    expense_ratio?: ComparisonItem;
    cash_flow_stability?: ComparisonItem;
    working_capital_gap?: ComparisonItem;
    debt_to_revenue?: ComparisonItem;
  };
  overallStatus: string;
  overallMessage: string;
}

const metricLabels: Record<string, string> = {
  expense_ratio: 'Expense to Revenue Ratio',
  cash_flow_stability: 'Cash Flow Stability',
  working_capital_gap: 'Working Capital Gap',
  debt_to_revenue: 'Debt to Revenue',
};

export function BenchmarkComparison({
  industryName,
  comparisons,
  overallStatus,
  overallMessage,
}: BenchmarkComparisonProps) {
  const getStatusColor = (isBetter: boolean, status: string) => {
    if (status === 'average') return 'text-[hsl(var(--info))]';
    return isBetter ? 'text-[hsl(var(--success))]' : 'text-destructive';
  };

  const getOverallStatusColor = () => {
    if (overallStatus === 'above_average') return 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20';
    if (overallStatus === 'average') return 'bg-[hsl(var(--info))]/10 text-[hsl(var(--info))] border-[hsl(var(--info))]/20';
    return 'bg-destructive/10 text-destructive border-destructive/20';
  };

  return (
    <Card data-testid="benchmark-comparison-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>Industry Comparison: {industryName}</span>
          <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getOverallStatusColor()}`}>
            {overallStatus.replace('_', ' ').toUpperCase()}
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{overallMessage}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(comparisons).map(([key, comparison]) => {
          if (!comparison) return null;
          
          const Icon = comparison.is_better ? ArrowUp : comparison.status === 'average' ? Minus : ArrowDown;
          const maxValue = Math.max(comparison.actual, comparison.benchmark) * 1.2;
          
          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{metricLabels[key] || key}</span>
                <div className={`flex items-center gap-1 text-sm ${getStatusColor(comparison.is_better, comparison.status)}`}>
                  <Icon className="h-4 w-4" />
                  <span>{Math.abs(comparison.percentage_diff).toFixed(1)}%</span>
                  <span className="text-muted-foreground">
                    {comparison.comparison} industry
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-20">Your Value</span>
                  <div className="flex-1">
                    <Progress 
                      value={(comparison.actual / maxValue) * 100} 
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium w-16 text-right">{comparison.actual.toFixed(1)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-20">Industry Avg</span>
                  <div className="flex-1 relative">
                    <Progress 
                      value={(comparison.benchmark / maxValue) * 100} 
                      className="h-2 [&>div]:bg-muted-foreground"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-16 text-right">{comparison.benchmark}</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
