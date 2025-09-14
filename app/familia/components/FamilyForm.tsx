'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const formSchema = z.object({
  contacts: z.object({
    phone: z.string().min(1, "Telefone é obrigatório"),
    whatsapp: z.string().min(1, "WhatsApp é obrigatório"),
    email: z.string().email("Email inválido"),
  }),
  access: z.object({
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string(),
  }),
  socioeconomic: z.object({
    incomeRange: z.string().min(1, "Faixa de renda é obrigatória"),
    familySize: z.coerce.number().min(1, "Tamanho da família deve ser no mínimo 1"),
    numberOfChildren: z.coerce.number().min(0, "Número de crianças não pode ser negativo"),
  }),
  address: z.object({
    street: z.string().min(1, "Rua é obrigatória"),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(1, "Estado é obrigatório"),
    referencePoint: z.string().optional(),
  }),
}).refine((data) => data.access.password === data.access.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["access", "confirmPassword"],
});

interface FamilyFormProps {
  onCancel: () => void;
}

export function FamilyForm({ onCancel }: FamilyFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contacts: { email: '', phone: '', whatsapp: '' },
      access: { password: '', confirmPassword: '' },
      socioeconomic: { incomeRange: '', familySize: 1, numberOfChildren: 0 },
      address: { street: '', neighborhood: '', city: '', state: '', referencePoint: '' },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setServerError(null);

    const response = await fetch('/api/familia/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: values.contacts.email,
        password: values.access.password,
        familyData: values,
      }),
    });

    setIsLoading(false);

    if (response.ok) {
      toast({ title: "Sucesso!", description: "Família e usuário criados com sucesso." });
      onCancel(); 
    } else {
      const errorData = await response.json();
      setServerError(errorData.error || "Ocorreu um erro desconhecido.");
      toast({ title: "Erro", description: errorData.error || "Não foi possível criar a família.", variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna da Esquerda */}
          <div className="space-y-6">
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold">Contatos</h3>
              <FormField control={form.control} name="contacts.phone" render={({ field }) => (
                <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input placeholder="(11) 99999-9999" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="contacts.whatsapp" render={({ field }) => (
                <FormItem><FormLabel>WhatsApp</FormLabel><FormControl><Input placeholder="(11) 99999-9999" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="contacts.email" render={({ field }) => (
                <FormItem><FormLabel>Email de Acesso</FormLabel><FormControl><Input type="email" placeholder="email@exemplo.com" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold">Dados de Acesso</h3>
              <FormField control={form.control} name="access.password" render={({ field }) => (
                <FormItem><FormLabel>Senha</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="access.confirmPassword" render={({ field }) => (
                <FormItem><FormLabel>Confirmar Senha</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </div>

          {/* Coluna da Direita */}
          <div className="space-y-6">
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold">Dados Socioeconômicos</h3>
              <FormField control={form.control} name="socioeconomic.incomeRange" render={({ field }) => (
                <FormItem><FormLabel>Faixa de Renda</FormLabel><FormControl><Input placeholder="R$ 1.000 - R$ 1.500" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="socioeconomic.familySize" render={({ field }) => (
                  <FormItem><FormLabel>Tamanho da Família</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="socioeconomic.numberOfChildren" render={({ field }) => (
                  <FormItem><FormLabel>Nº de Crianças</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold">Endereço</h3>
              <FormField control={form.control} name="address.street" render={({ field }) => (
                <FormItem><FormLabel>Rua e Número</FormLabel><FormControl><Input placeholder="Rua das Flores, 123" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="address.neighborhood" render={({ field }) => (
                <FormItem><FormLabel>Bairro</FormLabel><FormControl><Input placeholder="Centro" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="address.city" render={({ field }) => (
                  <FormItem><FormLabel>Cidade</FormLabel><FormControl><Input placeholder="São Paulo" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="address.state" render={({ field }) => (
                  <FormItem><FormLabel>Estado</FormLabel><FormControl><Input placeholder="SP" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="address.referencePoint" render={({ field }) => (
                <FormItem><FormLabel>Ponto de Referência</FormLabel><FormControl><Input placeholder="Próximo ao mercado" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
          </div>
        </div>

        {serverError && (
          <Alert variant="destructive">
            <AlertTitle>Erro no Servidor</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Criando Cadastro...' : 'Criar Cadastro'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
