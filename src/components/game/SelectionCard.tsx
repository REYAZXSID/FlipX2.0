
'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type SelectionCardProps = {
  Icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
};

export function SelectionCard({
  Icon,
  title,
  description,
  onClick,
  className,
}: SelectionCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative cursor-pointer rounded-xl border-2 border-muted bg-card p-6 text-center transition-all duration-300 hover:border-primary/80 hover:bg-primary/5 hover:shadow-2xl hover:-translate-y-2 animate-fly-in',
        className
      )}
    >
      <div className="flex justify-center mb-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]">
          <Icon className="w-8 h-8" />
        </div>
      </div>
      <h3 className="text-xl font-bold font-headline">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}
