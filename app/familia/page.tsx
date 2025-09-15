'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useFamilyData } from "@/hooks/use-family-data"
import { supabaseBrowserClient } from "@/lib/supabase/browser"
import type { Family, Assessment } from "@/lib/types"
import { Phone, Mail, MessageCircle, MapPin, Users, Baby, TrendingUp, Edit, FileText, AlertCircle, RefreshCw } from "lucide-react"
import { EditFamilyModal } from "./components/EditFamilyModal"

// Animações
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
}

function FamilyPageSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Skeleton className="h-5 w-64" />

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    </div>
  )
}

export default function FamiliaPage() {
  const { family, isLoading, error, refetch } = useFamilyData()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    await supabaseBrowserClient.auth.signOut()
    router.push("/")
  }

  const handleSaveFamily = async (updatedData: Partial<Family>) => {
    if (!family) return
    setIsSaving(true)
    
    try {
      // Aqui você pode implementar a atualização no Supabase
      // Por enquanto, vamos apenas mostrar uma mensagem de sucesso
      toast({
        title: "Sucesso!",
        description: "Os dados da família foram atualizados.",
      })
      setIsEditModalOpen(false)
      // Recarregar os dados após a atualização
      await refetch()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os dados da família.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const latestAssessment = assessments[0]

  // Mostrar skeleton enquanto carrega
  if (isLoading) {
    return <FamilyPageSkeleton />
  }

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao carregar dados</AlertTitle>
            <AlertDescription className="mt-2">
              {error}
            </AlertDescription>
          </Alert>
          <div className="mt-6 flex gap-4">
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
            <Button onClick={() => router.push('/cadastro')} variant="default">
              Fazer Cadastro
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar mensagem se não houver família
  if (!family) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Cadastro não encontrado</AlertTitle>
            <AlertDescription className="mt-2">
              Você ainda não possui um cadastro de família. Complete seu cadastro para acessar o dashboard.
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button onClick={() => router.push('/cadastro')} variant="default">
              Completar Cadastro
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <motion.div 
        className="min-h-screen bg-background p-4 sm:p-6 lg:p-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{family.name}</h1>
              <Badge variant={'green'}>
                {family.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" onClick={() => router.push("/dignometro")} aria-label="Responder Diagnóstico">
                <FileText className="w-4 h-4 mr-2" />
                Responder Diagnóstico
              </Button>
              <Button variant="outline" onClick={() => setIsEditModalOpen(true)} aria-label="Editar Família">
                <Edit className="w-4 h-4 mr-2" />
                Editar Família
              </Button>
            </div>
          </motion.div>

          <motion.p variants={itemVariants} className="text-muted-foreground">ID da Família: {family.id}</motion.p>

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contatos */}
            <Card className="min-h-[200px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Phone className="w-5 h-5" />
                  Contatos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium text-foreground">{family.contacts.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">WhatsApp</p>
                    <p className="font-medium text-foreground">{family.contacts.whatsapp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{family.contacts.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dados Socioeconômicos */}
            <Card className="min-h-[200px]">
              <CardHeader>
                <CardTitle className="text-foreground">Dados Socioeconômicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Faixa de Renda</p>
                  <p className="font-medium text-foreground">{family.socioeconomic.incomeRange}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tamanho da Família</p>
                    <p className="font-medium text-foreground">{family.socioeconomic.familySize} pessoas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Baby className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nº de Crianças</p>
                    <p className="font-medium text-foreground">{family.socioeconomic.numberOfChildren}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card className="min-h-[200px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MapPin className="w-5 h-5" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium text-foreground">{family.address.street}</p>
                <p className="text-muted-foreground">Bairro: {family.address.neighborhood}</p>
                <p className="text-muted-foreground">
                  Cidade/UF: {family.address.city}, {family.address.state}
                </p>
                <p className="text-muted-foreground">Ponto de referência: {family.address.referencePoint}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dignômetro e Histórico */}
          {latestAssessment && (
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground">Dignômetro (última avaliação)</CardTitle>
                    <Badge
                      variant={ latestAssessment.povertyLevel === "Baixo"
                          ? "blue"
                          : latestAssessment.povertyLevel === "Médio"
                            ? "yellow"
                            : "red"
                      }
                    >
                      Nível de Pobreza: {latestAssessment.povertyLevel}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Realizada em {latestAssessment.date.toLocaleDateString("pt-BR")}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center gap-4 py-8">
                  <div className="relative w-40 h-40">
                    <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 42 42">
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--border)" strokeWidth="3" />
                      <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke="var(--primary)"
                        strokeWidth="3"
                        strokeDasharray={`${(latestAssessment.score / 10) * 100} 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-foreground">{latestAssessment.score}</div>
                        <div className="text-lg text-muted-foreground">/ 10</div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push("/dignometro")}
                    variant="secondary"
                    size="sm"
                  >
                    Responder
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <TrendingUp className="w-5 h-5" />
                    Histórico de Avaliações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {assessments.map((assessment, index) => (
                    <div key={assessment.id} className="border rounded-lg p-4 bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <p className="font-medium text-sm text-foreground">
                            Avaliação de{" "}
                            {assessment.date.toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">Score: {assessment.score}/10</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={ assessment.povertyLevel === "Baixo"
                              ? "blue"
                              : assessment.povertyLevel === "Médio"
                                ? "yellow"
                                : "red"
                          }
                        >
                          {assessment.povertyLevel}
                        </Badge>
                        <Button variant="link" size="sm">
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
      <EditFamilyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        family={family}
        onSave={handleSaveFamily}
        isLoading={isSaving}
      />
    </>
  )
}