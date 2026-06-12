import http from "http"

const server=http.createServer((req,res)=>{
    res.writeHead(200,{'content-type':'application/json'})
    res.end(JSON.stringify({
        service:'order-service',
        method:req.method,
        url:req.url

    }))

})
server.listen(4003,()=>{
    console.log("Order Service running on 4003 ");
})