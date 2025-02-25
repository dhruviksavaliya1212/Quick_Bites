import express from "express"
import { logoutAdmin, registerAdmin } from "../controllers/adminController.js"
import { loginAdmin } from "../controllers/adminController.js"
import { verifyOTPAndLogin } from "../controllers/adminController.js"
import { forgotPassword } from "../controllers/adminController.js"
// import { verifyOTPAndForgotPassword } from "../"
import { verifyOTPAndForgetPasswordAdmin } from "../controllers/adminController.js"

const AdminAuthRouter = express.Router();

// Admin Authentication Routes
AdminAuthRouter.post("/register", registerAdmin);
AdminAuthRouter.post("/login", loginAdmin);
AdminAuthRouter.post("/forgot-password", forgotPassword);
AdminAuthRouter.post("/verify-otp-login", verifyOTPAndLogin);
AdminAuthRouter.post("/verify-otp-forgot-password", verifyOTPAndForgetPasswordAdmin);
AdminAuthRouter.post("/logout", logoutAdmin);

export{ AdminAuthRouter};
