import deliveryAgentModel from "../models/deliveryAgentModel.js";
import restaurantModel from "../models/restaurantModel.js";
import crypto from "crypto";
import { sendMail } from "../utills/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import orderModel from "../models/orderModel.js";
// import { sendMail } from "../utills/sendEmail.js";
import { generateOTP } from "../utills/generateOTP.js";
import { OTP } from "../models/OTPmodel.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import connectCloudinary from "../config/cloudinary.js";
import fs from "fs"

const inviteDeliveryAgent = async (req, res) => {
  try {
    const { sellerId, firstName, lastName, contactNo, email, gender } =
      req.body;
    // console.log(sellerId, firstName, lastName, contactNo, email, gender)

    if (!firstName || !lastName || !contactNo || !email || !gender) {
      return res.json({ success: false, message: "Missing Fields" });
    }

    const existing = await deliveryAgentModel.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already used" });
    }

    const restoData = await restaurantModel.find({ sellerId: sellerId });

    if (!restoData) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    const secretCode = crypto.randomBytes(4).toString("hex"); // 8-character hex code
    // console.log('secretCode',secretCode);

    const codeexpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const deliveryAgentData = {
      sellerId,
      firstName,
      lastName,
      contactNo,
      email,
      gender,
      restoname: restoData[0].name,
      secretCode,
      codeexpiresAt,
      isRegistered: false,
    };

    const newDeliveryAgent = new deliveryAgentModel(deliveryAgentData);

    await newDeliveryAgent.save();

    const inviteCode = secretCode;

    await sendMail(
      email,
      "Delivery boy Invite Code",
      `<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>QuickBite Delivery Registration</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin: 40px 0;">
          <tr>
            <td style="background-color: #ff6b00; padding: 20px; color: white; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">QuickBite</h1>
              <p style="margin: 4px 0 0;">Online Dining Solutions</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #333333;">You're Invited to Join as a Delivery Partner!</h2>
              <p style="font-size: 16px; color: #555555;">
                Hello, <br /><br />
                You have been invited to complete your registration as a delivery partner with <strong>QuickBite</strong>.
              </p>

              <p style="font-size: 16px; color: #555555;">
                Use the following secret code to continue your registration:
              </p>

              <div style="background-color: #fff4eb; padding: 15px; text-align: center; font-size: 20px; font-weight: bold; color: #ff6b00; border: 2px dashed #ff6b00; margin: 20px 0;">
                ${inviteCode}
              </div>

              <p style="font-size: 14px; color: #777777;">
                ⚠️ This code is valid for 1 hour. Make sure to complete your registration before it expires.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://your-app-link.com/delivery-register" 
                   style="background-color: #ff6b00; color: white; padding: 14px 24px; text-decoration: none; font-weight: bold; border-radius: 6px;">
                  Complete Registration
                </a>
              </div>

              <p style="font-size: 14px; color: #999999; text-align: center;">
                Need help? Contact our support team at <a href="mailto:support@quickbite.com" style="color: #ff6b00;">support@quickbite.com</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
              &copy; 2025 QuickBite – Online Dining Solutions. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
    );

    res.json({
      success: true,
      sellerId,
      message: "Invitation sent successfully",
    });
  } catch (error) {
    console.error(error);
    const statuscode = error.statusCode || 500;
    const errorMessage = error.message || "Something went wrong";
    res.status(statuscode).json({ success: false, message: errorMessage });
  }
};

const completeDeliveryAgentRegistration = async (req, res) => {
  try {
    const { secretCode, password, licenseNumber, vehicleNumber } = req.body;

    if (!secretCode || !password || !licenseNumber || !vehicleNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Fields" });
    }

    const agent = await deliveryAgentModel.findOne({ secretCode: secretCode });

    if (!agent) {
      return res.status(404).json({ success: false, message: "Invalid Code" });
    }

    if (agent.codeexpiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "Code Expired" });
    }

    if (agent.isRegistered) {
      return res
        .status(400)
        .json({ success: false, message: "Already Registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    agent.password = hashPassword;
    agent.licenseNumber = licenseNumber.toUpperCase();
    agent.vehicleNumber = vehicleNumber.toUpperCase();
    agent.isRegistered = true;
    agent.codeexpiresAt = "";
    agent.secretCode = "";
    agent.joinDate = Date.now();
    agent.isRegistered = true;
    await agent.save();

    // const token = jwt.sign({email:agent.email, id:agent._id}, process.env.JWT_SECRET, {expiresIn:"1h"})

    res.json({
      success: true,
      message: "Registration Completed Head to login!",
    });
  } catch (error) {
    console.error(error);
    const statuscode = error.statusCode || 500;
    const errorMessage = error.message || "Something went wrong";
    res.status(statuscode).json({ success: false, message: errorMessage });
  }
};

const loginDeliveryAgent = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Fields" });
    }

    const agent = await deliveryAgentModel.findOne({ email: email });
    const sellerId = await agent.sellerId;

    if (!agent) {
      return res
        .status(404)
        .json({ success: false, message: "agent not found!" });
    }

    if (!agent.isRegistered) {
      return res
        .status(400)
        .json({ success: false, message: "Agent not registered" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, agent.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { email: agent.email, agentId: agent._id, sellerId: sellerId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ success: true, token, message: "Logged In Successfully!" });
  } catch (error) {
    console.error(error);
    const statuscode = error.statusCode || 500;
    const errorMessage = error.message || "Something went wrong";
    res.status(statuscode).json({ success: false, message: errorMessage });
  }
};

const getAgentData = async (req, res) => {
  try {
    const agentData = await deliveryAgentModel.find({});
    res.json({ success: true, agentData, message: "Done" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// get restaurants all orders
const getOrders = async (req, res) => {
  try {
    const { sellerId } = req.body;
    // console.log(sellerId);

    const orderData = await orderModel
      .find({ sellerId })
      .populate("userId", "email");
    // console.log(orderData)
    res.json({ success: true, orderData });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const respondeToOrder = async (req, res) => {
  const { orderId, action, deliverAgentId } = req.body;

  try {
    const order = await orderModel.findById(orderId);
    const agent = await deliveryAgentModel.findById(deliverAgentId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.isCompleted) {
      return res.status(400).json({
        success: false,
        message: "Order already completed/delivered!",
      });
    }

    if (action === "accept") {
      if (order.status === "accepted" || order.status === "pickedUp") {
        return res.status(400).json({
          success: false,
          message: "Order already assigned to a delivery agent",
        });
      }

      order.status = "accepted";
      order.deliveryAgentId = deliverAgentId;
      agent.pendingDeliveries += 1;

    } else if (action === "reject") {
      if (order.status === "rejected") {
        return res.status(400).json({
          success: false,
          message: "Order already rejected",
        });
      }

      if (String(order.deliveryAgentId) === String(deliverAgentId)) {
        agent.pendingDeliveries = Math.max(agent.pendingDeliveries - 1, 0);
      }

      order.status = "rejected";
      order.deliveryAgentId = null;

    } else if (action === "pickedup") {
      if (order.status !== "accepted") {
        return res.status(400).json({
          success: false,
          message: "Order must be accepted before marking as picked up",
        });
      }

      if (String(order.deliveryAgentId) !== String(deliverAgentId)) {
        return res.status(403).json({
          success: false,
          message: "Only the assigned agent can mark this order as picked up",
        });
      }
      order.status = "pickedup";
      order.ispickedUp = true;

    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Use 'accept', 'reject', or 'pickedup'",
      });
    }

    await order.save();
    await agent.save();

    return res.status(200).json({
      success: true,
      message: `Order has been ${action}ed successfully`,
    });
  } catch (error) {
    console.error("Error in respondeToOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing the order",
    });
  }
};


const sendOrderCompleteOtp = async (req, res) => {
  const { orderId, email } = req.body;

  if (!orderId || !email) {
    return res
      .status(400)
      .json({ success: false, message: "orderid and email is required!" });
  }

  try {
    const _id = orderId;
    const order = await orderModel.findById({ _id });

    const deliveryAgent = order?.deliveryAgentId;
    if (!deliveryAgent) {
      return res.status(400).json({
        success: false,
        message: "No delivery agent assigned to this order!",
      });
    }
    console.log("order", order);

    console.log("delivery", deliveryAgent);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not Found!" });
    }

    if (order.isCompleted) {
      return res.status(400).json({
        success: false,
        message: "invalid or already completed order!",
      });
    }

    const otp = generateOTP();
    const otpSave = await OTP.create({
      otp: otp,
      deliveryBoy: deliveryAgent,
    });
    const otpId = otpSave._id;

    await sendMail(
      email,
      "Order Delivery-OTP",
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Order Delivery Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #fef6f2;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #f5c6a5;">
    <tr>
      <td style="background-color: #ff6f00; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0;">Verify Your Delivery</h1>
      </td>
    </tr>

    <tr>
      <td style="padding: 30px; color: #333333;">
        <p>Hi there,</p>
        <p>Your food is almost with you! To confirm the delivery, please provide the OTP below to your delivery agent:</p>

        <div style="background-color: #fff3e0; padding: 20px; text-align: center; margin: 20px 0; border: 2px dashed #ff9800;">
          <h2 style="font-size: 28px; letter-spacing: 3px; margin: 0; color: #d84315;">${otp}</h2>
        </div>

        <p>This OTP is valid for the next <strong>5 minutes</strong>. Please don’t share it with anyone else.</p>

        <p>Thanks for ordering with us! 🍽️</p>
        <p style="margin-top: 30px;">– Your Food Delivery Team</p>
      </td>
    </tr>

    <tr>
      <td style="background-color: #ff6f00; color: white; text-align: center; padding: 15px; font-size: 14px;">
        © 2025 QuickBites. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>
`
    );
    return res.status(200).json({
      success: true,
      otpId,
      orderId,
      message: "deliervy otp has been sent!",
    });
  } catch (error) {
    console.error(error);
  }
};

