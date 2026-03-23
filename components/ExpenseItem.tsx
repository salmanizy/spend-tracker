'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Expense } from '@/types'
import { CategoryIcon } from './CategoryIcon'

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

interface Props {
  expense: Expense
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function ExpenseItem({ expense, onEdit, onDelete }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        background: hovered ? '#222' : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      <CategoryIcon category={expense.category} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#fff', fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {expense.description}
        </p>
        <p style={{ color: '#666', fontSize: 12, marginTop: 2 }}>
          {formatDate(expense.date)}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{formatIDR(expense.amount)}</p>
          <p style={{ color: '#555', fontSize: 11, marginTop: 2 }}>{expense.payment_method}</p>
        </div>

        {hovered && (
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => onEdit(expense)}
              style={{ width: 28, height: 28, background: '#2e2e2e', border: 'none', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Pencil size={12} color="#888" />
            </button>
            <button
              onClick={() => onDelete(expense.id)}
              style={{ width: 28, height: 28, background: '#2e2e2e', border: 'none', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Trash2 size={12} color="#e55" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
