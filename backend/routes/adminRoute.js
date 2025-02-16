import express from 'express';
import { getDashData } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/dash-data', getDashData);


export default adminRouter;
