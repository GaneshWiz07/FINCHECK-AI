import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  status?: 'positive' | 'negative' | 'neutral';
  explanation?: string;
  whyMatters?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  status = 'neutral',
  explanation,
  whyMatters,
  icon,
  trend,
  trendValue,
}: MetricCardProps) {
  const statusColors = {
    positive: 'text-[hsl(var(--success))]',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <Card className="hover-elevate" data-testid={`metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center gap-1">
          {icon && (
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              {icon}
            </div>
          )}
          {explanation && (
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{explanation}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {trend && (
              <div className={`flex items-center gap-1 text-sm ${
                trend === 'up' ? 'text-[hsl(var(--success))]' : 
                trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                <TrendIcon className="h-4 w-4" />
                {trendValue && <span>{trendValue}</span>}
              </div>
            )}
          </div>
          {subtitle && (
            <p className={`text-sm ${statusColors[status]}`}>{subtitle}</p>
          )}
          {whyMatters && (
            <p className="text-xs text-muted-foreground mt-2">
              <span className="font-medium">Why this matters:</span> {whyMatters}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
