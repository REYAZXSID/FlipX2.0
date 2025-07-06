
"use client";

import { cn } from '@/lib/utils';
import { Lock, CheckCircle } from 'lucide-react';

type SettingSelectionCardProps = {
  title: string;
  onClick: () => void;
  isSelected: boolean;
  isOwned: boolean;
  children: React.ReactNode;
  className?: string;
};

export function SettingSelectionCard({
  title,
  onClick,
  isSelected,
  isOwned,
  children,
  className,
}: SettingSelectionCardProps) {
  return (
    <div
      onClick={isOwned ? onClick : undefined}
      className={cn(
        'group relative cursor-pointer rounded-xl border-2 bg-card p-4 text-center transition-all duration-300 transform hover:-translate-y-1 animate-fly-in',
        isSelected ? 'border-primary shadow-2xl ring-2 ring-primary/50' : 'border-muted hover:border-primary/80',
        !isOwned && 'cursor-not-allowed bg-muted/50 opacity-60 hover:transform-none',
        className
      )}
    >
      <div
        className={cn(
          "absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-background transition-all",
          isSelected ? "bg-primary" : "bg-transparent",
          !isOwned && "bg-muted-foreground/50"
        )}
      >
        {isOwned ? (
            isSelected && <CheckCircle className="h-6 w-6" />
        ) : <Lock className="h-4 w-4" />}
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex h-28 w-full items-center justify-center rounded-lg bg-muted/30 p-2 transition-colors group-hover:bg-muted/60">
          {children}
        </div>
        <h3 className="font-semibold truncate w-full">{title}</h3>
      </div>
    </div>
  );
}
