'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { FamilyForm } from '@/app/familia/components/FamilyForm'

export default function CadastroPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com botão de voltar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Login
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Form Section */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="bg-white border-b border-gray-100 px-8 py-6">
            <CardTitle className="text-2xl font-semibold text-gray-900 text-center">
              Cadastro da Família
            </CardTitle>
            <CardDescription className="text-gray-600 text-center mt-2">
              Preencha os dados abaixo para criar sua conta no Portal da Família
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 bg-white">
            <FamilyForm onCancel={() => router.push('/')} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


