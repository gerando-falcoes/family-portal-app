'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { Family } from '@/lib/types'

// Schema de validação para o formulário
const formSchema = z.object({
  contacts: z.object({
    phone: z.string().min(1, "Telefone é obrigatório"),
    whatsapp: z.string().min(1, "WhatsApp é obrigatório"),
    email: z.string().email("Email inválido"),
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
    referencePoint: z.string(),
  }),
})

interface FamilyFormProps {
  family: Family
  onSave: (data: Partial<Family>) => void
  onCancel: () => void
  isLoading: boolean
}

export function FamilyForm({ family, onSave, onCancel, isLoading }: FamilyFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contacts: family.contacts,
      socioeconomic: family.socioeconomic,
      address: family.address,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Seção de Contatos */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">Contatos</h3>
          <FormField
            control={form.control}
            name="contacts.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(11) 99999-9999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contacts.whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="(11) 99999-9999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contacts.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Seção Socioeconômica */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">Dados Socioeconômicos</h3>
          <FormField
            control={form.control}
            name="socioeconomic.incomeRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Faixa de Renda</FormLabel>
                <FormControl>
                  <Input placeholder="R$ 1.000 - R$ 1.500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="socioeconomic.familySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanho da Família</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socioeconomic.numberOfChildren"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº de Crianças</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Seção de Endereço */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">Endereço</h3>
          <FormField
            control={form.control}
            name="address.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rua e Número</FormLabel>
                <FormControl>
                  <Input placeholder="Rua das Flores, 123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input placeholder="Centro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="São Paulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="SP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="address.referencePoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ponto de Referência</FormLabel>
                <FormControl>
                  <Input placeholder="Próximo ao mercado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
