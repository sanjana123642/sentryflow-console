import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { togglePause, clearLive } from '../redux/logSlice.js'
import { Pause, Play, Trash2, Radio } from 'lucide-react'

const LEVEL_CLASS = { ERROR: 'error', WARN: 'warn', INFO: 'info', DEBUG: 'debug' }

function LogLine({ log }) {
  const ts = new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const cls = LEVEL_CLASS[log.level] || 'info'
  return (
    <div className={`log-line log-line--${cls}`}>
      <span className="log-ts">{ts}</span>
      <span className={`badge badge-${cls === 'error' ? 'error' : cls === 'warn' ? 'warn' : cls === 'debug' ? 'debug' : 'info'}`}>{log.level}</span>
      <span className="log-svc">[{log.service}]</span>
      <span className="log-msg">{log.message}</span>
      <span className="log-trace">#{log.traceId}</span>
    </div>
  )
}

export default function LiveLogStream() {
  const dispatch = useDispatch()
  const { live, paused } = useSelector(s => s.logs)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!paused && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [live, paused])

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title">
          <span className={`dot ${paused ? 'dot-paused' : ''}`} style={{ background: paused ? 'var(--accent-amber)' : undefined, boxShadow: paused ? '0 0 8px var(--accent-amber)' : undefined }} />
          Live Log Stream
          <span className="badge badge-info" style={{ marginLeft: 4 }}>{live.length}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost" onClick={() => dispatch(clearLive())}>
            <Trash2 size={12} /> Clear
          </button>
          <button
            className={`btn ${paused ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => dispatch(togglePause())}
          >
            {paused ? <><Play size={12} /> Resume</> : <><Pause size={12} /> Pause</>}
          </button>
        </div>
      </div>
      <div className="log-stream-body">
        {live.length === 0 && (
          <div className="log-empty">
            <Radio size={20} style={{ opacity: 0.3 }} />
            <span>Waiting for log events…</span>
          </div>
        )}
        {[...live].reverse().map(log => <LogLine key={log.id} log={log} />)}
        <div ref={bottomRef} />
      </div>

      <style>{`
        .log-stream-body {
          flex: 1;
          overflow-y: auto;
          padding: 6px 0;
          font-family: var(--font-mono);
          font-size: 11.5px;
        }
        .log-line {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 3px 12px;
          border-left: 2px solid transparent;
          transition: background 0.1s;
        }
        .log-line:hover { background: var(--bg-hover); }
        .log-line--error { border-left-color: var(--accent-red); }
        .log-line--warn  { border-left-color: var(--accent-amber); }
        .log-line--info  { border-left-color: var(--accent-cyan); }
        .log-line--debug { border-left-color: var(--accent-purple); }
        .log-ts   { color: var(--text-muted); flex-shrink: 0; font-size: 10.5px; }
        .log-svc  { color: var(--accent-cyan); opacity: 0.7; flex-shrink: 0; font-size: 10.5px; }
        .log-msg  { color: var(--text-primary); flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .log-trace{ color: var(--text-muted); flex-shrink: 0; font-size: 10px; }
        .log-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 32px;
          color: var(--text-muted);
          font-family: var(--font-sans);
        }
        .dot-paused { animation: none !important; }
      `}</style>
    </div>
  )
}
