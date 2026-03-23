'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid,
} from 'recharts'
import { MonthlyTotal } from '@/types'

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(amount)
}

function formatK(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`
  return String(value)
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#2a2a2a', border: '1px solid #3a3a3a',
        borderRadius: 12, padding: '8px 12px',
      }}>
        <p style={{ color: '#888', fontSize: 11, marginBottom: 2 }}>{label}</p>
        <p style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{formatIDR(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

interface Props {
  data: MonthlyTotal[]
  totalAllTime: number
  selectedMonth: string | null
  onSelectMonth: (month: string | null) => void
}

export function MonthlyChart({ data, totalAllTime, selectedMonth, onSelectMonth }: Props) {
  const latestMonth = data[data.length - 1]?.month ?? ''

  // ← pakai onClick di Bar, bukan di BarChart
  const handleBarClick = (barData: any) => {
    const clicked = barData?.month
    if (!clicked) return
    onSelectMonth(selectedMonth === clicked ? null : clicked)
  }

  return (
    <div style={{ background: '#1c1c1c', borderRadius: 24, padding: 20, marginBottom: 24 }}>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>Spent all time</p>
      <p style={{ color: '#fff', fontSize: 36, fontWeight: 700, letterSpacing: -1, marginBottom: selectedMonth ? 8 : 24 }}>
        {formatIDR(totalAllTime)}
      </p>

      {selectedMonth && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{selectedMonth}</span>
          <button
            onClick={() => onSelectMonth(null)}
            style={{
              background: '#2e2e2e', border: 'none', borderRadius: 20,
              padding: '3px 10px', color: '#888', fontSize: 11,
              cursor: 'pointer',
            }}
          >
            ✕ Reset
          </button>
        </div>
      )}

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          barSize={28}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          style={{ cursor: 'pointer' }}
        >
          <CartesianGrid vertical={false} stroke="#2a2a2a" strokeDasharray="0" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#555', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatK}
            tick={{ fill: '#555', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickCount={5}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.06)' }}
          />
          {/* ← onClick pindah ke sini */}
          <Bar dataKey="total" radius={[6, 6, 0, 0]} onClick={handleBarClick}>
            {data.map((entry) => (
              <Cell
                key={entry.month}
                fill={
                  selectedMonth
                    ? entry.month === selectedMonth ? '#ffffff' : '#2e2e2e'
                    : entry.month === latestMonth ? '#ffffff' : '#2e2e2e'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}