import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { undoFilter, redoFilter } from './redux/filterSlice.js'
import { ServerProvider } from './context/ServerContext.jsx'
import { useLogGenerator } from './hooks/useLogGenerator.js'
import LiveLogStream from './components/LiveLogStream.jsx'
import ErrorFilterPanel from './components/ErrorFilterPanel.jsx'
import AlertForm from './components/AlertForm.jsx'
import VirtualizedLogHistory from './components/VirtualizedLogHistory.jsx'
import FrequencyTracker from './components/FrequencyTracker.jsx'
import ServerStatusHub from './components/ServerStatusHub.jsx'
import GraphErrorBoundary from './components/GraphErrorBoundary.jsx'
import ErrorFrequencyChart from './components/ErrorFrequencyChart.jsx'
import RegexSearch from './components/RegexSearch.jsx'
import { Activity } from 'lucide-react'

function AppInner() {
  useLogGenerator()
  const dispatch = useDispatch()
  const [crashMode, setCrashMode] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); dispatch(undoFilter()) }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); dispatch(redoFilter()) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dispatch])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Topbar */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', height: 48,
        background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={14} color="#0a0b0e" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>SentryFlow</div>
            <div style={{ fontSize: 9.5, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Console</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 2, marginLeft: 16 }}>
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'history',   label: 'Log History' },
            { id: 'search',    label: 'Regex Search' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '5px 14px', borderRadius: 'var(--radius)', fontSize: 12, fontWeight: 500,
                background: activeTab === tab.id ? 'var(--bg-hover)' : 'transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                border: `1px solid ${activeTab === tab.id ? 'var(--border-bright)' : 'transparent'}`,
                transition: 'all 0.15s',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', animation: 'pulse 2s infinite', display: 'inline-block' }} />
            LIVE
          </span>
          <span style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>v2.3.1-prod</span>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 'dashboard' && <DashboardView crashMode={crashMode} onToggleCrash={() => setCrashMode(m => !m)} />}
        {activeTab === 'history' && (
          <div style={{ padding: 14, height: '100%', boxSizing: 'border-box' }}>
            <VirtualizedLogHistory />
          </div>
        )}
        {activeTab === 'search' && (
          <div style={{ padding: 14, height: '100%', boxSizing: 'border-box' }}>
            <RegexSearch />
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0,255,136,0.4); } 50% { opacity: 0.7; box-shadow: 0 0 0 5px rgba(0,255,136,0); } }
      `}</style>
    </div>
  )
}

function DashboardView({ crashMode, onToggleCrash }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '280px 1fr 280px',
      gridTemplateRows: '1fr 260px',
      gap: 10, padding: 10,
      height: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Left column */}
      <div style={{ gridRow: '1 / 3', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ flex: 1, minHeight: 0 }}><ErrorFilterPanel /></div>
        <div style={{ flex: 1, minHeight: 0 }}><AlertForm /></div>
      </div>

      {/* Center top: Live stream */}
      <div style={{ minHeight: 0 }}><LiveLogStream /></div>

      {/* Right column */}
      <div style={{ gridRow: '1 / 3', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ flex: 1, minHeight: 0 }}><ServerStatusHub /></div>
        <div style={{ flex: 1, minHeight: 0 }}><FrequencyTracker /></div>
      </div>

      {/* Center bottom: Chart with Error Boundary */}
      <GraphErrorBoundary crashMode={crashMode} onToggleCrash={onToggleCrash}>
        <ErrorFrequencyChart crashMode={crashMode} />
      </GraphErrorBoundary>
    </div>
  )
}

export default function App() {
  return (
    <ServerProvider>
      <AppInner />
    </ServerProvider>
  )
}
