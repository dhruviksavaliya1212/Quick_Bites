import express from 'express';
import { approvResto, getDashData, rejectResto,getMonthlyRevenue,getDailyOrders } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/get-revenue', getMonthlyRevenue);
adminRouter.get('/get-dailyorders', getDailyOrders);
adminRouter.get('/dash-data', getDashData);
adminRouter.post('/accept-resto', approvResto);
adminRouter.post('/reject-resto', rejectResto);


export default adminRouter;
