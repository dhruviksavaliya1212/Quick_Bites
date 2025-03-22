import orderModel from "../models/orderModel.js";
import userModel from "../models/userMOdel.js";
import Stripe from "stripe";
import razorpay from "razorpay";
import restaurantModel from "../models/restaurantModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const cashOnDelivery = async (req, res) => {
  try {
    const { orderData, userId } = req.body;

    if (Object.keys(orderData.address).length === 0) {
      return res.json({ success: false, message: "Address is not selected" });
    }
    if (orderData.items.length === 0) {
      return res.json({ success: false, message: "Your cart is empty" });
    }

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const sellerId = orderData.items.find((item) => item.sellerId)?.sellerId;

    const sellerData = await restaurantModel.find({sellerId})

    const order = {
      userId,
      items: orderData.items,
      amount: orderData.amount,
      address: orderData.address,
      paymentType: "Cash On Delivery",
      sellerId,
      restoName : sellerData[0].name,
      restoAddress : sellerData[0].address
    };

    const newOrder =  new orderModel(order);

    await newOrder.save();

    res.json({ success: true, message: "Order sent successfull" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Order not sent successfull" });
  }
};

const stripePayment = async (req, res) => {
  const frontend = process.env.FRONTEND;
  try {
    const { userId, orderData } = req.body;

    if (Object.keys(orderData.address).length === 0) {
      return res.json({ success: false, message: "Address is not selected" });
    }
    if (orderData.items.length === 0) {
      return res.json({ success: false, message: "Your cart is empty" });
    }

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const sellerId = orderData.items.find((item) => item.sellerId)?.sellerId;

    const sellerData = await restaurantModel.find({sellerId})

    const order = {
      userId,
      items: orderData.items,
      amount: orderData.amount,
      address: orderData.address,
      paymentType: "Online(Stripe)",
      sellerId,
      restoName : sellerData[0].name,
      restoAddress : sellerData[0].address
    };

    const newOrder = await new orderModel(order);

    await newOrder.save();

    const itemPrice = orderData.items.map((item) => item.newprice);

    const charges = parseInt(orderData.amount - itemPrice);

    const line_items = orderData.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.newprice * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery and other charges",
        },
        unit_amount: charges * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Order not sent successfull" });
  }
};

const verifyPayment = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      res.json({ success: true, message: "Not Paid" });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// Razorpay payment

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async (req, res) => {
  try {
    const { userId, orderData } = req.body;

    if (Object.keys(orderData.address).length === 0) {
      return res.json({ success: false, message: "Address is not selected" });
    }
    if (orderData.items.length === 0) {
      return res.json({ success: false, message: "Your cart is empty" });
    }

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const sellerId = orderData.items.find((item) => item.sellerId)?.sellerId;

    const sellerData = await restaurantModel.find({sellerId})

    const order = {
      userId,
      items: orderData.items,
      amount: orderData.amount,
      address: orderData.address,
      paymentType: "Online(Razorpay)",
      sellerId,
      restoName : sellerData[0].name,
      restoAddress : sellerData[0].address
    };

    const newOrder = await new orderModel(order);

    await newOrder.save();

    const createdOrder = await orderModel.findById(newOrder._id);

    const options = {
      amount: orderData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: createdOrder._id,
    };

    // creation of an order
    const Order = await razorpayInstance.orders.create(options);

    res.json({ success: true, Order });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// verify razorpay

const verifyRazorpay = async (req, res) => {
  try {
    const { response } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(
      response.razorpay_order_id
    );
    if (orderInfo.status === "paid") {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      res.json({ success: false, message: "Not paid" });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// get user orders data
const getOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orderData = await orderModel.find({ userId });

    res.json({ success: true, orderData });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// get restaurants all orders
const getOrders2 = async (req, res) => {
  try {
    const { sellerId } = req.body;
    console.log(sellerId);
    const orderData = await orderModel.find({ sellerId });
    res.json({ success: true, orderData });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// get All orders Data
const getAllOrders = async (req, res) => {
  try {
    const orderData = await orderModel.find({});
    res.json({ success: true, orderData });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const feedbackFromUser = async(req,res) => {
  try {
    const {_id, feedbackMsg} = req.body;

   const data= await orderModel.findByIdAndUpdate(_id, {feedback:feedbackMsg})
    res.json({ success: true, message: "Feedback send" ,data});
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
}

const responseFromSeller = async(req,res) => {
  try {
    const {_id, responseMsg} = req.body;

   const data= await orderModel.findByIdAndUpdate(_id, {response:responseMsg})
    res.json({ success: true, message: "response send" ,data});
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
}


export {
  cashOnDelivery,
  stripePayment,
  verifyPayment,
  paymentRazorpay,
  verifyRazorpay,
  getOrders,
  getOrders2,
  getAllOrders,
  feedbackFromUser,
  responseFromSeller
};
