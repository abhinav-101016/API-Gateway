import http from "http"
import httpProxy from 'http-proxy'
import dotenv from 'dotenv'

dotenv.config({path: '../.env'})
import {v4 as uuidv4} from 'uuid'
import { routes } from "./config/routes.js"
import { authMiddleware } from "../middleware/auth.js"
import { rateLimiter } from "../middleware/rateLimiter.js"
import { loggerMiddleware } from "../middleware/logger.js"
const proxy=httpProxy.createProxyServer()

const server=http.createServer(async(req,res)=>{
    loggerMiddleware(req,res)

    console.log(`[${req.method}] ${req.url}`)
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
    proxy.web(req,res,{target:route.target})

})
server.listen(3000,()=>{
    console.log("Server running on port 3000")
})