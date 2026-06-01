import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const adminToken=jwt.sign({
    userId:'123',role:'admin'},
    process.env.JWT_SECRET,{
        expiresIn:'1h'
    }
)
const userToken=jwt.sign({
    userId:'456',role:'user'},
    process.env.JWT_SECRET,{
        expiresIn:'1h'
    }
)
console.log('ADMIN TOKEN: ',adminToken)
console.log('USER TOKEN: ',userToken)