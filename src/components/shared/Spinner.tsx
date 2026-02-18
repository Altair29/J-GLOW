import { Loader2 } from 'lucide-react';

type SpinnerProps = {
  size?: number;
  className?: string;
  label?: string;
};

export function Spinner({ size = 24, className = '', label }: SpinnerProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 size={size} className="animate-spin text-gray-400" />
      {label && <span className="text-sm text-gray-500">{label}</span>}
    </div>
  );
}

type PageSpinnerProps = {
  label?: string;
};

export function PageSpinner({ label }: PageSpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Spinner size={32} label={label} />
    </div>
  );
}
