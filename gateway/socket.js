import Server from "http-proxy";
import { Socket } from "socket.io";
let io=null
export function initSocket(server){
    io= new Server(server,{
        cors:{
            origin:'*',
            methods:['GET','POST']
        },
         transports: ['polling', 'websocket'],
    path: '/socket.io'
    })
    
    io.on('connection',(socket)=>{
        console.log('[SOCKET] Dashboard connected')
        socket.on('disconnect',()=>{
            console.log('[SOCKET] Dashboard disconnected')
        })
    })
    console.log('[SOCKET] Socket.io initialized')
    return io
}
export function getIO(){
    if(!io){
        throw new error('Socket.io not initialized')
    }
    return io
}
