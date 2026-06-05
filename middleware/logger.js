import fs from 'fs'
import { getIO } from '../gateway/socket.js'
import { getBreaker } from '../gateway/circuitBreaker.js'

export function loggerMiddleware(req, res) {
  const start = Date.now()
  const ip = req.socket.remoteAddress

  res.on('finish', () => {
    const duration = Date.now() - start
    const status = res.statusCode
    const userId = req.user ? req.user.userId : 'guest'
    const timeStamp = new Date().toISOString()
    const requestId = req.headers['x-request-id'] || 'unknown'

    const color =
      status >= 500 ? '\x1b[31m' :
      status >= 400 ? '\x1b[33m' :
      '\x1b[32m'
    const reset = '\x1b[0m'

    const log = `[${timeStamp}] ${req.method} ${req.url} ${status} ${duration}ms | userId:${userId} ip:${ip} reqId:${requestId}`

    console.log(`${color}${log}${reset}`)
    fs.appendFileSync('gateway.log', log + '\n')

    const breakerStatus = {
      'user-service':    getBreaker('http://localhost:4001'),
      'product-service': getBreaker('http://localhost:4002'),
      'order-service':   getBreaker('http://localhost:4003')
    }

    try {
      const io = getIO()
      io.emit('traffic', {
        method: req.method,
        url: req.url,
        status,
        duration,
        userId,
        timeStamp,
        requestId,
        breakerStatus
      })
    } catch(err) {}
  })
}