import express from "express"
import authSeller from "../middlewares/authSeller.js";
import { addDeliveryAgent, deleteAgent, getAgentData } from "../controllers/deliveryAgentController.js";

const DeliveryAgentModelRouter = express.Router();


DeliveryAgentModelRouter.post('/add-agent',authSeller, addDeliveryAgent)
DeliveryAgentModelRouter.post('/get-agents', getAgentData)
DeliveryAgentModelRouter.post('/delete-agents', deleteAgent)

export{ DeliveryAgentModelRouter};
