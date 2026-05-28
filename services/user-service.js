import http from "http"

const server=http.createServer((req,res)=>{
    res.writeHead(200,{'content-type':'application/json'})
    res.end(JSON.stringify({
        service:'user-service',
        method:req.method,
        url:req.url
    }))

})

server.listen(4001,()=>{
    console.log("User service on port 4001")

})