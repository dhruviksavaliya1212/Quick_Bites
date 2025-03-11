import express from "express"
import authSeller from "../middlewares/authSeller.js";
import { inviteDeliveryAgent, deleteAgent, getAgentData, getSpecificAgentData,completeDeliveryAgentRegistration ,loginDeliveryAgent,getOrders,respondeToOrder,sendOrderCompleteOtp,completeOrderAndVerifyOtp} from "../controllers/deliveryAgentController.js";

const DeliveryAgentModelRouter = express.Router();


DeliveryAgentModelRouter.post('/invite-agent', inviteDeliveryAgent)
DeliveryAgentModelRouter.post('/complete-registration', completeDeliveryAgentRegistration)
DeliveryAgentModelRouter.post('/agent-login', loginDeliveryAgent)
DeliveryAgentModelRouter.post('/get-agents', getAgentData)
DeliveryAgentModelRouter.post('/respondeto-order', respondeToOrder)
DeliveryAgentModelRouter.post('/send-delivery-otp', sendOrderCompleteOtp)
DeliveryAgentModelRouter.post('/verify-delivery-otp', completeOrderAndVerifyOtp)
DeliveryAgentModelRouter.post('/get-orders', getOrders)
DeliveryAgentModelRouter.post('/get-specific-agents', getSpecificAgentData)
DeliveryAgentModelRouter.post('/delete-agents', deleteAgent)

export{ DeliveryAgentModelRouter};
    