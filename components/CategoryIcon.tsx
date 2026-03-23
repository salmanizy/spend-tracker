'use client'

import {
  UtensilsCrossed, ShoppingCart, Plane, Wrench,
  Gamepad2, HeartPulse, Car, CircleDollarSign,
} from 'lucide-react'
import { Category } from '@/types'

const icons: Record<Category, React.ElementType> = {
  'Food & Drinks': UtensilsCrossed,
  Shopping: ShoppingCart,
  Travel: Plane,
  Services: Wrench,
  Entertainment: Gamepad2,
  Health: HeartPulse,
  Transportation: Car,
  Other: CircleDollarSign,
}

export function CategoryIcon({ category }: { category: Category }) {
  const Icon = icons[category] ?? CircleDollarSign
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 12,
      background: '#2e2e2e',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon size={18} color="#fff" />
    </div>
  )
}
