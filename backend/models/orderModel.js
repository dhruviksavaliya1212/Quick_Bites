import mongoose from "mongoose";
import { type } from "os";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "user",
  },
  sellerId: {
    type: String,
    required: true,
  },
  deliveryAgentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "deliveryAgent",
  },
  restoName: {
    type: String,
    required: true,
  },
  restoAddress: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'Delivered','placed','pickedup','Out for Delivery'],
    default: 'placed',
  },  
  ispickedUp:{
    type : Boolean,
    default : false
  },
    date: {
    type: Date,
    default: Date.now(),
  },
  payment: {
    type: Boolean,
    default: false,
  },
  paymentType: {
    type: String,
    required: true,
  },
  isCancelled: {
    type: Boolean,
    default: false,
  },
  rejectedBy : {
    type: Array,
    default: [],
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt:{
    type: Date,
    default:null
  },
   feedback: {
    type: String,
    default: "",
  },
  response: {
    type: String,
    default: "",
  },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
