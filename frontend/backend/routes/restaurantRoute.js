import express from 'express'
import upload from '../middlewares/multer.js';
import { addRestaurant } from '../controllers/sellerController.js';


const restaurantRouter = express.Router();

restaurantRouter.post('/add-restaurant', upload.single("image"), addRestaurant);

export default restaurantRouter;