const completeOrderAndVerifyOtp = async (req, res) => {
  const { orderId, otp } = req.body;

  try {
    if (!orderId || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "orderId and otp are required!" });
    }

    const order = await orderModel.findById({ _id: orderId });
    if (!order) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order to complete!" });
    }

    const checkOTP = await OTP.findOne({ otp });
    if (!checkOTP) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP!" });
    }

    // Complete order
    order.isCompleted = true;
    order.status = "delivered";
    order.completedAt = new Date(); // Store as a Date object

    await order.save();

    // Delete the OTP after verifying
    await OTP.deleteOne({ otp: otp });

    // Add ₹40 to agent's totalEarnings
    const agent = await deliveryAgentModel.findByIdAndUpdate(
      order.deliveryAgentId,
      {
        $inc: { earnings: 40, completedDeliveries: 1 },
      },
      { new: true }
    );

    const totalDeliveries = agent.completedDeliveries + agent.pendingDeliveries;
    agent.totalDeliveries = totalDeliveries;
    agent.pendingDeliveries = Math.max(agent.pendingDeliveries - 1, 0);
    await agent.save();

    return res
      .status(200)
      .json({ success: true, message: "OTP verified and order completed!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP and complete order!",
    });
  }
};

const getDeliveryAgentHistory = async (req, res) => {
  const { deliveryAgentId } = req.params;
  console.log("deliervyagent", deliveryAgentId);

  try {
    const _id = deliveryAgentId;
    const agent = await deliveryAgentModel.findById(_id);
    if (!agent) {
      return res
        .status(404)
        .json({ success: false, message: "DeliveryAgent Not Found!" });
    }

    const deliveryHistory = await orderModel.find({ deliveryAgentId });

    if (!deliveryHistory.length > 0) {
      return res
        .status(404)
        .json({ success: false, message: "DeliveryHistry Not Found!" });
    }

    return res.status(200).json({
      success: true,
      message: "DeliveryHistry Found!",
      deliveryHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "server error to get the deliveryHistory",
    });
  }
};

