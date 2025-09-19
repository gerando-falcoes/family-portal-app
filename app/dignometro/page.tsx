"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle, Loader2, Target, TrendingUp } from "lucide-react"
import { supabaseBrowserClient } from '@/lib/supabase/browser'

// ✅ FASE 2.1: Novos imports para sistema Sim/Não
import { diagnosticoQuestions } from '@/lib/diagnostico'
import { QuestionCard } from './components/QuestionCard'
import { useDiagnostico } from './hooks/useDiagnostico'
import { useProgress } from './hooks/useProgress'

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } }

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid\" width=\"32\" height=\"32\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 32 0 L 0 0 0 32\" fill=\"none\" stroke=\"%23e2e8f0\" stroke-width=\"1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid)\" /%3E%3C/svg%3E')"}}></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center rounded-2xl shadow-xl border border-gray-100 bg-white/95 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
              <p className="text-gray-600">Carregando avaliação...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ✅ Tela de erro se não conseguir obter familyId
  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid\" width=\"32\" height=\"32\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 32 0 L 0 0 0 32\" fill=\"none\" stroke=\"%23e2e8f0\" stroke-width=\"1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid)\" /%3E%3C/svg%3E')"}}></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center rounded-2xl shadow-xl border border-gray-100 bg-white/95 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Erro de Autenticação</h3>
              <p className="text-red-600 mb-6">{authError}</p>
              <div className="space-y-3">
                <Button onClick={() => window.location.reload()} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  Tentar Novamente
                </Button>
                <Button variant="outline" onClick={() => router.push("/familia")} className="w-full">
                  Voltar ao Perfil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid\" width=\"32\" height=\"32\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 32 0 L 0 0 0 32\" fill=\"none\" stroke=\"%23e2e8f0\" stroke-width=\"1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid)\" /%3E%3C/svg%3E')"}}></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <Card className="w-full max-w-md text-center rounded-2xl shadow-xl border border-gray-100 bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <motion.div variants={itemVariants} className="mx-auto w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <CardTitle className="text-2xl text-gray-800">Avaliação Concluída!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div variants={itemVariants} className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200">
                    <div className="text-4xl font-bold text-gray-800 mb-2">{finalScore.toFixed(1)}</div>
                    <div className="text-lg text-gray-600 mb-4">/ 10</div>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                        getPovertyLevel(finalScore) === "Baixo"
                          ? "bg-blue-100 text-blue-800"
                          : getPovertyLevel(finalScore) === "Médio"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      Nível de Pobreza: {getPovertyLevel(finalScore)}
                    </span>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Button 
                      onClick={() => router.push("/familia")} 
                      className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      Voltar ao Perfil
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid\" width=\"32\" height=\"32\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 32 0 L 0 0 0 32\" fill=\"none\" stroke=\"%23e2e8f0\" stroke-width=\"1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid)\" /%3E%3C/svg%3E')"}}></div>
      
      <div className="relative z-10">
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-lg shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/familia")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Perfil
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-800">Dignômetro</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            
            {/* Header da avaliação */}
            <motion.div variants={itemVariants} className="mb-8">
              <Card className="rounded-2xl shadow-xl border border-gray-100 p-6 bg-white/95 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">Avaliação de Vulnerabilidade</h1>
                      <p className="text-gray-600">Responda honestamente para uma avaliação precisa</p>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-sm text-gray-500">Progresso</div>
                    <div className="text-xl font-bold text-gray-800">
                      {currentStep + 1} de {totalSteps}
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      {Math.round(progress)}% concluído
                    </div>
                  </div>
                </div>
                
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </Card>
            </motion.div>

            {/* Card da pergunta */}
            <motion.div variants={itemVariants} className="flex justify-center mb-8">
              <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                selectedValue={responses[currentQuestion.id]}
              />
            </motion.div>

            {/* Navegação */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button 
                variant="outline" 
                onClick={handlePrevious} 
                disabled={currentStep === 0}
                className="bg-white/80 backdrop-blur-sm border-gray-300 hover:bg-white order-2 sm:order-1 px-8 py-3 h-11 rounded-lg"
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg order-3 px-8 py-3 h-11 rounded-lg transform hover:scale-105 transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </div>
                ) : (
                  <>
                    {currentStep === totalSteps - 1 ? "Finalizar Avaliação" : "Próxima"}
                    {currentStep < totalSteps - 1 && <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />}
                  </>
                )}
              </Button>
            </motion.div>

            {/* Indicador de progresso visual */}
            <motion.div variants={itemVariants} className="mt-8">
              <Card className="rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 p-4">
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {Array.from({ length: totalSteps }, (_, index) => (
                    <motion.div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index <= currentStep
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                          : index === currentStep + 1
                          ? 'bg-blue-200'
                          : 'bg-gray-200'
                      }`}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: index <= currentStep ? 1 : 0.8 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}