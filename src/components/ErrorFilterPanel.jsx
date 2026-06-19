import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleFilter, undoFilter, redoFilter, clearFilters } from '../redux/filterSlice.js'
import { computeFrequency } from '../utils/frequencyUtils.js'
import { Undo2, Redo2, FilterX, Filter } from 'lucide-react'

const ERROR_TYPES = ['Login Error','DB Timeout','Auth Failure','Rate Limit','Null Pointer','Memory Leak','Network Error','Parse Error','Validation Error','SSL Error']

export default function ErrorFilterPanel() {
  const dispatch = useDispatch()
  const { active, history, future } = useSelector(s => s.filters)
  const logs = useSelector(s => s.logs.history)
  const freq = computeFrequency(logs)
  const freqMap = Object.fromEntries(freq.map(f => [f.type, f.count]))

  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <div className="panel-title">
          <span className="dot" style={{ background: 'var(--accent-purple)', boxShadow: '0 0 8px var(--accent-purple)' }} />
          Error Filters
          {active.length > 0 && <span className="badge badge-warn">{active.length} active</span>}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn btn-ghost" onClick={() => dispatch(undoFilter())} disabled={history.length === 0} title="Undo">
            <Undo2 size={12} />
          </button>
          <button className="btn btn-ghost" onClick={() => dispatch(redoFilter())} disabled={future.length === 0} title="Redo">
            <Redo2 size={12} />
          </button>
          <button className="btn btn-ghost" onClick={() => dispatch(clearFilters())} disabled={active.length === 0}>
            <FilterX size={12} /> Clear
          </button>
        </div>
      </div>
      <div className="panel-body" style={{ flex: 1, overflow: 'auto' }}>
        {active.length > 0 && (
          <div style={{ marginBottom: 10, padding: '6px 8px', background: 'var(--accent-purple-dim)', borderRadius: 'var(--radius)', border: '1px solid rgba(157,111,255,0.2)', fontSize: 11, color: 'var(--accent-purple)' }}>
            <Filter size={10} style={{ display: 'inline', marginRight: 4 }} />
            Showing: {active.join(', ')}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {ERROR_TYPES.map(type => {
            const cnt = freqMap[type] || 0
            const isActive = active.includes(type)
            const pct = freq.length ? Math.round((cnt / (freq[0]?.count || 1)) * 100) : 0
            return (
              <button
                key={type}
                onClick={() => dispatch(toggleFilter(type))}
                className="filter-chip"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 10px',
                  borderRadius: 'var(--radius)',
                  border: `1px solid ${isActive ? 'var(--accent-purple)' : 'var(--border)'}`,
                  background: isActive ? 'var(--accent-purple-dim)' : 'var(--bg-raised)',
                  cursor: 'pointer', width: '100%', textAlign: 'left',
                  transition: 'all 0.15s', position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${pct}%`, background: isActive ? 'rgba(157,111,255,0.1)' : 'rgba(255,255,255,0.02)',
                  transition: 'width 0.4s ease',
                }} />
                <span style={{ flex: 1, fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--accent-purple)' : 'var(--text-primary)', position: 'relative', zIndex: 1 }}>
                  {type}
                </span>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: cnt > 0 ? 'var(--text-secondary)' : 'var(--text-muted)', position: 'relative', zIndex: 1 }}>
                  {cnt}
                </span>
              </button>
            )
          })}
        </div>
        <div style={{ marginTop: 10, fontSize: 10.5, color: 'var(--text-muted)', display: 'flex', gap: 8, justifyContent: 'center' }}>
          <kbd style={{ padding: '1px 5px', border: '1px solid var(--border)', borderRadius: 3, fontFamily: 'var(--font-mono)' }}>Ctrl+Z</kbd> Undo ·
          <kbd style={{ padding: '1px 5px', border: '1px solid var(--border)', borderRadius: 3, fontFamily: 'var(--font-mono)' }}>Ctrl+Y</kbd> Redo
        </div>
      </div>
    </div>
  )
}
