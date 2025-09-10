"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { AuthService } from "@/lib/auth"
import { mockAssessments } from "@/lib/mock-data"
import type { Assessment } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle } from "lucide-react"

interface Question {
  id: string
  text: string
  options: {
    value: string
    label: string
    score: number
  }[]
}

const questions: Question[] = [
  {
    id: "housing",
    text: "Como você avalia as condições da sua moradia?",
    options: [
      { value: "excellent", label: "Excelente - Casa própria em bom estado", score: 10 },
      { value: "good", label: "Boa - Casa própria com pequenos reparos necessários", score: 8 },
      { value: "fair", label: "Regular - Casa alugada em bom estado", score: 6 },
      { value: "poor", label: "Ruim - Moradia precária ou em área de risco", score: 3 },
      { value: "very-poor", label: "Muito ruim - Sem moradia fixa", score: 1 },
    ],
  },
  {
    id: "income",
    text: "Como você avalia a renda familiar mensal?",
    options: [
      { value: "sufficient", label: "Suficiente para todas as necessidades e sobra", score: 10 },
      { value: "adequate", label: "Adequada para as necessidades básicas", score: 8 },
      { value: "tight", label: "Justa, às vezes falta para algumas coisas", score: 6 },
      { value: "insufficient", label: "Insuficiente, frequentemente falta dinheiro", score: 3 },
      { value: "very-insufficient", label: "Muito insuficiente, sempre em dificuldades", score: 1 },
    ],
  },
  {
    id: "education",
    text: "Qual o nível de escolaridade dos adultos da família?",
    options: [
      { value: "higher", label: "Ensino superior completo", score: 10 },
      { value: "high-school", label: "Ensino médio completo", score: 8 },
      { value: "elementary", label: "Ensino fundamental completo", score: 6 },
      { value: "incomplete", label: "Ensino fundamental incompleto", score: 3 },
      { value: "illiterate", label: "Não alfabetizado", score: 1 },
    ],
  },
  {
    id: "health",
    text: "Como você avalia o acesso da família aos serviços de saúde?",
    options: [
      { value: "excellent", label: "Excelente - Plano de saúde privado", score: 10 },
      { value: "good", label: "Bom - SUS com acesso fácil", score: 8 },
      { value: "fair", label: "Regular - SUS com algumas dificuldades", score: 6 },
      { value: "poor", label: "Ruim - Dificuldades frequentes de acesso", score: 3 },
      { value: "very-poor", label: "Muito ruim - Sem acesso adequado", score: 1 },
    ],
  },
  {
    id: "food",
    text: "Como está a segurança alimentar da sua família?",
    options: [
      { value: "secure", label: "Sempre temos comida suficiente e variada", score: 10 },
      { value: "mild-insecurity", label: "Às vezes falta variedade na alimentação", score: 8 },
      { value: "moderate-insecurity", label: "Frequentemente falta comida", score: 6 },
      { value: "severe-insecurity", label: "Muitas vezes passamos fome", score: 3 },
      { value: "very-severe", label: "Constantemente em insegurança alimentar", score: 1 },
    ],
  },
]

export default function DignometroPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    let totalScore = 0
    let answeredQuestions = 0

    questions.forEach((question) => {
      const answer = answers[question.id]
      if (answer) {
        const option = question.options.find((opt) => opt.value === answer)
        if (option) {
          totalScore += option.score
          answeredQuestions++
        }
      }
    })

    return answeredQuestions > 0 ? Math.round((totalScore / answeredQuestions) * 10) / 10 : 0
  }

  const getPovertyLevel = (score: number): "Baixo" | "Médio" | "Alto" => {
    if (score >= 7) return "Baixo"
    if (score >= 4) return "Médio"
    return "Alto"
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const score = calculateScore()
      const povertyLevel = getPovertyLevel(score)

      // Simulate API call to save assessment
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const user = AuthService.getCurrentUser()
      if (user?.familyId) {
        const newAssessment: Assessment = {
          id: `assess${Date.now()}`,
          familyId: user.familyId,
          date: new Date(),
          score,
          povertyLevel,
        }

        // Add to mock data (in a real app, this would be saved to database)
        mockAssessments.unshift(newAssessment)
      }

      setFinalScore(score)
      setIsCompleted(true)

      toast({
        title: "Avaliação concluída!",
        description: `Seu score foi ${score}/10 - Nível de pobreza: ${povertyLevel}`,
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar avaliação",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQuestionData = questions[currentQuestion]
  const currentAnswer = answers[currentQuestionData?.id]
  const canProceed = currentAnswer !== undefined

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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/familia")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Dignômetro</h1>
            <span className="text-sm text-gray-600">
              {currentQuestion + 1} de {questions.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestionData.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={currentAnswer || ""}
              onValueChange={(value) => handleAnswer(currentQuestionData.id, value)}
            >
              <div className="space-y-3">
                {currentQuestionData.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSubmitting
              ? "Salvando..."
              : currentQuestion === questions.length - 1
                ? "Finalizar Avaliação"
                : "Próxima"}
          </Button>
        </div>
      </div>
    </div>
  )
}
