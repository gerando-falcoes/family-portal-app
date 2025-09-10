# Guia de Estilo Completo - Sistema Decolagem

## Visão Geral
Este guia contém todos os padrões de design, animações, tipografia e estilos utilizados no sistema Decolagem. Use este documento como referência para replicar exatamente a mesma aparência e experiência do usuário em outros sistemas.

---

## 🎨 Paleta de Cores

### Cores Principais
```css
/* Cores CSS Variables */
:root {
  /* Backgrounds */
  --background: #F9FAFB; /* Cinza Claro */
  --foreground: #1F2937; /* Cinza Escuro */
  
  /* Cards e Superfícies */
  --card: #FFFFFF;
  --card-foreground: #1F2937;
  
  /* Cores Funcionais */
  --primary: #3B82F6; /* Azul Confiança */
  --primary-foreground: #FFFFFF;
  --secondary: #10B981; /* Verde Esperança */
  --secondary-foreground: #FFFFFF;
  --accent: #F59E0B; /* Laranja Energia */
  --accent-foreground: #FFFFFF;
  --destructive: #EF4444; /* Vermelho para alertas */
  --destructive-foreground: #FFFFFF;
  
  /* Elementos Neutros */
  --muted: #F3F4F6; /* Cinza um pouco mais escuro que o background */
  --muted-foreground: #6B7280; /* Cinza Médio */
  --border: #E5E7EB; /* Borda suave */
  --input: #E5E7EB;
  --ring: #3B82F6; /* Azul Confiança para anéis de foco */
  
  /* Cores para Gráficos */
  --chart-1: #10B981; /* Verde Esperança */
  --chart-2: #3B82F6; /* Azul Confiança */
  --chart-3: #F59E0B; /* Laranja Energia */
  --chart-4: #8B5CF6; /* Roxo Dignidade */
  --chart-5: #EC4899; /* Rosa Cuidado */
  
  /* Raio das Bordas */
  --radius: 0.75rem; /* 12px - Bordas arredondadas */
}
```

### Status Colors (Badges e Estados)
```css
/* Status Colors - Aplicar via classes Tailwind */
.status-red { background: #fef2f2; color: #991b1b; border: #fecaca; }
.status-orange { background: #fff7ed; color: #9a3412; border: #fed7aa; }
.status-yellow { background: #fefce8; color: #a16207; border: #fde68a; }
.status-blue { background: #eff6ff; color: #1e40af; border: #bfdbfe; }
.status-green { background: #f0fdf4; color: #166534; border: #bbf7d0; }
```

---

## 🔤 Tipografia

### Fonte Principal
```css
font-family: Inter, system-ui, sans-serif;
```

### Hierarquia de Títulos
```css
/* H1 - Títulos Principais */
.title-main {
  font-size: 2rem; /* 32px */
  font-weight: 700; /* bold */
  color: #1F2937; /* gray-800 */
  letter-spacing: -0.025em; /* tracking-tighter */
  line-height: 1.2;
}

/* H2 - Títulos de Seção */
.title-section {
  font-size: 1.875rem; /* 30px */
  font-weight: 700; /* bold */
  color: #1F2937; /* gray-800 */
  line-height: 1.3;
}

/* H3 - Subtítulos */
.title-subsection {
  font-size: 1.5rem; /* 24px */
  font-weight: 600; /* semibold */
  color: #1F2937; /* gray-800 */
  line-height: 1.4;
}

/* H4 - Títulos de Cards */
.title-card {
  font-size: 1.125rem; /* 18px */
  font-weight: 600; /* semibold */
  color: #1F2937; /* gray-800 */
  line-height: 1.5;
}

/* Texto do Corpo */
.body-text {
  font-size: 0.875rem; /* 14px */
  font-weight: 400; /* normal */
  color: #4B5563; /* gray-600 */
  line-height: 1.6;
}

/* Texto Pequeno/Auxiliar */
.text-small {
  font-size: 0.75rem; /* 12px */
  font-weight: 400; /* normal */
  color: #6B7280; /* gray-500 */
  line-height: 1.5;
}

/* Texto de Labels */
.label-text {
  font-size: 0.875rem; /* 14px */
  font-weight: 500; /* medium */
  color: #374151; /* gray-700 */
  line-height: 1.5;
}
```

---

## 🎭 Animações e Transições (Framer Motion)

