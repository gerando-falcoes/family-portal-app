import { useState, useCallback, useEffect } from 'react';
import { DiagnosticoService } from '@/lib/diagnostico';

export function useDiagnostico() {
  // ✅ Sempre inicia com respostas vazias - usuário deve selecionar novamente
  const [responses, setResponses] = useState<Record<string, boolean>>({});

  // ✅ Limpa as respostas antigas do localStorage ao iniciar nova avaliação
  useEffect(() => {
    DiagnosticoService.clearResponses();
  }, []);

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
