import React, { createContext, useContext, useState, useEffect } from 'react'

const ServerContext = createContext(null)

const SERVERS = [
  { id: 'api-01', name: 'API Gateway', region: 'us-east-1', maxRPS: 5000 },
  { id: 'db-01',  name: 'DB Primary',  region: 'us-east-1', maxRPS: 2000 },
  { id: 'auth-01',name: 'Auth Service', region: 'eu-west-1', maxRPS: 1000 },
  { id: 'cache-01',name: 'Redis Cache', region: 'ap-south-1',maxRPS: 10000 },
]

function randomStatus() {
  const r = Math.random()
  if (r > 0.9) return 'degraded'
  if (r > 0.97) return 'down'
  return 'healthy'
}

export function ServerProvider({ children }) {
  const [serverStats, setServerStats] = useState(() =>
    SERVERS.map(s => ({
      ...s,
      status: 'healthy',
      rps: Math.floor(Math.random() * s.maxRPS * 0.6),
      latency: Math.floor(Math.random() * 80) + 20,
      errorRate: parseFloat((Math.random() * 2).toFixed(2)),
      uptime: 99.9,
    }))
  )

  useEffect(() => {
    const id = setInterval(() => {
      setServerStats(prev => prev.map(s => ({
        ...s,
        status: randomStatus(),
        rps: Math.max(0, s.rps + Math.floor((Math.random() - 0.4) * 200)),
        latency: Math.max(5, s.latency + Math.floor((Math.random() - 0.5) * 15)),
        errorRate: parseFloat(Math.max(0, s.errorRate + (Math.random() - 0.5) * 0.3).toFixed(2)),
      })))
    }, 2500)
    return () => clearInterval(id)
  }, [])

  return (
    <ServerContext.Provider value={{ servers: serverStats }}>
      {children}
    </ServerContext.Provider>
  )
}

export function useServers() {
  return useContext(ServerContext)
}
