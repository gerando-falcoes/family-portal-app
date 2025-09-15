'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, Heart, Home } from 'lucide-react'
import { FamilyForm } from '@/app/familia/components/FamilyForm'

export default function CadastroPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header com botão de voltar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Login
            </Button>
            <Image src="/placeholder-logo.svg" alt="Gerando Falcões" width={120} height={60} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Faça Parte da Nossa <span className="text-blue-600">Comunidade</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Cadastre sua família e tenha acesso a programas sociais, oportunidades e benefícios exclusivos.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Programas Sociais</h3>
            <p className="text-sm text-gray-600">Acesso a programas de capacitação, educação e desenvolvimento</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Apoio Familiar</h3>
            <p className="text-sm text-gray-600">Suporte e orientação para o desenvolvimento familiar</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Oportunidades</h3>
            <p className="text-sm text-gray-600">Acesso a vagas de emprego e oportunidades de renda</p>
          </div>
        </div>

        {/* Form Section */}
        <Card className="max-w-5xl mx-auto shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardTitle className="text-2xl font-bold text-center">Cadastro da Família</CardTitle>
            <CardDescription className="text-blue-100 text-center">
              Preencha os dados abaixo para criar sua conta no Portal da Família
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <FamilyForm onCancel={() => router.push('/')} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


