import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Expires in 5 min
});

export const OTP = mongoose.model("OTP", OTPSchema);
