"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { supabaseBrowserClient } from '@/lib/supabase/browser'

// ✅ FASE 2.1: Novos imports para sistema Sim/Não
import { diagnosticoQuestions } from '@/lib/diagnostico'
import { QuestionCard } from './components/QuestionCard'
import { useDiagnostico } from './hooks/useDiagnostico'
import { useProgress } from './hooks/useProgress'

// ❌ REMOVIDO: Sistema antigo de múltiplas escolhas
// ✅ Agora usando diagnosticoQuestions de @/lib/diagnostico

export default function DignometroPage() {
  // ✅ FASE 2.2: Nova lógica de state com hooks
  const { responses, updateResponse, isAnswered } = useDiagnostico()
  const { currentStep, totalSteps, nextStep, previousStep, currentQuestion } = useProgress()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [familyId, setFamilyId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // ✅ Buscar familyId usando a mesma estratégia da página da família
  useEffect(() => {
    const fetchFamilyId = async () => {
      try {
        setIsLoading(true)
        setAuthError(null)

        // Verificar se o usuário está autenticado
        const { data: { session }, error: sessionError } = await supabaseBrowserClient.auth.getSession()
        
        if (sessionError || !session?.user?.email) {
          setAuthError('Usuário não autenticado')
          router.push('/')
          return
        }

        // Buscar dados da família com token de autenticação
        const response = await fetch('/api/familia/get', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          if (response.status === 404) {
            setAuthError('Família não encontrada. Verifique se você completou o cadastro.')
          } else if (response.status === 401) {
            setAuthError('Sessão expirada. Faça login novamente.')
            router.push('/')
          } else {
            setAuthError('Erro ao carregar dados da família')
          }
          return
        }

        const data = await response.json()
        setFamilyId(data.family.id)

      } catch (err) {
        console.error('Erro ao buscar familyId:', err)
        setAuthError('Erro de conexão. Tente novamente.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFamilyId()
  }, [])

  const progress = ((currentStep + 1) / totalSteps) * 100

  // ✅ FASE 2.2: Nova lógica de manipulação de respostas
  const handleAnswer = (questionId: string, answer: boolean) => {
    updateResponse(questionId, answer)
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      nextStep()
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      previousStep()
    }
  }

  // ✅ FASE 2.2: Nova lógica de cálculo de score (Sim/Não)
  const calculateScore = () => {
    const totalQuestions = diagnosticoQuestions.length
    const positiveAnswers = Object.values(responses).filter(Boolean).length
    return (positiveAnswers / totalQuestions) * 10
  }

  const getPovertyLevel = (score: number): "Baixo" | "Médio" | "Alto" => {
    if (score >= 7) return "Baixo"
    if (score >= 4) return "Médio"
    return "Alto"
  }

  // ✅ FASE 2.3: Nova lógica de submit com integração à API real
  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const score = calculateScore()
      
      if (!familyId) {
        throw new Error('Family ID não encontrado. Tente recarregar a página.')
      }

      // Obter email do usuário autenticado
      const { data: { session } } = await supabaseBrowserClient.auth.getSession()
      const userEmail = session?.user?.email
      
      if (!userEmail) {
        throw new Error('Usuário não autenticado')
      }
      
      // ✅ Chamada real para a API criada na Fase 1
      const response = await fetch('/api/dignometro/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyId: familyId,
          responses: responses, // ✅ Objeto {pergunta: true/false}
          userEmail: userEmail
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao salvar avaliação')
      }
      
      if (result.success) {
        setFinalScore(score)
        setIsCompleted(true)
        toast({
          title: "Avaliação concluída!",
          description: `Score: ${score}/10 - Nível: ${result.povertyLevel}`,
        })
      } else {
        throw new Error(result.error || 'Resposta inválida da API')
      }
    } catch (error) {
      console.error('Erro ao submeter avaliação:', error)
      toast({
        title: "Erro ao salvar avaliação",
        description: error instanceof Error ? error.message : 'Erro inesperado',
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ✅ Verificação de resposta usando novos hooks
  const canProceed = isAnswered(currentQuestion.id)

  // ✅ Tela de loading enquanto busca familyId
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando avaliação...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ✅ Tela de erro se não conseguir obter familyId
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro de Autenticação</h3>
            <p className="text-red-600 mb-4">{authError}</p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                Tentar Novamente
              </Button>
              <Button variant="outline" onClick={() => router.push("/familia")} className="w-full">
                Voltar ao Perfil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Avaliação Concluída!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{finalScore}</div>
              <div className="text-lg text-gray-600">/ 10</div>
              <div className="mt-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    getPovertyLevel(finalScore) === "Baixo"
                      ? "bg-blue-100 text-blue-800"
                      : getPovertyLevel(finalScore) === "Médio"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  Nível de Pobreza: {getPovertyLevel(finalScore)}
                </span>
              </div>
            </div>
            <Button onClick={() => router.push("/familia")} className="w-full bg-purple-600 hover:bg-purple-700">
              Voltar ao Perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header melhorado */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/familia")} 
            className="mb-6 hover:bg-white/50 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Perfil
          </Button>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Dignômetro
                </h1>
                <p className="text-gray-600 mt-1">Avaliação de vulnerabilidade social</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Progresso</div>
                <div className="text-xl font-bold text-gray-800">
                  {currentStep + 1} de {totalSteps}
                </div>
                <div className="text-sm text-purple-600 font-medium">
                  {Math.round(progress)}% concluído
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Progress 
                value={progress} 
                className="h-3 bg-gray-200 rounded-full overflow-hidden"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
                   style={{ width: `${progress}%` }}>
              </div>
            </div>
          </div>
        </div>

        {/* Card da pergunta centralizado */}
        <div className="flex justify-center mb-8">
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            selectedValue={responses[currentQuestion.id]}
          />
        </div>

        {/* Navegação melhorada */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-3xl mx-auto">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentStep === 0}
            className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white order-2 sm:order-1 px-8 py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <div className="text-center text-sm text-gray-600 order-1 sm:order-2">
            <div className="bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
              Pergunta {currentStep + 1} de {totalSteps}
            </div>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg order-3 px-8 py-3 rounded-xl"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                {currentStep === totalSteps - 1 ? "Finalizar Avaliação" : "Próxima"}
                {currentStep < totalSteps - 1 && <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />}
              </>
            )}
          </Button>
        </div>

        {/* Indicador de progresso visual adicional */}
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                      : index === currentStep + 1
                      ? 'bg-purple-200'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
