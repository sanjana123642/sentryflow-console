import React from 'react'
import { useSelector } from 'react-redux'
import { computeFrequency } from '../utils/frequencyUtils.js'
import { TrendingUp } from 'lucide-react'

const LEVEL_COLORS = { ERROR: 'var(--accent-red)', WARN: 'var(--accent-amber)', INFO: 'var(--accent-cyan)', DEBUG: 'var(--accent-purple)' }

export default function FrequencyTracker() {
  const logs = useSelector(s => s.logs.history)
  const freq = computeFrequency(logs)
  const max = freq[0]?.count || 1

  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <div className="panel-title">
          <TrendingUp size={11} style={{ color: 'var(--accent-green)' }} />
          Frequency Tracker
        </div>
        <span style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{logs.length} total</span>
      </div>
      <div className="panel-body" style={{ flex: 1, overflow: 'auto' }}>
        {freq.length === 0 && (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0', fontSize: 12 }}>Collecting data…</div>
        )}
        {freq.map((item, idx) => {
          const pct = (item.count / max) * 100
          const dominantLevel = Object.entries(item.levels).sort((a,b) => b[1]-a[1])[0]?.[0] || 'INFO'
          const barColor = LEVEL_COLORS[dominantLevel]
          return (
            <div key={item.type} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', width: 14 }}>#{idx+1}</span>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{item.type}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {Object.entries(item.levels).map(([lvl, cnt]) => (
                    <span key={lvl} style={{ fontSize: 10, color: LEVEL_COLORS[lvl], fontFamily: 'var(--font-mono)' }}>{lvl[0]}{cnt}</span>
                  ))}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: barColor }}>{item.count}</span>
                </div>
              </div>
              <div style={{ height: 4, background: 'var(--bg-raised)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 2, transition: 'width 0.4s ease', boxShadow: `0 0 6px ${barColor}` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
