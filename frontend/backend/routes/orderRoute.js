import express from 'express';
import authUser from '../middlewares/authUser.js';
import { cashOnDelivery, getOrders, paymentRazorpay, stripePayment, verifyPayment, verifyRazorpay } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/cash-on-delivery', authUser, cashOnDelivery);
orderRouter.post('/online-stripe', authUser, stripePayment);
orderRouter.post('/verify', verifyPayment);
orderRouter.post('/online-razorpay', authUser, paymentRazorpay);
orderRouter.post('/verify-razorpay', authUser, verifyRazorpay);
orderRouter.post('/get-orders', authUser, getOrders);

export default orderRouter;