import { 
  Home, 
  Droplets, 
  Bath, 
  GraduationCap, 
  Heart, 
  UtensilsCrossed, 
  TrendingUp, 
  DollarSign, 
  PiggyBank, 
  Smartphone,
  LucideIcon
} from 'lucide-react'

interface DimensionIconProps {
  dimension: string
  className?: string
  size?: number
}

const dimensionIcons: Record<string, LucideIcon> = {
  'Moradia': Home,
  'Água': Droplets,
  'Saneamento': Bath,
  'Educação': GraduationCap,
  'Saúde': Heart,
  'Alimentação': UtensilsCrossed,
  'Renda Diversificada': TrendingUp,
  'Renda Estável': DollarSign,
  'Poupança': PiggyBank,
  'Bens e Conectividade': Smartphone,
}

const dimensionColors: Record<string, string> = {
  'Moradia': 'text-blue-600',
  'Água': 'text-cyan-600',
  'Saneamento': 'text-teal-600',
  'Educação': 'text-purple-600',
  'Saúde': 'text-red-500',
  'Alimentação': 'text-orange-600',
  'Renda Diversificada': 'text-green-600',
  'Renda Estável': 'text-emerald-600',
  'Poupança': 'text-yellow-600',
  'Bens e Conectividade': 'text-indigo-600',
}

const dimensionBackgrounds: Record<string, string> = {
  'Moradia': 'bg-blue-50 border-blue-200',
  'Água': 'bg-cyan-50 border-cyan-200',
  'Saneamento': 'bg-teal-50 border-teal-200',
  'Educação': 'bg-purple-50 border-purple-200',
  'Saúde': 'bg-red-50 border-red-200',
  'Alimentação': 'bg-orange-50 border-orange-200',
  'Renda Diversificada': 'bg-green-50 border-green-200',
  'Renda Estável': 'bg-emerald-50 border-emerald-200',
  'Poupança': 'bg-yellow-50 border-yellow-200',
  'Bens e Conectividade': 'bg-indigo-50 border-indigo-200',
}

export function DimensionIcon({ dimension, className = '', size = 24 }: DimensionIconProps) {
  const IconComponent = dimensionIcons[dimension] || Home
  const colorClass = dimensionColors[dimension] || 'text-gray-600'
  
  return (
    <IconComponent 
      size={size} 
      className={`${colorClass} ${className}`} 
    />
  )
}

export function getDimensionColor(dimension: string): string {
  return dimensionColors[dimension] || 'text-gray-600'
}

export function getDimensionBackground(dimension: string): string {
  return dimensionBackgrounds[dimension] || 'bg-gray-50 border-gray-200'
}


