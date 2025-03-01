import express from "express"
import authSeller from "../middlewares/authSeller.js";
import { addDeliveryAgent, deleteAgent, getAgentData, getSpecificAgentData } from "../controllers/deliveryAgentController.js";

const DeliveryAgentModelRouter = express.Router();


DeliveryAgentModelRouter.post('/add-agent',authSeller, addDeliveryAgent)
DeliveryAgentModelRouter.post('/get-agents', getAgentData)
DeliveryAgentModelRouter.post('/get-specific-agents', getSpecificAgentData)
DeliveryAgentModelRouter.post('/delete-agents', deleteAgent)

export{ DeliveryAgentModelRouter};
