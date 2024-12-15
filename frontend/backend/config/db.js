import mongoose from "mongoose";

const connectDB = () => {
  mongoose.connect(`${process.env.MONGODB_URI}/quickbites`).then(()=>{
    console.log("db connected");
  });
};

export default connectDB;
