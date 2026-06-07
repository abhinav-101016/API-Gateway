import http from "http"
import httpProxy from 'http-proxy'
import dotenv from 'dotenv'

dotenv.config({path: '../.env'})
import {v4 as uuidv4} from 'uuid'
import { routes } from "./config/routes.js"
import { healthCheck } from "./health.js"
import { authMiddleware } from "../middleware/auth.js"
import { rateLimiter } from "../middleware/rateLimiter.js"
import { loggerMiddleware } from "../middleware/logger.js"
import { circuitBreakerMiddleware } from "./circuitBreaker.js"
import { initSocket } from "./socket.js"

import { connectDB } from './db.js'
import { getRoutes,loadRoutes,watchRoutes } from "./config/routeManager.js"
import Route from "./models/Route.js"
import RequestLogs from "./models/RequestLogs.js"
import { timeStamp } from "console"

const proxy=httpProxy.createProxyServer({ws:false})

const server=http.createServer(async(req,res)=>{
  
    loggerMiddleware(req,res)
    if(req.url==='/health'){
        await healthCheck(req,res)
        return 
    }

    if(req.url==='/metrics'){
        const logs=await RequestLogs.find().sort({timestamp:-1}).
        limit(1000)
        res.writeHead(200,{
            'content-type':'apllication/json',
            'access-control-allow-origin':'*'
        })
        res.end(JSON.stringify(logs))
        return
    }

    console.log(`[${req.method}] ${req.url}`)
   const routes=getRoutes()
   const route=routes.find(r=>req.url.startsWith(r.path))
    if(!route){
        res.writeHead(404,{"content-type":"application/json"})
        res.end(JSON.stringify({error:'Route not found'}))
        return 
    }
    const isAuthorized=authMiddleware(req,res,route.auth,route.roles)
    if(!isAuthorized) return 
    const isAllowed=await rateLimiter(req,res,route.rateLimit);
    if(!isAllowed) return 
    if(req.user){
        req.headers['x-user-id']=req.user.userId
        req.headers['x-user-role']=req.user.role
    }
    req.headers['x-request-id']=uuidv4()
    req.headers['x-forwarded-by']='api-gateway'
    req.headers['x-forwarded-ip']=req.socket.remoteAddress
    circuitBreakerMiddleware(req,res,route.target)

})
initSocket(server)

async function start() {
    await connectDB()
    await loadRoutes()
    await watchRoutes()
    server.listen(3000,()=>{
    console.log("Server running on port 3000")
})
    
}
start()

