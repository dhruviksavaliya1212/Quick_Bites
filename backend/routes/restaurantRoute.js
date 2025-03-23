import express from 'express'
import upload from '../middlewares/multer.js';
import { acceptOrder, addRestaurant, changeAvailability, changeOrderStatus, checkResto, completeOrder, deleteResto, getFoods, getFoodsFrontend, getOrders, getRestoData, rejectOrder, removeFood, updateProfile, updateProfileAdmin } from '../controllers/restaurantController.js';
import authSeller from '../middlewares/authSeller.js';

const restaurantRouter = express.Router();

restaurantRouter.post('/add-restaurant', upload.single("image"), authSeller, addRestaurant);
restaurantRouter.post('/check-restaurant', authSeller, checkResto);
restaurantRouter.post('/get-orders', authSeller, getOrders);
restaurantRouter.post('/get-foods', authSeller, getFoods);
restaurantRouter.post('/get-foods-frontend', getFoodsFrontend);
restaurantRouter.post('/remove-food', authSeller, removeFood);
restaurantRouter.post('/accept-order', authSeller, acceptOrder);
restaurantRouter.post('/reject-order', authSeller, rejectOrder);
restaurantRouter.post('/complete-order', authSeller, completeOrder);
restaurantRouter.post('/update-profile', authSeller, updateProfile);
restaurantRouter.post('/change-availability', authSeller, changeAvailability);
restaurantRouter.post('/change-status', changeOrderStatus);
restaurantRouter.post('/get-resto-data', getRestoData);
restaurantRouter.post('/update-data-admin', updateProfileAdmin);
restaurantRouter.post('/delete-resto', deleteResto);

export default restaurantRouter;