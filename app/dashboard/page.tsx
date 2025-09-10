"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Users, FileText, BarChart3, Settings, LogOut } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    AuthService.logout()
    toast({
      title: "Logout realizado com sucesso!",
      description: "Até logo!",
    })
    router.push("/")
  }

  const dashboardItems = [
    {
      title: "Perfil da Família",
      description: "Visualizar e editar informações da família",
      icon: Users,
      href: "/familia",
      color: "bg-blue-500",
    },
    {
      title: "Cadastrar Família",
      description: "Registrar nova família no sistema",
      icon: FileText,
      href: "/cadastro",
      color: "bg-green-500",
    },
    {
      title: "Dignômetro",
      description: "Responder avaliação socioeconômica",
      icon: BarChart3,
      href: "/dignometro",
      color: "bg-purple-500",
    },
    {
      title: "Configurações",
      description: "Gerenciar configurações do sistema",
      icon: Settings,
      href: "#",
      color: "bg-gray-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-semibold text-gray-900">Portal da Família</h1>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Bem-vindo ao Portal da Família. Escolha uma opção abaixo para começar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  if (item.href === "#") {
                    toast({ title: "Funcionalidade em desenvolvimento" })
                  } else {
                    router.push(item.href)
                  }
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1</div>
                  <div className="text-sm text-gray-600">Família Cadastrada</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <div className="text-sm text-gray-600">Avaliações Realizadas</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">8.5</div>
                  <div className="text-sm text-gray-600">Score Médio</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
