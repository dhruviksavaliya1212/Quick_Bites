import express from 'express';
import authUser from '../middlewares/authUser.js';
import { addToCart, removeFromCart, getCartData } from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.post('/add-cart', authUser, addToCart)
cartRouter.post('/remove-cart', authUser, removeFromCart)
cartRouter.post('/get-cart', authUser, getCartData)

export default cartRouter;