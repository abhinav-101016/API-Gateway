import mongoose from 'mongoose'
const routeSchema= new mongoose.Schema({
    path:{
        type:String,
        required:true,
        unique:true
    },
    target:{
        type:String,
        required:true
    }
    ,
    auth:{
        type:Boolean,
        default:false
    },
    roles:{
        type:[String],
        default:[]
    }
    ,
    active: {
    type: Boolean,
    default: true      
  },
    rateLimit: {
    limit:  { type: Number, default: 10 },
    window: { type: Number, default: 60 }
  }
  },{timestamps: true

})
export default mongoose.model('Route',routeSchema)