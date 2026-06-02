import Redis from "ioredis";
import http from "http"
import { stat } from "fs";
import { uptime } from "process";
const redis=new Redis()

async function checkRedis() {
    const start=Date.now()
    try{
        await redis.ping()
        return {
            status:"healthy",
            responseTime:`${Date.now()-start}ms`

        }
    }catch(err){
        return {
            status:'unhealthy',
            error:err.message
        }
    }

    
}
async function checkService(name,port) {
    return new Promise((resolve)=>{
        const start=Date.now()
        const req=http.get(`http://localhost:${port}`,(res)=>{
            resolve({
                name,
                status:'healthy',
                responseTime:`${Date.now()-start}ms`
            })
            res.resume()
        })
        req.setTimeout(3000,()=>{
            req.destroy()
            resolve({
                name,
                status:'unhealthy',
                error:'timeout'
            })
        })
        req.on('error',(err)=>{
            resolve({
                name,
                status:'unhealthy',
                error:err.code
            })
        })
    })
    
}
function formatUptime(seconds){
    const h=Math.floor(seconds/3600)
    const m=Math.floor((seconds%3600)/60)
    const s=Math.floor(seconds%60)
    return `${h}h ${m}m ${s}s`
}
function getMemory() {
  const mem = process.memoryUsage()
  return {
    used: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
    total: `${Math.round(mem.heapTotal / 1024 / 1024)}MB`
  }
}
export async function healthCheck(req,res){
    const [redis,userService,productService,orderService]=await Promise.all([
        checkRedis(),
    checkService('user-service', 4001),
    checkService('product-service', 4002),
    checkService('order-service', 4003),
    ])
    const dependencies={
        redis,userService,productService,orderService
    }
    const allHealty=Object.values(dependencies).every(dep=>dep.status==='healthy')
    const overallStatus=allHealty?'healthy':'unhealthy'
    const statusCode=allHealty?200:503

    const report={
        status:overallStatus,
        timestamp:new Date().toISOString(),
        uptime:formatUptime(process.uptime()),
        version:'1.0.0',
        dependencies,
        memory:getMemory()
    }
    res.writeHead(statusCode,{'Content-type':'application/json'})
    res.end(JSON.stringify(report , null ,2))

}