import React from 'react';
import { cn } from '@/lib/utils';

interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: SeparatorProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-gray-700',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  );
} 