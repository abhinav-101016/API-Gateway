import jwt from 'jsonwebtoken'

export function authMiddleware(req,res,isProtected){
    if(!isProtected){
        console.log(`[AUTH] Public Route- skipping: ${req.url}`)
        return true
    }
    const authHeader=req.headers['authorization']
    if(!authHeader){
        res.writeHead(401,{'content-type':'application/json'})
        res.end(JSON.stringify({error:'No token Provided'}))
        return false
    }
    if(!authHeader.startsWith('Bearer')){
        res.writeHead(401, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Invalid token format' }))
    return false
    }
    const token=authHeader.split(" ")[1]
    
   
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        console.log(`[AUTH] Verified — userId: ${decoded.userId} role: ${decoded.role}`)
        return true;
    }
    catch(err){
        if(err.name==='TokenExpiredError'){
            res.writeHead(401,{'content-type':'application/json'})
            res.end(JSON.stringify({error:"Token expired"}))
        } else {
      res.writeHead(401,{ 'Content-Type': 'application/json' })
      
      res.end(JSON.stringify({ error: 'Invalid token' }))
    }
    return false

    }

}

