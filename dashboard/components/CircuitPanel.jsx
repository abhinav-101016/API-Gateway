import { useState,useEffect } from "react"
const services = [
  { key: 'user-service',    label: 'user-service',    port: '4001' },
  { key: 'product-service', label: 'product-service', port: '4002' },
  { key: 'order-service',   label: 'order-service',   port: '4003' },
]

function stateColor(state) {
  if (state === 'OPEN')      return { text: 'text-[#f85149]', dot: 'bg-[#f85149]' }
  if (state === 'HALF-OPEN') return { text: 'text-[#d29922]', dot: 'bg-[#d29922]' }
  return                  { text: 'text-[#3fb950]', dot: 'bg-[#3fb950]' }
}

export default function CircuitPanel({ circuits }) {
     const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {services.map(({ key, label, port }) => {
        const breaker = circuits[key] || { state: 'CLOSED', failureCount: 0 }
        const colors = stateColor(breaker.state)
        return (
          <div key={key} className="bg-[#161b22] border border-[#21262d] rounded-lg p-3">
            <div className="text-[10px] text-[#8b949e] uppercase tracking-widest mb-2">
              {label} :{port}
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
              
              
              <span className={`text-xs font-medium ${colors.text}`}>
                {breaker.state}
              </span>
              {breaker.state==='OPEN'&& <span className={`text-xs font-medium ${colors.text}`}>
                Retry After:
                {Math.max(Math.ceil((breaker.nextRetryTime-now)/1000),0)} secs
              </span>}
            </div>
            <div className="text-[10px] text-[#484f58] mt-1">
              failures: {breaker.failureCount || 0}
            </div>
          </div>
        )
      })}
    </div>
  )
}