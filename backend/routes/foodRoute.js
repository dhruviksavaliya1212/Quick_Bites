import express from "express";

import { addFood, allFoods } from "../controllers/foodController.js";
import upload from "../middlewares/multer.js";
import authSeller from "../middlewares/authSeller.js";

const foodRouter = express.Router();

foodRouter.post('/add-food', upload.single("image"), authSeller, addFood);
foodRouter.post('/all-foods', allFoods);


export default foodRouter;
