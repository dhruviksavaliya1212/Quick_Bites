import mongoose from "mongoose";

const PromotionSchema = new mongoose.Schema(
  {
    promotionName: {
      type: String,
      required: true,
    },
    offerCode: {
      type: String,
      required: true,
      unique:true
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
    promotionBanner: {
      type: String,
      required: true,
    },
    discount: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export const PromotionModel = mongoose.model("Promotion", PromotionSchema);
