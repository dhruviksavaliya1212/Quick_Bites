import express from "express"
import { logoutAdmin, registerAdmin } from "../controllers/adminController.js"
import { loginAdmin } from "../controllers/adminController.js"
import { verifyOTPAndLogin } from "../controllers/adminController.js"
import { forgotPassword } from "../controllers/adminController.js"
// import { verifyOTPAndForgotPassword } from "../"
import { verifyOTPAndForgetPasswordAdmin,getAllOrders,updateAdmin,getAdminProfile,addPromotion,updatePromotion,deletPromotion,checkPromotion,getAllPromtions } from "../controllers/adminController.js"
import upload from "../middlewares/multer.js"

const AdminAuthRouter = express.Router();

// Admin Authentication Routes
AdminAuthRouter.post("/register",upload.single("profilePhoto"), registerAdmin);
AdminAuthRouter.post("/login", loginAdmin);
AdminAuthRouter.put("/updateadmin-profile/:adminId",upload.single('profilePhoto'), updateAdmin);
AdminAuthRouter.get('/getadmin-profile',  getAdminProfile);
AdminAuthRouter.get('/getallpromotions/:adminId',  getAllPromtions);
AdminAuthRouter.post('/addpromotion',upload.single('promotionBanner'),  addPromotion);
AdminAuthRouter.put('/updatepromotion',upload.single('promotionBanner'),  updatePromotion);
AdminAuthRouter.delete('/deletpromotion',  deletPromotion);
AdminAuthRouter.post('/checkpromotion',  checkPromotion);
AdminAuthRouter.post("/forgot-password", forgotPassword);
AdminAuthRouter.post("/verify-otp-login", verifyOTPAndLogin);
AdminAuthRouter.post("/verify-otp-forgot-password", verifyOTPAndForgetPasswordAdmin);
AdminAuthRouter.post("/logout", logoutAdmin);
AdminAuthRouter.get('/getall-orders', getAllOrders);


export{ AdminAuthRouter};
