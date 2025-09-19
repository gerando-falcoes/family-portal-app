
import { v4 as uuidv4 } from 'uuid';
import { DiagnosticoQuestion, DiagnosticoResponse } from './types';

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
  ]

export class DiagnosticoService {
  static saveResponse(questionId: string, answer: boolean): void {
    const responses = DiagnosticoService.loadResponses();
    responses[questionId] = answer;
    localStorage.setItem('diagnostico_responses', JSON.stringify(responses));
  }

  static loadResponses(): Record<string, boolean> {
    if (typeof window === 'undefined') return {};
    const responses = localStorage.getItem('diagnostico_responses');
    return responses ? JSON.parse(responses) : {};
  }

  static clearResponses(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('diagnostico_responses');
    }
  }

  static calculateScore(responses: Record<string, boolean>): number {
    const totalQuestions = diagnosticoQuestions.length;
    const positiveAnswers = Object.values(responses).filter(Boolean).length;
    
    if (totalQuestions === 0) return 0;

    return (positiveAnswers / totalQuestions) * 10;
  }

  static saveDiagnostico(responses: Record<string, boolean>, userEmail: string, userId: string, familyId: string): DiagnosticoResponse {
    const score = DiagnosticoService.calculateScore(responses);
    const newDiagnostico: DiagnosticoResponse = {
      id: uuidv4(),
      userId,
      userEmail,
      familyId,
      responses,
      score,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    localStorage.setItem('diagnostico_final', JSON.stringify(newDiagnostico));
    localStorage.removeItem('diagnostico_responses');
    localStorage.removeItem('diagnostico_current_step');
    
    return newDiagnostico;
  }

  static async submitToDatabase(diagnostico: DiagnosticoResponse): Promise<void> {
    // Lógica futura para enviar para a API/Base de dados
    console.log("Submitting to database:", diagnostico);
    // Exemplo:
    // await fetch('/api/diagnostico', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(diagnostico),
    // });
  }
}
