export default function TopBar({ connected }) {
  return (
    <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#21262d]">
      <div className="flex items-center gap-2.5">
        
        <div>
          <div className="text-sm text-[#e6edf3] font-medium">API-Gateway</div>
          <div className="text-xs text-[#8b949e]">v1.0.0 · port 3000</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-[#3fb950]' : 'bg-[#f85149]'}`} />
        <span className={`text-xs ${connected ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
          {connected ? 'live' : 'disconnected'}
        </span>
      </div>
    </div>
  )
}