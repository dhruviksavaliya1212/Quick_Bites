import mongoose from "mongoose";

const deliveryAgentSchema = new mongoose.Schema({
  sellerId:{
    type:String,
    required:true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },

  contactNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  restoname: {
    type: String,
    required: true,
  },
  commision: {
    type: String,
    default:'',
  },
  revenue: {
    type: Number,
    default:0,
  },
  isAvailable:{
    type: Boolean,
    default: true,
  }
});

const deliveryAgentModel = mongoose.models.deliveryAgent || mongoose.model("deliveryAgent", deliveryAgentSchema);

export default deliveryAgentModel;
