import http from "http";
const server=http.createServer((req,res)=>{
    console.log(req.method,req.url,req.headers)
    res.writeHead(200,{'content-type':'application/json'})


   
    res.end(JSON.stringify({message:'hello'}))
})
server.listen(3000,()=>{
    console.log("Server running on port 3000")
})
