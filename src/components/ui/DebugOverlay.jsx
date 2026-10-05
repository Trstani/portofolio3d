import { useEffect, useState } from 'react'
import { getGlobalLogs } from '../../hooks/useDebugLogger'

export default function DebugOverlay() {
  const [visible, setVisible] = useState(true)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    if (!visible) return

    const interval = setInterval(() => {
      setLogs([...getGlobalLogs()])
    }, 100)

    return () => clearInterval(interval)
  }, [visible])

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          zIndex: 999999,
          padding: '8px 12px',
          background: '#333',
          color: '#fff',
          border: '1px solid #666',
          borderRadius: '4px',
          fontSize: '11px',
          cursor: 'pointer',
          pointerEvents: 'auto',
          fontFamily: 'monospace',
        }}
      >
        SHOW DEBUG
      </button>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 999998,
        width: 'min(320px, 90vw)',
        maxHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(0, 0, 0, 0.92)',
        border: '1px solid #00ff00',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#00ff00',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 8px',
          borderBottom: '1px solid #00ff00',
          background: 'rgba(0, 0, 0, 0.95)',
          pointerEvents: 'auto',
        }}
      >
        <span style={{ fontWeight: 'bold' }}>DEBUG</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => {
              setLogs([])
              getGlobalLogs().length = 0
            }}
            style={{
              padding: '2px 6px',
              background: '#333',
              color: '#00ff00',
              border: '1px solid #00ff00',
              borderRadius: '2px',
              fontSize: '9px',
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}
          >
            CLEAR
          </button>
          <button
            onClick={() => setVisible(false)}
            style={{
              padding: '2px 6px',
              background: '#333',
              color: '#00ff00',
              border: '1px solid #00ff00',
              borderRadius: '2px',
              fontSize: '9px',
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}
          >
            HIDE
          </button>
        </div>
      </div>

      {/* LOGS */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '6px 8px',
          display: 'flex',
          flexDirection: 'column-reverse',
          background: 'rgba(0, 0, 0, 0.85)',
          pointerEvents: 'none',
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: '#666' }}>waiting...</div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} style={{ lineHeight: '1.2', marginBottom: '2px' }}>
              <span style={{ color: '#00ff00', fontWeight: 'bold' }}>
                {log.timestamp}
              </span>
              <span style={{ color: '#88ff88', marginLeft: '4px' }}>
                {log.event}
              </span>
              {log.values && Object.keys(log.values).length > 0 && (
                <div
                  style={{
                    marginLeft: '12px',
                    color: '#88aa88',
                    fontSize: '9px',
                  }}
                >
                  {Object.entries(log.values)
                    .map(([k, v]) => {
                      if (v === null || v === undefined) return ''
                      if (typeof v === 'boolean') return `${k}: ${v ? 'T' : 'F'}`
                      if (typeof v === 'object') return ''
                      return `${k}: ${String(v).slice(0, 20)}`
                    })
                    .filter(Boolean)
                    .join(' | ')}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
