"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthService } from "@/lib/auth"
import { mockFamilies, mockAssessments } from "@/lib/mock-data"
import type { Family, Assessment } from "@/lib/types"
import { Phone, Mail, MessageCircle, MapPin, Users, Baby, LogOut, TrendingUp } from "lucide-react"

export default function FamiliaPage() {
  const [family, setFamily] = useState<Family | null>(null)
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const router = useRouter()

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (user?.familyId) {
      const familyData = mockFamilies.find((f) => f.id === user.familyId)
      const familyAssessments = mockAssessments.filter((a) => a.familyId === user.familyId)

      setFamily(familyData || null)
      setAssessments(familyAssessments)
    }
  }, [])

  const handleLogout = () => {
    AuthService.logout()
    router.push("/")
  }

  const latestAssessment = assessments[0]

  if (!family) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Carregando dados da família...</p>
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
                  <p className="font-medium">{family.contacts.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">WhatsApp</p>
                  <p className="font-medium">{family.contacts.whatsapp}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{family.contacts.email}</p>
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
                <p className="font-medium">{family.socioeconomic.incomeRange}</p>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Tamanho da Família</p>
                  <p className="font-medium">{family.socioeconomic.familySize} pessoas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Baby className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Nº de Crianças</p>
                  <p className="font-medium">{family.socioeconomic.numberOfChildren}</p>
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
              <p className="font-medium">{family.address.street}</p>
              <p className="text-gray-600">Bairro: {family.address.neighborhood}</p>
              <p className="text-gray-600">
                Cidade/UF: {family.address.city}, {family.address.state}
              </p>
              <p className="text-gray-600">Ponto de referência: {family.address.referencePoint}</p>
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
                  <Badge
                    className={
                      latestAssessment.povertyLevel === "Baixo"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : latestAssessment.povertyLevel === "Médio"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : "bg-red-100 text-red-800 border-red-200"
                    }
                  >
                    Nível de Pobreza: {latestAssessment.povertyLevel}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Realizada em {latestAssessment.date.toLocaleDateString("pt-BR")}
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
                      strokeDasharray={`${(latestAssessment.score / 10) * 100} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{latestAssessment.score}</div>
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
                {assessments.map((assessment, index) => (
                  <div key={assessment.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-sm">
                          Avaliação de{" "}
                          {assessment.date.toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">Score: {assessment.score}/10</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        className={
                          assessment.povertyLevel === "Baixo"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : assessment.povertyLevel === "Médio"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : "bg-red-100 text-red-800 border-red-200"
                        }
                      >
                        {assessment.povertyLevel}
                      </Badge>
                      <Button variant="link" size="sm" className="text-cyan-600 hover:text-cyan-800 p-0 h-auto">
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
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
