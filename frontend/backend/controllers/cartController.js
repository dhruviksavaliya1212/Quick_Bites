import userModel from "../models/userMOdel.js";

const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const userData = await userModel.findById(userId);

    let cartData = await userData.cartData;

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added to cart" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Not Added to cart" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const userData = await userModel.findById(userId);

    let cartData = await userData.cartData;

    if (cartData[itemId]>0) {
      cartData[itemId] -= 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Removed from cart" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Not removed from cart" });
  }
};

const getCartData = async(req,res) => {
  try {
    const {userId} = req.body;

    const userData = await userModel.findById(userId);

    const cartData = await userData.cartData;

    res.json({success:true, cartData, message:"Cart Data get successfull"})

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Not removed from cart" });
  }
}

export { addToCart, removeFromCart, getCartData };
