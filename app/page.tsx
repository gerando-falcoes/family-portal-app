"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Lock } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TEMPORÁRIO: Aceita qualquer login e sempre redireciona
      // Para reverter: use o código original abaixo
      const user = await AuthService.login(email || "temp@example.com", password || "temp")
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard...",
      })
      router.push("/familia")

      // Código original (comentado):
      // const user = await AuthService.login(email, password)
      // if (user) {
      //   toast({
      //     title: "Login realizado com sucesso!",
      //     description: "Redirecionando para o dashboard...",
      //   })
      //   router.push("/familia")
      // } else {
      //   toast({
      //     title: "Erro no login",
      //     description: "Email ou senha incorretos.",
      //     variant: "destructive",
      //   })
      // }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Entrar no Portal da Família</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Temporário:</strong> Sistema de autenticação desabilitado. Qualquer email/senha funcionará.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <div className="mt-6 text-center space-y-2">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => toast({ title: "Funcionalidade em desenvolvimento" })}
            >
              Esqueci minha senha
            </button>
            <div>
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/90"
                onClick={() => router.push("/cadastro")}
              >
                Cadastrar
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
