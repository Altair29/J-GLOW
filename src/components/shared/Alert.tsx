import { type ReactNode } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

type Variant = 'info' | 'success' | 'warning' | 'error';

type AlertProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

const config: Record<Variant, { classes: string; Icon: typeof Info }> = {
  info: {
    classes: 'bg-blue-50 border-blue-200 text-blue-800',
    Icon: Info,
  },
  success: {
    classes: 'bg-green-50 border-green-200 text-green-800',
    Icon: CheckCircle,
  },
  warning: {
    classes: 'bg-amber-50 border-amber-200 text-amber-800',
    Icon: AlertTriangle,
  },
  error: {
    classes: 'bg-red-50 border-red-200 text-red-700',
    Icon: XCircle,
  },
};

export function Alert({ variant = 'info', children, className = '' }: AlertProps) {
  const { classes, Icon } = config[variant];

  return (
    <div className={`flex items-start gap-3 px-4 py-3 border rounded-lg text-sm ${classes} ${className}`}>
      <Icon size={18} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
