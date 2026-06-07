import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config({path:'../.env'})

export async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('[DB] MongoDB connected')

    }catch(err){
        console.error('[DB] Connection failed',err.message)
        process.exit(1)
    }
    
}