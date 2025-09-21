'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import type { IncomeRange, BrazilianState } from "@/lib/types"
import { Loader2, User, DollarSign, MapPin, Mail, Lock, Plus, Trash2, Users } from "lucide-react"

const incomeRanges: IncomeRange[] = [ "Até R$ 500", "R$ 501 - R$ 1.000", "R$ 1.001 - R$ 1.500", "R$ 1.501 - R$ 2.000", "R$ 2.001 - R$ 3.000", "Acima de R$ 3.000" ]
const brazilianStates: BrazilianState[] = [ "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO" ]

const familyRelations = [
  "Pai", "Mãe", "Filho", "Filha", "Avô", "Avó", "Neto", "Neta", 
  "Irmão", "Irmã", "Tio", "Tia", "Primo", "Prima", "Cunhado", "Cunhada", 
  "Sogro", "Sogra", "Genro", "Nora", "Padrasto", "Madrasta", "Enteado", "Enteada", "Outro"
]

interface FamilyMember {
  id: string
  nome: string
  idade: string
  cpf: string
  esta_empregado: boolean
  relacao_familia: string
  is_responsavel: boolean
}

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } }

export default function CadastroPage() {
  const [formData, setFormData] = useState({ 
    // Senha
    password: "",
    // Dados da família
    name: "", 
    cpf: "",
    phone: "", 
    emailFamilia: "", 
    incomeRange: "" as IncomeRange | "", 
    cep: "",
    street: "", 
    neighborhood: "", 
    city: "", 
    state: "" as BrazilianState | "", 
    referencePoint: "" 
  })
  
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: "1",
      nome: "",
      idade: "",
      cpf: "",
      esta_empregado: false,
      relacao_familia: "",
      is_responsavel: true
    }
  ])
  
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }))

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  // Função para validar CPF
  const validateCPF = (cpf: string): boolean => {
    if (!cpf) return true; // CPF pode ser vazio para alguns membros
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Validação do primeiro dígito
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF[i]) * (10 - i);
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cleanCPF[9]) !== digit1) return false;
    
    // Validação do segundo dígito
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF[i]) * (11 - i);
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    return parseInt(cleanCPF[10]) === digit2;
  };

  const handleCPFChange = (field: string, value: string) => {
    const formatted = formatCPF(value);
    setFormData((prev) => ({ ...prev, [field]: formatted }));
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
        setFormData(prev => ({
          ...prev,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const handleCEPChange = (field: string, value: string) => {
    const formatted = formatCEP(value);
    setFormData((prev) => ({ ...prev, [field]: formatted }));
    
    // Buscar endereço quando CEP for completo
    if (formatted.replace(/\D/g, '').length === 8) {
      fetchAddressByCEP(formatted);
    }
  };

  // Funções para gerenciar membros da família
  const handleMemberChange = (memberId: string, field: keyof FamilyMember, value: string | boolean) => {
    setFamilyMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, [field]: field === 'cpf' ? formatCPF(value as string) : value }
        : member
    ));
  };

  const handleResponsavelChange = (memberId: string, isChecked: boolean) => {
    setFamilyMembers(prev => prev.map(member => ({
      ...member,
      is_responsavel: member.id === memberId ? isChecked : false
    })));
  };

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      nome: "",
      idade: "",
      cpf: "",
      esta_empregado: false,
      relacao_familia: "",
      is_responsavel: false
    };
    setFamilyMembers(prev => [...prev, newMember]);
  };

  const removeFamilyMember = (memberId: string) => {
    if (familyMembers.length <= 1) {
      toast({ title: "Erro", description: "Deve haver pelo menos um membro na família.", variant: "destructive" });
      return;
    }
    setFamilyMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Validar campos obrigatórios
    const requiredFields: (keyof typeof formData)[] = [ "password", "name", "cpf", "phone", "incomeRange", "street", "neighborhood", "city", "state" ]
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      toast({ title: "Campos obrigatórios", description: `Por favor, preencha: ${missingFields.join(", ")}`, variant: "destructive" })
      setIsLoading(false)
      return
    }

    // Validar CPF da família
    if (!validateCPF(formData.cpf)) {
      toast({ title: "CPF inválido", description: "Por favor, insira um CPF válido para a família.", variant: "destructive" })
      setIsLoading(false)
      return
    }

    // Validar membros da família
    const invalidMembers = familyMembers.filter(member => !member.nome || !member.idade || !member.relacao_familia);
    if (invalidMembers.length > 0) {
      toast({ title: "Dados dos membros incompletos", description: "Por favor, preencha nome, idade e relação para todos os membros.", variant: "destructive" })
      setIsLoading(false)
      return
    }

    // Validar CPFs dos membros
    const invalidCPFs = familyMembers.filter(member => member.cpf && !validateCPF(member.cpf));
    if (invalidCPFs.length > 0) {
      toast({ title: "CPF inválido", description: "Por favor, verifique os CPFs dos membros da família.", variant: "destructive" })
      setIsLoading(false)
      return
    }

    // Verificar se há pelo menos um responsável
    const hasResponsavel = familyMembers.some(member => member.is_responsavel);
    if (!hasResponsavel) {
      toast({ title: "Responsável obrigatório", description: "É necessário marcar pelo menos um membro como responsável.", variant: "destructive" })
      setIsLoading(false)
      return
    }

    // Validar senha
    if (formData.password.length < 6) {
      toast({ title: "Senha muito curta", description: "A senha deve ter pelo menos 6 caracteres.", variant: "destructive" })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/familia/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: formData.password,
          familyData: {
            name: formData.name,
            cpf: formData.cpf,
            contacts: {
              phone: formData.phone,
              email: formData.emailFamilia || null
            },
            socioeconomic: {
              incomeRange: formData.incomeRange,
              familySize: familyMembers.length
            },
            address: {
              cep: formData.cep,
              street: formData.street,
              neighborhood: formData.neighborhood,
              city: formData.city,
              state: formData.state,
              referencePoint: formData.referencePoint || ''
            },
            members: familyMembers.map(member => ({
              nome: member.nome,
              idade: parseInt(member.idade),
              cpf: member.cpf || null,
              esta_empregado: member.esta_empregado,
              relacao_familia: member.relacao_familia,
              is_responsavel: member.is_responsavel
            }))
          }
        }),
      });

      if (response.ok) {
        toast({ title: "Família cadastrada com sucesso!", description: "Redirecionando para a página inicial..." })
        setTimeout(() => router.push("/"), 2000)
      } else {
        const errorData = await response.json();
        toast({ title: "Erro no cadastro", description: errorData.error || "Ocorreu um erro inesperado.", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Erro no cadastro", description: "Ocorreu um erro inesperado.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid\" width=\"32\" height=\"32\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 32 0 L 0 0 0 32\" fill=\"none\" stroke=\"%23e2e8f0\" stroke-width=\"1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid)\" /%3E%3C/svg%3E')"}}></div>
      
      <div className="relative z-10">
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-lg shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Cadastrar Família</h1>
            <Button 
              variant="outline" 
              onClick={() => router.push("/")} 
              className="rounded-md flex items-center gap-2"
            >
              Voltar
            </Button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div variants={itemVariants} className="mb-8 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-800 mb-2">Cadastrar Família</h2>
              <p className="text-gray-600">Informe os dados da família e defina uma senha.</p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div variants={containerVariants} className="space-y-8">
                
                {/* Senha */}
                <motion.div variants={itemVariants}>
                  <Card className="rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">Senha de Acesso</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <FormField id="password" label="Senha" type="password" placeholder="Mínimo 6 caracteres" value={formData.password} onChange={handleInputChange} />
                    </div>
                  </Card>
                </motion.div>

                {/* Informações da Família */}
                <motion.div variants={itemVariants}>
                  <Card className="rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">Informações da Família</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField id="name" label="Nome da Família" placeholder="Ex: Família Silva" value={formData.name} onChange={handleInputChange} />
                      <FormField id="cpf" label="CPF" placeholder="000.000.000-00" value={formData.cpf} onChange={handleCPFChange} />
                      <FormField id="phone" label="Telefone/WhatsApp" placeholder="(11) 99999-9999" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
                      <FormField id="emailFamilia" label="Email da Família (Opcional)" type="email" placeholder="familia@exemplo.com" value={formData.emailFamilia} onChange={handleInputChange} />
                    </div>
                  </Card>
                </motion.div>

                {/* Dados Socioeconômicos */}
                <motion.div variants={itemVariants}>
                  <Card className="rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">Dados Socioeconômicos</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <FormSelect id="incomeRange" label="Faixa de Renda" placeholder="Selecione a faixa de renda" value={formData.incomeRange} options={incomeRanges} onChange={handleInputChange} />
                    </div>
                  </Card>
                </motion.div>

                {/* Membros da Família */}
                <motion.div variants={itemVariants}>
                  <Card className="rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">Membros da Família</h3>
                      </div>
                      <Button
                        type="button"
                        onClick={addFamilyMember}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg px-4 py-2 flex items-center gap-2 hover:shadow-lg transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Membro
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {familyMembers.map((member, index) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50/50"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-800">Membro {index + 1}</h4>
                            {familyMembers.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeFamilyMember(member.id)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-600">Nome</Label>
                              <Input
                                placeholder="Nome completo"
                                value={member.nome}
                                onChange={(e) => handleMemberChange(member.id, 'nome', e.target.value)}
                                className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors rounded-lg"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-600">Idade</Label>
                              <Input
                                type="number"
                                placeholder="Idade"
                                min="0"
                                max="120"
                                value={member.idade}
                                onChange={(e) => handleMemberChange(member.id, 'idade', e.target.value)}
                                className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors rounded-lg"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-600">CPF (Opcional)</Label>
                              <Input
                                placeholder="000.000.000-00"
                                value={member.cpf}
                                onChange={(e) => handleMemberChange(member.id, 'cpf', e.target.value)}
                                className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors rounded-lg"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-600">Relação com a Família</Label>
                              <Select value={member.relacao_familia} onValueChange={(value) => handleMemberChange(member.id, 'relacao_familia', value)}>
                                <SelectTrigger className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors rounded-lg">
                                  <SelectValue placeholder="Selecione a relação" />
                                </SelectTrigger>
                                <SelectContent>
                                  {familyRelations.map((relation) => (
                                    <SelectItem key={relation} value={relation}>
                                      {relation}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`empregado-${member.id}`}
                                  checked={member.esta_empregado}
                                  onCheckedChange={(checked) => handleMemberChange(member.id, 'esta_empregado', checked as boolean)}
                                />
                                <Label htmlFor={`empregado-${member.id}`} className="text-sm font-medium text-gray-600">
                                  Está empregado
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`responsavel-${member.id}`}
                                  checked={member.is_responsavel}
                                  onCheckedChange={(checked) => handleResponsavelChange(member.id, checked as boolean)}
                                />
                                <Label htmlFor={`responsavel-${member.id}`} className="text-sm font-medium text-gray-600">
                                  É o responsável pela família
                                </Label>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>

                {/* Endereço */}
                <motion.div variants={itemVariants}>
                  <Card className="rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">Endereço</h3>
                    </div>
                    <div className="space-y-6">
                      <FormField id="cep" label="CEP (Opcional)" placeholder="12345-678" value={formData.cep} onChange={handleCEPChange} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField id="street" label="Rua e Número" placeholder="Rua das Flores, 123" value={formData.street} onChange={handleInputChange} />
                        <FormField id="neighborhood" label="Bairro" placeholder="Centro" value={formData.neighborhood} onChange={handleInputChange} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField id="city" label="Cidade" placeholder="São Paulo" value={formData.city} onChange={handleInputChange} />
                        <FormSelect id="state" label="Estado" placeholder="Estado" value={formData.state} options={brazilianStates} onChange={handleInputChange} />
                        <FormField id="referencePoint" label="Ponto de Referência (Opcional)" placeholder="Próximo ao mercado" value={formData.referencePoint} onChange={handleInputChange} />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-end gap-4 mt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-11 px-8 rounded-lg" 
                  onClick={() => router.push("/")} 
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="h-11 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cadastrando família...
                    </div>
                  ) : (
                    'Cadastrar Família'
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTS ---
const FormField: React.FC<{ 
  id: string
  label: string
  value: string
  onChange: (id: string, value: string) => void
  type?: string
  placeholder?: string
  min?: string 
}> = ({ id, label, onChange, ...props }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-gray-600">
      {label}
    </Label>
    <Input 
      id={id} 
      onChange={(e) => onChange(id, e.target.value)} 
      className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors rounded-lg" 
      {...props} 
    />
  </div>
)

const FormSelect: React.FC<{ 
  id: string
  label: string
  value: string
  placeholder: string
  options: readonly string[]
  onChange: (id: string, value: string) => void 
}> = ({ id, label, value, placeholder, options, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-gray-600">
      {label}
    </Label>
    <Select value={value} onValueChange={(val) => onChange(id, val)}>
      <SelectTrigger id={id} className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors rounded-lg">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)