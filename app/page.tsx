"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } }

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = await AuthService.login(email, password)
      if (user) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        })
        router.push("/familia")
      } else {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        })
      }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid\" width=\"32\" height=\"32\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 32 0 L 0 0 0 32\" fill=\"none\" stroke=\"%23e2e8f0\" stroke-width=\"1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid)\" /%3E%3C/svg%3E')"}}></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={containerVariants}
          className="w-full max-w-md"
        >
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center space-y-6 pb-8">
                <motion.div 
                  variants={itemVariants}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Lock className="w-8 h-8 text-white" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Portal da Família</h1>
                  <p className="text-gray-600">Faça login para acessar sua conta</p>
                </motion.div>
              </CardHeader>
              
              <CardContent>
                <motion.form variants={itemVariants} onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-600">
                      E-mail
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-600">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors rounded-lg"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Entrando...
                      </div>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </motion.form>
                
                <motion.div variants={itemVariants} className="mt-8 text-center space-y-4">
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={() => toast({ title: "Funcionalidade em desenvolvimento" })}
                  >
                    Esqueci minha senha
                  </button>
                  
                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-sm text-gray-500">ou</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => router.push("/cadastro")}
                  >
                    Criar nova conta
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