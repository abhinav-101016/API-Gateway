import http from "http"
import httpProxy from 'http-proxy'
import { routes } from "./config/routes.js"
const proxy=httpProxy.createProxyServer()

const server=http.createServer((req,res)=>{
    console.log(`[${req.method}] ${req.url}`)
    const route=routes.find(r=>req.url.startsWith(r.path))
    if(!route){
        res.writeHead(404,{"content-type":"application/json"})
        res.end(JSON.stringify({error:'Route not found'}))
        return 
    }
    proxy.web(req,res,{target:route.target})

})
server.listen(3000,()=>{
    console.log("Server running on port 3000")
})