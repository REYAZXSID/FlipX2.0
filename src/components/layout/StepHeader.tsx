
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type StepHeaderProps = {
  title: string;
  step: number;
  totalSteps: number;
};

export function StepHeader({ title, step, totalSteps }: StepHeaderProps) {
  const router = useRouter();

  const progress = (step / totalSteps) * 100;

  return (
    <div className="w-full max-w-2xl text-center animate-fly-in">
      <div className="relative flex items-center justify-center mb-8">
        {step > 1 && (
            <Button
                variant="outline"
                size="icon"
                className="absolute left-0"
                onClick={() => router.back()}
            >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
            </Button>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold font-headline tracking-wide text-primary">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Step {step}/{totalSteps}</span>
        <Progress value={progress} className="w-full h-2" />
      </div>
    </div>
  );
}
