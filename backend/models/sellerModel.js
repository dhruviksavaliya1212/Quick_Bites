import mongoose, { mongo } from 'mongoose';

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
})

const sellerModel = mongoose.models.seller || mongoose.model("seller", sellerSchema);

export default sellerModel