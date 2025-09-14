'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FamilyForm } from '@/app/familia/components/FamilyForm'

export default function CadastroPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full mx-auto">
        <div className="flex justify-center mb-8">
          <Image src="/placeholder-logo.svg" alt="Gerando Falcões" width={200} height={100} />
        </div>
        <Card className="overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2">
            <div className="p-8 bg-gray-100">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800">Bem-vindo ao Portal da Família</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Crie sua conta para acessar todos os benefícios e oportunidades que a Gerando Falcões oferece.
                </CardDescription>
              </CardHeader>
              <div className="p-8">
                <Image src="/placeholder.svg" alt="Família" width={400} height={300} className="rounded-lg" />
              </div>
            </div>
            <div className="p-8">
              <CardContent>
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">Crie seu cadastro</h2>
                <FamilyForm onCancel={() => router.push('/')} />
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}


