import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId : {
    type:String,
    required:true
  },
  sellerId:{
    type:String,
    required:true
  },
  restoName:{
    type:String,
    required:true
  },
  restoAddress:{
    type:String,
    required:true
  },
  items:{
    type:Array,
    required:true
  },
  amount:{
    type:Number,
    required:true
  },
  address:{
    type:Object,
    required:true
  },
  status:{
    type:String,
    default:"Placed"
  },
  date:{
    type:Date,
    default:Date.now()
  },
  payment:{
    type:Boolean,
    default:false
  },
  paymentType:{
    type:String,
    required:true
  },
  isCancelled:{
    type:Boolean,
    default:false
  },
  isCompleted:{
    type:Boolean,
    default:false
  },
  isAccepted:{
    type:Boolean,
    default:false
  },
  feedback:{
    type:String,
    default:''
  },
  response:{
    type:String,
    default:''
  }
})

const orderModel = mongoose.models.order || mongoose.model("order",orderSchema);

export default orderModel;