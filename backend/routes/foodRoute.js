import express from "express";

import { addFood, allFoods } from "../controllers/foodController.js";
import upload from "../middlewares/multer.js";

const foodRouter = express.Router();

foodRouter.post('/add-food', upload.single("image"), addFood);
foodRouter.post('/all-foods', allFoods);


export default foodRouter;