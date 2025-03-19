import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import foodRouter from "./routes/foodRoute.js";
import restaurantRouter from "./routes/restaurantRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import { AdminAuthRouter } from "./routes/adminAuthRoutes.js";
import adminRouter from "./routes/adminRoute.js";
import { DeliveryAgentModelRouter } from "./routes/deliveryAgentRoute.js";
// import { app, server } from './config/socket.js';

// app config
const app = express();
const server = http.createServer(app);

// port
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//midlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://quick-bites-frontend-six.vercel.app",
    "https://quickbites-admin-panel.vercel.app",
    "https://quick-bites-seller.vercel.app",
    "https://quick-bites-delivery.vercel.app",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    ,
  ],

  credentials: true, // Allow cookies and authorization headers
  exposedHeaders: ["Authorization"], //frontend can access this header
};

app.use(cors(corsOptions));

app.use("/api/food", foodRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/auth/admin", AdminAuthRouter);
app.use("/api/admin", adminRouter);
app.use("/api/delivery-agent", DeliveryAgentModelRouter);

// testing api
app.get("/", (req, res) => {
  res.send("Hello");
});

server.listen(port, () => console.log("server running on port " + port));