### Variantes de Container (Animações Sequenciais)
```javascript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.1, // Elementos aparecem com 0.1s de diferença
      delayChildren: 0.2    // Espera 0.2s antes de começar
    },
  },
}
```

### Variantes de Item (Elementos Individuais)
```javascript
const itemVariants = {
  hidden: { 
    y: 20,        // Começa 20px abaixo
    opacity: 0    // Totalmente transparente
  },
  visible: { 
    y: 0,         // Vai para posição normal
    opacity: 1,   // Fica totalmente visível
    transition: { 
      duration: 0.5,    // Duração de 0.5s
      ease: "easeOut"   // Aceleração suave
    } 
  },
}
```

### Animações de Entrada de Página
```javascript
// Header (desliza de cima para baixo)
const headerAnimation = {
  initial: { y: -100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.6, ease: "easeOut" }
}

// Conteúdo Principal (fade + movimento vertical)
const pageContentAnimation = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

// Sidebar/Conteúdo Lateral (vem da direita)
const sidebarAnimation = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, delay: 0.5, ease: "easeOut" }
}
```

### Animações de Hover e Interação
```javascript
// Cards com Hover
const cardHoverAnimation = {
  whileHover: { 
    y: -5,           // Levanta 5px
    scale: 1.02,     // Aumenta 2%
    shadow: "lg"     // Sombra maior
  },
  transition: { type: "spring", stiffness: 300 }
}

// Botões com Hover
const buttonHoverAnimation = {
  whileHover: { scale: 1.05 },    // Aumenta 5%
  whileTap: { scale: 0.95 },      // Diminui 5% ao clicar
  transition: { duration: 0.2 }
}

// Avatar com Hover
const avatarHoverAnimation = {
  whileHover: { scale: 1.1 },
  transition: { type: "spring", stiffness: 300 }
}
```

### Animações de Progress/Loading
```javascript
// Barras de Progresso
const progressAnimation = {
  initial: { width: 0 },
  animate: { width: `${percentage}%` },
  transition: { duration: 1.5, ease: "easeOut" }
}

// Círculos de Progresso (SVG)
const circleProgressAnimation = {
  initial: { strokeDashoffset: 339.292 },
  animate: { strokeDashoffset: 339.292 - (339.292 * score) / 10 },
  transition: { duration: 1.5, delay: 0.5, ease: "easeOut" }
}
```

### Animações de Tabela/Lista
```javascript
// Linha da Tabela com Hover
const tableRowHoverAnimation = {
  whileHover: { 
    backgroundColor: "#F9FAFB", // gray-50
    scale: 1.01 
  },
  transition: { duration: 0.2 }
}
```

---

## 🏗️ Componentes e Layout

### Estrutura de Cards
```css
.card-base {
  background: white;
  border-radius: 1rem; /* 16px - rounded-2xl */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); /* shadow-md */
  padding: 1.5rem; /* 24px - p-6 */
  border: 1px solid #E5E7EB; /* border-gray-200 */
}

.card-hover {
  transition: box-shadow 0.3s ease;
}

.card-hover:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); /* shadow-lg */
}
```

### Header Sticky
```css
.header-sticky {
  background: rgba(255, 255, 255, 0.8); /* bg-white/80 */
  backdrop-filter: blur(16px); /* backdrop-blur-lg */
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(229, 231, 235, 0.8); /* border-gray-200/80 */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  height: 5rem; /* 80px - h-20 */
}
```

### Navegação (Pills)
```css
.nav-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px; /* rounded-full */
  background: rgba(243, 244, 246, 0.8); /* bg-gray-100/80 */
  padding: 0.25rem; /* p-1 */
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem; /* px-4 py-2 */
  border-radius: 9999px; /* rounded-full */
  color: #6B7280; /* text-gray-600 */
  font-weight: 500; /* font-medium */
  transition: all 0.2s ease; /* transition-colors duration-200 */
}

.nav-item:hover {
  background: white;
  color: #2563EB; /* text-blue-600 */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
}
```

### Grid Layouts
```css
/* Dashboard - Grid de Métricas */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem; /* gap-6 */
}

@media (min-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Layout Principal - 3 Colunas */
.main-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem; /* gap-6 */
}

@media (min-width: 1024px) {
  .main-layout {
    grid-template-columns: 2fr 1fr; /* lg:grid-cols-3 equivalent */
  }
}
```

