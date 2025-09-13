# Guia de UI - Sistema Decolagem

Este guia documenta todos os elementos visuais, cores, estilos e animações do sistema Decolagem para facilitar a implementação em outros projetos.

## 📋 Índice

1. [Paleta de Cores](#paleta-de-cores)
2. [Tipografia](#tipografia)
3. [Componentes](#componentes)
4. [Animações](#animações)
5. [Layout e Espaçamento](#layout-e-espaçamento)
6. [Estados Interativos](#estados-interativos)
7. [Screenshots](#screenshots)

---

## 🎨 Paleta de Cores

### Cores Principais

```css
:root {
  /* Cores de Fundo */
  --background: #F9FAFB;        /* Cinza Claro */
  --foreground: #1F2937;        /* Cinza Escuro */
  --card: #FFFFFF;              /* Branco */
  
  /* Cores Primárias */
  --primary: #3B82F6;           /* Azul Confiança */
  --primary-foreground: #FFFFFF;
  
  /* Cores Secundárias */
  --secondary: #10B981;         /* Verde Esperança */
  --secondary-foreground: #FFFFFF;
  
  /* Cores de Acento */
  --accent: #F59E0B;            /* Laranja Energia */
  --accent-foreground: #FFFFFF;
  
  /* Cores de Estado */
  --destructive: #EF4444;       /* Vermelho para alertas */
  --destructive-foreground: #FFFFFF;
  
  /* Cores Neutras */
  --muted: #F3F4F6;            /* Cinza um pouco mais escuro que o background */
  --muted-foreground: #6B7280; /* Cinza Médio */
  --border: #E5E7EB;           /* Borda suave */
  --input: #E5E7EB;
  --ring: #3B82F6;             /* Azul Confiança para anéis de foco */
}
```

### Cores para Gráficos

```css
:root {
  --chart-1: #10B981;  /* Verde Esperança */
  --chart-2: #3B82F6;  /* Azul Confiança */
  --chart-3: #F59E0B;  /* Laranja Energia */
  --chart-4: #8B5CF6;  /* Roxo Dignidade */
  --chart-5: #EC4899;  /* Rosa Cuidado */
}
```

### Cores de Status das Famílias

```css
/* Status Badges */
.status-pobreza-extrema {
  background-color: #FEE2E2;
  color: #DC2626;
  border-color: #FECACA;
}

.status-pobreza {
  background-color: #FED7AA;
  color: #EA580C;
  border-color: #FDBA74;
}

.status-dignidade {
  background-color: #FEF3C7;
  color: #D97706;
  border-color: #FDE68A;
}

.status-prosperidade {
  background-color: #DBEAFE;
  color: #2563EB;
  border-color: #BFDBFE;
}

.status-quebra-ciclo {
  background-color: #D1FAE5;
  color: #059669;
  border-color: #A7F3D0;
}
```

---

## 📝 Tipografia

### Fontes

```css
:root {
  --font-sans: Inter, system-ui, sans-serif;
}
```

### Hierarquia Tipográfica

```css
/* Títulos */
h1 {
  font-size: 2.25rem;    /* 36px */
  font-weight: 700;
  line-height: 1.2;
  color: #1F2937;
}

h2 {
  font-size: 1.875rem;   /* 30px */
  font-weight: 600;
  line-height: 1.3;
  color: #1F2937;
}

h3 {
  font-size: 1.5rem;     /* 24px */
  font-weight: 600;
  line-height: 1.4;
  color: #374151;
}

/* Texto do corpo */
body {
  font-size: 1rem;       /* 16px */
  font-weight: 400;
  line-height: 1.6;
  color: #1F2937;
}

/* Texto pequeno */
.text-sm {
  font-size: 0.875rem;   /* 14px */
  line-height: 1.5;
}

/* Texto extra pequeno */
.text-xs {
  font-size: 0.75rem;    /* 12px */
  line-height: 1.4;
}
```

---

## 🧩 Componentes

### Botões

#### Botão Primário
```css
.btn-primary {
  background-color: #3B82F6;
  color: #FFFFFF;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #2563EB;
  transform: scale(1.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primary:focus {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}
```

#### Botão Secundário
```css
.btn-secondary {
  background-color: #10B981;
  color: #FFFFFF;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #059669;
  transform: scale(1.05);
}
```

#### Botão Outline
```css
.btn-outline {
  background-color: transparent;
  color: #3B82F6;
  border: 1px solid #3B82F6;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.btn-outline:hover {
  background-color: #EBF8FF;
  color: #1D4ED8;
}
```

#### Botão Ghost
```css
.btn-ghost {
  background-color: transparent;
  color: #6B7280;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.btn-ghost:hover {
  background-color: #F3F4F6;
  color: #3B82F6;
}
```

### Cards

```css
.card {
  background-color: #FFFFFF;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #E5E7EB;
  padding: 1.5rem;
  transition: all 0.2s ease-in-out;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 0.5rem;
}

.card-content {
  color: #6B7280;
  line-height: 1.6;
}
```

### Inputs

```css
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  background-color: #F9FAFB;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background-color: #FFFFFF;
}

.input::placeholder {
  color: #9CA3AF;
}
```

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  border: 1px solid;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge-prosperidade {
  background-color: #DBEAFE;
  color: #2563EB;
  border-color: #BFDBFE;
}

.badge-pobreza-extrema {
  background-color: #FEE2E2;
  color: #DC2626;
  border-color: #FECACA;
}

.badge-dignidade {
  background-color: #FEF3C7;
  color: #D97706;
  border-color: #FDE68A;
}

.badge-quebra-ciclo {
  background-color: #D1FAE5;
  color: #059669;
  border-color: #A7F3D0;
}
```

### Progress Bars

```css
.progress {
  width: 100%;
  height: 0.625rem;
  background-color: #E5E7EB;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #3B82F6;
  border-radius: 9999px;
  transition: width 1.5s ease-out;
}

.progress-bar-green {
  background-color: #10B981;
}

.progress-bar-orange {
  background-color: #F59E0B;
}

.progress-bar-pink {
  background-color: #EC4899;
}
```

---

## ✨ Animações

### Animações de Entrada

```css
/* Fade In com movimento vertical */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Fade In com movimento horizontal */
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-in-left {
  animation: fadeInLeft 0.5s ease-out;
}
```

### Animações de Hover

```css
/* Hover com escala */
.hover-scale {
  transition: transform 0.2s ease-in-out;
}

.hover-scale:hover {
  transform: scale(1.05);
}

/* Hover com elevação */
.hover-lift {
  transition: all 0.2s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### Animações de Loading

```css
/* Spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Animações de Progresso

```css
/* Progresso animado */
@keyframes progressFill {
  from {
    width: 0%;
  }
  to {
    width: var(--progress-width);
  }
}

.progress-animated {
  animation: progressFill 1.5s ease-out;
}
```

---

## 📐 Layout e Espaçamento

### Sistema de Grid

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
```

### Espaçamento

```css
/* Padding */
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }

/* Margin */
.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }
.m-3 { margin: 0.75rem; }
.m-4 { margin: 1rem; }
.m-6 { margin: 1.5rem; }
.m-8 { margin: 2rem; }

/* Gap */
.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }
```

### Border Radius

```css
.rounded-sm { border-radius: 0.125rem; }
.rounded { border-radius: 0.25rem; }
.rounded-md { border-radius: 0.375rem; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-2xl { border-radius: 1rem; }
.rounded-full { border-radius: 9999px; }
```

---

## 🎯 Estados Interativos

### Estados de Foco

```css
.focus-ring {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

.focus-ring-destructive {
  outline: 2px solid #EF4444;
  outline-offset: 2px;
}
```

### Estados de Hover

```css
/* Hover para botões */
.btn-hover {
  transition: all 0.2s ease-in-out;
}

.btn-hover:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Hover para cards */
.card-hover {
  transition: all 0.2s ease-in-out;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Hover para linhas de tabela */
.table-row-hover {
  transition: all 0.2s ease-in-out;
}

.table-row-hover:hover {
  background-color: #F9FAFB;
  transform: scale(1.01);
}
```

### Estados de Loading

```css
.loading {
  opacity: 0.6;
  pointer-events: none;
  position: relative;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid #3B82F6;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

---

## 🖼️ Screenshots

### Página de Login
![Login Page](.playwright-mcp/login-page.png)

**Características:**
- Fundo com gradiente suave (cinza claro para azul claro)
- Card central com backdrop-blur e transparência
- Animações de entrada com Framer Motion
- Botão com efeito de escala no hover

### Dashboard
![Dashboard](.playwright-mcp/dashboard.png)

**Características:**
- Header fixo com backdrop-blur
- Cards de métricas com animações de hover
- Gráfico circular animado
- Barras de progresso com animações
- Layout responsivo em grid

### Página de Famílias
![Families Page](.playwright-mcp/families-page.png)

**Características:**
- Tabela com hover effects nas linhas
- Badges coloridos para status
- Botões com animações de escala
- Menu dropdown animado
- Busca com ícone integrado

---

## 🚀 Implementação

### Dependências Necessárias

```json
{
  "dependencies": {
    "framer-motion": "^12.23.12",
    "lucide-react": "^0.454.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

### Configuração do Tailwind

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        // ... outras cores
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### Utilitários CSS

```javascript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## 📝 Notas de Implementação

1. **Animações**: Use Framer Motion para animações complexas e CSS transitions para efeitos simples
2. **Responsividade**: O sistema usa breakpoints padrão (sm, md, lg, xl)
3. **Acessibilidade**: Todos os componentes incluem estados de foco e ARIA labels
4. **Performance**: Animações são otimizadas com `transform` e `opacity`
5. **Consistência**: Use as variáveis CSS para manter consistência de cores

---

*Este guia foi gerado automaticamente baseado na análise do sistema Decolagem usando Playwright e análise de código.*
