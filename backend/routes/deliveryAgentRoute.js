import express from "express"
import authSeller from "../middlewares/authSeller.js";
import { inviteDeliveryAgent, deleteAgent, getAgentData, getSpecificAgentData,completeDeliveryAgentRegistration ,loginDeliveryAgent,getOrders} from "../controllers/deliveryAgentController.js";

const DeliveryAgentModelRouter = express.Router();


DeliveryAgentModelRouter.post('/invite-agent', inviteDeliveryAgent)
DeliveryAgentModelRouter.post('/complete-registration', completeDeliveryAgentRegistration)
DeliveryAgentModelRouter.post('/agent-login', loginDeliveryAgent)
DeliveryAgentModelRouter.post('/get-agents', getAgentData)
DeliveryAgentModelRouter.post('/get-orders', getOrders)
DeliveryAgentModelRouter.post('/get-specific-agents', getSpecificAgentData)
DeliveryAgentModelRouter.post('/delete-agents', deleteAgent)

export{ DeliveryAgentModelRouter};
    