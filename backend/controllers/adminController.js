import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/adminModel.js";
import { OTP } from "../models/OTPmodel.js";
import { generateOTP } from "../utills/generateOTP.js";
import { sendMail } from "../utills/sendEmail.js";
import sellerModel from "../models/sellerModel.js";
import userModel from "../models/userMOdel.js";

// register a admin

const registerAdmin = async (req, res) => {
  const { userName, email, password } = req.body;



  if (!userName || !email || !password) {
    return res.status(400).json({ message: "Missing required fields!" });
  }

  try {

    const isEmailTaken = await Promise.all([
      Admin.findOne({ email }),
      sellerModel.findOne({ email }),
      userModel.findOne({ email })
    ]);
    
    if (isEmailTaken.some(result => result)) {
      return res.status(400).json({
        success: false,
        message: "This Email is already in use. Please use another email!",
      });
    }
    
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


const forgotPassword = async (req, res) => {  

  const { email} = req.body;

  try {
    
    if(!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    const admin  = await Admin.findOne({email})

    if(!admin)
    {
      return res.status(400).json({success:false, message: "Email not found!" });
    }

    const generatedOtp =  generateOTP();
    const hashedOtp = await bcrypt.hash(generatedOtp,10);  
    const otp  = await OTP.create({admin:admin._id,otp:hashedOtp})
    const otpId = otp._id;

    await sendMail(email,"Your OTP for Reset Password",
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
    )
 
       res.status(200).json({success:true,otpId, message: "otp sent to your mail for forget password!" });

  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ message: "Something went wrong! Please try again later." });
  }
}

// verify otp and reset password

const verifyOTPAndForgetPasswordAdmin = async (req, res) => {

  const {otpId,verificationCode,newPassword,cPassword} = req.body;

  try {
    
    if(!otpId || !verificationCode)
    {
      return res.status(400).json({ message: "OTP ID and verification code are required!" });
    }

    const otpRecord = await OTP.findOne({_id:otpId});
    if(!otpRecord)
    {
      return res.status(401).json({ message: "OTP Record not found!" });
    }

    const isMatch = await bcrypt.compare(verificationCode,otpRecord.otp);
    if(!isMatch)
    {
      return res.status(401).json({ message: "Invalid OTP!" });
    }

    const admin = await Admin.findOne({_id:otpRecord.admin});
    if(!admin)
    {
      return res.status(401).json({ message: "Admin not found!" });
    }

    const isExistPassword = await bcrypt.compare(newPassword,admin.password);
    if(isExistPassword)
    {
      return res.status(400).json({success:false, message: "New password should not be same as old password!" });
    }

    if(newPassword !== cPassword)
    {
      return res.status(400).json({success:false, message: "Password and confirm password should be same!" });
    }

    const hashedPwd = await bcrypt.hash(newPassword,10)

    const createNewPassword = await Admin.findByIdAndUpdate(admin._id,{password:hashedPwd},{new:true})
    console.log("New Password:",createNewPassword);

    await OTP.deleteOne({_id:otpRecord._id});

    res.status(200).json({success:true, message: "Password updated successfully!" });


  } catch (error) {
    console.error("Error in verifyOTPAndResetPassword:", error);
    return res.status(500).json({ message: "Something went wrong! Please try again later" });
    
  }

}

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

        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        // console.log("Auth Header:", authHeader); // Check if it's received

        // Directly use authHeader if there's no "Bearer" prefix
        const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

        // console.log("Token from headers:", tokenFromHeader); // Final check

        if (!tokenFromHeader) {
            return res.status(401).json({ message: "Unauthorized! Token is missing." });
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

        res.setHeader('Authorization', "");
        res.json({ message: "Logged out successfully" });

    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Failed to log out" });
    }
};


  

export { registerAdmin, loginAdmin, verifyOTPAndLogin, logoutAdmin,verifyOTPAndForgetPasswordAdmin,forgotPassword };
