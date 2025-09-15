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
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span className="font-medium">Progresso do Cadastro</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Coluna da Esquerda */}
            <div className="space-y-8">
              {/* Seção de Contatos */}
              <div className="space-y-5">
                <div className="pb-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-600" />
                    Informações de Contato
                  </h3>
                </div>
                
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
                        className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
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
                        className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="contacts.email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Email de Acesso</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="email@exemplo.com" 
                        {...field}
                        className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Seção de Acesso */}
              <div className="space-y-5">
                <div className="pb-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-gray-600" />
                    Dados de Acesso
                  </h3>
                </div>
                
                <FormField control={form.control} name="access.password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Senha</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        className="border-gray-300 focus:border-gray-900 focus:ring-gray-900" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="access.confirmPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        className="border-gray-300 focus:border-gray-900 focus:ring-gray-900" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Coluna da Direita */}
            <div className="space-y-8">
              {/* Seção Socioeconômica */}
              <div className="space-y-5">
                <div className="pb-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                    Dados Socioeconômicos
                  </h3>
                </div>
                
                <FormField control={form.control} name="socioeconomic.incomeRange" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Faixa de Renda</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
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
                      <FormLabel className="text-sm font-medium text-gray-700">Tamanho da Família</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="20" 
                          {...field} 
                          className="border-gray-300 focus:border-gray-900 focus:ring-gray-900" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="socioeconomic.numberOfChildren" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Nº de Crianças</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="15" 
                          {...field} 
                          className="border-gray-300 focus:border-gray-900 focus:ring-gray-900" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* Seção de Endereço */}
              <div className="space-y-5">
                <div className="pb-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    Endereço
                  </h3>
                </div>
                
                <FormField control={form.control} name="address.street" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Rua e Número</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Rua das Flores, 123" 
                        {...field} 
                        className="border-gray-300 focus:border-gray-900 focus:ring-gray-900" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="address.neighborhood" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Bairro</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Centro" 
                        {...field} 
                        className="border-gray-300 focus:border-gray-900 focus:ring-gray-900" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="address.city" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Cidade</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="São Paulo" 
                          {...field} 
                          className="border-gray-300 focus:border-gray-900 focus:ring-gray-900" 
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
                          <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
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
                    <FormLabel className="text-sm font-medium text-gray-700">Ponto de Referência (Opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Próximo ao mercado" 
                        {...field} 
                        className="border-gray-300 focus:border-gray-900 focus:ring-gray-900" 
                      />
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

          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              disabled={isLoading}
              className="flex-1 sm:flex-none border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium"
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
