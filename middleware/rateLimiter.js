import { Redis } from 'ioredis'
console.log('[REDIS] Connecting to', process.env.REDIS_HOST, process.env.REDIS_PORT)
const redis=new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
})

export async function rateLimiter(req,res,rateLimit) {
    const LIMIT=rateLimit.limit;
const WINDOW=rateLimit.window
    
    const identifier=req.user?`user:${req.user.userId}`:`user:${req.socket.remoteAddress}`
    const key = `ratelimit:${identifier}:${req.url.split('/')[1]}`
    const count=await redis.incr(key)
    if(count===1){
        await redis.expire(key,WINDOW)

    }
    else{
        const ttl=await redis.ttl(key)
        if(ttl===-1){
            await redis.expire(key,WINDOW)
        }
    }
    const ttl=await redis.ttl(key)

    res.setHeader('X-RateLimit-Limit',LIMIT)
    res.setHeader('X-RateLimit-Remaining',Math.max(0,LIMIT-count))
    res.setHeader('X-RateLimit-Reset',ttl)

    if(count>LIMIT){
        console.log(`[RATE LIMIT] Blocked — ${identifier} count: ${count}`)
        res.writeHead(429,{'content-type':'application/json',
            'retry-after':ttl
        })
        res.end(JSON.stringify({error: 'Too many requests. Slow down.',
      retryAfter: `${ttl} seconds`}))
      return false
    }
    console.log(`[RATE LIMIT] Allowed — ${identifier} count: ${count}/${LIMIT}`)
  return true
    
}