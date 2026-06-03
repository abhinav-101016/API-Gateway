import httpProxy from 'http-proxy'
const proxy=httpProxy.createProxyServer()

const FAILURE_THRESHOLD=3;
const RETRY_TIMEOUT=30000
const circuitBreakers={
    'http://localhost:4001':{state:'CLOSED',failureCount:0,nextRetryTime:null},
    'http://localhost:4002':{state:'CLOSED',failureCount:0,nextRetryTime:null},
    'http://localhost:4003':{state:'CLOSED',failureCount:0,nextRetryTime:null},
}
let proxyFailed = false;

function getBreaker(target){
    return circuitBreakers[target]
}
function recordSuccess(target){
    const breaker=getBreaker(target)
    breaker.state='CLOSED',
    breaker.failureCount=0
}
function recordFailure(target){
    const breaker=getBreaker(target)
    breaker.failureCount++
    console.log(`[CIRCUIT] Failure recorded for ${target} — count: ${breaker.failureCount}/${FAILURE_THRESHOLD}`)
    if(breaker.failureCount>=FAILURE_THRESHOLD){
        breaker.state='OPEN'
        breaker.nextRetryTime=Date.now()+RETRY_TIMEOUT
        console.log(`[CIRCUIT] Circuit OPENED for ${target}- retry at ${new Date(breaker.nextRetryTime).toISOString()}`)


    }
}
function canRequest(target){
    const breaker=getBreaker(target)
    if(breaker.state==='CLOSED'){
        return 'ALLOW'
    }
    if(breaker.state==='OPEN'){
        if(Date.now()>breaker.nextRetryTime){
            breaker.state='HALF-OPEN'
            console.log(`[CIRCUIT] Circuit HALF-OPEN for ${target} — testing recovery`)
            return 'ALLOW'
        }
        return 'BLOCK'
    }
    if(breaker.state==='HALF-OPEN'){
        return 'ALLOW'
    }
}
export function circuitBreakerMiddleware(req,res,target){
    const decision=canRequest(target)
    if(decision==='BLOCK'){
        const breaker=getBreaker(target)
        const retryAfter=Math.ceil((breaker.nextRetryTime-Date.now())/1000)
        console.log(`[CIRCUIT] Request BLOCKED — circuit is OPEN for ${target}`)
        res.writeHead(503,{'content-type':'application/json'})
        res.end(JSON.stringify({
            error:'Service temporarily unavailable',
            reason:'Circuit breaker is open',
            retryAfter:`${retryAfter} seconds`
        }))
        return false
    }
    proxy.web(req,res,{target},(err)=>{
        if(err){
            recordFailure(target)
            proxyFailed=true
            console.log(`[CIRCUIT] Proxy error for ${target}: ${err.message}`)
            if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Service unavailable' }))
      }
      return 
        }
    })

    res.on('finish',()=>{
         if (proxyFailed) return;

        if(res.statusCode<500){
            recordSuccess(target)
        }
        else{
            recordFailure(target)
        }
    })
    return true
}

