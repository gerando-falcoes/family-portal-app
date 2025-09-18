'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { IncomeRange, BrazilianState } from "@/lib/types"
import { Loader2, User, DollarSign, MapPin } from "lucide-react"
import MagicCard from "@/components/ui/magic-card"
import ShimmerButton from "@/components/ui/shimmer-button"
import BlurFade from "@/components/ui/blur-fade"
import GridPattern from "@/components/ui/grid-pattern"

const incomeRanges: IncomeRange[] = [ "Até R$ 500", "R$ 501 - R$ 1.000", "R$ 1.001 - R$ 1.500", "R$ 1.501 - R$ 2.000", "R$ 2.001 - R$ 3.000", "Acima de R$ 3.000" ]
const brazilianStates: BrazilianState[] = [ "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO" ]

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } } }

export default function CadastroPage() {
  const [formData, setFormData] = useState({ phone: "", whatsapp: "", email: "", incomeRange: "" as IncomeRange | "", familySize: "", numberOfChildren: "", street: "", neighborhood: "", city: "", state: "" as BrazilianState | "", referencePoint: "" })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const requiredFields: (keyof typeof formData)[] = [ "phone", "email", "incomeRange", "familySize", "numberOfChildren", "street", "neighborhood", "city", "state" ]
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      toast({ title: "Campos obrigatórios", description: `Por favor, preencha: ${missingFields.join(", ")}`, variant: "destructive" })
      setIsLoading(false)
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({ title: "Família cadastrada com sucesso!", description: "Redirecionando para a página de login..." })
      setTimeout(() => router.push("/"), 2000)
    } catch (error) {
      toast({ title: "Erro no cadastro", description: "Ocorreu um erro inesperado.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative p-4 sm:p-6 lg:p-8">
      <GridPattern 
        width={32} 
        height={32} 
        x={-1} 
        y={-1} 
        strokeDasharray="4 2"
        className="absolute inset-0 opacity-20 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
      />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <BlurFade delay={0.1} inView>
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div variants={itemVariants} className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Cadastrar Família</h1>
              <p className="text-prose">Informe contatos, dados socioeconômicos e endereço.</p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div variants={containerVariants} className="space-y-8">
                <motion.div variants={itemVariants}>
                  <MagicCard>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">Contatos</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField id="phone" label="Telefone" placeholder="(XX) XXXXX-XXXX" value={formData.phone} onChange={handleInputChange} />
                      <FormField id="whatsapp" label="WhatsApp" placeholder="(XX) XXXXX-XXXX" value={formData.whatsapp} onChange={handleInputChange} />
                      <FormField id="email" label="Email" type="email" placeholder="exemplo@email.com" value={formData.email} onChange={handleInputChange} />
                    </div>
                  </MagicCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <MagicCard>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">Dados Socioeconômicos</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormSelect id="incomeRange" label="Faixa de Renda" placeholder="Selecione a faixa de renda" value={formData.incomeRange} options={incomeRanges} onChange={handleInputChange} />
                      <FormField id="familySize" label="Tamanho da Família" type="number" min="1" placeholder="Informe o tamanho da família" value={formData.familySize} onChange={handleInputChange} />
                      <FormField id="numberOfChildren" label="Número de Filhos" type="number" min="0" placeholder="Informe o número de filhos" value={formData.numberOfChildren} onChange={handleInputChange} />
                    </div>
                  </MagicCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <MagicCard>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">Endereço</h2>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField id="street" label="Rua" placeholder="Informe a rua" value={formData.street} onChange={handleInputChange} />
                        <FormField id="neighborhood" label="Bairro" placeholder="Informe o bairro" value={formData.neighborhood} onChange={handleInputChange} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField id="city" label="Cidade" placeholder="Informe a cidade" value={formData.city} onChange={handleInputChange} />
                        <FormSelect id="state" label="Estado" placeholder="UF" value={formData.state} options={brazilianStates} onChange={handleInputChange} />
                        <FormField id="referencePoint" label="Ponto de Referência" placeholder="Informe um ponto de referência" value={formData.referencePoint} onChange={handleInputChange} />
                      </div>
                    </div>
                  </MagicCard>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-end gap-4 mt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-11 px-8" 
                  onClick={() => router.push("/")} 
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <ShimmerButton 
                  type="submit" 
                  className="h-11 px-8" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spinner" />
                      Salvando...
                    </div>
                  ) : (
                    'Salvar'
                  )}
                </ShimmerButton>
              </motion.div>
            </form>
          </motion.div>
        </BlurFade>
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
    <Label htmlFor={id} className="text-sm font-medium text-prose">
      {label}
    </Label>
    <Input 
      id={id} 
      onChange={(e) => onChange(id, e.target.value)} 
      className="h-11 bg-input border-border focus:border-ring transition-colors" 
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
    <Label htmlFor={id} className="text-sm font-medium text-prose">
      {label}
    </Label>
    <Select value={value} onValueChange={(val) => onChange(id, val)}>
      <SelectTrigger id={id} className="h-11 bg-input border-border focus:border-ring transition-colors">
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
