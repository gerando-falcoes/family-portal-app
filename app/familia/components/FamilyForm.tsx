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
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Phone, Mail, Lock, DollarSign, MapPin, Loader2 } from 'lucide-react'

const incomeRanges = [
  { value: "ate-1000", label: "Até R$ 1.000" },
  { value: "1000-1500", label: "R$ 1.000 - R$ 1.500" },
  { value: "1500-2500", label: "R$ 1.500 - R$ 2.500" },
  { value: "2500-4000", label: "R$ 2.500 - R$ 4.000" },
  { value: "acima-4000", label: "Acima de R$ 4.000" },
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
  contacts: z.object({
    phone: z.string().min(10, "Telefone deve ter no mínimo 10 dígitos").regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato inválido: (11) 99999-9999"),
    whatsapp: z.string().min(10, "WhatsApp deve ter no mínimo 10 dígitos").regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato inválido: (11) 99999-9999"),
    email: z.string().email("Email inválido"),
  }),
  access: z.object({
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "A senha deve conter ao menos uma letra maiúscula, uma minúscula e um número"),
    confirmPassword: z.string(),
  }),
  socioeconomic: z.object({
    incomeRange: z.string().min(1, "Faixa de renda é obrigatória"),
    familySize: z.coerce.number().min(1, "Tamanho da família deve ser no mínimo 1").max(20, "Máximo de 20 pessoas"),
    numberOfChildren: z.coerce.number().min(0, "Número de crianças não pode ser negativo").max(15, "Máximo de 15 crianças"),
  }),
  address: z.object({
    street: z.string().min(5, "Rua deve ter no mínimo 5 caracteres"),
    neighborhood: z.string().min(2, "Bairro deve ter no mínimo 2 caracteres"),
    city: z.string().min(2, "Cidade deve ter no mínimo 2 caracteres"),
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
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contacts: { email: '', phone: '', whatsapp: '' },
      access: { password: '', confirmPassword: '' },
      socioeconomic: { incomeRange: '', familySize: 1, numberOfChildren: 0 },
      address: { street: '', neighborhood: '', city: '', state: '', referencePoint: '' },
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

  // Calcular progresso baseado nos campos preenchidos
  const calculateProgress = () => {
    const values = form.getValues();
    const totalFields = 12; // Total de campos obrigatórios
    let filledFields = 0;

    if (values.contacts.email) filledFields++;
    if (values.contacts.phone) filledFields++;
    if (values.contacts.whatsapp) filledFields++;
    if (values.access.password) filledFields++;
    if (values.access.confirmPassword) filledFields++;
    if (values.socioeconomic.incomeRange) filledFields++;
    if (values.socioeconomic.familySize > 0) filledFields++;
    if (values.socioeconomic.numberOfChildren >= 0) filledFields++;
    if (values.address.street) filledFields++;
    if (values.address.neighborhood) filledFields++;
    if (values.address.city) filledFields++;
    if (values.address.state) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  };

  const progress = calculateProgress();

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
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progresso do Cadastro</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna da Esquerda */}
            <div className="space-y-6">
              {/* Seção de Contatos */}
              <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Informações de Contato</h3>
                </div>
                
                <FormField control={form.control} name="contacts.phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Telefone</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(11) 99999-9999" 
                        {...field}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          field.onChange(formatted);
                        }}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="contacts.whatsapp" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">WhatsApp</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(11) 99999-9999" 
                        {...field}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          field.onChange(formatted);
                        }}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="contacts.email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Email de Acesso</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="email@exemplo.com" 
                        {...field}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Seção de Acesso */}
              <div className="space-y-4 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Dados de Acesso</h3>
                </div>
                
                <FormField control={form.control} name="access.password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="access.confirmPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Coluna da Direita */}
            <div className="space-y-6">
              {/* Seção Socioeconômica */}
              <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Dados Socioeconômicos</h3>
                </div>
                
                <FormField control={form.control} name="socioeconomic.incomeRange" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Faixa de Renda</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
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
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="socioeconomic.familySize" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Tamanho da Família</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="20" {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="socioeconomic.numberOfChildren" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Nº de Crianças</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="15" {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* Seção de Endereço */}
              <div className="space-y-4 p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Endereço</h3>
                </div>
                
                <FormField control={form.control} name="address.street" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Rua e Número</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua das Flores, 123" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="address.neighborhood" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Centro" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="address.city" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="São Paulo" {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="address.state" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Estado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Estado" />
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
                </div>
                
                <FormField control={form.control} name="address.referencePoint" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Ponto de Referência (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Próximo ao mercado" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
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

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando Cadastro...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Criar Cadastro
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
