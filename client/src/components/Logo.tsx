import { TrendingUp } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-14 w-14',
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4.5 w-4.5',
    lg: 'h-7 w-7',
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-xl rounded-full opacity-50" />
        <div className={`relative ${sizeClasses[size]} bg-gradient-to-br from-primary via-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/30`}>
          <TrendingUp className={`text-primary-foreground ${iconSizes[size]}`} />
        </div>
      </div>
      {showText && (
        <div className="flex items-baseline gap-1">
          <span className={`font-bold tracking-tight ${textClasses[size]} bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text`}>
            FINCHECK
          </span>
          <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI</span>
        </div>
      )}
    </div>
  );
}
