import express from 'express';
import { register, login, verifyOtp } from '../controllers/sellerController.js';

const sellerRouter = express.Router();

sellerRouter.post('/register', register);
sellerRouter.post('/login', login);
sellerRouter.post('/verify-otp', verifyOtp);

export default sellerRouter;
