import sellerModel from "../models/sellerModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OTP } from "../models/OTPmodel.js";
import { generateOTP } from "../utills/generateOTP.js";
import { sendMail } from "../utills/sendEmail.js";
import { Admin } from "../models/adminModel.js";
import userModel from "../models/userMOdel.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check user available or not
    const seller = await sellerModel.findOne({ email });


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
    
    if (seller) {
      return res.json({
        success: false,
        message: "Seller already registered!. Please Login",
      });
    }

    // validate the data
    if (name.length < 2) {
      return res.json({
        success: false,
        message: "name must be 2 letter or more",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "email must be in formate" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be 8 character long",
      });
    }

    // encrypt the password
    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const sellerData = {
      name,
      email,
      password: hashPassword,
    };

    // store user in database
    const newSeller = new sellerModel(sellerData);

    await newSeller.save();

    // create token
    const token = jwt.sign({ id: newSeller._id }, process.env.JWT_SECRET);

    res.json({ success: true, token, message: "Register successfull" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the seller by email
    const sellerDoc = await sellerModel.findOne({ email }); // Renamed to avoid confusion

    if (!sellerDoc) {
      return res.json({ success: false, message: "Seller not found!" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, sellerDoc.password);

    if (isMatch) {
      // Generate JWT token
      const token = jwt.sign({ id: sellerDoc._id }, process.env.JWT_SECRET);

      // Check if an existing OTP exists for this seller
      const existingOTP = await OTP.findOne({ seller: sellerDoc._id });

      if (existingOTP) {
        return res
          .status(429)
          .json({
            success: false,
            message:
              "OTP already sent! Please wait before requesting a new one.",
          });
      }

      // Generate a secure OTP
      const otp = generateOTP();
      // Hash the OTP (await the promise)
      const hashedOTP = await bcrypt.hash(otp, 10);

      // Create a new OTP document
      const createdOTP = await OTP.create({
        seller: sellerDoc._id, // Use the seller's ID from the document
        otp: hashedOTP,
      });

      const otpId = createdOTP._id;

      // Send the OTP via email
      await sendMail(
        email,
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
                      © 2025 QuickBites - Online Dining Solutions. All Rights Reserved.
                  </div>
              </div>
          </body>
          </html>`
      );

      res.json({ success: true, otpId,token, message: "OTP sent successfully!" });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (err) {
    console.error(err); // Log the full error for debugging
    res.json({ success: false, message: "Something went wrong at login" });
  }
};

const forgetPassword = async (req, res) => {  

  const { email} = req.body;

  try {
    
    if(!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    const seller = await sellerModel.findOne({email})

    if(!seller)
    {
      return res.status(400).json({success:false, message: "Email not found!" });
    }

    const generatedOtp =  generateOTP();
    const hashedOtp = await bcrypt.hash(generatedOtp,10);  
    const otp  = await OTP.create({seller:seller._id,otp:hashedOtp})
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

const verifyOTPAndForgetPasswordSeller = async (req, res) => {

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

    const seller = await sellerModel.findOne({_id:otpRecord.seller});
    if(!seller)
    {
      return res.status(401).json({ message: "seller not found!" });
    }

    const isExistPassword = await bcrypt.compare(newPassword,seller.password);
    if(isExistPassword)
    {
      return res.status(400).json({success:false, message: "New password should not be same as old password!" });
    }

    if(newPassword !== cPassword)
    {
      return res.status(400).json({success:false, message: "Password and confirm password should be same!" });
    }

    const hashedPwd = await bcrypt.hash(newPassword,10)

    const createNewPassword = await sellerModel.findByIdAndUpdate(seller._id,{password:hashedPwd},{new:true})
    console.log("New Password:",createNewPassword);

    await OTP.deleteOne({_id:otpRecord._id});

    res.status(200).json({success:true, message: "Password updated successfully!" });

  } catch (error) {
    console.error("Error in verifyOTPAndResetPassword:", error);
    return res.status(500).json({ message: "Something went wrong! Please try again later" });
    
  }

}

const verifyOTPAndLogin = async (req, res) => {
  const { otpId, verificationcode } = req.body;
  try {
    if (!otpId || !verificationcode) {
      return res
        .status(400)
        .json({
          message: "otpid and vefification are required!",
          success: false,
        });
    }

    const otp = await OTP.findOne({ _id: otpId });

    // find the otp into the database
    if(!otp)
    {
     return res.status(401).json({message:"otp not found!",success:false})
    }

    // verifies the otp
    const verifyOtpAndLogin = bcrypt.compare(verificationcode,otp.otp)
    if(!verifyOtpAndLogin)
    {
     return res.status(401).json({message:"otp is incorrect!",success:false})
    }

    const sellerId = otp.seller;

    // generate the jwt to login the seller
    const token = jwt.sign({id : sellerId}, process.env.JWT_SECRET,{expiresIn:"1d"});
    
    // sent the security headers 
    res.setHeader("Authorization",`Bearer ${token}`)

       // deletes the otp after login for security
       await OTP.deleteOne({_id:otpId})

    res.status(200).json({message:"seller otp verified and login successfully!",success:true,token})

       } catch (error) {
    console.error("error to verfiy-otp", error);
    res
      .status(500)
      .json({ message: "failed to vefify the otp", success: false });
  }
};

export { register, login, verifyOTPAndLogin ,verifyOTPAndForgetPasswordSeller, forgetPassword};

