import { TrendingUp } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <div className={`relative ${sizeClasses[size]} bg-primary rounded-lg flex items-center justify-center`}>
          <TrendingUp className="text-primary-foreground h-1/2 w-1/2" />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight ${textClasses[size]}`}>
            FINCHECK
          </span>
          <span className="text-xs text-primary font-semibold -mt-1">AI</span>
        </div>
      )}
    </div>
  );
}
