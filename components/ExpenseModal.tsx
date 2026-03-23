'use client'

import { useState, useEffect } from 'react'
import { Expense, Category, PaymentMethod } from '@/types'

const CATEGORIES: Category[] = [
  'Food & Drinks', 'Shopping', 'Travel', 'Services',
  'Entertainment', 'Health', 'Transportation', 'Other',
]

interface Props {
  expense?: Expense | null
  onClose: () => void
  onSave: (data: Omit<Expense, 'id' | 'user_id' | 'created_at'>, id?: string) => Promise<void>
}

export function ExpenseModal({ expense, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'Food & Drinks' as Category,
    payment_method: 'Bank' as PaymentMethod,
    date: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (expense) {
      setForm({
        description: expense.description,
        amount: String(expense.amount),
        category: expense.category,
        payment_method: expense.payment_method,
        date: expense.date,
      })
    }
  }, [expense])

  const handleSubmit = async () => {
    if (!form.description || !form.amount || !form.date) {
      setError('Please fill all fields')
      return
    }
    setLoading(true)
    setError('')
    try {
      await onSave({
        description: form.description,
        amount: parseFloat(form.amount),
        category: form.category,
        payment_method: form.payment_method,
        date: form.date,
      }, expense?.id)
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      />

      {/* Sheet */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: 480,
        background: '#1c1c1c',
        borderRadius: '28px 28px 0 0',
        padding: '24px 20px 40px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button onClick={onClose} style={{ color: '#888', background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', padding: 4 }}>
            Cancel
          </button>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>
            {expense ? 'Edit Expense' : 'New Expense'}
          </span>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ color: loading ? '#555' : '#fff', background: 'none', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 4 }}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>

        {error && (
          <p style={{ color: '#e55', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{error}</p>
        )}

        {/* Form card */}
        <div style={{ background: '#242424', borderRadius: 18, overflow: 'hidden' }}>
          {/* Description */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #2e2e2e' }}>
            <input
              type="text"
              placeholder="Title"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, fontFamily: 'inherit' }}
            />
          </div>

          {/* Amount */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #2e2e2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#888', fontSize: 14 }}>Amount</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#888', fontSize: 14 }}>Rp</span>
              <input
                type="tel"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, textAlign: 'right', width: 140, fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Category */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #2e2e2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#888', fontSize: 14 }}>Category</span>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', appearance: 'none' }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} style={{ background: '#1c1c1c' }}>{c}</option>
              ))}
            </select>
          </div>

          {/* Payment */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #2e2e2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#888', fontSize: 14 }}>Payment</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['Bank', 'Cash'] as PaymentMethod[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setForm({ ...form, payment_method: m })}
                  style={{
                    padding: '4px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                    background: form.payment_method === m ? '#fff' : '#3a3a3a',
                    color: form.payment_method === m ? '#000' : '#888',
                    transition: 'all 0.15s',
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#888', fontSize: 14 }}>Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={{
                background: '#3a3a3a', border: 'none', outline: 'none',
                color: '#fff', fontSize: 13, borderRadius: 12,
                padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
