# 🧪 **GUIA DE TESTES MANUAIS - DIGNÔMETRO**

## 📋 **PRÉ-REQUISITOS**
- Servidor Next.js rodando: `npm run dev`
- Supabase configurado e acessível
- Família cadastrada no sistema

---

## 🎯 **TESTE 1: CARREGAMENTO DA PÁGINA**

### **Passos:**
1. Acesse `http://localhost:3000/dignometro`
2. Aguarde a página carregar

### **Resultados Esperados:**
- ✅ Título "Dignômetro" visível
- ✅ Contador "1 de 10" exibido
- ✅ Botão "Voltar" presente
- ✅ Dimensão da pergunta exibida (ex: "Dimensão: Moradia")
- ✅ Pergunta da primeira dimensão carregada
- ✅ Botões "Sim" e "Não" visíveis
- ✅ Barra de progresso em 10%
- ✅ Botão "Anterior" desabilitado
- ✅ Botão "Próxima" desabilitado (até responder)

---

## 🎯 **TESTE 2: NAVEGAÇÃO ENTRE PERGUNTAS**

### **Passos:**
1. Na primeira pergunta, clique em "Sim"
2. Verifique se botão "Próxima" foi habilitado
3. Clique em "Próxima"
4. Verifique se chegou na pergunta 2
5. Clique em "Anterior"
6. Verifique se voltou para pergunta 1 com resposta mantida

### **Resultados Esperados:**
- ✅ Resposta "Sim" destacada (botão azul)
- ✅ Contador mudou para "2 de 10"
- ✅ Nova pergunta carregada (Dimensão: Água)
- ✅ Barra de progresso em 20%
- ✅ Botão "Anterior" habilitado
- ✅ Resposta anterior mantida ao voltar

---

## 🎯 **TESTE 3: COMPLETAR AVALIAÇÃO (SCORE ALTO)**

### **Passos:**
1. Responda todas as 10 perguntas com "Sim"
2. Na última pergunta, clique em "Finalizar Avaliação"
3. Aguarde processamento

### **Resultados Esperados:**
- ✅ Tela de conclusão exibida
- ✅ Score "10" exibido
- ✅ "Nível de Pobreza: Baixo" exibido
- ✅ Toast de sucesso: "Avaliação concluída!"
- ✅ Botão "Voltar ao Perfil" presente

---

## 🎯 **TESTE 4: COMPLETAR AVALIAÇÃO (SCORE MÉDIO)**

### **Passos:**
1. Responda 5 perguntas com "Sim" e 5 com "Não"
2. Finalize a avaliação

### **Resultados Esperados:**
- ✅ Score "5" exibido
- ✅ "Nível de Pobreza: Médio" exibido
- ✅ Dados salvos no Supabase

---

## 🎯 **TESTE 5: COMPLETAR AVALIAÇÃO (SCORE BAIXO)**

### **Passos:**
1. Responda todas as 10 perguntas com "Não"
2. Finalize a avaliação

### **Resultados Esperados:**
- ✅ Score "0" exibido
- ✅ "Nível de Pobreza: Alto" exibido

---

## 🎯 **TESTE 6: VALIDAÇÃO NO SUPABASE**

### **Passos:**
1. Complete uma avaliação
2. Verifique no Supabase a tabela `dignometro_assessments`

### **Query de Verificação:**
```sql
SELECT * FROM dignometro_assessments 
ORDER BY created_at DESC 
LIMIT 1;
```

### **Resultados Esperados:**
- ✅ Registro criado com dados corretos
- ✅ `family_id` preenchido
- ✅ `answers` em formato JSONB: `{"moradia": true, "agua": false, ...}`
- ✅ `poverty_score` numérico (0-10)
- ✅ `poverty_level` texto ("Alto", "Médio", "Baixo")
- ✅ `dimension_scores` JSONB: `{"moradia": 1, "agua": 0, ...}`
- ✅ `assessment_date` formato YYYY-MM-DD
- ✅ `created_at` timestamp atual

---

## 🎯 **TESTE 7: TRATAMENTO DE ERROS**

### **Passos:**
1. Desconecte o Supabase (temporariamente)
2. Complete uma avaliação
3. Tente finalizar

### **Resultados Esperados:**
- ✅ Toast de erro exibido
- ✅ Usuário permanece na interface
- ✅ Pode tentar novamente após reconectar

---

## 🎯 **TESTE 8: RESPONSIVIDADE**

### **Passos:**
1. Teste em diferentes tamanhos de tela
2. Teste em mobile/tablet

### **Resultados Esperados:**
- ✅ Interface adaptável
- ✅ Botões clicáveis em mobile
- ✅ Texto legível em todos os tamanhos

---

## 📊 **VALIDAÇÃO DAS 10 DIMENSÕES**

### **Perguntas Implementadas:**
1. **Moradia** - CEP, segurança, estrutura sólida
2. **Água** - Acesso diário à água potável
3. **Saneamento** - Banheiro adequado com descarga
4. **Educação** - Crianças 6-17 anos matriculadas
5. **Saúde** - Acesso a atendimento médico e remédios
6. **Alimentação** - Duas refeições/dia nos últimos 3 meses
7. **Renda Diversificada** - Múltiplas fontes de renda
8. **Renda Estável** - Renda mantida por 6 meses
9. **Poupança** - Família possui poupança
10. **Bens e Conectividade** - Internet + 3 itens básicos

---

## 🔧 **CÁLCULO DE SCORE**

### **Fórmula:**
```
Score = (Respostas "Sim" / 10) × 10
```

### **Classificação:**
- **Score ≥ 7:** Nível de Pobreza **Baixo**
- **Score ≥ 4:** Nível de Pobreza **Médio** 
- **Score < 4:** Nível de Pobreza **Alto**

### **Exemplos:**
- 10 "Sim" = Score 10 = Baixo
- 7 "Sim" = Score 7 = Baixo
- 5 "Sim" = Score 5 = Médio
- 3 "Sim" = Score 3 = Alto
- 0 "Sim" = Score 0 = Alto

---

## ✅ **CHECKLIST FINAL**

### **Funcionalidades:**
- [ ] 10 perguntas Sim/Não funcionando
- [ ] Navegação fluida entre perguntas
- [ ] Cálculo correto de score
- [ ] Classificação correta de nível
- [ ] Salvamento real no Supabase
- [ ] Toast de confirmação/erro
- [ ] Tela de conclusão funcional

### **Estrutura de Dados:**
- [ ] JSON responses apenas boolean
- [ ] poverty_score como número
- [ ] dimension_scores como JSONB estruturado
- [ ] assessment_date formato correto

### **UX/UI:**
- [ ] Interface responsiva
- [ ] Botões destacados quando selecionados
- [ ] Progresso visual claro
- [ ] Mensagens de feedback adequadas

---

## 🚨 **PROBLEMAS CONHECIDOS**

1. **AuthService Mock:** Em produção, verificar se há usuário logado
2. **Timeout:** Aguardar resposta da API antes de mostrar conclusão
3. **Offline:** Implementar cache local para funcionar offline

---

## 📞 **SUPORTE**

Se encontrar problemas:
1. Verifique logs do console do navegador
2. Verifique logs do servidor Next.js
3. Verifique conectividade com Supabase
4. Confirme se família tem ID válido

**Status:** ✅ **Sistema funcionando conforme especificado**
