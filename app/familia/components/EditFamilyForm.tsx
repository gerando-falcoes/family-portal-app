'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, Phone, Mail, DollarSign, MapPin, Loader2, Users } from 'lucide-react'
import type { Family } from '@/lib/types'

const incomeRanges = [
  { value: "Até R$ 500", label: "Até R$ 500" },
  { value: "R$ 501 - R$ 1.000", label: "R$ 501 - R$ 1.000" },
  { value: "R$ 1.001 - R$ 1.500", label: "R$ 1.001 - R$ 1.500" },
  { value: "R$ 1.501 - R$ 2.000", label: "R$ 1.501 - R$ 2.000" },
  { value: "R$ 2.001 - R$ 3.000", label: "R$ 2.001 - R$ 3.000" },
  { value: "Acima de R$ 3.000", label: "Acima de R$ 3.000" },
];

const brazilianStates = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos").regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato inválido: 000.000.000-00"),
  contacts: z.object({
    phone: z.string().min(10, "Telefone deve ter no mínimo 10 dígitos"),
    whatsapp: z.string().min(10, "WhatsApp deve ter no mínimo 10 dígitos"),
    email: z.string().email("Email inválido"),
  }),
  socioeconomic: z.object({
    incomeRange: z.string().min(1, "Faixa de renda é obrigatória"),
    familySize: z.coerce.number().min(1, "Tamanho da família deve ser no mínimo 1").max(20, "Máximo de 20 pessoas"),
    numberOfChildren: z.coerce.number().min(0, "Número de crianças não pode ser negativo").max(15, "Máximo de 15 crianças"),
  }),
  address: z.object({
    cep: z.string().optional(),
    street: z.string().min(5, "Rua deve ter no mínimo 5 caracteres"),
    neighborhood: z.string().min(2, "Bairro deve ter no mínimo 2 caracteres"),
    city: z.string().min(2, "Cidade deve ter no mínimo 2 caracteres"),
    state: z.string().min(1, "Estado é obrigatório"),
    referencePoint: z.string().optional(),
  }),
});

interface EditFamilyFormProps {
  family: Family;
  onSave: (updatedData: Partial<Family>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function EditFamilyForm({ family, onSave, onCancel, isLoading }: EditFamilyFormProps) {
  const { toast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: family.name || '',
      cpf: family.cpf || '',
      contacts: {
        email: family.contacts.email || '',
        phone: family.contacts.phone || '',
        whatsapp: family.contacts.whatsapp || '',
      },
      socioeconomic: {
        incomeRange: family.socioeconomic.incomeRange || '',
        familySize: family.socioeconomic.familySize || 1,
        numberOfChildren: family.socioeconomic.numberOfChildren || 0,
      },
      address: {
        cep: family.address.cep || '',
        street: family.address.street || '',
        neighborhood: family.address.neighborhood || '',
        city: family.address.city || '',
        state: family.address.state || '',
        referencePoint: family.address.referencePoint || '',
      },
    },
  });

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  // Função para formatar CEP
  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  // Função para buscar endereço por CEP
  const fetchAddressByCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        form.setValue('address.street', data.logradouro || '');
        form.setValue('address.neighborhood', data.bairro || '');
        form.setValue('address.city', data.localidade || '');
        form.setValue('address.state', data.uf || '');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setServerError(null);
    
    // Preparar dados para envio
    const updatedData: Partial<Family> = {
      name: values.name,
      cpf: values.cpf,
      contacts: values.contacts,
      socioeconomic: values.socioeconomic,
      address: values.address,
    };

    onSave(updatedData);
  };

  return (
    <div className="bg-gray-50 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Informações Básicas da Família */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Informações da Família</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Nome da Família</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Família Silva" 
                      {...field}
                      className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="cpf" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">CPF da Família</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="000.000.000-00" 
                      {...field}
                      onChange={(e) => {
                        const formatted = formatCPF(e.target.value);
                        field.onChange(formatted);
                      }}
                      className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          {/* Seção de Contatos */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Phone className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Informações de Contato</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField control={form.control} name="contacts.phone" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Telefone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(11) 99999-9999" 
                      {...field}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        field.onChange(formatted);
                      }}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="contacts.whatsapp" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">WhatsApp</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(11) 99999-9999" 
                      {...field}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        field.onChange(formatted);
                      }}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            
            <div className="mt-4">
              <FormField control={form.control} name="contacts.email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="email@exemplo.com" 
                      {...field}
                      disabled={true}
                      className="h-11 border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </FormControl>
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ O email não pode ser alterado por questões de segurança
                  </p>
                </FormItem>
              )} />
            </div>
          </div>

          {/* Seção Socioeconômica */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Dados Socioeconômicos</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <FormField control={form.control} name="socioeconomic.incomeRange" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Faixa de Renda</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                          <SelectValue placeholder="Selecione sua faixa de renda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {incomeRanges.map((income) => (
                          <SelectItem key={income.value} value={income.value}>
                            {income.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              
              <FormField control={form.control} name="socioeconomic.familySize" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Pessoas na Família</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      max="20" 
                      {...field} 
                      placeholder="Ex: 4"
                      className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="socioeconomic.numberOfChildren" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Número de Crianças</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="15" 
                      {...field} 
                      placeholder="Ex: 2"
                      className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          {/* Seção de Endereço */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Endereço</h3>
            </div>
            
            <div className="space-y-4">
              <FormField control={form.control} name="address.cep" render={({ field }) => (
                <FormItem className="max-w-xs">
                  <FormLabel className="text-sm font-medium text-gray-700">CEP <span className="text-gray-400">(Opcional)</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="12345-678" 
                      {...field}
                      onChange={(e) => {
                        const formatted = formatCEP(e.target.value);
                        field.onChange(formatted);
                        
                        // Buscar endereço quando CEP for completo
                        if (formatted.replace(/\D/g, '').length === 8) {
                          fetchAddressByCEP(formatted);
                        }
                      }}
                      className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="lg:col-span-2">
                  <FormField control={form.control} name="address.street" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Rua e Número</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Rua das Flores, 123" 
                          {...field} 
                          className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                
                <FormField control={form.control} name="address.neighborhood" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Bairro</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Centro" 
                        {...field} 
                        className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="address.city" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Cidade</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: São Paulo" 
                        {...field} 
                        className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="address.state" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brazilianStates.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="address.referencePoint" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Ponto de Referência <span className="text-gray-400">(Opcional)</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Próximo ao mercado" 
                        {...field} 
                        className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
          </div>

          {serverError && (
            <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50">
              <AlertTitle className="text-red-800 font-semibold">Erro no Servidor</AlertTitle>
              <AlertDescription className="text-red-700">{serverError}</AlertDescription>
            </Alert>
          )}

          {/* Botões de Ação */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel} 
                disabled={isLoading}
                className="h-11 px-6 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="h-11 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