const getGroupedEarnings = async (req, res) => {
  const { deliveryAgentId } = req.params;
  const { type = "day" } = req.query;

  const allowedTypes = ["day", "month", "week"];
  if (!allowedTypes.includes(type)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid grouping type" });
  }

  try {
    const groupFormate =
      type === "day"
        ? {
            year: { $year: "$completedAt" },
            month: { $month: "$completedAt" },
            day: { $dayOfMonth: "$completedAt" },
          }
        : type === "week"
        ? {
            year: { $year: "$completedAt" },
            week: { $isoWeek: "$completedAt" },
          }
        : {
            year: { $year: "$completedAt" },
            month: { $month: "$completedAt" },
          };

    const earnings = await orderModel.aggregate([
      {
        $match: {
          deliveryAgentId: new mongoose.Types.ObjectId(deliveryAgentId),
          isCompleted: true,
        },
      },
      {
        $group: {
          _id: groupFormate,
          totalEarnings: { $sum: 40 },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
          "_id.day": -1,
          "_id.week": -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "earnings fetched as per the type!",
      earnings,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "failed to compute the earnings!" });
  }
};

const updateDeliveryAgentProfile = async (req, res) => {
  const {
    deliveryAgentId,
    firstName,
    lastName,
    profilePhoto,
    contactNo,
    email,
    licenseNumber,
    vehicleNumber,
  } = req.body;

  const _id = deliveryAgentId;

  try {
    if (!deliveryAgentId) {
      return res.status(400).json({
        success: false,
        message: "Delivery Agent ID is required.",
      });
    }

    let profilePhotoUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "delivery_agents",
      });
      profilePhotoUrl = result?.secure_url;

      // Delete file from local uploads folder
      fs.unlinkSync(req.file.path);
    }

    const updateData = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(contactNo && { contactNo }),
      ...(email && { email }),
      ...(licenseNumber && { licenseNumber }),
      ...(vehicleNumber && { vehicleNumber }),
      ...(profilePhotoUrl && { profilePhoto: profilePhotoUrl }),
    };

    const updateDeliveryAgent = await deliveryAgentModel.findByIdAndUpdate(
      { _id },
      updateData,
      { new: true }
    );

    if (!updateDeliveryAgent) {
      return res.status(404).json({
        success: false,
        message: "Delivery agent not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updateDeliveryAgent,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "failed to upadte the deliveryAgent profile!",
      });
  }
};

const getSpecificAgentData = async (req, res) => {
  const { sellerId } = req.body;
  try {
    const agentData = await deliveryAgentModel.find({ sellerId: sellerId });
    res.json({ success: true, agentData, message: "Done" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const deleteAgent = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    await deliveryAgentModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Agent Deleted" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export {
  inviteDeliveryAgent,
  getAgentData,
  deleteAgent,
  getSpecificAgentData,
  completeDeliveryAgentRegistration,
  loginDeliveryAgent,
  getOrders,
  respondeToOrder,
  sendOrderCompleteOtp,
  completeOrderAndVerifyOtp,
  getDeliveryAgentHistory,
  getGroupedEarnings,
  updateDeliveryAgentProfile
};
