import mongoose from "mongoose";
import bycrpt from "bcryptjs";

const AdminSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// hash the password before saving into the db
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bycrpt.hash(this.password, 10);
  next();
});

export const Admin = mongoose.model("Admin", AdminSchema);
