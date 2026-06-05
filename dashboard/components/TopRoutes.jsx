export default function TopRoutes({ routes }) {
  const sorted = Object.entries(routes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const max = sorted[0]?.[1] || 1

  return (
    <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-3.5">
      <div className="text-[10px] text-[#8b949e] uppercase tracking-widest mb-3">
        top routes
      </div>
      {sorted.length === 0 && (
        <div className="text-xs text-[#484f58]">waiting for requests...</div>
      )}
      {sorted.map(([path, count]) => (
        <div key={path} className="flex items-center gap-2 py-1.5 border-b border-[#21262d] last:border-0">
          <span className="text-xs text-[#79c0ff] flex-1 font-mono">{path}</span>
          <div className="w-14 h-0.5 bg-[#21262d] rounded-full">
            <div
              className="h-0.5 bg-[#1f6feb] rounded-full"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
          <span className="text-xs text-[#8b949e] w-7 text-right">{count}</span>
        </div>
      ))}
    </div>
  )
}