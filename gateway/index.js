import http from "http"
import httpProxy from 'http-proxy'
import dotenv from 'dotenv'

dotenv.config({path: '../.env'})
import { routes } from "./config/routes.js"
import { authMiddleware } from "../middleware/auth.js"
const proxy=httpProxy.createProxyServer()

const server=http.createServer((req,res)=>{
    console.log(`[${req.method}] ${req.url}`)
    const route=routes.find(r=>req.url.startsWith(r.path))
    if(!route){
        res.writeHead(404,{"content-type":"application/json"})
        res.end(JSON.stringify({error:'Route not found'}))
        return 
    }
    const isAuthorized=authMiddleware(req,res,route.auth,route.roles)
    if(!isAuthorized) return 
    if(req.user){
        req.headers['x-user-id']=req.user.userId
        req.headers['x-user-role']=req.user.role
    }
    proxy.web(req,res,{target:route.target})

})
server.listen(3000,()=>{
    console.log("Server running on port 3000")
})