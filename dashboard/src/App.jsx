import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import './App.css'

const socket = io('http://localhost:3000', {
  transports: ['polling', 'websocket']
})

function App() {
  const [connected, setConnected] = useState(false)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected to gateway:', socket.id)
      setConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from gateway')
      setConnected(false)
    })

    socket.on('connect_error', (err) => {
      console.log('❌ Connection error:', err.message)
    })

    socket.on('traffic', (data) => {
      console.log('Traffic event:', data)
      setLogs(prev => [data, ...prev].slice(0, 1500))
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
      socket.off('traffic')
    }
  }, [])

  return (
    <div>
      <h1>API Gateway Dashboard</h1>
      <p>Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      <div>
        {logs.map((log, i) => (
          <div key={i}>
            {log.method} {log.url} {log.status} {log.duration}ms
          </div>
        ))}
      </div>
    </div>
  )
}

export default App