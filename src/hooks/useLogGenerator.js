import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addLog } from '../redux/logSlice.js'
import { triggerAlert } from '../redux/alertSlice.js'

const ERROR_TYPES = ['Login Error','DB Timeout','Auth Failure','Rate Limit','Null Pointer','Memory Leak','Network Error','Parse Error','Validation Error','SSL Error']
const SERVICES = ['api-gateway','auth-service','db-primary','cache-layer','payment-svc','notification-svc']
const LEVELS = ['ERROR','WARN','INFO','DEBUG']
const LEVEL_WEIGHTS = [0.25, 0.3, 0.35, 0.1]

function weightedLevel() {
  const r = Math.random()
  let acc = 0
  for (let i = 0; i < LEVELS.length; i++) {
    acc += LEVEL_WEIGHTS[i]
    if (r < acc) return LEVELS[i]
  }
  return 'INFO'
}

const MESSAGES = {
  ERROR: [
    'Connection refused at {service}: max retries exceeded',
    'NullPointerException in {service} handler at line 247',
    'Failed to authenticate user — token expired or invalid',
    'Database write failed: deadlock detected on users table',
    'Unhandled exception: Cannot read property of undefined',
    'Rate limit exceeded: 429 Too Many Requests from {service}',
    'SSL certificate validation failed for upstream {service}',
    'Heap memory limit reached — OOM killer invoked',
  ],
  WARN: [
    'High response latency detected on {service}: 1842ms',
    'Retry attempt 2/3 for {service} connection',
    'Cache miss rate above 40% — consider pre-warming',
    'Deprecated API endpoint called: /v1/user/info',
    'JWT token expiring in 5 minutes — refresh recommended',
    'Disk usage at 85% on /var/data partition',
    'Slow query detected: execution time 3.2s on users.findAll',
  ],
  INFO: [
    'User authentication successful for session #a8f3c',
    'Cache refreshed: 1,240 entries updated in 0.4s',
    'New deployment: v2.3.1 rolled out to 3 replicas',
    'Health check passed for all registered services',
    'Scheduled job completed: cleanup_old_tokens (0 errors)',
    'Request queue flushed: 842 items processed',
  ],
  DEBUG: [
    'Middleware chain: auth → validate → serialize → respond',
    'Trace: getUser(id=1042) → cache HIT, returning cached data',
    'SQL: SELECT * FROM sessions WHERE expires_at < NOW() LIMIT 100',
    'WebSocket ping/pong cycle completed in 12ms',
  ],
}

let logId = 1

export function useLogGenerator() {
  const dispatch = useDispatch()
  const rules = useSelector(s => s.alerts.rules)
  const counts = useSelector(s => {
    const map = {}
    s.logs.history.slice(0, 200).forEach(l => {
      map[l.errorType] = (map[l.errorType] || 0) + 1
    })
    return map
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const level = weightedLevel()
      const service = SERVICES[Math.floor(Math.random() * SERVICES.length)]
      const errorType = ERROR_TYPES[Math.floor(Math.random() * ERROR_TYPES.length)]
      const templates = MESSAGES[level]
      const msg = templates[Math.floor(Math.random() * templates.length)].replace('{service}', service)

      const log = {
        id: logId++,
        level,
        message: msg,
        service,
        errorType,
        timestamp: new Date().toISOString(),
        traceId: Math.random().toString(36).slice(2, 10).toUpperCase(),
      }

      dispatch(addLog(log))

      // Check alert rules
      rules.forEach(rule => {
        const cnt = (counts[rule.errorType] || 0) + (log.errorType === rule.errorType ? 1 : 0)
        if (cnt >= rule.threshold) {
          dispatch(triggerAlert({ rule, count: cnt, logId: log.id }))
        }
      })
    }, 600)

    return () => clearInterval(interval)
  }, [dispatch, rules, counts])
}
