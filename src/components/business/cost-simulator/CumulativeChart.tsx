"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts'

export type CumulativeLineData = {
  label: string
  jp: number
  fg: number
}

export default function CumulativeChart({ data }: { data: CumulativeLineData[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12, fontWeight: 600 }} />
        <YAxis
          tick={{ fontSize: 11 }}
          tickFormatter={(v: number) => `${v}万`}
          width={55}
        />
        <Tooltip
          content={({ active, payload, label }: any) => {
            if (!active || !payload || payload.length === 0) return null
            const jpItem = payload.find((p: any) => p.dataKey === 'jp')
            const fgItem = payload.find((p: any) => p.dataKey === 'fg')
            return (
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 13, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
                {jpItem && <div style={{ color: '#EF4444', marginBottom: 2 }}>日本人採用: {Math.round(jpItem.value)}万円</div>}
                {fgItem && <div style={{ color: '#2563EB' }}>外国人採用: {Math.round(fgItem.value)}万円</div>}
              </div>
            )
          }}
        />
        <Legend
          verticalAlign="top"
          height={36}
          formatter={(value: string) => <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{value}</span>}
        />
        <Area
          type="monotone"
          dataKey="jp"
          name="日本人採用（人件費＋採用・離職コスト）"
          stroke="#EF4444"
          strokeWidth={3}
          fill="#EF4444"
          fillOpacity={0.1}
          dot={{ r: 5, fill: '#EF4444', strokeWidth: 0 }}
          activeDot={{ r: 7 }}
        />
        <Area
          type="monotone"
          dataKey="fg"
          name="外国人採用（人件費＋管理費）"
          stroke="#2563EB"
          strokeWidth={3}
          fill="#2563EB"
          fillOpacity={0.1}
          dot={{ r: 5, fill: '#2563EB', strokeWidth: 0 }}
          activeDot={{ r: 7 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
