import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import foodRouter from './routes/foodRoute.js';
import restaurantRouter from './routes/restaurantRoute.js';

// app config
const app = express();

// port
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//midlewares
app.use(express.json());
app.use(cors());

app.use("/api/food", foodRouter)
app.use("/api/restaurant", restaurantRouter)

// testing api
app.get('/',(req,res)=>{
  res.send("Hello")
})


app.listen(port,()=>console.log("server running on port " + port));