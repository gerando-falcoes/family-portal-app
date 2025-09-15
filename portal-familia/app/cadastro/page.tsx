"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { IncomeRange, BrazilianState } from "@/lib/types";

const incomeRanges: IncomeRange[] = [
  "Até R$ 500",
  "R$ 501 - R$ 1.000",
  "R$ 1.001 - R$ 1.500",
  "R$ 1.501 - R$ 2.000",
  "R$ 2.001 - R$ 3.000",
  "Acima de R$ 3.000",
];

const brazilianStates: BrazilianState[] = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    // Contatos
    phone: "",
    whatsapp: "",
    email: "",
    // Dados Socioeconômicos
    incomeRange: "" as IncomeRange | "",
    familySize: "",
    numberOfChildren: "",
    // Endereço
    street: "",
    neighborhood: "",
    city: "",
    state: "" as BrazilianState | "",
    referencePoint: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    const requiredFields = [
      "phone",
      "email",
      "incomeRange",
      "familySize",
      "numberOfChildren",
      "street",
      "neighborhood",
      "city",
      "state",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://alexandrec.app.n8n.cloud/webhook-test/d538a0b0-2d0c-4872-9a4f-7354d1640b12",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Erro ao cadastrar família");

      toast({
        title: "Família cadastrada com sucesso!",
        description: "Redirecionando para a página de login...",
      });

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cadastrar Família
          </h1>
          <p className="text-gray-600">
            Informe contatos, dados socioeconômicos e endereço.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Contatos */}
            <Card>
              <CardHeader>
                <CardTitle>Contatos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(XX) XXXX-XXXX"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    placeholder="(XX) XXXX-XXXX"
                    value={formData.whatsapp}
                    onChange={(e) =>
                      handleInputChange("whatsapp", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dados Socioeconômicos */}
            <Card>
              <CardHeader>
                <CardTitle>Dados Socioeconômicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="incomeRange">Faixa de Renda</Label>
                  <Select
                    value={formData.incomeRange}
                    onValueChange={(value) =>
                      handleInputChange("incomeRange", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a faixa de renda" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="familySize">Tamanho da Família</Label>
                  <Input
                    id="familySize"
                    type="number"
                    min="1"
                    placeholder="Informe o tamanho da família"
                    value={formData.familySize}
                    onChange={(e) =>
                      handleInputChange("familySize", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numberOfChildren">Número de Filhos</Label>
                  <Input
                    id="numberOfChildren"
                    type="number"
                    min="0"
                    placeholder="Informe o número de filhos"
                    value={formData.numberOfChildren}
                    onChange={(e) =>
                      handleInputChange("numberOfChildren", e.target.value)
                    }
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    placeholder="Informe a rua"
                    value={formData.street}
                    onChange={(e) =>
                      handleInputChange("street", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    placeholder="Informe o bairro"
                    value={formData.neighborhood}
                    onChange={(e) =>
                      handleInputChange("neighborhood", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      placeholder="Informe a cidade"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) =>
                        handleInputChange("state", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        {brazilianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referencePoint">Ponto de Referência</Label>
                  <Input
                    id="referencePoint"
                    placeholder="Informe um ponto de referência"
                    value={formData.referencePoint}
                    onChange={(e) =>
                      handleInputChange("referencePoint", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
