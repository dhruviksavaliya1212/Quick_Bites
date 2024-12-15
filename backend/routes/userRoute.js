import express from 'express';
import { getProfile, googleLogin, login, register, updateProfile } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';


const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/google-login", googleLogin);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", authUser, updateProfile);

export default userRouter;