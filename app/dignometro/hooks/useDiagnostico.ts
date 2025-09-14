import { useState, useCallback } from 'react';
import { DiagnosticoService } from '@/lib/diagnostico';

export function useDiagnostico() {
  const [responses, setResponses] = useState<Record<string, boolean>>(() => 
    DiagnosticoService.loadResponses()
  );

  const updateResponse = useCallback((questionId: string, answer: boolean) => {
    setResponses(prev => ({ ...prev, [questionId]: answer }));
    DiagnosticoService.saveResponse(questionId, answer);
  }, []);

  const isAnswered = (questionId: string) => {
    return responses[questionId] !== undefined;
  };

  return {
    responses,
    updateResponse,
    isAnswered,
  };
}
