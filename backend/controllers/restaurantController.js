import { v2 as cloudinary } from "cloudinary";
import restaurantModel from "../models/restaurantModel.js";
import validator from "validator";
import sellerModel from "../models/sellerModel.js";
import foodModel from "../models/FoodModel.js";
import orderModel from "../models/orderModel.js"

const checkResto = async (req, res) => {
  try {
    const { sellerId } = req.body;

    console.log(sellerId);

    const restaurant = await restaurantModel.findOne({ sellerId });

    console.log(restaurant)

    if (restaurant) {
      return res.json({
        success: true,
        restaurant,
        message: "Restaurant Found",
      });
    } else {
      return res.json({
        success: false,
        message: "Restaurant not Found",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const addRestaurant = async (req, res) => {
  try {
    const { sellerId } = req.body;
    const { name, desc, phone, address, email, deliverytime, timing } =
      req.body;

    const imageFile = req.file;

    const seller = await sellerModel.findById(sellerId);
    console.log(seller)
    const ownername = seller.name;
    
    // missing details
    if (
      (!name,
      !imageFile,
      !desc,
      !phone,
      !address,
      !email,
      !deliverytime,
      !ownername,
      !timing)
    ) {
      return res.json({ success: false, message: "Missing details" });
    }

    // validate data
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Email must be in formate" });
    }

    if (!validator.isMobilePhone(phone, ["en-IN"])) {
      return res.json({
        success: false,
        message: "contact no must be in formate",
      });
    }

    // upload img in cloudinary
    const uploadImage = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageUrl = uploadImage.secure_url;

    // add data to database
    const restaurantData = {
      sellerId,
      name,
      ownername,
      desc,
      phone,
      address,
      email,
      deliverytime,
      timing,
      image: imageUrl,
    };

    const newRestaurant = new restaurantModel(restaurantData);

    await newRestaurant.save();

    res.json({
      success: true,
      message: "request sent successfully for adding restaurant",
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong!" });
  }
};

const getOrders = async (req, res) => {
  try {
    const { sellerId } = req.body;

    const foods = await foodModel.find({ sellerId });

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const orders = await orderModel.find({ sellerId });

    // date: { $gte: today }

    // console.log(foods);

    let earning = 0;

    orders.map((item) => {
      if (item.payment) {
        if (item.isCompleted && !item.isCancelled) {
          earning += item.amount;
        }
      }
    });

    const data = {
      earning,
      foods: foods.length,
      orders: orders.length,
      latestOrders: orders.reverse().slice(0, 5),
    };

    res.json({ success: true, data, message: "Orders founded" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// get restaurant foods
const getFoods = async (req, res) => {
  try {
    const { sellerId } = req.body;
    const foods = await foodModel.find({ sellerId });
    res.json({ success: true, foods, message: "Foods founded" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const getFoodsFrontend = async (req, res) => {
  try {
    const { sellerId } = req.body;
    const foods = await foodModel.find({ sellerId });
    res.json({ success: true, foods, message: "Foods founded" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// remove food from seller panel
const removeFood = async (req, res) => {
  try {
    const { itemId, sellerId } = req.body;

    await foodModel.findByIdAndDelete(itemId);

    res.json({ success: true, message: "Food Removed" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// Accept Order
const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    await orderModel.findByIdAndUpdate(orderId, {
      isAccepted: true,
      status: "Accepted",
    });

    res.json({ success: true, message: "Order Accepted" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// Reject order
const rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { isCancelled: true, status:"Cancelled" });

    res.json({ success: true, message: "Order Accepted" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// complete Order
const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    await orderModel.findByIdAndUpdate(orderId, {
      isCompleted: true,
      payment: true,
      status:"Out for Delivery"
    });

    res.json({ success: true, message: "Order Completed" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// update profile
const updateProfile = async (req, res) => {
  try {
    const { restoId, email, phone, address, deliverytime, timing } = req.body;

    if (
      email === "" ||
      phone === "" ||
      address === "" ||
      deliverytime === "" ||
      timing === ""
    ) {
      return res.json({
        success: false,
        message: "Some fields arre empty. Please fill it",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Email must be in formate" });
    }

    if (!validator.isMobilePhone(phone, ["en-IN"])) {
      return res.json({ success: false, message: "Phone no must be 10 digit" });
    }

    await restaurantModel.findByIdAndUpdate(restoId, {
      email,
      phone,
      address,
      deliverytime,
      timing,
    });

    res.json({ success: true, message: "Profile Updated" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};
const updateProfileAdmin = async (req, res) => {
  try {
    const { email, phone, address, _id} = req.body;

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Email must be in formate" });
    }

    if (!validator.isMobilePhone(phone, ["en-IN"])) {
      return res.json({ success: false, message: "Phone no must be 10 digit" });
    }

    await restaurantModel.findByIdAndUpdate(_id, {
      email,
      phone,
      address,
    });

    res.json({ success: true, message: "Profile Updated" });
  } catch (err) {
    console.log(err);
    console.log(err)
    res.json({ success: false, message: "Something went wrong" });
  }
};

// change Availability of restuarants
const changeAvailability = async (req, res) => {
  try {
    const { restoId } = req.body;

    const restoData = await restaurantModel.findById(restoId);
    await restaurantModel.findByIdAndUpdate(restoId, {
      isopen: !restoData.isopen,
    });

    res.json({ success: true, message: "Availability changed" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const changeOrderStatus = async(req,res) => {
  try {
    const {status, orderId} = req.body;

  await orderModel.findByIdAndUpdate(orderId, {status:status});

  res.json({success:true, message:"Status Changed"});
  } catch (err) {
    
    console.log(err);
      res.json({ success: false, message: "Something went wrong" });
  }
}

const getRestoData = async(req,res) => {
  try {
    const restoData = await restaurantModel.find({});
    res.json({success:true, restoData, message:"Fetch successfully"});
  } catch (err) {
    res.json({ success: false, message: "Something went wrong" });
  }
}

const deleteResto = async(req,res) => {
  try {
    const {restoId} = req.body;
    console.log(restoId)

    await restaurantModel.findByIdAndDelete(restoId);
    res.json({success:true, message:"Restaurant Deleted"})
  } catch (err) {
    res.json({ success: false, message: "Something went wrong" });
  }
}


export {
  addRestaurant,
  checkResto,
  getOrders,
  getFoods,
  getFoodsFrontend,
  removeFood,
  acceptOrder,
  rejectOrder,
  completeOrder,
  updateProfile,
  changeAvailability,
  changeOrderStatus,
  getRestoData,
  updateProfileAdmin,
  deleteResto
};
