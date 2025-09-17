# 📋 **PLANO DE IMPLEMENTAÇÃO - REFATORAÇÃO DIGNÔMETRO**

## 🔍 **ANÁLISE SITUAÇÃO ATUAL** (via MCP Supabase)

### **Estrutura de Banco Validada:**
✅ **Tabela `dignometro_assessments` EXISTS** com estrutura:
- `id` (uuid, PK)
- `family_id` (uuid, FK → families.id) 
- `answers` (jsonb) - Respostas estruturadas
- `poverty_score` (numeric) - Score calculado
- `poverty_level` (text) - Classificação da pobreza
- `dimension_scores` (jsonb) - Scores por dimensão
- `assessment_date` (date) - Data da avaliação
- `created_at` (timestamp) - Timestamp de criação

### **Problemas Identificados no Sistema Atual:**
❌ **Inconsistência de Dados:** Registro existente mostra estrutura antiga:
```json
{
  "answers": {
    "food": "secure",
    "health": "very-poor", 
    "income": "very-insufficient",
    "housing": "excellent",
    "education": "illiterate"
  },
  "poverty_score": "4.6",
  "dimension_scores": "Médio" // ❌ Deveria ser JSONB
}
```

❌ **Página Principal:** Usa sistema de múltiplas escolhas em vez de Sim/Não
❌ **Tipos Ausentes:** DiagnosticoQuestion/Response não definidos em lib/types.ts
❌ **API Inexistente:** Sem endpoint para salvar no Supabase

---

## 🎯 **PLANO DE EXECUÇÃO DETALHADO**

### **FASE 1: CORREÇÃO DE TIPOS E ESTRUTURAS** 

#### **1.1 Adicionar Tipos em `lib/types.ts`**
```typescript
export interface DiagnosticoQuestion {
  id: string;
  dimensao: string;
  pergunta: string;
}

export interface DiagnosticoResponse {
  id: string;
  userId: string;
  userEmail: string;
  familyId: string;
  responses: Record<string, boolean>; // ✅ Sim/Não apenas
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiagnosticoProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
}

export interface DignometroAssessment {
  id: string;
  family_id: string;
  answers: Record<string, boolean>; // ✅ Nova estrutura
  poverty_score: number;
  poverty_level: string;
  dimension_scores: Record<string, number>; // ✅ JSONB estruturado
  assessment_date: string;
  created_at: string;
}
```

#### **1.2 Criar API Route `/api/dignometro/submit/route.ts`**
```typescript
import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { familyId, responses, userEmail } = await request.json();
    
    // Calcular score baseado em respostas Sim/Não
    const totalQuestions = Object.keys(responses).length;
    const positiveAnswers = Object.values(responses).filter(Boolean).length;
    const score = (positiveAnswers / totalQuestions) * 10;
    
    // Classificar nível de pobreza
    const povertyLevel = score >= 7 ? 'Baixo' : score >= 4 ? 'Médio' : 'Alto';
    
    // Calcular scores por dimensão (cada dimensão = 1 se Sim, 0 se Não)
    const dimensionScores = Object.entries(responses).reduce((acc, [key, value]) => {
      acc[key] = value ? 1 : 0;
      return acc;
    }, {} as Record<string, number>);

    // ✅ Inserir na tabela dignometro_assessments
    const { data, error } = await supabaseServerClient
      .from('dignometro_assessments')
      .insert({
        family_id: familyId,
        answers: responses, // ✅ JSONB com estrutura Sim/Não
        poverty_score: score,
        poverty_level: povertyLevel,
        dimension_scores: dimensionScores, // ✅ JSONB estruturado
        assessment_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase:', error);
      return NextResponse.json({ error: 'Erro ao salvar avaliação' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      assessment: data,
      score,
      povertyLevel 
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
```

---

### **FASE 2: REFATORAÇÃO DA PÁGINA PRINCIPAL**

#### **2.1 Modificar `app/dignometro/page.tsx`**

**❌ REMOVER:** Sistema atual de múltiplas escolhas
```typescript
// ❌ Remover este array
const questions: Question[] = [
  {
    id: "housing",
    text: "Como você avalia as condições da sua moradia?",
    options: [
      { value: "excellent", label: "Excelente...", score: 10 },
      // ... múltiplas opções
    ]
  }
  // ...
];
```

