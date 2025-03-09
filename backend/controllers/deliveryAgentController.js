import deliveryAgentModel from "../models/deliveryAgentModel.js";
import restaurantModel from "../models/restaurantModel.js";
import crypto from "crypto";
import { sendMail } from "../utills/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const inviteDeliveryAgent  = async(req,res) => {
  try {
    const {sellerId, firstName, lastName, contactNo, email, gender} = req.body;
    // console.log(sellerId, firstName, lastName, contactNo, email, gender)

    if(!firstName || !lastName || !contactNo || !email || !gender){
      return res.json({success:false, message:"Missing Fields"})
    }

    const existing = await deliveryAgentModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already used" });
    }

    const restoData = await restaurantModel.find({sellerId:sellerId})

    if (!restoData) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
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
      restoname:restoData[0].name,
      secretCode,
      codeexpiresAt,
      isRegistered:false,
    }

    const newDeliveryAgent = new deliveryAgentModel(deliveryAgentData)

    await newDeliveryAgent.save();

    const inviteCode = secretCode;

    await sendMail(email,"Delivery boy Invite Code",
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
`)

res.json({ success: true, message: "Invitation sent successfully" });

  } catch (err) {
    console.error(error)
    const statuscode = error.statusCode || 500;
    const errorMessage = error.message || 'Something went wrong';
    res.status(statuscode).json({success:false, message:errorMessage})
  }
}

const completeDeliveryAgentRegistration = async (req,res) => {

  try {

    const {secretCode,password,licenceNumber,vehicleNumber} = req.body;
    
    if(!secretCode || !password || !licenceNumber || !vehicleNumber){
      return res.status(400).json({success:false, message:"Missing Fields"})
    }

    const agent = await deliveryAgentModel.findOne({secretCode:secretCode});

    if(!agent){
      return res.status(404).json({success:false, message:"Invalid Code"})
    }

    if(agent.codeexpiresAt < new Date()){
      return res.status(400).json({success:false, message:"Code Expired"})
    }

    if(agent.isRegistered){
      return res.status(400).json({success:false, message:"Already Registered"})
    }

    const hashPassword = await bcrypt.hash(password, 10);
    agent.password = hashPassword;
    agent.licenseNumber = licenceNumber.toUpperCase();  
    agent.vehicleNumber = vehicleNumber.toUpperCase();
    agent.isRegistered = true;
    agent.codeexpiresAt = "";
    agent.secretCode = "";
    agent.joinDate = Date.now();
    agent.isRegistered = true;
    await agent.save();
   
    // const token = jwt.sign({email:agent.email, id:agent._id}, process.env.JWT_SECRET, {expiresIn:"1h"})

    res.json({success:true, message:"Registration Completed Head to login!"})

  } catch (error) {
    console.error(error)
    const statuscode = error.statusCode || 500;
    const errorMessage = error.message || 'Something went wrong';
    res.status(statuscode).json({success:false, message:errorMessage})
  }
}

const loginDeliveryAgent  = async(req,res) => {
  try {

    const {email,password} = req.body;

    if(!email || !password)
    {
      return res.status(400).json({success:false, message:"Missing Fields"})
    }

    const agent = await deliveryAgentModel.findOne({email:email}); 
    if(!agent)
    {
      return res.status(404).json({success:false, message:"agent not found!"})
    }

    if(!agent.isRegistered)
    {
      return res.status(400).json({success:false, message:"Agent not registered"})
    }

    const isPasswordCorrect = await bcrypt.compare(password, agent.password);
    if(!isPasswordCorrect)
    {
      return res.status(400).json({success:false, message:"Invalid Credentials"})
    }

    const token = jwt.sign({email:agent.email, id:agent._id}, process.env.JWT_SECRET, {expiresIn:"1h"})
    res.json({success:true, token, message:"Logged In Successfully!"})

  } catch (error) {
    console.error(error)
    const statuscode = error.statusCode || 500;
    const errorMessage = error.message || 'Something went wrong'; 
    res.status(statuscode).json({success:false, message:errorMessage})
  }
}

const getAgentData = async(req,res) => {
  try {
    const agentData = await deliveryAgentModel.find({});
    res.json({success:true, agentData, message:"Done"})
  } catch (err) {
    console.log(err)
    res.json({success:false, message:"Something went wrong"})
  }
}

const getSpecificAgentData = async(req,res) => {
  const {sellerId} = req.body
  try {
    const agentData = await deliveryAgentModel.find({sellerId:sellerId});
    res.json({success:true, agentData, message:"Done"})
  } catch (err) {
    console.log(err)
    res.json({success:false, message:"Something went wrong"})
  }
}

const deleteAgent = async(req,res) => {
  try {
    const {id} = req.body
    console.log(id)
    await deliveryAgentModel.findByIdAndDelete(id);
    res.json({success:true, message:"Agent Deleted"})
  } catch (err) {
    console.log(err)
    res.json({success:false, message:"Something went wrong"})
  }
}


export {inviteDeliveryAgent,getAgentData,deleteAgent,getSpecificAgentData,completeDeliveryAgentRegistration,loginDeliveryAgent}
