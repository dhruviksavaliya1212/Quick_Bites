import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  sellerId:{
    type:String,
    required:true,
  },
  name:{
    type:String,
    required:true,
  },
  ownername:{
    type:String,
    required:true,
  },
  image:{
    type:String,
    required:true
  },
  desc:{
    type:String,
    required:true
  },
  phone:{
    type:String,
    required:true
  },
  address:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  rating:{
    type:String,
    required:false,
    default:"0"
  },
  deliverytime:{
    type:String,
    required:false,
    default:"0"
  },
  timing:{
    type:String,
    required:true
  },
  isopen:{
    type:Boolean,
    required:false,
    default:false
  },
  isrequested:{
    type:Boolean,
    default:true
  },
  isrejected:{
    type:Boolean,
    default:false
  },
  rejectionmsg:{
    type:String,
    default:''
  }
})

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema);

export default restaurantModel