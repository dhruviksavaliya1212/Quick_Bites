import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io"; // ✅ Correct named import
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
// import { Server } from 'socket.io'
import { AdminAuthRouter } from "./routes/adminAuthRoutes.js";
import adminRouter from "./routes/adminRoute.js";
import { DeliveryAgentModelRouter } from "./routes/deliveryAgentRoute.js";

// App config
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
      "https://quick-bites-frontend-six.vercel.app",
      "https://quickbites-admin-panel.vercel.app",
      "https://quick-bites-seller.vercel.app",
      "https://quick-bites-delivery.vercel.app",
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Port
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middlewares
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ✅ Correct socket.io usage
// const io = new Server(server, {
//   cors: { origin: "*" }
// });

const deliveryNamespace = io.of('/track');

deliveryNamespace.on('connection', (socket) => {
  console.log('Client connected to /track');

  socket.on('joinRoom', (deliveryBoyId) => {
    socket.join(deliveryBoyId);
  });

  socket.on('locationUpdate', ({ deliveryBoyId, lat, lng }) => {
    deliveryNamespace.to(deliveryBoyId).emit('location', { lat, lng });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Incoming Origin:", origin);
    const allowed = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
      "https://quick-bites-frontend-six.vercel.app",
      "https://quickbites-admin-panel.vercel.app",
      "https://quick-bites-seller.vercel.app",
      "https://quick-bites-delivery.vercel.app",
      "http://192.168.237.229:5173"
    ];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  exposedHeaders: ["Authorization"],
};
app.use(cors(corsOptions));

// Routes
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

// Socket.IO logic for location tracking
const deliveryLocations = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

socket.on('sendLocation', (data) => {
  const { deliveryAgentId, latitude, longitude } = data;
  deliveryLocations[deliveryAgentId] = { latitude, longitude };
  
  console.log(`🚀 Broadcasting location of ${deliveryAgentId}, ${latitude}, ${longitude}`);
  
  // ✅ Log if emitting works
  console.log("📢 Emitting to all clients:", { deliveryAgentId, latitude, longitude });
  
  // Emit location update to all connected clients
  io.emit('locationUpdate', { deliveryAgentId, latitude, longitude });
});

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Testing API
app.get("/", (req, res) => {
  res.send("Hello");
});

server.listen(port, () => console.log("Server running on port " + port));
