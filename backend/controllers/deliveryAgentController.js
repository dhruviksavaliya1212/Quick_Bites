import deliveryAgentModel from "../models/deliveryAgentModel.js";
import restaurantModel from "../models/restaurantModel.js";


const addDeliveryAgent = async(req,res) => {
  try {
    const {sellerId, firstName, lastName, contactNo, email, gender} = req.body;
    console.log(sellerId, firstName, lastName, contactNo, email, gender)

    if(!firstName || !lastName || !contactNo || !email || !gender){
      return res.json({success:false, message:"Missing Fields"})
    }

    const restoData = await restaurantModel.find({sellerId:sellerId})

    const deliveryAgentData = {
      sellerId,
      firstName,
      lastName,
      contactNo,
      email,
      gender,
      restoname:restoData[0].name,
    }

    const newDeliveryAgent = new deliveryAgentModel(deliveryAgentData)

    await newDeliveryAgent.save();

    return res.json({success:true, message:"Delivery Agent Added"})

  } catch (err) {
    console.log(err)
    res.json({success:false, message:"Something went wrong"})
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


export {addDeliveryAgent,getAgentData,deleteAgent,getSpecificAgentData}