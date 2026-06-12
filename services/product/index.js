import http from "http"

const server=http.createServer((req,res)=>{
    res.writeHead(200,{'content-type':'application/json'})
    res.end(JSON.stringify({
        service:'product-service',
        method:req.method,
        url:req.url
    }))

})

server.listen(4002,()=>{
    console.log("Product service on port 4002")

})