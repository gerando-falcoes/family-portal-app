'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DiagnosticoQuestion } from '../types/diagnostico';

interface QuestionCardProps {
  question: DiagnosticoQuestion;
  onAnswer: (questionId: string, answer: boolean) => void;
  selectedValue?: boolean;
}

export function QuestionCard({ question, onAnswer, selectedValue }: QuestionCardProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center text-lg font-semibold text-gray-600">
          Dimensão: {question.dimensao}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-xl mb-8">{question.pergunta}</p>
        <div className="flex justify-center gap-4">
          <Button
            variant={selectedValue === true ? 'default' : 'outline'}
            onClick={() => onAnswer(question.id, true)}
            className="w-32"
          >
            Sim
          </Button>
          <Button
            variant={selectedValue === false ? 'destructive' : 'outline'}
            onClick={() => onAnswer(question.id, false)}
            className="w-32"
          >
            Não
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
