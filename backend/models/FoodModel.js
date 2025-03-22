import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  sellerId:{
    type:String,
    required:true,
  },
  name: {
    type: String,
    required: true,
  },
  restoname: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  oldprice: {
    type: String,
    required: false,
  },
  newprice: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    default: "0.0",
  },
  desc: {
    type: String,
    required: true,
  },
  veg: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  bestSeller:{
    type:Boolean,
    default:false
  },
  category:{
    type:String,
    default:""
  },
  subCategory:{
    type:String,
    default:""
  }
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
