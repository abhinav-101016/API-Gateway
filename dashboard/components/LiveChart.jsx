export default function LiveChart({ data }) {
  const max = Math.max(...data.map(d => d.count), 1)

  return (
    <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-3.5 mb-0">
      <div className="text-[10px] text-[#8b949e] uppercase tracking-widest mb-3">
        requests / second
      </div>
      <div className="flex items-end gap-0.5 h-20">
        {data.map((d, i) => {
          const height = Math.max((d.count / max) * 100, 3)
          const color = d.isBlocked
            ? 'bg-[#d29922]'
            : d.hasError
            ? 'bg-[#f85149]'
            : 'bg-[#1f6feb]'
          return (
            <div
              key={i}
              className={`flex-1 rounded-t-sm opacity-85 transition-all duration-200 ${color}`}
              style={{ height: `${height}%` }}
            />
          )
        })}
      </div>
    </div>
  )
}