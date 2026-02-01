import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ScoreGaugeProps {
  score: number;
  label: string;
  status: string;
  explanation: string;
  size?: 'sm' | 'md' | 'lg';
  showWhyMatters?: boolean;
  whyMatters?: string;
}

export function ScoreGauge({
  score,
  label,
  status,
  explanation,
  size = 'md',
  showWhyMatters = true,
  whyMatters,
}: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getColor = () => {
    if (score >= 70) return 'text-[hsl(var(--success))]';
    if (score >= 50) return 'text-[hsl(var(--warning))]';
    return 'text-destructive';
  };

  const getStrokeColor = () => {
    if (score >= 70) return 'stroke-[hsl(var(--success))]';
    if (score >= 50) return 'stroke-[hsl(var(--warning))]';
    return 'stroke-destructive';
  };

  const getStatusBadgeColor = () => {
    if (status === 'excellent' || status === 'healthy') return 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]';
    if (status === 'good' || status === 'moderate' || status === 'average') return 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]';
    return 'bg-destructive/10 text-destructive';
  };

  const sizes = {
    sm: { svg: 80, stroke: 6, text: 'text-lg' },
    md: { svg: 120, stroke: 8, text: 'text-2xl' },
    lg: { svg: 160, stroke: 10, text: 'text-4xl' },
  };

  const { svg, stroke, text } = sizes[size];
  const radius = (svg - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - animatedScore) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: svg, height: svg }}>
        <svg
          width={svg}
          height={svg}
          className="transform -rotate-90"
        >
          <circle
            cx={svg / 2}
            cy={svg / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted/30"
          />
          <circle
            cx={svg / 2}
            cy={svg / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            className={`${getStrokeColor()} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${text} ${getColor()}`}>
            {animatedScore}
          </span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <h4 className="font-medium">{label}</h4>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{explanation}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor()}`}>
          {status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {showWhyMatters && whyMatters && (
        <p className="text-xs text-muted-foreground text-center max-w-[200px]">
          <span className="font-medium">Why this matters:</span> {whyMatters}
        </p>
      )}
    </div>
  );
}
