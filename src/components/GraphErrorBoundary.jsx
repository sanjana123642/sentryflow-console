import React, { Component } from 'react'
import { useSelector } from 'react-redux'
import { computeFrequency } from '../utils/frequencyUtils.js'
import { AlertTriangle, RefreshCw, BarChart2 } from 'lucide-react'

function TextFallback() {
  // We can't use hooks inside a class, so this is a separate functional component
  return <TextFallbackInner />
}

function TextFallbackInner() {
  const logs = useSelector(s => s.logs.history)
  const freq = computeFrequency(logs).slice(0, 5)
  const total = logs.length
  const errCount = logs.filter(l => l.level === 'ERROR').length

  return (
    <div style={{ padding: 12, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 8, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Text Summary (chart unavailable)</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        {[
          { label: 'Total Logs', value: total.toLocaleString(), color: 'var(--accent-cyan)' },
          { label: 'Errors', value: errCount.toLocaleString(), color: 'var(--accent-red)' },
          { label: 'Error Rate', value: total ? `${((errCount/total)*100).toFixed(1)}%` : '0%', color: 'var(--accent-amber)' },
          { label: 'Types', value: freq.length, color: 'var(--accent-purple)' },
        ].map(m => (
          <div key={m.label} style={{ padding: '6px 8px', background: 'var(--bg-raised)', borderRadius: 'var(--radius)' }}>
            <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{m.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginBottom: 4 }}>Top Error Types:</div>
      {freq.map((item, i) => (
        <div key={item.type} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
          <span style={{ color: 'var(--text-muted)', width: 14 }}>#{i+1}</span>
          <span style={{ flex: 1 }}>{item.type}</span>
          <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>{item.count}</span>
        </div>
      ))}
    </div>
  )
}

export default class GraphErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('GraphErrorBoundary caught:', error, info)
  }

  render() {
    const { hasError, error } = this.state
    const { children, crashMode, onToggleCrash } = this.props

    return (
      <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="panel-header">
          <div className="panel-title">
            {hasError
              ? <><AlertTriangle size={11} style={{ color: 'var(--accent-red)' }} /> Chart — Crashed</>
              : <><BarChart2 size={11} style={{ color: 'var(--accent-purple)' }} /> Error Frequency Chart</>
            }
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className={`btn ${crashMode ? 'btn-danger' : 'btn-ghost'}`}
              onClick={onToggleCrash}
              style={{ fontSize: 10.5 }}
            >
              {crashMode ? '💥 Crash ON' : 'Simulate Crash'}
            </button>
            {hasError && (
              <button className="btn btn-ghost" onClick={() => this.setState({ hasError: false, error: null })}>
                <RefreshCw size={11} /> Recover
              </button>
            )}
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {hasError ? (
            <div style={{ height: '100%', overflow: 'auto' }}>
              <div style={{ margin: 12, padding: '8px 12px', background: 'var(--accent-red-dim)', border: '1px solid rgba(255,59,92,0.3)', borderRadius: 'var(--radius)', fontSize: 11, color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
                <AlertTriangle size={11} style={{ display: 'inline', marginRight: 5 }} />
                {error?.message || 'Chart component threw an error'}
              </div>
              <TextFallback />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    )
  }
}
