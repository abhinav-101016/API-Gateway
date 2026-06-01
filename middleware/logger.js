import fs from 'fs'

export function loggerMiddleware(req,res){
    const start=Date.now()
    const ip=req.socket.remoteAddress
    res.on('finish',()=>{
        const duration=Date.now()-start;
        const status=res.statusCode
        const method=req.method
        const url=req.url
        const userId=req.user?req.user.userId:'guest'
        const timeStamp=new Date().toISOString()

       const color =
      status >= 500 ? '\x1b[31m' :  
      status >= 400 ? '\x1b[33m' :   
      '\x1b[32m'                     
    const reset = '\x1b[0m'
    const requestId = req.headers['x-request-id'] || 'unknown'

    const log = `[${timeStamp}] ${method} ${url} ${status} ${duration}ms | userId:${userId} ip:${ip} reqId:${requestId}` 
    console.log(`${color}${log}${reset}`)

    fs.appendFileSync('gateway.log',log+'\n')
    
    })


}