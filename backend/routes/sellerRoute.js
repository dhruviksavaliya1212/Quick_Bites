import express from 'express';
import { register, login, verifyOTPAndLogin,forgetPassword,verifyOTPAndForgetPasswordSeller,getAllResponses } from '../controllers/sellerController.js';

const sellerRouter = express.Router();

sellerRouter.post('/register', register);
sellerRouter.post('/login', login);
sellerRouter.post('/getallresponses', getAllResponses);
sellerRouter.post('/verify-otp-login', verifyOTPAndLogin);
sellerRouter.post('/forget-password', forgetPassword);
sellerRouter.post('/verify-otp-forget-password', verifyOTPAndForgetPasswordSeller);


export default sellerRouter;
