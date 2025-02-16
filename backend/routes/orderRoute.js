import express from 'express';
import authUser from '../middlewares/authUser.js';
import { cashOnDelivery, getAllOrders, getOrders, getOrders2, paymentRazorpay, stripePayment, verifyPayment, verifyRazorpay } from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/cash-on-delivery', authUser, cashOnDelivery);
orderRouter.post('/online-stripe', authUser, stripePayment);
orderRouter.post('/verify', verifyPayment);
orderRouter.post('/online-razorpay', authUser, paymentRazorpay);
orderRouter.post('/verify-razorpay', authUser, verifyRazorpay);
orderRouter.post('/get-orders', authUser, getOrders);
orderRouter.post('/get-orders2', authSeller, getOrders2);
orderRouter.post('/get-all-orders', getAllOrders);

export default orderRouter;