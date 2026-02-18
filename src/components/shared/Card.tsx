import { type CSSProperties, type ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
};

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className = '', style, padding = 'md', hover = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 ${paddingMap[padding]} ${
        hover ? 'hover:border-gray-300 hover:shadow-md transition-all duration-200' : ''
      } ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

type CardHeaderProps = {
  children: ReactNode;
  className?: string;
};

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

type CardTitleProps = {
  children: ReactNode;
  className?: string;
  as?: 'h2' | 'h3' | 'h4';
};

export function CardTitle({ children, className = '', as: Tag = 'h3' }: CardTitleProps) {
  return (
    <Tag className={`font-bold text-gray-900 ${className}`}>
      {children}
    </Tag>
  );
}

type CardContentProps = {
  children: ReactNode;
  className?: string;
};

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      {children}
    </div>
  );
}
