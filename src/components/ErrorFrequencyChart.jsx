import React from 'react'
import { useSelector } from 'react-redux'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { computeTimeSeries } from '../utils/frequencyUtils.js'
import { BarChart2 } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '6px 10px', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color }}>{p.dataKey}: {p.value}</div>
      ))}
    </div>
  )
}

export default function ErrorFrequencyChart({ crashMode }) {
  const logs = useSelector(s => s.logs.history)
  const data = computeTimeSeries(logs)

  // If crashMode is on, throw to trigger the Error Boundary
  if (crashMode) throw new Error('Simulated chart render crash!')

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <defs>
              {[['ERROR','#ff3b5c'],['WARN','#ffb300'],['INFO','#00d4ff'],['DEBUG','#9d6fff']].map(([k,c]) => (
                <linearGradient key={k} id={`grad${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={c} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={c} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <XAxis dataKey="t" tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} interval={2} />
            <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
            {[['ERROR','#ff3b5c'],['WARN','#ffb300'],['INFO','#00d4ff'],['DEBUG','#9d6fff']].map(([k,c]) => (
              <Area key={k} type="monotone" dataKey={k} stroke={c} strokeWidth={1.5} fill={`url(#grad${k})`} dot={false} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
