"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFamilyData } from "@/hooks/use-family-data"
import type { DiagnoseAssessment } from "@/lib/types"
import { Phone, Mail, MessageCircle, MapPin, Users, Baby, LogOut, TrendingUp, Target, Loader2, AlertTriangle } from "lucide-react"

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } }

export default function FamiliaPage() {
  const router = useRouter()
  const { family, latestAssessment, assessmentHistory, isDashboard, isLoading, error } = useFamilyData()

  const handleLogout = () => {
    // Para agora, apenas redirecionar. Depois implementar logout real
    router.push("/")
  }

  const formatPovertyLevel = (level: string) => {
    const levels: { [key: string]: string } = {
      'pobreza extrema': 'Pobreza Extrema',
      'pobreza': 'Pobreza',
      'dignidade': 'Dignidade',
      'prosperidade em desenvolvimento': 'Prosperidade em Desenvolvimento',
      'quebra de ciclo da pobreza': 'Quebra de Ciclo da Pobreza',
      // Manter compatibilidade com dados antigos
      'alto': 'Pobreza Extrema',
      'medio': 'Dignidade', 
      'baixo': 'Prosperidade em Desenvolvimento'
    }
    return levels[level?.toLowerCase()] || level
  }

  const getPovertyLevelColor = (level: string) => {
    const formattedLevel = formatPovertyLevel(level)
    switch (formattedLevel) {
      case 'Quebra de Ciclo da Pobreza':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Prosperidade em Desenvolvimento':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Dignidade':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Pobreza':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Pobreza Extrema':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

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
              <p className="text-gray-600">Carregando dados da família...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid\" width=\"32\" height=\"32\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 32 0 L 0 0 0 32\" fill=\"none\" stroke=\"%23e2e8f0\" stroke-width=\"1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid)\" /%3E%3C/svg%3E')"}}></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center rounded-2xl shadow-xl border border-gray-100 bg-white/95 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Erro ao Carregar</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!family) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid\" width=\"32\" height=\"32\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 32 0 L 0 0 0 32\" fill=\"none\" stroke=\"%23e2e8f0\" stroke-width=\"1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid)\" /%3E%3C/svg%3E')"}}></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center rounded-2xl shadow-xl border border-gray-100 bg-white/95 backdrop-blur-sm">
            <CardContent className="pt-6">
              <p className="text-gray-600">Nenhuma família encontrada</p>
            </CardContent>
          </Card>
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
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-800">{family.name}</h1>
              <Badge
                variant={family.status === "Ativa" ? "default" : "secondary"}
                className="bg-green-100 text-green-800 border-green-200"
              >
                {family.status}
              </Badge>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="rounded-md flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            
            {/* ID da Família */}
            <motion.div variants={itemVariants} className="mb-8">
              <p className="text-gray-600 text-sm">
                ID da Família: <span className="font-medium">{family.id}</span>
              </p>
            </motion.div>

            {/* Cards de Informações */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              
              {/* Contatos */}
              <Card className="rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300 bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800">Contatos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Telefone</p>
                      <p className="font-medium text-gray-800">{family.contacts.phone || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">WhatsApp</p>
                      <p className="font-medium text-gray-800">{family.contacts.whatsapp || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-800">{family.contacts.email || 'Não informado'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dados Socioeconômicos */}
              <Card className="rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300 bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800">Dados Socioeconômicos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Faixa de Renda</p>
                    <p className="font-medium text-gray-800">{family.socioeconomic.incomeRange || 'Não informado'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Tamanho da Família</p>
                      <p className="font-medium text-gray-800">{family.socioeconomic.familySize || 0} pessoas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Baby className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Nº de Crianças</p>
                      <p className="font-medium text-gray-800">{family.socioeconomic.numberOfChildren || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Endereço */}
              <Card className="rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300 bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800">Endereço</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="font-medium text-gray-800">{family.address.street || 'Endereço não informado'}</p>
                  <p className="text-gray-600">Bairro: {family.address.neighborhood || 'Não informado'}</p>
                  <p className="text-gray-600">
                    Cidade/UF: {family.address.city || 'Não informado'}, {family.address.state || 'Não informado'}
                  </p>
                  <p className="text-gray-600">Ponto de referência: {family.address.referencePoint || 'Não informado'}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Dignômetro e Histórico */}
            {latestAssessment && (
              <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                
                {/* Última Avaliação */}
                <Card className="rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300 bg-white/95 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-gray-800">Dignômetro (última avaliação)</CardTitle>
                        <p className="text-sm text-gray-600">
                          Realizada em {new Date(latestAssessment.assessment_date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <Badge className={getPovertyLevelColor(latestAssessment.poverty_level)}>
                      {formatPovertyLevel(latestAssessment.poverty_level)}
                    </Badge>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 shadow-lg">
                      <div className="text-5xl font-bold text-gray-800 mb-2">
                        {Number(latestAssessment.poverty_score).toFixed(1)}
                      </div>
                      <p className="text-gray-600 text-lg mb-4">/ 10</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Histórico */}
                <Card className="rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300 bg-white/95 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-800">Histórico de Avaliações</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {assessmentHistory.length > 0 ? (
                      assessmentHistory.map((assessment, index) => (
                        <div key={assessment.assessment_id} className="border border-gray-200 rounded-lg p-4 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-colors">
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
                          <div className="flex items-center justify-between">
                            <Badge className={getPovertyLevelColor(assessment.poverty_level)}>
                              {formatPovertyLevel(assessment.poverty_level)}
                            </Badge>
                            <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-800 p-0 h-auto">
                              Ver detalhes
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">Nenhuma avaliação anterior encontrada</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Se não há avaliação, mostrar mensagem */}
            {!latestAssessment && (
              <motion.div variants={itemVariants} className="text-center py-8 mb-8">
                <Card className="rounded-2xl shadow-xl border border-gray-100 p-8 bg-white/95 backdrop-blur-sm">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma avaliação encontrada</h3>
                  <p className="text-gray-600 mb-6">Realize sua primeira avaliação para acompanhar o progresso da família.</p>
                </Card>
              </motion.div>
            )}

            {/* Botão Dignômetro */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <Button
                onClick={() => router.push("/dignometro")}
                className="h-12 px-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
              >
                Responder Dignômetro
              </Button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}