import mongoose from "mongoose";
const requestLogSchema=new mongoose.Schema({
    method:    { type: String },
  url:       { type: String },
  status:    { type: Number },
  duration:  { type: Number },
  userId:    { type: String },
  ip:        { type: String },
  requestId: { type: String },
  timestamp: { type: Date, default: Date.now }
})
requestLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 })
export default mongoose.model('Requesting',requestLogSchema)