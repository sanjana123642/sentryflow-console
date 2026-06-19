import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addRule, removeRule } from '../redux/alertSlice.js'
import { formatAlertTime } from '../utils/alertUtils.js'
import { Bell, BellOff, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'

const ERROR_TYPES = ['Login Error','DB Timeout','Auth Failure','Rate Limit','Null Pointer','Memory Leak','Network Error','Parse Error','Validation Error','SSL Error']
const CHANNELS = ['Email','Slack','PagerDuty','Webhook']

export default function AlertForm() {
  const dispatch = useDispatch()
  const { rules, triggered } = useSelector(s => s.alerts)
  const [form, setForm] = useState({ errorType: ERROR_TYPES[0], threshold: 5, channel: 'Email', recipient: '' })
  const [saved, setSaved] = useState(false)

  function handleSubmit() {
    if (!form.recipient.trim()) return
    dispatch(addRule(form))
    setForm(f => ({ ...f, recipient: '' }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <div className="panel-title">
          <Bell size={11} style={{ color: 'var(--accent-amber)' }} />
          Alert Setup
        </div>
        <span className="badge badge-warn">{rules.length} rules</span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Form */}
        <div style={{ display: 'grid', gap: 8 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Error Type</span>
            <select value={form.errorType} onChange={e => setForm(f => ({ ...f, errorType: e.target.value }))} style={{ padding: '6px 10px' }}>
              {ERROR_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Threshold</span>
              <input type="number" min={1} max={1000} value={form.threshold}
                onChange={e => setForm(f => ({ ...f, threshold: +e.target.value }))}
                style={{ padding: '6px 10px' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Channel</span>
              <select value={form.channel} onChange={e => setForm(f => ({ ...f, channel: e.target.value }))} style={{ padding: '6px 10px' }}>
                {CHANNELS.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recipient</span>
            <input value={form.recipient} onChange={e => setForm(f => ({ ...f, recipient: e.target.value }))}
              placeholder="you@company.com or #slack-channel"
              style={{ padding: '6px 10px' }} />
          </label>
          <button className="btn btn-primary" onClick={handleSubmit} style={{ justifyContent: 'center' }}>
            {saved ? <><CheckCircle size={12} /> Saved!</> : <><Bell size={12} /> Add Rule</>}
          </button>
        </div>

        {/* Rules list */}
        {rules.length > 0 && (
          <div>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Active Rules</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {rules.map(rule => (
                <div key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg-raised)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <Bell size={11} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rule.errorType}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>≥{rule.threshold} → {rule.channel}: {rule.recipient}</div>
                  </div>
                  <button onClick={() => dispatch(removeRule(rule.id))} style={{ color: 'var(--text-muted)', padding: 2 }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Triggered */}
        {triggered.length > 0 && (
          <div>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Recent Triggers</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 120, overflow: 'auto' }}>
              {triggered.slice(0, 10).map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11, color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
                  <AlertTriangle size={10} />
                  {formatAlertTime(t.time)} — {t.rule.errorType} ({t.count} hits)
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
