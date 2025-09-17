'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DiagnosticoQuestion } from '../types/diagnostico';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionCardProps {
  question: DiagnosticoQuestion;
  onAnswer: (questionId: string, answer: boolean) => void;
  selectedValue?: boolean;
}

export function QuestionCard({ question, onAnswer, selectedValue }: QuestionCardProps) {
  return (
    <Card className="w-full max-w-3xl shadow-lg border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg border-b border-gray-100">
        <div className="flex flex-col items-center space-y-3">
          <Badge 
            variant="secondary" 
            className="bg-purple-100 text-purple-700 border-purple-200 px-4 py-1 text-sm font-medium"
          >
            📊 {question.dimensao}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed mb-4">
            {question.pergunta}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full"></div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-md mx-auto">
          {/* Botão SIM */}
          <Button
            onClick={() => onAnswer(question.id, true)}
            className={`
              relative flex items-center justify-center gap-3 px-8 py-6 text-lg font-semibold
              transition-all duration-300 transform hover:scale-105 rounded-xl
              ${selectedValue === true 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200 border-2 border-green-400' 
                : 'bg-white text-green-600 border-2 border-green-200 hover:border-green-300 hover:bg-green-50'
              }
            `}
            variant="outline"
          >
            <CheckCircle className={`w-6 h-6 ${selectedValue === true ? 'text-white' : 'text-green-500'}`} />
            <span>Sim</span>
            {selectedValue === true && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </Button>

          {/* Botão NÃO */}
          <Button
            onClick={() => onAnswer(question.id, false)}
            className={`
              relative flex items-center justify-center gap-3 px-8 py-6 text-lg font-semibold
              transition-all duration-300 transform hover:scale-105 rounded-xl
              ${selectedValue === false 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200 border-2 border-red-400' 
                : 'bg-white text-red-600 border-2 border-red-200 hover:border-red-300 hover:bg-red-50'
              }
            `}
            variant="outline"
          >
            <XCircle className={`w-6 h-6 ${selectedValue === false ? 'text-white' : 'text-red-500'}`} />
            <span>Não</span>
            {selectedValue === false && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
                <XCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </Button>
        </div>

        {/* Indicador visual da resposta selecionada */}
        {selectedValue !== undefined && (
          <div className="mt-8 text-center">
            <div className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              ${selectedValue 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
              }
            `}>
              {selectedValue ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Resposta: Sim
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Resposta: Não
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
