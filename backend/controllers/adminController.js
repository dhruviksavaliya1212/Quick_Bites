import orderModel from "../models/orderModel.js";
import restaurantModel from "../models/restaurantModel.js";
import userModel from "../models/userMOdel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/adminModel.js";
import { OTP } from "../models/OTPmodel.js";
import { generateOTP } from "../utills/generateOTP.js";
import { sendMail } from "../utills/sendEmail.js";
import sellerModel from "../models/sellerModel.js";
import { PromotionModel } from "../models/promotion.js";
import connectCloudinary from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const getDashData = async (req, res) => {
  try {
    const orderData = await orderModel.find({});

    const filterData = orderData.filter((order, _) => order.payment);
    const getAmount = filterData.map((order) => order.amount);
    let revenue = 0;
    getAmount.forEach((amount) => (revenue += amount));

    const users = await userModel.find({});

    const pendingOrders = orderData.filter(
      (order, _) => order.status !== "Delivered"
    );
    const deliveredOrders = orderData.filter(
      (order, _) => order.status === "Delivered"
    );

    const resto = await restaurantModel.find({});

    const dashData = {
      totalOrders: orderData.length,
      revenue,
      totalUsers: users.length,
      pendingOrders: pendingOrders.length,
      deliveredOrders: deliveredOrders.length,
      totalResto: resto.length,
    };

    res.json({ success: true, dashData, message: "Data Fetched" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const approvResto = async (req, res) => {
  try {
    const { restoId } = req.body;

    await restaurantModel.findByIdAndUpdate(restoId, {
      isrequested: false,
      isOpen: true,
    });

    res.json({ success: true, message: "Accepted" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const rejectResto = async (req, res) => {
  try {
    const { restoId, rejectionReason } = req.body;

    console.log(restoId, rejectionReason);

    await restaurantModel.findByIdAndUpdate(restoId, {
      isrejected: true,
      isOpen: false,
      rejectionmsg: rejectionReason,
    });

    res.json({ success: true, message: "Rejected" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// register a admin

const registerAdmin = async (req, res) => {
  const { userName, email, password, gender, address, profilePhoto, DOB } =
    req.body;

  if (!userName || !email || !password || !DOB) {
    return res.status(400).json({ message: "Missing required fields!" });
  }

  let profilephoto = null;

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "admin_folder",
      });
      profilephoto = result.secure_url;
      fs.unlinkSync(req.file.path);
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return res.status(500).json({ message: "Profile photo upload failed!" });
    }
  }

  try {
    // Check if email exists in any of the models
    const isEmailTaken = await Promise.all([
      Admin.findOne({ email }),
      sellerModel.findOne({ email }),
      userModel.findOne({ email }),
    ]);

    if (isEmailTaken.some((result) => result)) {
      return res.status(400).json({
        success: false,
        message: "This Email is already in use. Please use another email!",
      });
    }

    // Check if username is already taken
    const existingUser = await Admin.findOne({ userName });
    if (existingUser) {
      return res.status(409).json({ message: "Username already in use!" });
    }

    const [day, month, year] = DOB.split("/");
    const parsedDOB = new Date(`${year}-${month}-${day}`);
    if (isNaN(parsedDOB.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid DOB format! Use DD/MM/YYYY." });
    }

    // Create new Admin
    const newAdmin = await Admin.create({
      userName,
      email,
      password,
      DOB: parsedDOB,
      address,
      gender,
      profilePhoto: profilephoto,
    });

    res
      .status(201)
      .json({ message: "Admin Registered Successfully!", newAdmin });
  } catch (error) {
    console.error("Failed at registration!", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

// get the admin-profile
const getAdminProfile = async (req, res) => {
  try {
    const { adminId } = req.query;

    if (!adminId) {
      return res
        .status(400)
        .json({ message: "adminId is required in query params." });
    }

    const admin = await Admin.findById(adminId).select("-password"); // exclude password

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    res.status(200).json({ admin });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch admin profile." });
  }
};

// update the admin
const updateAdmin = async (req, res) => {
  const { userName, email, password, gender, address, DOB } = req.body;
  const adminId = req.params.adminId;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Handle optional profile photo
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "admin_folder",
        });
        admin.profilePhoto = result.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return res
          .status(500)
          .json({ message: "Profile photo upload failed!" });
      }
    }

    // Update only provided fields
    if (userName) admin.userName = userName;
    if (email) admin.email = email;
    if (password) admin.password = password;
    if (gender) admin.gender = gender;
    if (address) admin.address = address;

    if (DOB) {
      const [day, month, year] = DOB.split("/");
      const parsedDOB = new Date(`${year}-${month}-${day}`);
      if (isNaN(parsedDOB.getTime())) {
        return res
          .status(400)
          .json({ message: "Invalid DOB format! Use DD/MM/YYYY." });
      }
      admin.DOB = parsedDOB;
    }

    await admin.save();
    res.status(200).json({ message: "Admin updated successfully", admin });
  } catch (error) {
    console.error("Admin update failed:", error);
    res.status(500).json({ message: "Internal server error" });
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

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Email not found!" });
    }

    const generatedOtp = generateOTP();
    const hashedOtp = await bcrypt.hash(generatedOtp, 10);
    const otp = await OTP.create({ admin: admin._id, otp: hashedOtp });
    const otpId = otp._id;

    await sendMail(
      email,
      "Your OTP for Reset Password",
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
                  <p>Your OTP for forget password is:</p>
                  <div class="otp-code">${generatedOtp}</div>
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

    res.status(200).json({
      success: true,
      otpId,
      message: "otp sent to your mail for forget password!",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong! Please try again later." });
  }
};

// verify otp and reset password

const verifyOTPAndForgetPasswordAdmin = async (req, res) => {
  const { otpId, verificationCode, newPassword, cPassword } = req.body;

  try {
    if (!otpId || !verificationCode) {
      return res
        .status(400)
        .json({ message: "OTP ID and verification code are required!" });
    }

    const otpRecord = await OTP.findOne({ _id: otpId });
    if (!otpRecord) {
      return res.status(401).json({ message: "OTP Record not found!" });
    }

    const isMatch = await bcrypt.compare(verificationCode, otpRecord.otp);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid OTP!" });
    }

    const admin = await Admin.findOne({ _id: otpRecord.admin });
    if (!admin) {
      return res.status(401).json({ message: "Admin not found!" });
    }

    const isExistPassword = await bcrypt.compare(newPassword, admin.password);
    if (isExistPassword) {
      return res.status(400).json({
        success: false,
        message: "New password should not be same as old password!",
      });
    }

    if (newPassword !== cPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password should be same!",
      });
    }

    const hashedPwd = await bcrypt.hash(newPassword, 10);

    const createNewPassword = await Admin.findByIdAndUpdate(
      admin._id,
      { password: hashedPwd },
      { new: true }
    );
    console.log("New Password:", createNewPassword);

    await OTP.deleteOne({ _id: otpRecord._id });

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error in verifyOTPAndResetPassword:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong! Please try again later" });
  }
};

// verify OTP & Login

const verifyOTPAndLogin = async (req, res) => {
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
    // console.log("Received Headers:", req.headers); // Debugging

    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];
    // console.log("Auth Header:", authHeader); // Check if it's received

    // Directly use authHeader if there's no "Bearer" prefix
    const tokenFromHeader = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    // console.log("Token from headers:", tokenFromHeader); // Final check

    if (!tokenFromHeader) {
      return res
        .status(401)
        .json({ message: "Unauthorized! Token is missing." });
    }

    const decoded = jwt.verify(tokenFromHeader, process.env.JWT_SECRET);
    const adminId = decoded.adminId;

    // Remove OTP related to the adminId
    await OTP.deleteOne({ admin: adminId });

    res.clearCookie("token", {
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
      path: "/",
    });

    res.setHeader("Authorization", "");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Failed to log out" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orderData = await orderModel.find();
    res.json({ success: true, orderData });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const getAllPromtions = async (req, res) => {
  const { adminId } = req.params;

  try {
    if (!adminId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "adminId is required to fetch the promotions!",
        });
    }

    const promotions = await PromotionModel.find({ adminId });
    if (!promotions) {
      return res
        .status(404)
        .json({ success: false, message: "promotions not found!" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "promotions fetched successfully!",
        promotions,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: true, message: "failed to fetch the promotions" });
  }
};

const addPromotion = async (req, res) => {
  const { promotionName, discount, offerCode, adminId } = req.body;
  const _id = adminId;
  try {
    if (!promotionName || !discount || !offerCode || !adminId) {
      return res
        .status(400)
        .json({ success: false, message: "missing fields!" });
    }

    const admin = await Admin.findById(_id);
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "TO add the promtion admin is required!",
      });
    }

    const isExist = await PromotionModel.findOne({ offerCode });
    if (isExist) {
      return res
        .status(409)
        .json({ success: false, message: "promotion already exist" });
    }

    let promotionurl;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "promotionbanner is required!" });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file?.path, {
        folder: "promotions",
      });

      if (result) {
        promotionurl = result.secure_url;
      }
    }

    const promotion = await PromotionModel.create({
      promotionName,
      promotionBanner: promotionurl,
      discount,
      offerCode,
      adminId,
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      message: "promotion added successfully",
      promotion,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "failed to add promotion!" });
  }
};

