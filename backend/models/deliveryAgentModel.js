import mongoose from "mongoose";

const deliveryAgentSchema = new mongoose.Schema({
  sellerId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  profilePhoto:{
    type:String,
    default:null
  },
  contactNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: false, // Not required during invite
  },
  gender: {
    type: String,
    required: true,
  },
  restoname: {
    type: String,
    required: true,
  },
  commission: {
    type: String,
    default: 0,
  },
  isorderAccepted: {
    type:Boolean,
    default:false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  licenseNumber: {
    type: String,
    default: "",
  },
  vehicleNumber: {
    type: String,
    default: "",
  },
  totalDeliveries: {
    type: Number,
    default: 0,
  },
  pendingDeliveries: {
    type: Number,
    default: 0,
  },
  deliveryHistory:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
  }],
  completedDeliveries: {
    type: Number,
    default: 0,
  },
  earnings: {
    type: Number,
    default: 0,
  },
  // Extra fields to manage invitation state
  isRegistered: {
    type: Boolean,
    default: false, // false when just invited
  },
  secretCode: {
    type: String,
    default: "", // used for invite link
    expires: 3600, // expires in 1 hour
  },
  codeExpiresAt: {
    type: Date,
  },
});

const deliveryAgentModel =
  mongoose.models.deliveryAgent ||
  mongoose.model("deliveryAgent", deliveryAgentSchema);

export default deliveryAgentModel;
