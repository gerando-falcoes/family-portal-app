'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isNextDisabled?: boolean;
  nextLabel?: string;
}

export function NavigationButtons({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isNextDisabled = false,
  nextLabel = 'Continuar',
}: NavigationButtonsProps) {
  return (
    <div className="flex w-full justify-between mt-8">
      {canGoPrevious ? (
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      ) : (
        <div /> // Placeholder for alignment
      )}
      {canGoNext ? (
        <Button onClick={onNext} disabled={isNextDisabled}>
          {nextLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={onNext} disabled={isNextDisabled}>
          Finalizar
        </Button>
      )}
    </div>
  );
}
