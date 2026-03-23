'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
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
      <div style={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: 12, padding: '8px 12px' }}>
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
}

export function MonthlyChart({ data, totalAllTime }: Props) {
  const latestMonth = data[data.length - 1]?.month ?? ''

  return (
    <div style={{ background: '#1c1c1c', borderRadius: 24, padding: 20, marginBottom: 24 }}>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>Spent all time</p>
      <p style={{ color: '#fff', fontSize: 36, fontWeight: 700, letterSpacing: -1, marginBottom: 24 }}>
        {formatIDR(totalAllTime)}
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={32} margin={{ top: 0, right: 4, left: -24, bottom: 0 }}>
          <XAxis
            dataKey="month"
            tick={{ fill: '#666', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatK}
            tick={{ fill: '#555', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickCount={4}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.month} fill={entry.month === latestMonth ? '#ffffff' : '#2e2e2e'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
