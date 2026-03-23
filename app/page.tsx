'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, LogOut, Search, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Expense, MonthlyTotal } from '@/types'
import { AuthForm } from '@/components/AuthForm'
import { MonthlyChart } from '@/components/MonthlyChart'
import { ExpenseItem } from '@/components/ExpenseItem'
import { ExpenseModal } from '@/components/ExpenseModal'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'

function groupByMonth(expenses: Expense[]): MonthlyTotal[] {
  const map: Record<string, { total: number; date: Date }> = {}
  
  expenses.forEach((e) => {
    const d = new Date(e.date + 'T00:00:00')
    const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    if (!map[key]) {
      map[key] = { total: 0, date: new Date(d.getFullYear(), d.getMonth(), 1) }
    }
    map[key].total += e.amount
  })

  return Object.entries(map)
    .map(([month, { total, date }]) => ({ month, total, date }))
    .sort((a, b) => a.date.getTime() - b.date.getTime()) // ← sort pakai objek Date asli
    .slice(-6)
    .map(({ month, total }) => ({ month, total }))
}

export default function Home() {
  const supabase = createClient()

  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [allExpenses, setAllExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setAuthChecked(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token ?? ''}`,
    }
  }

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const res = await fetch('/api/expenses?all=true', { headers })
      const data = await res.json()
      const all: Expense[] = data.expenses || []

      // Filter 30 hari terakhir di client
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const recent = all.filter(e => new Date(e.date) >= thirtyDaysAgo)

      setAllExpenses(all)
      setExpenses(recent)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) fetchExpenses()
  }, [user, fetchExpenses])

  const handleSave = async (data: Omit<Expense, 'id' | 'user_id' | 'created_at'>, id?: string) => {
    const headers = await getAuthHeaders()
    if (id) {
      const res = await fetch(`/api/expenses/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
    } else {
      const res = await fetch('/api/expenses', { method: 'POST', headers, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
    }
    await fetchExpenses()
    setEditingExpense(null)
  }

  const handleDelete = async (id: string) => {
    setDeleteLoading(true)
    try {
      const headers = await getAuthHeaders()
      await fetch(`/api/expenses/${id}`, { method: 'DELETE', headers })
      await new Promise(resolve => setTimeout(resolve, 300)) // tunggu 300ms
      await fetchExpenses()
    } finally {
      setDeleteLoading(false)
      setDeletingId(null)
    }
  }

  const handleLogout = async () => { await supabase.auth.signOut() }

  const monthlyData = groupByMonth(allExpenses)
  const totalAllTime = allExpenses.reduce((s, e) => s + e.amount, 0)
  
  const filteredExpenses = (selectedMonth
    ? allExpenses.filter((e) => {
        const d = new Date(e.date + 'T00:00:00')
        const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        return key === selectedMonth
      })
    : expenses
  ).filter((e) =>
    e.description.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(debouncedQuery.toLowerCase())
  )

  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 24, height: 24, border: '2px solid #333', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  if (!user) return <AuthForm onSuccess={() => fetchExpenses()} />

  return (
    <div style={{ minHeight: '100vh', background: '#000000', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '56px 16px 100px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ background: '#1c1c1c', borderRadius: 20, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Expenses</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="#666">
              <path d="M5 7L1 3h8L5 7z" />
            </svg>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => { setShowSearch(!showSearch); setSearchQuery('') }}
              style={{ width: 36, height: 36, background: '#1c1c1c', border: 'none', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              {showSearch ? <X size={16} color="#fff" /> : <Search size={16} color="#fff" />}
            </button>
            <button
              onClick={handleLogout}
              style={{ width: 36, height: 36, background: '#1c1c1c', border: 'none', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <LogOut size={16} color="#fff" />
            </button>
          </div>
        </div>

        {/* Search */}
        {showSearch && (
          <div style={{ marginBottom: 16 }}>
            <input
              autoFocus
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 16, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}

        <MonthlyChart
          data={monthlyData}
          totalAllTime={totalAllTime}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
        />

        <p style={{ color: '#888', fontSize: 13, fontWeight: 500, marginBottom: 12 }}>
          {selectedMonth ? selectedMonth : debouncedQuery ? `Results for "${debouncedQuery}"` : 'Latest'}
        </p>

        {/* Expense list */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <div style={{ width: 24, height: 24, border: '2px solid #333', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p style={{ color: '#444', fontSize: 14 }}>No expenses found</p>
            <p style={{ color: '#333', fontSize: 12, marginTop: 4 }}>Tap + to add your first expense</p>
          </div>
        ) : (
          <div style={{ background: '#1c1c1c', borderRadius: 24, overflow: 'hidden' }}>
            {filteredExpenses.map((expense, i) => (
              <div key={expense.id} style={{ borderTop: i === 0 ? 'none' : '1px solid #262626' }}>
                <ExpenseItem
                  expense={expense}
                  onEdit={(e) => { setEditingExpense(e); setShowModal(true) }}
                  onDelete={(id) => setDeletingId(id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => { setEditingExpense(null); setShowModal(true) }}
        style={{
          position: 'fixed', bottom: 32,
          left: '50%', transform: 'translateX(-50%)',
          width: 56, height: 56, borderRadius: '50%',
          background: '#fff', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          transition: 'transform 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(-50%) scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'translateX(-50%) scale(1)')}
      >
        <Plus size={24} color="#000" />
      </button>

      {showModal && (
        <ExpenseModal
          expense={editingExpense}
          onClose={() => { setShowModal(false); setEditingExpense(null) }}
          onSave={handleSave}
        />
      )}

      {deletingId && (
        <DeleteConfirmModal
          onConfirm={() => handleDelete(deletingId)}
          onCancel={() => setDeletingId(null)}
          loading={deleteLoading}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}