const deletPromotion = async (req, res) => {
  const { promtotionId } = req.body;

  const _id = promtotionId;

  try {
    const isexist = await PromotionModel.findById(_id);
    if (!isexist) {
      return res
        .status(404)
        .json({ success: false, message: "Promotion Not Found For Deletion!" });
    }

    await PromotionModel.deleteOne({ _id });

    return res
      .status(200)
      .json({ success: true, message: "promotion deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "failed to delete the promotion" });
  }
};

const updatePromotion = async (req, res) => {
  const { promotionId, promotionName, discount, offerCode, adminId } = req.body;
  const _id = promotionId;
  try {
    if (!promotionName || !discount || !offerCode) {
      return res
        .status(400)
        .json({ success: false, message: "missing fields!" });
    }

    const isexist = await PromotionModel.findById(_id);
    if (!isexist) {
      return res
        .status(404)
        .json({ success: false, message: "Promotion Not Found For Deletion!" });
    }

    let promotionurl;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "promotionbanner is required!" });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file?.path, {
        folder: "promotions",
      });

      if (result) {
        promotionurl = result.secure_url;
      }
    }

    // updating the record

    const updatedPromtion = await PromotionModel.findByIdAndUpdate(
      { _id },
      {
        promotionName: promotionName,
        discount: discount,
        offerCode: offerCode,
        promotionBanner: promotionurl,
      }
    );

    return res
      .status(200)
      .json({
        success: true,
        message: "promotion updated successfully",
        updatedPromtion,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "failed to update the promotion!" });
  }
};

const checkPromotion = async (req, res) => {
  const { offerCode } = req.body;
  try {
    const promotion = await PromotionModel.findOne({ offerCode });
    if (!promotion) {
      return res
        .status(404)
        .json({ success: false, message: "promotion not found to check" });
    }

    if (!promotion.isActive) {
      return res
        .status(403)
        .json({
          success: false,
          message: "promotion is not 'Availabe/Active' to use",
        });
    }

    return res
      .status(200)
      .json({ success: true, message: "promotion is valid to be applied!" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "failed to check the promotion" });
  }
};

export {
  getDashData,
  getAllOrders,
  forgotPassword,
  approvResto,
  rejectResto,
  registerAdmin,
  loginAdmin,
  verifyOTPAndLogin,
  verifyOTPAndForgetPasswordAdmin,
  logoutAdmin,
  updateAdmin,
  getAdminProfile,
  getAllPromtions,
  addPromotion,
  updatePromotion,
  deletPromotion,
  checkPromotion,
};
