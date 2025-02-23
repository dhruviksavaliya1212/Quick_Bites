
import orderModel from "../models/orderModel.js";
import restaurantModel from "../models/restaurantModel.js";
import userModel from "../models/userMOdel.js";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/adminModel.js";
import { OTP } from "../models/OTPmodel.js";
import { generateOTP } from "../utills/generateOTP.js";
import { sendMail } from "../utills/sendEmail.js";


const approvResto = async(req,res) => {
  try {
    const {restoId} = req.body;

    await restaurantModel.findByIdAndUpdate(restoId, {isrequested:false});

    res.json({success:true, message:"Accepted"});

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
}

const rejectResto = async(req,res) => {
  try {
    const {restoId, rejectionReason} = req.body;

    console.log(restoId, rejectionReason)

    await restaurantModel.findByIdAndUpdate(restoId, {isrejected:true, rejectionmsg:rejectionReason});

    res.json({success:true, message:"Rejected"})
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
}

// register a admin

const registerAdmin = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({ message: "Missing required fields!" });
  }

  try {
    const existingEmail = await Admin.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({ message: "Email already in use!" });
    }

    const existingUser = await Admin.findOne({ userName });
    if (existingUser) {
      return res.status(409).json({ message: "userName already in use!" });
    }

    const newAdmin = await Admin.create({
      userName,
      email,
      password,
    });

    res
      .status(201)
      .json({ message: "Admin Registered Successfully!", newAdmin });
  } catch (error) {
    console.error("Failed at registration!", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

// login & send OTP

const loginAdmin = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    // Validate input fields
    if (
      !userName ||
      !email ||
      !password ||
      !userName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Normalize email for case-insensitive lookup
    const normalizeEmail = email.toLowerCase();

    // Find admin in database
    const findAdmin = await Admin.findOne({ email: normalizeEmail });

    if (!findAdmin) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    // Check password validity
    const isValidPassword = await bcrypt.compare(password, findAdmin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    // const otpid = await OTP.findOne({})
    // Check if an OTP already exists (prevent flooding)
    const existingOTP = await OTP.findOne({ admin: findAdmin._id });
    if (existingOTP) {
      return res.status(429).json({
        message: "OTP already sent! Please wait before requesting a new one.",
      });
    }
    
    // Generate Secure OTP
    const otp = generateOTP();

    // Hash OTP before storing (Security Improvement)
    const hashedOTP = await bcrypt.hash(otp, 10);
    const createdOTP = await new OTP({
      admin: findAdmin._id,
      otp: hashedOTP,
    }).save();

    const otpId = createdOTP._id;
    // console.log(otpId)

    // Send OTP via email
    await sendMail(
      normalizeEmail,
      "Your OTP for Login",
      `<!DOCTYPE html>
        <html>
        <head>
            <title>QuickBites - OTP Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #fff3e0;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 500px;
                    margin: 30px auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    border-top: 5px solid #ff6600;
                }
                .header {
                    background-color: #ff6600;
                    color: #ffffff;
                    padding: 15px;
                    font-size: 22px;
                    font-weight: bold;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    font-size: 16px;
                    color: #333333;
                    margin: 20px 0;
                }
                .otp-code {
                    font-size: 24px;
                    font-weight: bold;
                    color: #ffffff;
                    background: #ff6600;
                    padding: 10px 20px;
                    display: inline-block;
                    border-radius: 5px;
                    letter-spacing: 2px;
                    margin: 10px 0;
                }
                .footer {
                    font-size: 12px;
                    color: #666666;
                    margin-top: 20px;
                    border-top: 1px solid #dddddd;
                    padding-top: 10px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">QuickBites - Online Dining Solutions</div>
                <div class="content">
                    <p>Hello,</p>
                    <p>Your OTP for login is:</p>
                    <div class="otp-code">${otp}</div>
                    <p>This OTP is valid for only 5 minutes. Do not share it with anyone.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
                <div class="footer">
                    &copy; 2025 QuickBites - Online Dining Solutions. All Rights Reserved.
                </div>
            </div>
        </body>
        </html>`
    );

    res.json({ message: "OTP sent", otpId });
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    res
      .status(500)
      .json({ message: "Something went wrong! Please try again later." });
  }
};

// verify OTP & Login

  const verifyOTP = async (req, res) => {
    const { otpId, verificationCode } = req.body;

    try {
      if (!otpId || !verificationCode) {
        return res
          .status(400)
          .json({ message: "OTP ID and verification code are required!" });
      }

      const otpRecord = await OTP.findOne({ _id: otpId });

      if (!otpRecord) {
        console.error(`OTP record not found for ID: ${otpId}`);
        return res.status(401).json({ message: "Invalid OTP!" });
      }

      console.log("Found OTP record:", otpRecord);

      const isMatch = await bcrypt.compare(verificationCode, otpRecord.otp);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid OTP!" });
      }

      const token = jwt.sign(
        { adminId: otpRecord.admin },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
    
      res.setHeader("Authorization", `Bearer ${token}`);
        // await OTP.deleteOne({ _id: otpRecord._id });

      res.status(200).json({ message: "Login Successful", token });
    } catch (error) {
      console.error("Error in verifying the OTP:", error);
      res.status(500).json({ message: "Failed to verify the OTP & Login!" });
    }
  };

  const logoutAdmin = async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      const tokenFromHeader = authHeader && authHeader.split(" ")[1];
  

      console.log("Token from headers:", tokenFromHeader);
  
      const token =  tokenFromHeader;
  
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized! Token is missing." });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const adminId = decoded.adminId;
  
      // Remove OTP related to the adminId
      await OTP.deleteOne({ admin: adminId });
  
      res.clearCookie("token", {
        httpOnly: false, // Match the original setting
        secure: false,   // Match the original setting
        sameSite: "Lax", // Match the original setting
        path: "/",       // Ensure path matches
      });
  
      res.setHeader('Authorization', "");
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Failed to log out" });
    }
  };

export {getDashData, approvResto, rejectResto, registerAdmin, loginAdmin, verifyOTP, logoutAdmin}
