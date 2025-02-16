import orderModel from "../models/orderModel.js";
import restaurantModel from "../models/restaurantModel.js";
import userModel from "../models/userMOdel.js";

const getDashData = async(req,res) => {
  try {

    const orderData = await orderModel.find({});
    
    const filterData = orderData.filter((order,_) =>  order.payment);
    const getAmount = filterData.map((order)=> order.amount);
    let revenue = 0;
    getAmount.forEach((amount) => revenue+=amount)

    const users = await userModel.find({})

    const pendingOrders = orderData.filter((order,_) => order.status !== "Delivered")
    const deliveredOrders = orderData.filter((order,_) => order.status === "Delivered")

    const resto = await restaurantModel.find({})

    const dashData = {
      totalOrders : orderData.length,
      revenue,
      totalUsers : users.length,
      pendingOrders : pendingOrders.length,
      deliveredOrders : deliveredOrders.length,
      totalResto : resto.length,
    }

    res.json({success: true,dashData, message: "Data Fetched"})
    
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
}

export {getDashData}