'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Phone, MapPin, Users, LogOut, TrendingUp, AlertTriangle, Target, Loader2 } from "lucide-react"

// Interfaces TypeScript
interface FamilyData {
  id: string
  name: string
  status: string
  contacts: {
    phone: string
    whatsapp: string
    email: string
  }
  socioeconomic: {
    incomeRange: string
    familySize: string
    numberOfChildren: string
  }
  address: {
    street: string
    neighborhood: string
    city: string
    state: string
    referencePoint: string
  }
}

interface AssessmentData {
  assessment_id: string
  assessment_date: string
  poverty_score: string
  poverty_level: string
}

export default function FamiliaPage() {
  const router = useRouter()
  const [family, setFamily] = useState<FamilyData | null>(null)
  const [latestAssessment, setLatestAssessment] = useState<AssessmentData | null>(null)
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFamilyData = async () => {
      try {
        setIsLoading(true)
        
        // Obter token de autenticação do Supabase
        const { supabaseBrowserClient } = await import('@/lib/supabase/browser')
        const { data: { session } } = await supabaseBrowserClient.auth.getSession()
        
        if (!session?.access_token) {
          throw new Error('Usuário não autenticado')
        }
        
        // Buscar dados da família com token de autorização
        const response = await fetch('/api/familia/get', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })
        if (!response.ok) {
          throw new Error('Erro ao carregar dados da família')
        }
        
        const data = await response.json()
        
        // Organizar dados da família
        setFamily({
          id: data.family.id,
          name: data.family.name,
          status: data.family.status,
          contacts: {
            phone: data.family.contacts.phone,
            whatsapp: data.family.contacts.whatsapp,
            email: data.family.contacts.email
          },
          socioeconomic: {
            incomeRange: data.family.socioeconomic.incomeRange,
            familySize: data.family.socioeconomic.familySize,
            numberOfChildren: data.family.socioeconomic.numberOfChildren
          },
          address: {
            street: data.family.address.street,
            neighborhood: data.family.address.neighborhood,
            city: data.family.address.city,
            state: data.family.address.state,
            referencePoint: data.family.address.referencePoint
          }
        })

        // Organizar última avaliação
        if (data.latestAssessment) {
          setLatestAssessment({
            assessment_id: data.latestAssessment.assessment_id || '',
            assessment_date: data.latestAssessment.assessment_date,
            poverty_score: data.latestAssessment.poverty_score,
            poverty_level: data.latestAssessment.poverty_level
          })
        }

        // Organizar histórico de avaliações
        if (data.assessmentHistory && data.assessmentHistory.length > 0) {
          const formattedHistory = data.assessmentHistory.map((assessment: any) => ({
            assessment_id: assessment.id,
            assessment_date: assessment.assessment_date,
            poverty_score: assessment.poverty_score,
            poverty_level: assessment.poverty_level
          }))
          setAssessmentHistory(formattedHistory)
        }
        
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFamilyData()
  }, [])

  // Estados de loading e erro
  if (isLoading) {
    return <FamilyPageSkeleton />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />
  }

  if (!family) {
    return <ErrorState message="Família não encontrada" onRetry={() => window.location.reload()} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid\" width=\"32\" height=\"32\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 32 0 L 0 0 0 32\" fill=\"none\" stroke=\"%23e2e8f0\" stroke-width=\"1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid)\" /%3E%3C/svg%3E')"}}></div>
      
      <div className="relative z-10">
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-lg shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-800">{family.name}</h1>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                family.status === "Ativa" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {family.status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push("/dignometro")}
                className="h-9 px-4 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Responder Dignômetro
              </button>
              <button 
                onClick={() => router.push("/")} 
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="space-y-8">
            <p className="text-gray-600 text-sm">
              ID da Família: <span className="font-medium">{family.id}</span>
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <InfoCard icon={Phone} title="Contatos" data={family.contacts} />
              <InfoCard icon={Users} title="Dados Socioeconômicos" data={family.socioeconomic} />
              <InfoCard icon={MapPin} title="Endereço" data={family.address} />
            </div>

            {latestAssessment && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">Dignômetro (Última avaliação)</h3>
                        <p className="text-gray-600 text-sm">
                          Realizada em {new Date(latestAssessment.assessment_date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <ScoreDisplay score={Number(latestAssessment.poverty_score)} level={latestAssessment.poverty_level} />
                  </div>
                </div>
                
                <div>
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">Histórico de Avaliações</h3>
                    </div>
                    <div className="space-y-4">
                      {assessmentHistory.length > 0 ? assessmentHistory.map((assessment) => (
                        <div key={assessment.assessment_id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-sm text-gray-600">
                              {new Date(assessment.assessment_date).toLocaleDateString("pt-BR", { 
                                month: "long", 
                                year: "numeric" 
                              })}
                            </p>
                            <div className="text-lg font-bold text-gray-800">
                              {Number(assessment.poverty_score).toFixed(1)}
                              <span className="text-sm text-gray-600">/10</span>
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {assessment.poverty_level}
                          </span>
                        </div>
                      )) : (
                        <p className="text-gray-600 text-center py-8">Nenhuma avaliação anterior.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

// Mapeamento de campos para português
const fieldLabels: { [key: string]: string } = {
  // Contatos
  'phone': 'Telefone',
  'whatsapp': 'WhatsApp',
  'email': 'E-mail',
  
  // Dados Socioeconômicos
  'incomeRange': 'Faixa de Renda',
  'familySize': 'Tamanho da Família',
  'numberOfChildren': 'Número de Crianças',
  
  // Endereço
  'street': 'Rua',
  'neighborhood': 'Bairro',
  'city': 'Cidade',
  'state': 'Estado',
  'referencePoint': 'Ponto de Referência'
}

const InfoCard = ({ icon: Icon, title, data }: { icon: React.ElementType, title: string, data: any }) => (
  <div>
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-3 text-sm">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between items-start">
            <span className="text-gray-600 font-medium">{fieldLabels[key] || key}:</span>
            <span className="text-gray-800 text-right">{String(value) || 'N/A'}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const ScoreDisplay = ({ score, level }: { score: number, level: string }) => (
  <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 shadow-lg">
    <div className="text-5xl font-bold text-gray-800 mb-2">
      {score.toFixed(1)}
    </div>
    <p className="text-gray-600 text-lg mb-4">/ 10</p>
    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
      {level}
    </span>
  </div>
)

const EmptyState = ({ title, description, action }: { title: string, description: string, action: React.ReactNode }) => (
  <div className="flex items-center justify-center p-8">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{description}</p>
        <div>{action}</div>
      </div>
    </div>
  </div>
)

const FamilyPageSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="h-20 border-b border-border/40 bg-background/80" />
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="w-full h-10 bg-muted rounded-md animate-pulse"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => <div key={i} className="w-full h-48 bg-muted rounded-xl animate-pulse"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => <div key={i} className="w-full h-64 bg-muted rounded-xl animate-pulse"></div>)}
      </div>
    </main>
  </div>
)

const ErrorState = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Ocorreu um Erro</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
    </div>
)