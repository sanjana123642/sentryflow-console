import React from 'react'
import { useServers } from '../context/ServerContext.jsx'
import { Server, Wifi, WifiOff, AlertCircle } from 'lucide-react'

const STATUS_CONFIG = {
  healthy:  { color: 'var(--accent-green)',  icon: Wifi,        label: 'Healthy'  },
  degraded: { color: 'var(--accent-amber)',  icon: AlertCircle, label: 'Degraded' },
  down:     { color: 'var(--accent-red)',    icon: WifiOff,     label: 'Down'     },
}

function StatusDot({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.healthy
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: cfg.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, boxShadow: `0 0 6px ${cfg.color}`, display: 'inline-block' }} />
      {cfg.label}
    </span>
  )
}

export default function ServerStatusHub() {
  const { servers } = useServers()

  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <div className="panel-title">
          <Server size={11} style={{ color: 'var(--accent-cyan)' }} />
          Server Status Hub
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 10.5 }}>
          <span style={{ color: 'var(--accent-green)' }}>●{servers.filter(s => s.status === 'healthy').length} up</span>
          <span style={{ color: 'var(--accent-amber)' }}>●{servers.filter(s => s.status === 'degraded').length} deg</span>
          <span style={{ color: 'var(--accent-red)' }}>●{servers.filter(s => s.status === 'down').length} dn</span>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {servers.map(server => (
          <div key={server.id} style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--border)',
            background: server.status === 'down' ? 'rgba(255,59,92,0.04)' : server.status === 'degraded' ? 'rgba(255,179,0,0.04)' : 'transparent',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{server.name}</div>
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{server.id} · {server.region}</div>
              </div>
              <StatusDot status={server.status} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
              {[
                { label: 'RPS', value: server.rps.toLocaleString(), max: server.maxRPS, color: 'var(--accent-cyan)' },
                { label: 'Latency', value: `${server.latency}ms`, max: 500, raw: server.latency, color: server.latency > 200 ? 'var(--accent-amber)' : 'var(--accent-green)' },
                { label: 'Err Rate', value: `${server.errorRate}%`, max: 10, raw: server.errorRate, color: server.errorRate > 3 ? 'var(--accent-red)' : 'var(--accent-green)' },
              ].map(m => (
                <div key={m.label} style={{ background: 'var(--bg-raised)', borderRadius: 'var(--radius)', padding: '5px 8px' }}>
                  <div style={{ fontSize: 9.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{m.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: m.color }}>{m.value}</div>
                  <div style={{ height: 2, background: 'var(--border)', borderRadius: 1, marginTop: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, ((m.raw ?? server.rps) / m.max) * 100)}%`, background: m.color, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
