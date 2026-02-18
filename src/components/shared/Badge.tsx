import { type CSSProperties, type ReactNode } from 'react';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'custom';
type Size = 'sm' | 'md';

export type BadgeProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  color?: string;
  bgColor?: string;
  className?: string;
  style?: CSSProperties;
};

const variantClasses: Record<Variant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  custom: '',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({ children, variant = 'default', size = 'sm', color, bgColor, className = '', style: styleProp }: BadgeProps) {
  const computedStyle: CSSProperties = { ...styleProp };
  if (variant === 'custom' && color) computedStyle.color = color;
  if (variant === 'custom' && bgColor) computedStyle.backgroundColor = bgColor;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={computedStyle}
    >
      {children}
    </span>
  );
}
