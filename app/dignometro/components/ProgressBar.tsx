'use client';

import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="w-full flex items-center gap-4">
      <span className="text-sm font-medium text-gray-500">
        {currentStep + 1} de {totalSteps}
      </span>
      <Progress value={progress} className="flex-1" />
    </div>
  );
}
