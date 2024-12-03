import mongoose from "mongoose";

const foodSchema = new mongoose.Schema ({
  name:{
    type:String,
    required:true
  },
  image:{
    type:String,
    required:true
  },
  oldprice:{
    type:String,
    required:false
  },
  newprice:{
    type:String,
    required:true
  },
  rating:{
    type:String,
    required:false
  },
  desc:{
    type:String,
    required:true
  },
  veg:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    default: Date
  }

})

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;