'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { DiagnosticoResponse } from '../types/diagnostico';
import { diagnosticoQuestions } from '@/lib/diagnostico';

interface ResultCardProps {
  result: DiagnosticoResponse;
  onRestart: () => void;
  onGoToDashboard: () => void;
}

export function ResultCard({ result, onRestart, onGoToDashboard }: ResultCardProps) {
    const getQuestionById = (id: string) => diagnosticoQuestions.find(q => q.id === id);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Diagnóstico Concluído!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-lg">Sua pontuação final é:</p>
          <p className="text-5xl font-bold text-blue-600">{result.score.toFixed(1)}</p>
        </div>
        
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Resumo das Dimensões:</h3>
            <ul className="space-y-2">
                {Object.entries(result.responses).map(([questionId, answer]) => {
                    const question = getQuestionById(questionId);
                    return (
                        <li key={questionId} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                            <span className="font-medium">{question?.dimensao}</span>
                            {answer ? (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            ) : (
                                <XCircle className="h-6 w-6 text-red-500" />
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full mt-6">
            <Button onClick={onGoToDashboard} className="w-full">
              Voltar para o Dashboard
            </Button>
            <Button onClick={onRestart} variant="outline" className="w-full">
              Refazer Diagnóstico
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
