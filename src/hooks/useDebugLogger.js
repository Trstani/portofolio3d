import { useState, useCallback, useRef } from 'react'

const MAX_LOGS = 30
let globalLogs = []

export function useDebugLogger() {
  const [logs, setLogs] = useState([])
  const logsRef = useRef([])

  const addLog = useCallback((timestamp, event, values) => {
    const logEntry = {
      timestamp: timestamp.toFixed(2),
      event,
      values,
    }

    logsRef.current = [logEntry, ...logsRef.current].slice(0, MAX_LOGS)
    globalLogs = logsRef.current
    setLogs([...logsRef.current])
  }, [])

  const clearLogs = useCallback(() => {
    logsRef.current = []
    globalLogs = []
    setLogs([])
  }, [])

  const getLogs = useCallback(() => {
    return logsRef.current
  }, [])

  return { logs, addLog, clearLogs, getLogs }
}

export function getGlobalLogs() {
  return globalLogs
}

export function addGlobalLog(timestamp, event, values) {
  const logEntry = {
    timestamp: timestamp.toFixed(2),
    event,
    values,
  }
  globalLogs = [logEntry, ...globalLogs].slice(0, MAX_LOGS)
}
