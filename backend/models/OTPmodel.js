import mongoose from "mongoose";
import { type } from "os";

const OTPSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "seller",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  deliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "deliveryAgent",
  },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Expires in 5 min
});

OTPSchema.pre("save", function (next) {
  if (!this.admin && !this.seller && !this.user && !this.deliveryBoy) {
    throw new Error("At least one of admin, seller,deliveryBoy or user must be provided");
  }
  next();
});

export const OTP = mongoose.model("OTP", OTPSchema);
