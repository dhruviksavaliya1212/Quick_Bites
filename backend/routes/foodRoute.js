import express from "express";

import { addFood, allFoods, getFilteredFoods } from "../controllers/foodController.js";
import upload from "../middlewares/multer.js";
import authSeller from "../middlewares/authSeller.js";

const foodRouter = express.Router();

foodRouter.post('/add-food', upload.single("image"), authSeller, addFood);
foodRouter.post('/all-foods', allFoods);
foodRouter.post('/filtered-foods', getFilteredFoods);


export default foodRouter;
