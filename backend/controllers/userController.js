import userModel from "../models/userMOdel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import oauth2client from "../config/google.js";
import { generateOTP } from "../utills/generateOTP.js";
import { sendMail } from "../utills/sendEmail.js";
import { OTP } from "../models/OTPmodel.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check user available or not
    const user = await userModel.findOne({ email });

    if (user) {
      return res.json({ success: false, message: "User already registered!" });
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

    const userData = {
      name,
      email,
      password: hashPassword,
    };

    // store user in database
      const newUser = new userModel(userData);

      await newUser.save();

      const otp = generateOTP()
      const hashedOtp = await bcrypt.hash(otp,salt);

      // store otp in database
      const userOtp = await OTP.create({user:newUser._id,otp:hashedOtp});
      const otpId = userOtp._id;

      // sending the otp to user email
      await sendMail(email,"Your Registration OTP",
      `<!DOCTYPE html>
<html>
<head>
    <title>QuickBites - Registration OTP</title>
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
        <div class="header">Welcome to QuickBites!</div>
        <div class="content">
            <p>Hello ${name},</p>
            <p>Thank you for registering with QuickBites. Your OTP for verification is:</p>
            <div class="otp-code">${otp}</div>
            <p>This OTP is valid for only 5 minutes. Please complete your registration soon.</p>
            <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
            &copy; 2025 QuickBites - Online Dining Solutions. All Rights Reserved.
        </div>
    </div>
</body>
</html>
`)


    // create token
    // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res.json({ success: true,otpId, message: "OTP sent to your email for verification" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    // decrypt the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {

      // delete all the otp of the user before login to avoid confusion!
      await OTP.deleteMany({user:user._id});

      const otp  = generateOTP();
      const salt = await bcrypt.genSalt(10);
      const hashedOtp = await bcrypt.hash(otp,salt);

      const userOtp = await OTP.create({user:user._id,otp:hashedOtp});
      const otpId = userOtp._id;  

      // sending the otp to user email
      await sendMail(email,"Your Login OTP",  
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
        <div class="header">QuickBites - OTP Verification</div>
        <div class="content">
            <p>Hello ${user.name},</p>
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
</html>
`)

      // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      res.json({ success: true,otpId, message: "OTP sent to your email for verification" });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// verify otp and issues the token  
const verifyOtp =  async (req,res) => { 

  const {otpId,verificationcode} = req.body; 

  try {
    
    if(!otpId || !verificationcode){
      return res.json({success:false, message:"OTP ID and verification code are required!"})
    }

    const otpRecord = await OTP.findOne({_id:otpId});
    if(!otpRecord){
      return res.json({success:false, message:"OTP Not Found Or Used before!"})
    }

    const verifyOtp = bcrypt.compare(verificationcode,otpRecord.otp);
    if(!verifyOtp)
    {
      return res.status(401).json({message:"Invalid OTP!"})
    }

    const token = jwt.sign({id:otpRecord.user},process.env.JWT_SECRET,{expiresIn:"1d"});

    res.setHeader("Authorization",`Bearer ${token}`);

    await OTP.deleteOne({_id:otpRecord._id});
    
    res.status(200).json({success:true, message:"Login Successfull", token})

  } catch (error) {
    console.error("Error in verifying the OTP:", error);
    res.status(500).json({ message: "Failed to verify the OTP & Login!" });
  }
}

// Google login api
const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;

    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    let userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
                                     
    const { email, name } = userRes.data;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        name,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
   
    res.json({ success: true, token, message: "Login successfull" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// API to get user profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, gender, dob } = req.body;
    const image = req.file;

    if (!name || !phone || !address || !gender || !dob) {
      return res.json({ success: false, message: "Data missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address,
      gender,
      dob,
    });

    if (image) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
      });

      const imageUrl = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }
    res.json({ success: true, message: "Profile Updated" });
  } catch (err) {
    res.json({ success: false, message: "Something went wrong" });
    console.log(err)
  }
};

const getAllUsers = async(req,res) => {
  try {
    
    const users = await userModel.find({}).select("-password");;

    res.json({success:true, users, message:"User Fetched"})

  } catch (err) {
    res.json({ success: false, message: "Something went wrong" });
    console.log(err)
  }
}

const deleteUser = async(req,res) => {
  try {
    const {userId} = req.body;

    await userModel.findByIdAndDelete(userId)

    res.json({success:true, message:"User Deleted"})

  } catch (err) {
    res.json({ success: false, message: "Something went wrong" });
    console.log(err)
  }
}

export { register, login,verifyOtp, getProfile, updateProfile, googleLogin, getAllUsers, deleteUser };