**✅ SUBSTITUIR POR:** Import das perguntas corretas
```typescript
import { diagnosticoQuestions } from '@/lib/diagnostico';
import { QuestionCard } from './components/QuestionCard';
import { useDiagnostico } from './hooks/useDiagnostico';
import { useProgress } from './hooks/useProgress';
```

**✅ NOVA LÓGICA DE STATE:**
```typescript
const { responses, updateResponse, isAnswered } = useDiagnostico();
const { currentStep, totalSteps, nextStep, previousStep, currentQuestion } = useProgress();

const handleAnswer = (questionId: string, answer: boolean) => {
  updateResponse(questionId, answer);
};

const calculateScore = () => {
  const totalQuestions = diagnosticoQuestions.length;
  const positiveAnswers = Object.values(responses).filter(Boolean).length;
  return (positiveAnswers / totalQuestions) * 10;
};
```

**✅ NOVA LÓGICA DE SUBMIT:**
```typescript
const handleSubmit = async () => {
  setIsSubmitting(true);
  
  try {
    const user = AuthService.getCurrentUser();
    const score = calculateScore();
    
    const response = await fetch('/api/dignometro/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        familyId: user.familyId,
        responses: responses, // ✅ Objeto {pergunta: true/false}
        userEmail: user.email
      })
    });

    const result = await response.json();
    
    if (result.success) {
      setFinalScore(score);
      setIsCompleted(true);
      toast({
        title: "Avaliação concluída!",
        description: `Score: ${score}/10 - Nível: ${result.povertyLevel}`,
      });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    toast({
      title: "Erro ao salvar avaliação",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

**✅ NOVO JSX RENDER:**
```typescript
return (
  <div className="min-h-screen bg-gray-50 p-4">
    <div className="max-w-2xl mx-auto">
      {/* Header com progresso */}
      <div className="mb-6">
        <Progress value={((currentStep + 1) / totalSteps) * 100} />
        <span className="text-sm text-gray-600">
          {currentStep + 1} de {totalSteps}
        </span>
      </div>

      {/* ✅ Usar QuestionCard existente */}
      <QuestionCard
        question={currentQuestion}
        onAnswer={handleAnswer}
        selectedValue={responses[currentQuestion.id]}
      />

      {/* Navegação */}
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={previousStep} 
          disabled={currentStep === 0}
        >
          Anterior
        </Button>
        <Button
          onClick={currentStep === totalSteps - 1 ? handleSubmit : nextStep}
          disabled={!isAnswered(currentQuestion.id) || isSubmitting}
        >
          {isSubmitting ? "Salvando..." : 
           currentStep === totalSteps - 1 ? "Finalizar" : "Próxima"}
        </Button>
      </div>
    </div>
  </div>
);
```


### **FASE 3: TESTES E2E COM PLAYWRIGHT + MCP**

#### **3.1 Criar `tests/dignometro.spec.ts`**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Dignômetro - Fluxo Completo', () => {
  test('Deve completar avaliação com respostas Sim/Não', async ({ page }) => {
    // ✅ 1. Navegar para dignômetro
    await page.goto('/dignometro');
    await expect(page.locator('h1:has-text("Dignômetro")')).toBeVisible();

    // ✅ 2. Verificar 10 perguntas existem
    const progressText = page.locator('text=/\\d+ de 10/');
    await expect(progressText).toBeVisible();

    // ✅ 3. Responder todas as perguntas com "Sim" (score máximo)
    for (let i = 0; i < 10; i++) {
      // Verificar pergunta carregou
      await expect(page.locator('.text-xl')).toBeVisible();
      
      // Clicar "Sim"
      await page.click('button:has-text("Sim")');
      
      // Verificar resposta selecionada
      await expect(page.locator('button:has-text("Sim")[variant="default"]')).toBeVisible();
      
      // Navegar (exceto última pergunta)
      if (i < 9) {
        await page.click('button:has-text("Próxima")');
        await page.waitForTimeout(500); // Aguardar transição
      }
    }

    // ✅ 4. Finalizar avaliação
    await page.click('button:has-text("Finalizar")');
    await page.waitForSelector('text=Avaliação Concluída!', { timeout: 10000 });

    // ✅ 5. Verificar score máximo (10/10)
    await expect(page.locator('text=10')).toBeVisible();
    await expect(page.locator('text=Nível de Pobreza: Baixo')).toBeVisible();

    // ✅ 6. Verificar toast de sucesso
    await expect(page.locator('text=Avaliação concluída!')).toBeVisible();
  });

  test('Deve calcular score médio com respostas mistas', async ({ page }) => {
    await page.goto('/dignometro');

    // Responder 5 Sim, 5 Não (score = 5.0)
    for (let i = 0; i < 10; i++) {
      const button = i < 5 ? 'button:has-text("Sim")' : 'button:has-text("Não")';
      await page.click(button);
      
      if (i < 9) {
        await page.click('button:has-text("Próxima")');
        await page.waitForTimeout(500);
      }
    }

    await page.click('button:has-text("Finalizar")');
    await page.waitForSelector('text=Avaliação Concluída!');

    // Score = 5, Nível = Médio
    await expect(page.locator('text=5')).toBeVisible();
    await expect(page.locator('text=Nível de Pobreza: Médio')).toBeVisible();
  });

  test('Deve validar salvamento no Supabase via MCP', async ({ page }) => {
    // ✅ Interceptar chamada API
    let assessmentData = null;
    await page.route('/api/dignometro/submit', async route => {
      const response = await route.fetch();
      assessmentData = await response.json();
      await route.fulfill({ response });
    });

    await page.goto('/dignometro');

    // Completar avaliação rapidamente
    for (let i = 0; i < 10; i++) {
      await page.click('button:has-text("Sim")');
      if (i < 9) await page.click('button:has-text("Próxima")');
    }
    
    await page.click('button:has-text("Finalizar")');
    await page.waitForSelector('text=Avaliação Concluída!');

    // ✅ Verificar dados salvos via MCP
    expect(assessmentData).not.toBeNull();
    expect(assessmentData.success).toBe(true);
    expect(assessmentData.score).toBe(10);
    expect(assessmentData.povertyLevel).toBe('Baixo');
  });
});
```