### Formulários
```css
.form-section {
  background: white;
  border-radius: 1rem; /* rounded-2xl */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); /* shadow-md */
  transition: box-shadow 0.3s ease;
}

.form-section:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); /* shadow-lg */
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem; /* gap-6 */
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Layout de Formulário Complexo */
@media (min-width: 1024px) {
  .complex-form-layout {
    grid-template-columns: 1fr 1fr 340px; /* [1fr_1fr_340px] */
  }
}
```

---

## 🎯 Componentes Específicos

### Badges de Status
```javascript
const statusConfig = {
  "Pobreza Extrema": { color: "red", label: "Pobreza Extrema" },
  "Pobreza": { color: "orange", label: "Pobreza" },
  "Dignidade": { color: "yellow", label: "Dignidade" },
  "Prosperidade": { color: "blue", label: "Prosperidade" },
  "Quebra de Ciclo": { color: "green", label: "Quebra de Ciclo" },
}

const badgeColors = {
  red: "bg-red-100 text-red-800 border-red-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  green: "bg-green-100 text-green-800 border-green-200",
}
```

### Botões
```css
/* Botão Principal */
.btn-primary {
  background: #3B82F6; /* bg-blue-600 */
  color: white;
  font-weight: 700; /* font-bold */
  padding: 0.75rem 1.5rem; /* py-3 px-6 */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); /* shadow-lg */
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #2563EB; /* hover:bg-blue-700 */
  transform: scale(1.05); /* hover:scale-105 */
}

/* Botão Secundário */
.btn-secondary {
  background: white;
  color: #3B82F6; /* text-blue-600 */
  border: 1px solid #3B82F6; /* border-blue-600 */
  font-weight: 700; /* font-bold */
  padding: 0.75rem 1.5rem; /* py-3 px-6 */
  border-radius: 0.5rem; /* rounded-lg */
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #EFF6FF; /* hover:bg-blue-50 */
  color: #2563EB; /* hover:text-blue-700 */
  transform: scale(1.05); /* hover:scale-105 */
}
```

### Inputs e Forms
```css
.input-base {
  width: 100%;
  padding: 0.5rem 1rem; /* py-2 px-4 */
  border: 1px solid #D1D5DB; /* border-gray-300 */
  border-radius: 0.5rem; /* rounded-lg */
  background: rgba(243, 244, 246, 0.8); /* bg-gray-100/80 */
  box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-inner */
  transition: all 0.2s ease;
}

.input-base:focus {
  outline: none;
  border-color: #3B82F6; /* focus:border-blue-500 */
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); /* focus:ring-2 focus:ring-blue-500 */
}

.label-base {
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #374151; /* text-gray-700 */
  margin-bottom: 0.5rem; /* mb-2 */
  display: block;
}
```

### Progress Indicators
```css
.progress-bar-container {
  width: 100%;
  height: 0.625rem; /* h-2.5 */
  background: #E5E7EB; /* bg-gray-200 */
  border-radius: 9999px; /* rounded-full */
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 9999px; /* rounded-full */
  transition: width 1.5s ease; /* Animação suave */
}

/* Cores do Progress */
.progress-blue { background: #3B82F6; }
.progress-green { background: #10B981; }
.progress-orange { background: #F59E0B; }
.progress-purple { background: #8B5CF6; }
```

---

## 📱 Responsividade

### Breakpoints
```css
/* Mobile First Approach */
.responsive-container {
  padding: 1rem; /* p-4 */
}

/* Tablet */
@media (min-width: 640px) {
  .responsive-container {
    padding: 1.5rem; /* sm:p-6 */
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .responsive-container {
    padding: 2rem; /* lg:p-8 */
  }
}

/* Grid Responsivo */
.responsive-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem; /* gap-4 */
}

@media (min-width: 768px) {
  .responsive-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem; /* md:gap-6 */
  }
}

@media (min-width: 1024px) {
  .responsive-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem; /* lg:gap-8 */
  }
}
```

---

## 🎨 Backgrounds e Gradientes

