import { useState, useEffect } from 'react'
import socket from './socket'
import TopBar from '../components/TopBar'
import StatGrid from '../components/StatGrid'
import LiveChart from '../components/LiveChart'
import TopRoutes from '../components/TopRoutes'
import RequestLog from '../components/RequestLog'
import CircuitPanel from '../components/CircuitPanel'



function App() {
  const [connected, setConnected] = useState(false)
  const [logs, setLogs] = useState([])
  const [stats,setStats]=useState({
    total: 0, errors: 0, blocked: 0, totalDuration: 0

  })

  const [chartData,setChartData]=useState(
    Array(20).fill({count:0,hasError:false,isBlocked:false})
  )
  const [routes, setRoutes] = useState({})
  const [circuits, setCircuits] = useState({})


  useEffect(() => {

  fetch('http://localhost:3000/metrics').then(
    r=>r.json()).then(historicalLogs=>{
      if(!historicalLogs.length){
        return
      }
      setLogs(historicalLogs.slice(0,50))
      let total=0,errors=0,
      blocked=0,totalDuration=0
      const routeCounts={}
      historicalLogs.forEach(log => {
        total++
        if(log.status>=400) errors++
        if(log.status===429) blocked++
        totalDuration+=log.duration

        const route='/'+log.url.split('/')[1]
        routeCounts[route]=(routeCounts[route]||0)+1

        
      })
      setStats({total,errors,blocked,totalDuration})
      setRoutes(routeCounts)

    }).catch(err=>console.log('metrics fetch failed:',err.message))



    socket.on('connect', () => {
      
      setConnected(true)
    })

    socket.on('disconnect', () => {
     
      setConnected(false)
    })

    socket.on('connect_error', (err) => {
      console.log('❌ Connection error:', err.message)
    })

    socket.on('traffic', (data) => {
      
      setLogs(prev => [data, ...prev].slice(0, 50))
      setStats(prev=>({
        total:prev.total+1,
        errors:data.status>=400?prev.errors+1:prev.errors,
        blocked:data.status===429?prev.blocked+1:prev.blocked,
        totalDuration:prev.totalDuration+data.duration
      }
    
    
    )
  
  
  )

  setChartData(prev=>[...prev.slice(1),{
    count:1,
    hasError:data.status>=400,
    isBlocked:data.status===429
  }])
  const routeName = '/' + data.url.split('/')[1]
      setRoutes(prev => ({
        ...prev,
        [routeName]: (prev[routeName] || 0) + 1
      }))

      if (data.breakerStatus) setCircuits(data.breakerStatus)
    
    })

    

     

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
      socket.off('traffic')
    }
  }, [])

  const avgDuration = stats.total > 0 ? Math.round(stats.totalDuration / stats.total) : 0
  const errorRate = stats.total > 0 ? ((stats.errors / stats.total) * 100).toFixed(1) : '0.0'

  return (
    <div className='min-h-screen bg-[#010409] text-[#e6edf3] font-mono p-5'>
      
      <div >
        <TopBar connected={connected}/>
        <StatGrid total={stats.total} errorRate={errorRate} blocked={stats.blocked} avgDuration={avgDuration} />
        <LiveChart data={chartData}/>
        <TopRoutes routes={routes}/>
        <RequestLog logs={logs}/>
         <CircuitPanel circuits={circuits}/>
       
      </div>
    </div>
  )
}

export default App