#### **3.2 Configurar `playwright.config.ts`**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

### **FASE 4: VALIDAÇÃO PERGUNTAS DA PLANILHA**

#### **4.1 Verificar `lib/diagnostico.ts` - Perguntas Atuais:**
```typescript
export const diagnosticoQuestions: DiagnosticoQuestion[] = [
  {
    id: "moradia",
    dimensao: "Moradia", 
    pergunta: "A moradia tem CEP ou endereço digital, é segura, feita com alvenaria ou estrutura sólida, sem risco imediato de desabamento ou enchente?"
  },
  {
    id: "agua",
    dimensao: "Água",
    pergunta: "A família tem acesso diário à água potável dentro de casa ou em local próximo, de forma segura e regular?"
  },
  {
    id: "saneamento", 
    dimensao: "Saneamento",
    pergunta: "A família possui acesso a banheiro sanitário adequado (com descarga e esgoto), de uso individual ou compartilhado com no máximo uma outra família?"
  },
  {
    id: "educacao",
    dimensao: "Educação", 
    pergunta: "As crianças da família (6 a 17 anos) estão matriculadas e frequentam a escola regularmente?"
  },
  {
    id: "saude",
    dimensao: "Saúde",
    pergunta: "Se alguém ficou doente no último ano, a família conseguiu buscar atendimento médico adequado e acessar os remédios necessários?"
  },
  {
    id: "alimentacao",
    dimensao: "Alimentação",
    pergunta: "Nos últimos 3 meses, todos os membros da família conseguiram fazer pelo menos duas refeições por dia, todos os dias."
  },
  {
    id: "renda_diversificada",
    dimensao: "Renda Diversificada",
    pergunta: "A família possui mais de uma fonte de renda ativa, como trabalho formal/informal, pensão, bicos ou pequenos negócios?"
  },
  {
    id: "renda_estavel", 
    dimensao: "Renda Estável",
    pergunta: "A responsável familiar conseguiu manter uma fonte de renda estável (formal ou informal) nos últimos 6 meses, sem interrupções longas?"
  },
  {
    id: "poupanca",
    dimensao: "Poupança",
    pergunta: "A família tem poupança?"
  },
  {
    id: "bens_conectividade",
    dimensao: "Bens e Conectividade", 
    pergunta: "A família possui acesso à internet e conta com pelo menos três dos seguintes itens: geladeira, ventilador, máquina de lavar roupas ou tanquinho, fogão (a gás ou elétrico) ou televisão?"
  }
];
```

**✅ AÇÃO NECESSÁRIA:** Comparar com planilha fornecida e atualizar se necessário.

