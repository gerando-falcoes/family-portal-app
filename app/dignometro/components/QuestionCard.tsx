'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DiagnosticoQuestion } from '../types/diagnostico'
import { ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react'
import { DimensionIcon, getDimensionColor, getDimensionBackground } from './DimensionIcon'
import { motion } from 'framer-motion'

interface QuestionCardProps {
  question: DiagnosticoQuestion
  onAnswer: (questionId: string, answer: boolean) => void
  selectedValue?: boolean
}

const questionDescriptions: Record<string, string> = {
  'moradia': 'Avalia se a família possui moradia segura e com endereço formal',
  'agua': 'Verifica o acesso regular à água potável para consumo diário',
  'saneamento': 'Analisa as condições sanitárias e acesso a banheiro adequado',
  'educacao': 'Acompanha a frequência escolar das crianças da família',
  'saude': 'Avalia o acesso a atendimento médico e medicamentos',
  'alimentacao': 'Verifica a segurança alimentar e regularidade das refeições',
  'renda_diversificada': 'Analisa a diversificação das fontes de renda familiar',
  'renda_estavel': 'Verifica a estabilidade da renda principal da família',
  'poupanca': 'Avalia a capacidade de poupança e reserva financeira',
  'bens_conectividade': 'Analisa o acesso a bens essenciais e conectividade'
}

export function QuestionCard({ question, onAnswer, selectedValue }: QuestionCardProps) {
  const backgroundClass = getDimensionBackground(question.dimensao)
  const description = questionDescriptions[question.id] || ''
  
  return (
    <div className="w-full space-y-6">
      {/* Header com ícone e categoria */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border ${backgroundClass}`}>
          <DimensionIcon dimension={question.dimensao} size={20} />
          <span className={`text-sm font-medium ${getDimensionColor(question.dimensao)}`}>
            {question.dimensao}
          </span>
        </div>
        
        <h2 className="text-lg md:text-xl font-semibold text-foreground leading-relaxed px-4">
          {question.pergunta}
        </h2>
        
        {description && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <HelpCircle className="w-4 h-4" />
            <span>{description}</span>
      </div>
        )}
      </motion.div>
      
      {/* Botões de resposta */}
      <motion.div 
        className="flex flex-col items-center space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button
          onClick={() => onAnswer(question.id, true)}
          variant={selectedValue === true ? 'default' : 'outline'}
          size="lg"
          className={`
            w-full max-w-sm h-12 text-base font-medium rounded-xl transition-all duration-200 
            border-2 ${selectedValue === true 
              ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-lg shadow-green-600/25' 
              : 'border-green-200 hover:border-green-400 hover:bg-green-50'
            }
            hover:-translate-y-1 hover:shadow-lg
          `}
        >
          <div className="flex items-center justify-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              selectedValue === true ? 'bg-white/20' : 'bg-green-100'
            }`}>
              <ThumbsUp className={`w-4 h-4 ${selectedValue === true ? 'text-white' : 'text-green-600'}`} />
            </div>
            <div className="text-center">
              <div className="text-base font-semibold">Sim</div>
              <div className={`text-xs ${selectedValue === true ? 'text-green-100' : 'text-green-600'}`}>
                Esta situação se aplica à família
              </div>
            </div>
          </div>
        </Button>

        <Button
          onClick={() => onAnswer(question.id, false)}
          variant={selectedValue === false ? 'destructive' : 'outline'}
          size="lg"
          className={`
            w-full max-w-sm h-12 text-base font-medium rounded-xl transition-all duration-200 
            border-2 ${selectedValue === false 
              ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-lg shadow-red-600/25' 
              : 'border-red-200 hover:border-red-400 hover:bg-red-50'
            }
            hover:-translate-y-1 hover:shadow-lg
          `}
        >
          <div className="flex items-center justify-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              selectedValue === false ? 'bg-white/20' : 'bg-red-100'
            }`}>
              <ThumbsDown className={`w-4 h-4 ${selectedValue === false ? 'text-white' : 'text-red-600'}`} />
            </div>
            <div className="text-center">
              <div className="text-base font-semibold">Não</div>
              <div className={`text-xs ${selectedValue === false ? 'text-red-100' : 'text-red-600'}`}>
                Esta situação NÃO se aplica à família
              </div>
            </div>
          </div>
        </Button>
      </motion.div>
    </div>
  )
}
