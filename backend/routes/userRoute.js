import express from 'express';
import { deleteUser, getAllUsers, getProfile, googleLogin, login, register, updateProfile, verifyOtp } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from "../middlewares/multer.js";


const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/getAllUser", getAllUsers);
userRouter.post("/delete-user", deleteUser);
userRouter.get("/google-login", googleLogin);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile",  upload.single("image"), authUser, updateProfile);

export default userRouter;
