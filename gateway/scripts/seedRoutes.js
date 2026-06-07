import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' })
import Route from '../models/Route.js'
const routes=[
    {

    path: '/users',
    target: 'http://localhost:4001',
    auth: true,
    roles: ['admin'],
    active: true,
    rateLimit: { limit: 10, window: 60 }

    },{

    path: '/products',
    target: 'http://localhost:4002',
    auth: true,
    roles: [],
    active: true,
    rateLimit: { limit: 30, window: 60 }

    },{

    path: '/orders',
    target: 'http://localhost:4003',
    auth: true,
    roles: ['admin','user'],
    active: true,
    rateLimit: { limit: 5, window: 60 }

    }
]

async function seed(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('[SEED] Connected')

        await Route.deleteMany({})
        await Route.insertMany(routes)


    }catch(err){
        console.error('[SEED] failed',err.message)

    }
    finally{
        await mongoose.disconnect()
        console.log('[SEED] Done — disconnected')
    }
}
seed()