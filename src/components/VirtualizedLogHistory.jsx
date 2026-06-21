import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { buildRegex, highlightMatches } from '../utils/regexUtils.js'
import { Database, Search } from 'lucide-react'

const ROW_HEIGHT = 26
const LEVEL_COLOR = { ERROR: 'var(--accent-red)', WARN: 'var(--accent-amber)', INFO: 'var(--accent-cyan)', DEBUG: 'var(--accent-purple)' }

function HighlightedText({ text, regex }) {
  const parts = highlightMatches(text, regex)
  return (
    <span>
      {parts.map((p, i) =>
        p.match
          ? <mark key={i} style={{ background: 'rgba(255,179,0,0.35)', color: 'var(--accent-amber)', borderRadius: 2 }}>{p.text}</mark>
          : <span key={i}>{p.text}</span>
      )}
    </span>
  )
}

export default function VirtualizedLogHistory() {
  const allLogs = useSelector(s => s.logs.history)
  const activeFilters = useSelector(s => s.filters.active)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('ALL')

  const regex = useMemo(() => buildRegex(search), [search])
  const isValid = !search || regex !== null

  const filtered = useMemo(() => {
    return allLogs.filter(log => {
      if (activeFilters.length > 0 && !activeFilters.includes(log.errorType)) return false
      if (levelFilter !== 'ALL' && log.level !== levelFilter) return false
      if (regex && !regex.test(log.message + log.service + log.errorType)) return false
      return true
    })
  }, [allLogs, activeFilters, levelFilter, regex])

  const Row = ({ index, style }) => {
    const log = filtered[index]
    if (!log) return null
    const ts = new Date(log.timestamp).toLocaleTimeString([], { hour12: false })
    return (
      <div style={{ ...style, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 11 }}
        className="virt-row">
        <span style={{ color: 'var(--text-muted)', flexShrink: 0, fontSize: 10 }}>{ts}</span>
        <span style={{ color: LEVEL_COLOR[log.level], fontWeight: 700, width: 42, flexShrink: 0, fontSize: 10 }}>{log.level}</span>
        <span style={{ color: 'var(--text-muted)', flexShrink: 0, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>[{log.service}]</span>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
          <HighlightedText text={log.message} regex={regex} />
        </span>
      </div>
    )
  }

  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <div className="panel-title">
          <Database size={11} style={{ color: 'var(--accent-green)' }} />
          Log History
          <span className="badge badge-info">{filtered.length.toLocaleString()} / {allLogs.length.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['ALL','ERROR','WARN','INFO','DEBUG'].map(l => (
            <button key={l} onClick={() => setLevelFilter(l)}
              className="btn btn-ghost"
              style={{ padding: '3px 8px', fontSize: 10, background: levelFilter === l ? 'var(--bg-hover)' : undefined, borderColor: levelFilter === l ? 'var(--border-bright)' : undefined }}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'relative' }}>
          <Search size={12} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Filter by regex or text…"
            style={{ width: '100%', padding: '5px 10px 5px 28px', borderColor: !isValid ? 'var(--accent-red)' : undefined }} />
        </div>
        {!isValid && <div style={{ fontSize: 10.5, color: 'var(--accent-red)', marginTop: 3 }}>Invalid regex pattern</div>}
      </div>
      <div style={{ flex: 1 }}>
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 12 }}>No logs match current filters</div>
        ) : (
          <div style={{ height: '100%', width: '100%' }}>
            {Row}
          </div>
        )}
      </div>
      <style>{`.virt-row:hover { background: var(--bg-hover); }`}</style>
    </div>
  )
}
