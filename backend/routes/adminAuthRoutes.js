import express from "express"
import { registerAdmin } from "../controllers/adminController.js"
import { loginAdmin } from "../controllers/adminController.js"
import { verifyOTP } from "../controllers/adminController.js"

const AdminAuthRouter = express.Router();

// Admin Authentication Routes
AdminAuthRouter.post("/register", registerAdmin);
AdminAuthRouter.post("/login", loginAdmin);
AdminAuthRouter.post("/verify-otp", verifyOTP);

export{ AdminAuthRouter};
