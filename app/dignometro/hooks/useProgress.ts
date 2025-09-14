import { useState, useMemo } from 'react';
import { diagnosticoQuestions } from '@/lib/diagnostico';

export function useProgress(initialStep = 0) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const totalSteps = useMemo(() => diagnosticoQuestions.length, []);

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(step => step + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  return {
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    goToStep,
    canGoNext: currentStep < totalSteps - 1,
    canGoPrevious: currentStep > 0,
    currentQuestion: diagnosticoQuestions[currentStep],
  };
}