---

### **FASE 5: ESTRUTURA JSON FINAL**

#### **5.1 Exemplo de Payload API:**
```json
{
  "familyId": "e2da494a-4fbd-45ae-be4b-d01f0e69712d",
  "responses": {
    "moradia": true,
    "agua": false, 
    "saneamento": true,
    "educacao": true,
    "saude": false,
    "alimentacao": true,
    "renda_diversificada": false,
    "renda_estavel": true,
    "poupanca": false,
    "bens_conectividade": true
  },
  "userEmail": "usuario@email.com"
}
```

#### **5.2 Exemplo de Resposta Supabase:**
```json
{
  "success": true,
  "assessment": {
    "id": "new-uuid",
    "family_id": "e2da494a-4fbd-45ae-be4b-d01f0e69712d",
    "answers": {
      "moradia": true,
      "agua": false,
      // ... todas as respostas
    },
    "poverty_score": 6.0,
    "poverty_level": "Médio",
    "dimension_scores": {
      "moradia": 1,
      "agua": 0,
      // ... scores por dimensão
    },
    "assessment_date": "2024-09-16",
    "created_at": "2024-09-16T10:30:00Z"
  },
  "score": 6.0,
  "povertyLevel": "Médio"
}
```

---

## ✅ **CHECKLIST DE VALIDAÇÃO FINAL**

### **Funcionalidades:**
- [ ] 10 perguntas Sim/Não funcionando
- [ ] Navegação entre perguntas fluida  
- [ ] Cálculo correto: (respostas_sim / total) * 10
- [ ] Classificação: ≥7=Baixo, ≥4=Médio, <4=Alto
- [ ] Salvamento real no Supabase via API
- [ ] Toast de confirmação/erro
- [ ] Redirecionamento pós-conclusão

### **Estrutura de Dados:**
- [ ] JSON responses apenas boolean
- [ ] poverty_score como número
- [ ] dimension_scores como JSONB estruturado
- [ ] assessment_date formato correto

### **Testes E2E (via MCP Playwright):**
- [ ] Fluxo completo 10 perguntas
- [ ] Score máximo (10 "Sim")
- [ ] Score médio (5 "Sim", 5 "Não")  
- [ ] Score mínimo (10 "Não")
- [ ] Validação salvamento Supabase
- [ ] Tratamento de erros

### **MCP Configuração:**
- [ ] MCP Supabase configurado
- [ ] MCP Playwright instalado
- [ ] Browsers Playwright instalados
- [ ] Variáveis ambiente configuradas

---

## 📊 **IMPACTO ESPERADO**

### **Antes (Sistema Atual):**
- ❌ Múltiplas escolhas complexas  
- ❌ Dados inconsistentes no Supabase
- ❌ Mock de salvamento (localStorage)
- ❌ Sem testes automatizados

### **Depois (Sistema Novo):**
- ✅ Respostas simples Sim/Não
- ✅ Dados estruturados no Supabase  
- ✅ API real de salvamento
- ✅ Testes E2E automatizados
- ✅ MCP integration completa

---

## ⏱️ **CRONOGRAMA ESTIMADO**

| Fase | Tempo Estimado | Dependências |
|------|---------------|--------------|
| Fase 1 - Tipos/API | 4-6 horas | Planilha de perguntas |
| Fase 2 - Refatoração UI | 6-8 horas | Fase 1 concluída |
| Fase 3 - MCP Config | 2-3 horas | Acessos Supabase |
| Fase 4 - Testes E2E | 4-6 horas | Fase 2 concluída |
| Fase 5 - Validação | 2-3 horas | Planilha final |
| **TOTAL** | **18-26 horas** | **2-3 dias úteis** |

---

## 🚀 **PRÓXIMOS PASSOS**

1. **Revisar planilha** de perguntas fornecida
2. **Confirmar estrutura** das 10 dimensões
3. **Implementar Fase 1** (tipos + API)
4. **Configurar MCP** Supabase + Playwright  
5. **Executar testes** para validação

---

**📁 Arquivo criado:** `PLANO_IMPLEMENTACAO_DIGNOMETRO.md`  
**🔧 MCP Validado:** Supabase (tabela exists) + Playwright (requer instalação)  
**📊 Status:** Pronto para implementação  
**👥 Stakeholders:** Equipe de desenvolvimento + QA

