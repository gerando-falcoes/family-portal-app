'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { AuthService } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const [cpf, setCpf] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const user = await AuthService.login(cpf, password)
      if (user) {
        toast({ title: "Login realizado com sucesso!", description: "Redirecionando..." })
        router.push('/familia')
      } else {
        toast({ title: "Erro no login", description: "CPF, senha incorretos ou usuário não aprovado.", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Erro no login", description: "Ocorreu um erro inesperado.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Entrar no Portal da Família
            </h1>
            <p className="text-gray-600 mt-2">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                  CPF
                </label>
                <input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value);
                    setCpf(formatted);
                  }}
                  required
                  className="w-full h-12 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-all duration-200 rounded-lg px-4"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-all duration-200 rounded-lg px-4"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <button 
                type="button" 
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                Esqueci minha senha.
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Não tem uma conta?</p>
              <button 
                type="button" 
                className="text-sm text-blue-600 font-medium hover:underline" 
                onClick={() => router.push('/cadastro')}
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}