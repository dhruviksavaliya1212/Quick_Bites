import express from 'express';
import { approvResto, getDashData, rejectResto } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/dash-data', getDashData);
adminRouter.post('/accept-resto', approvResto);
adminRouter.post('/reject-resto', rejectResto);


export default adminRouter;
