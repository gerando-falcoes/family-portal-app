'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { supabaseBrowserClient } from '@/lib/supabase/browser'

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    const { error } = await supabaseBrowserClient.auth.signInWithPassword(values)

    setIsLoading(false)

    if (error) {
      toast({ title: "Erro no Login", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Login bem-sucedido!", description: "Você será redirecionado em breve." })
      router.push('/familia')
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center mb-8">
          <Image src="/placeholder-logo.svg" alt="Gerando Falcões" width={200} height={100} />
        </div>
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="p-8 bg-gray-100">
            <CardTitle className="text-3xl font-bold text-gray-800">Acesse sua conta</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Use seu email e senha para entrar no portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="seu@email.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Não tem uma conta?{" "}
                  <a href="/cadastro" className="font-medium text-blue-600 hover:underline">
                    Cadastre-se
                  </a>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
