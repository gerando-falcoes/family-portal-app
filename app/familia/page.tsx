"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFamilyData } from "@/hooks/use-family-data"
import type { DiagnoseAssessment } from "@/lib/types"
import { Phone, Mail, MessageCircle, MapPin, Users, Baby, LogOut, TrendingUp } from "lucide-react"

export default function FamiliaPage() {
  const router = useRouter()
  const { family, latestAssessment, assessmentHistory, isDashboard, isLoading, error } = useFamilyData()

  const handleLogout = () => {
    // Para agora, apenas redirecionar. Depois implementar logout real
    router.push("/")
  }

  const formatPovertyLevel = (level: string) => {
    const levels: { [key: string]: string } = {
      'baixo': 'Baixo',
      'medio': 'Médio', 
      'alto': 'Alto'
    }
    return levels[level?.toLowerCase()] || level
  }

  const getPovertyLevelColor = (level: string) => {
    const formattedLevel = formatPovertyLevel(level)
    switch (formattedLevel) {
      case 'Baixo':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Médio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Alto':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Carregando dados da família...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </div>
    )
  }

  if (!family) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Nenhuma família encontrada</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{family.name}</h1>
            <Badge
              variant={family.status === "Ativa" ? "default" : "secondary"}
              className="bg-green-100 text-green-800 border-green-200"
            >
              {family.status}
            </Badge>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        <p className="text-gray-600">ID da Família: {family.id}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contatos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contatos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium">{family.contacts.phone || 'Não informado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">WhatsApp</p>
                  <p className="font-medium">{family.contacts.whatsapp || 'Não informado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{family.contacts.email || 'Não informado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados Socioeconômicos */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Socioeconômicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Faixa de Renda</p>
                <p className="font-medium">{family.socioeconomic.incomeRange || 'Não informado'}</p>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Tamanho da Família</p>
                  <p className="font-medium">{family.socioeconomic.familySize || 0} pessoas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Baby className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Nº de Crianças</p>
                  <p className="font-medium">{family.socioeconomic.numberOfChildren || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{family.address.street || 'Endereço não informado'}</p>
              <p className="text-gray-600">Bairro: {family.address.neighborhood || 'Não informado'}</p>
              <p className="text-gray-600">
                Cidade/UF: {family.address.city || 'Não informado'}, {family.address.state || 'Não informado'}
              </p>
              <p className="text-gray-600">Ponto de referência: {family.address.referencePoint || 'Não informado'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Dignômetro e Histórico */}
        {latestAssessment && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Dignômetro (última avaliação)</CardTitle>
                  <Badge className={getPovertyLevelColor(latestAssessment.poverty_level)}>
                    Nível de Pobreza: {formatPovertyLevel(latestAssessment.poverty_level)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Realizada em {new Date(latestAssessment.assessment_date).toLocaleDateString("pt-BR")}
                </p>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 42 42">
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e5e7eb" strokeWidth="3" />
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray={`${(Number(latestAssessment.poverty_score) / 10) * 100} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{Number(latestAssessment.poverty_score).toFixed(1)}</div>
                      <div className="text-lg text-gray-600">/ 10</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Histórico de Avaliações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assessmentHistory.length > 0 ? (
                  assessmentHistory.map((assessment, index) => (
                    <div key={assessment.assessment_id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <p className="font-medium text-sm">
                            Avaliação de{" "}
                            {new Date(assessment.assessment_date).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            Score: {Number(assessment.poverty_score).toFixed(1)}/10
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={getPovertyLevelColor(assessment.poverty_level)}>
                          {formatPovertyLevel(assessment.poverty_level)}
                        </Badge>
                        <Button variant="link" size="sm" className="text-cyan-600 hover:text-cyan-800 p-0 h-auto">
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhuma avaliação anterior encontrada</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Se não há avaliação, mostrar apenas o botão */}
        {!latestAssessment && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Nenhuma avaliação do Dignômetro encontrada.</p>
            <p className="text-gray-500 mb-6">Realize sua primeira avaliação para acompanhar o progresso da família.</p>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button
            onClick={() => router.push("/dignometro")}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg"
          >
            Responder Dignômetro
          </Button>
        </div>
      </div>
    </div>
  )
}
