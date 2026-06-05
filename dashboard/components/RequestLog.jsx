const methodColors = {
  GET:    'text-[#79c0ff]',
  POST:   'text-[#56d364]',
  PUT:    'text-[#d29922]',
  DELETE: 'text-[#f85149]',
  PATCH:  'text-[#bc8cff]'
}

function StatusBadge({ status }) {
  if (status >= 500) return (
    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a0e0e] text-[#f85149] border border-[#3d1515] font-medium">
      {status}
    </span>
  )
  if (status >= 400) return (
    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2d1a0e] text-[#d29922] border border-[#3d2510] font-medium">
      {status}
    </span>
  )
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0d2817] text-[#3fb950] border border-[#1a4228] font-medium">
      {status}
    </span>
  )
}

export default function RequestLog({ logs }) {
  return (
    <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-3.5 mb-2.5">
      <div className="flex justify-between items-center mb-3">
        <div className="text-[10px] text-[#8b949e] uppercase tracking-widest">
          live request log
        </div>
        <span className="text-[10px] text-[#484f58]">last 50 requests</span>
      </div>
      {logs.length === 0 && (
        <div className="text-xs text-[#484f58]">waiting for requests...</div>
      )}
      {logs.map((log, i) => (
        <div key={i} className="flex items-center gap-2.5 py-1.5 border-b border-[#21262d] last:border-0 text-xs">
          <span className="text-[#484f58] w-16 shrink-0">
            {new Date(log.timeStamp).toLocaleTimeString()}
          </span>
          <span className={`w-9 font-medium shrink-0 ${methodColors[log.method] || 'text-[#e6edf3]'}`}>
            {log.method}
          </span>
          <span className="text-[#8b949e] flex-1 font-mono truncate">{log.url}</span>
          
          <StatusBadge status={log.status} />
          <span className="text-[#8b949e]  font-mono truncate">{log.userId}</span>
          <span className="text-[#484f58] w-9 text-right shrink-0">{log.duration}ms</span>
          
        </div>
      ))}
    </div>
  )
}