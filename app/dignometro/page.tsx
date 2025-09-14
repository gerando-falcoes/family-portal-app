'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgress } from './hooks/useProgress';
import { useDiagnostico } from './hooks/useDiagnostico';
import { QuestionCard } from './components/QuestionCard';
import { ProgressBar } from './components/ProgressBar';
import { NavigationButtons } from './components/NavigationButtons';
import { ResultCard } from './components/ResultCard';
import { DiagnosticoService } from '@/lib/diagnostico';
import { DiagnosticoResponse } from './types/diagnostico';
import { useAuth } from '@/lib/auth'; // Assuming useAuth hook exists to get user info

export default function DiagnosticoPage() {
  const router = useRouter();
  const { user } = useAuth() ?? {}; // Mock user, replace with actual auth
  const { 
    currentStep, 
    totalSteps, 
    nextStep, 
    previousStep, 
    canGoNext, 
    canGoPrevious, 
    currentQuestion,
    goToStep
  } = useProgress();
  
  const { responses, updateResponse, isAnswered } = useDiagnostico();
  const [finalResult, setFinalResult] = useState<DiagnosticoResponse | null>(null);

  useEffect(() => {
    const savedStep = localStorage.getItem('diagnostico_current_step');
    if (savedStep) {
      goToStep(parseInt(savedStep, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('diagnostico_current_step', currentStep.toString());
  }, [currentStep]);

  const handleNext = () => {
    if (canGoNext) {
      nextStep();
    } else {
      // Final step
      if (user) {
        const result = DiagnosticoService.saveDiagnostico(responses, user.email, user.id, user.familyId || '');
        setFinalResult(result);
        // Optional: submit to database
        // DiagnosticoService.submitToDatabase(result);
      }
    }
  };

  const handleRestart = () => {
    localStorage.removeItem('diagnostico_responses');
    localStorage.removeItem('diagnostico_current_step');
    setFinalResult(null);
    goToStep(0);
    // Manually clear responses in the hook
    Object.keys(responses).forEach(key => updateResponse(key, undefined as any));
  };

  const handleGoToDashboard = () => {
    router.push('/familia');
  };

  if (finalResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <ResultCard result={finalResult} onRestart={handleRestart} onGoToDashboard={handleGoToDashboard} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl space-y-8">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <QuestionCard 
          question={currentQuestion} 
          onAnswer={updateResponse} 
          selectedValue={responses[currentQuestion.id]}
        />
        <NavigationButtons 
          onPrevious={previousStep}
          onNext={handleNext}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          isNextDisabled={!isAnswered(currentQuestion.id)}
        />
      </div>
    </div>
  );
}