### Background Principal
```css
.main-background {
  background: #F9FAFB; /* bg-gray-50 */
  min-height: 100vh;
}

/* Background da Página de Login */
.login-background {
  background: linear-gradient(to bottom right, #F9FAFB, #DBEAFE); /* from-gray-50 to-blue-100 */
  min-height: 100vh;
  width: 100%;
}

/* Background de Cards com Glassmorphism */
.glass-card {
  background: rgba(255, 255, 255, 0.8); /* bg-white/80 */
  backdrop-filter: blur(16px); /* backdrop-blur-lg */
  border: 1px solid rgba(229, 231, 235, 1); /* border-gray-200 */
}

/* Gradiente de Header de Perfil */
.profile-gradient {
  background: linear-gradient(to right, #3B82F6, #8B5CF6); /* from-blue-500 to-purple-500 */
  height: 6rem; /* h-24 */
}
```

---

## 🖼️ Elementos Visuais

### Avatars e Imagens
```css
.avatar-base {
  border-radius: 50%; /* rounded-full */
  border: 4px solid white; /* border-4 border-white */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); /* shadow-lg */
}

.avatar-small {
  width: 2.5rem; /* w-10 */
  height: 2.5rem; /* h-10 */
}

.avatar-large {
  width: 8rem; /* w-32 */
  height: 8rem; /* h-32 */
}

.avatar-hover {
  transition: border-color 0.2s ease;
}

.avatar-hover:hover {
  border-color: #3B82F6; /* hover:border-blue-500 */
}
```

### Scrollbar Customizada
```css
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
```

### Focus States
```css
button:focus,
input:focus,
select:focus {
  outline: 2px solid #3B82F6; /* outline-blue-500 */
  outline-offset: 2px;
}
```

---

## 🔧 Dependências Necessárias

### Package.json (Principais)
```json
{
  "dependencies": {
    "framer-motion": "^12.23.12",
    "lucide-react": "^0.454.0",
    "next": "14.2.16",
    "react": "^18",
    "react-dom": "^18",
    "@radix-ui/react-avatar": "latest",
    "@radix-ui/react-dropdown-menu": "latest",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-select": "latest",
    "@radix-ui/react-checkbox": "latest",
    "@radix-ui/react-label": "latest",
    "@radix-ui/react-progress": "latest",
    "@radix-ui/react-slot": "latest",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

---

## 📋 Checklist de Implementação

### ✅ Configuração Base
- [ ] Instalar dependências (Framer Motion, Radix UI, Tailwind CSS)
- [ ] Configurar Tailwind CSS com cores customizadas
- [ ] Configurar fonte Inter
- [ ] Implementar scrollbar customizada

### ✅ Componentes UI Base
- [ ] Implementar sistema de Button com variantes
- [ ] Criar componente Card com todas as variações
- [ ] Implementar Badge com sistema de cores de status
- [ ] Criar Input e Label com estilos consistentes
- [ ] Implementar Progress components

### ✅ Animações
- [ ] Configurar Framer Motion
- [ ] Implementar containerVariants e itemVariants
- [ ] Adicionar animações de entrada de página
- [ ] Configurar hover effects em cards e botões
- [ ] Implementar animações de progress

### ✅ Layout e Navegação
- [ ] Criar Header sticky com glassmorphism
- [ ] Implementar navegação em pills
- [ ] Configurar grids responsivos
- [ ] Implementar layouts específicos (dashboard, forms, perfis)

### ✅ Estados e Interações
- [ ] Configurar sistema de status com cores
- [ ] Implementar focus states
- [ ] Adicionar hover effects consistentes
- [ ] Configurar transições suaves

---

## 🎯 Notas de Implementação

1. **Sempre use Framer Motion** para animações, nunca CSS puro
2. **Mantenha consistência** nas durações de animação (0.2s para hover, 0.5s para entrada)
3. **Use glassmorphism** em headers e modais (backdrop-blur-lg + bg-white/80)
4. **Bordas arredondadas** são sempre `rounded-2xl` (1rem) para cards principais
5. **Spacing consistente** - use sempre múltiplos de 0.25rem (1, 1.5, 2, 3, 4, 6, 8)
6. **Shadows escalonadas** - shadow-sm para elementos pequenos, shadow-md para cards, shadow-lg para hover
7. **Hierarquia de cores** - gray-800 para títulos, gray-600 para corpo, gray-500 para auxiliar

Este guia garante que qualquer desenvolvedor possa replicar exatamente a mesma experiência visual e de interação do sistema Decolagem.
