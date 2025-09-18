'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Users, FileText, BarChart3, Settings, LogOut, ArrowRight } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

const dashboardItems = [
  { title: "Perfil da Família", description: "Visualizar e editar informações", icon: Users, href: "/familia", color: "text-primary" },
  { title: "Cadastrar Família", description: "Registrar nova família no sistema", icon: FileText, href: "/cadastro", color: "text-secondary" },
  { title: "Dignômetro", description: "Responder avaliação socioeconômica", icon: BarChart3, href: "/dignometro", color: "text-accent" },
  { title: "Configurações", description: "Gerenciar configurações da conta", icon: Settings, href: "#", color: "text-muted-foreground" },
]

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    AuthService.logout()
    toast({ title: "Logout realizado com sucesso!", description: "Até logo!" })
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="h-20 sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Portal da Família</h1>
          <Button variant="outline" onClick={handleLogout} className="rounded-md flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <h2 className="text-2xl font-bold tracking-tighter text-foreground mb-1">Dashboard</h2>
          <p className="text-prose">Bem-vindo de volta! Escolha uma opção abaixo para começar.</p>
        </motion.div>

        <motion.div variants={gridContainerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardItems.map((item) => {
            const Icon = item.icon
            return (
              <motion.div key={item.title} variants={cardVariants}>
                <Card
                  className="rounded-xl shadow-card border-border/60 group hover:shadow-card-hover hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-full"
                  onClick={() => item.href === "#" ? toast({ title: "Funcionalidade em desenvolvimento" }) : router.push(item.href)}
                >
                  <CardHeader className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 flex-grow">
                    <p className="text-prose text-sm">{item.description}</p>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto">
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-12">
          <Card className="rounded-xl shadow-card border-border/60">
            <CardHeader className="p-6">
              <CardTitle>Estatísticas Rápidas</CardTitle>
              <CardDescription className="text-prose">Resumo do seu progresso.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard value="1" label="Família Cadastrada" />
                <MetricCard value="2" label="Avaliações Realizadas" />
                <MetricCard value="8.5" label="Score Médio" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

const MetricCard = ({ value, label }: { value: string | number, label: string }) => (
  <div className="text-center p-4 rounded-lg border bg-[linear-gradient(135deg,var(--muted)_0%,hsl(var(--background))_100%)]">
    <div className="text-2xl font-bold text-foreground">{value}</div>
    <div className="text-xs text-muted-foreground mt-1">{label}</div>
  </div>
)