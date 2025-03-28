import express from "express"
import authSeller from "../middlewares/authSeller.js";
import { inviteDeliveryAgent, deleteAgent, getAgentData, getSpecificAgentData,completeDeliveryAgentRegistration ,loginDeliveryAgent,getOrders,respondeToOrder,sendOrderCompleteOtp,completeOrderAndVerifyOtp,getDeliveryAgentHistory,getGroupedEarnings,updateDeliveryAgentProfile,getAgentProfile} from "../controllers/deliveryAgentController.js";
import upload from "../middlewares/multer.js";

const DeliveryAgentModelRouter = express.Router();


DeliveryAgentModelRouter.post('/invite-agent', inviteDeliveryAgent)
DeliveryAgentModelRouter.post('/complete-registration', completeDeliveryAgentRegistration)
DeliveryAgentModelRouter.post('/agent-login', loginDeliveryAgent)
DeliveryAgentModelRouter.post('/get-agents', getAgentData)
DeliveryAgentModelRouter.post('/get-agentprofile', getAgentProfile)
DeliveryAgentModelRouter.post('/respondeto-order', respondeToOrder)
DeliveryAgentModelRouter.post('/send-delivery-otp', sendOrderCompleteOtp)
DeliveryAgentModelRouter.post('/verify-delivery-otp', completeOrderAndVerifyOtp)
DeliveryAgentModelRouter.get('/delivery-history/:deliveryAgentId',getDeliveryAgentHistory)
DeliveryAgentModelRouter.get('/deliveryAgent-earnings/:deliveryAgentId',getGroupedEarnings)
DeliveryAgentModelRouter.put('/updateAgent-profile',upload.single("profilePhoto"),updateDeliveryAgentProfile)
DeliveryAgentModelRouter.post('/get-orders', getOrders)
DeliveryAgentModelRouter.post('/get-specific-agents', getSpecificAgentData)
DeliveryAgentModelRouter.post('/delete-agents', deleteAgent)

export{ DeliveryAgentModelRouter};
    