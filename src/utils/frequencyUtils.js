export function computeFrequency(logs) {
  const map = {}
  logs.forEach(log => {
    const key = log.errorType || 'Unknown'
    if (!map[key]) map[key] = { type: key, count: 0, levels: {} }
    map[key].count++
    map[key].levels[log.level] = (map[key].levels[log.level] || 0) + 1
  })
  return Object.values(map).sort((a, b) => b.count - a.count)
}

export function computeTimeSeries(logs, buckets = 12) {
  if (!logs.length) return []
  const now = Date.now()
  const windowMs = 60 * 1000
  const bucketMs = windowMs / buckets
  const series = Array.from({ length: buckets }, (_, i) => ({
    t: new Date(now - (buckets - i - 1) * bucketMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    ERROR: 0, WARN: 0, INFO: 0, DEBUG: 0,
  }))
  logs.forEach(log => {
    const age = now - new Date(log.timestamp).getTime()
    const idx = Math.floor((windowMs - age) / bucketMs)
    if (idx >= 0 && idx < buckets && series[idx]) {
      series[idx][log.level] = (series[idx][log.level] || 0) + 1
    }
  })
  return series
}
