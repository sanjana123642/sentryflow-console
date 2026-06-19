import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { buildRegex, highlightMatches } from '../utils/regexUtils.js'
import { Search, X, BookOpen } from 'lucide-react'

const PRESETS = [
  { label: 'All Errors',    pattern: 'error|fail|exception', flags: 'i' },
  { label: 'Auth Issues',   pattern: '(auth|login|token|jwt)', flags: 'i' },
  { label: 'DB Related',    pattern: '(db|database|sql|query|deadlock)', flags: 'i' },
  { label: 'Network',       pattern: '(timeout|connection|refused|502|503)', flags: 'i' },
  { label: 'Memory',        pattern: '(memory|heap|oom|leak)', flags: 'i' },
  { label: 'Trace IDs',     pattern: '[A-Z0-9]{8}', flags: '' },
]

export default function RegexSearch() {
  const logs = useSelector(s => s.logs.history)
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('i')
  const [showPresets, setShowPresets] = useState(false)

  const regex = useMemo(() => buildRegex(pattern, flags), [pattern, flags])
  const isValid = !pattern || regex !== null

  const matches = useMemo(() => {
    if (!regex) return []
    return logs.filter(l => regex.test(l.message + ' ' + l.service + ' ' + l.errorType)).slice(0, 50)
  }, [logs, regex])

  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <div className="panel-title">
          <Search size={11} style={{ color: 'var(--accent-cyan)' }} />
          Regex Search
          {pattern && regex && <span className="badge badge-info">{matches.length} matches</span>}
        </div>
        <button className="btn btn-ghost" onClick={() => setShowPresets(p => !p)} style={{ fontSize: 10.5 }}>
          <BookOpen size={11} /> Presets
        </button>
      </div>

      {showPresets && (
        <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {PRESETS.map(p => (
            <button key={p.label} className="btn btn-ghost" style={{ fontSize: 10.5, padding: '3px 8px' }}
              onClick={() => { setPattern(p.pattern); setFlags(p.flags); setShowPresets(false) }}>
              {p.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>/</span>
          <input value={pattern} onChange={e => setPattern(e.target.value)}
            placeholder="pattern…"
            style={{ width: '100%', padding: '6px 28px', fontFamily: 'var(--font-mono)', fontSize: 12, borderColor: !isValid ? 'var(--accent-red)' : undefined }} />
          <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>/</span>
        </div>
        <input value={flags} onChange={e => setFlags(e.target.value)}
          placeholder="i"
          style={{ width: 40, padding: '6px 8px', fontFamily: 'var(--font-mono)', fontSize: 12, textAlign: 'center' }}
          maxLength={4} />
        {pattern && <button onClick={() => setPattern('')} style={{ color: 'var(--text-muted)', padding: 4 }}><X size={13} /></button>}
      </div>

      {!isValid && (
        <div style={{ padding: '4px 12px', fontSize: 10.5, color: 'var(--accent-red)', borderBottom: '1px solid var(--border)', background: 'var(--accent-red-dim)' }}>
          Invalid regex — check your pattern syntax
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
        {!pattern && (
          <div style={{ padding: 16, color: 'var(--text-muted)', textAlign: 'center' }}>
            <Search size={18} style={{ opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
            Enter a regex pattern to search logs<br />
            <span style={{ fontSize: 10 }}>e.g. <code style={{ color: 'var(--accent-cyan)' }}>timeout|refused</code> or <code style={{ color: 'var(--accent-cyan)' }}>[A-Z]{'{8}'}</code></span>
          </div>
        )}
        {pattern && regex && matches.length === 0 && (
          <div style={{ padding: 16, color: 'var(--text-muted)', textAlign: 'center', fontSize: 12 }}>No matches found</div>
        )}
        {matches.map(log => {
          const ts = new Date(log.timestamp).toLocaleTimeString([], { hour12: false })
          const parts = highlightMatches(log.message, regex)
          return (
            <div key={log.id} style={{ padding: '5px 12px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginBottom: 2 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{ts}</span>
                <span className={`badge badge-${log.level === 'ERROR' ? 'error' : log.level === 'WARN' ? 'warn' : log.level === 'DEBUG' ? 'debug' : 'info'}`}>{log.level}</span>
                <span style={{ color: 'var(--text-muted)' }}>[{log.service}]</span>
              </div>
              <div style={{ color: 'var(--text-primary)' }}>
                {parts.map((p, i) =>
                  p.match
                    ? <mark key={i} style={{ background: 'rgba(0,212,255,0.25)', color: 'var(--accent-cyan)', borderRadius: 2, padding: '0 1px' }}>{p.text}</mark>
                    : <span key={i}>{p.text}</span>
                )}
              </div>
            </div>
          )
        })}
        {matches.length === 50 && pattern && (
          <div style={{ padding: 8, textAlign: 'center', fontSize: 10.5, color: 'var(--text-muted)' }}>Showing first 50 matches</div>
        )}
      </div>
    </div>
  )
}
