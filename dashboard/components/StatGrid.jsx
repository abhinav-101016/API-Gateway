function StatCard({label,value,valueClass,sub}){
    return(
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-3">
            <div className="text-[10px] text-[#8b949e] uppercase tracking-widest mb-1.5">
        {label}
      </div>
      <div className={`text-2xl font-medium tracking-tight ${valueClass || 'text-[#e6edf3]'}`}>
        {value}
      </div>
      <div className="text-[10px] text-[#8b949e] mt-1">{sub}</div>
        </div>
    )
}

export default function StatGrid({total,errorRate,blocked,avgDuration}){
    return(
        <div className="grid grid-cols-4 gap-2.5 mb-2.5">
            <StatCard
        label="total requests"
        value={total.toLocaleString()}
        sub="since session start"
      />
      <StatCard
        label="error rate"
        value={`${errorRate}%`}
        valueClass={parseFloat(errorRate) > 5 ? 'text-[#f85149]' : 'text-[#e6edf3]'}
        sub="4xx + 5xx responses"
      />
      <StatCard
        label="rate limited"
        value={blocked}
        valueClass={blocked > 0 ? 'text-[#d29922]' : 'text-[#e6edf3]'}
        sub="429 responses"
      />
      <StatCard
        label="avg latency"
        value={`${avgDuration}ms`}
        sub="across all routes"
      />
        </div>
    )
}