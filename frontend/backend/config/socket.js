import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

// app config
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin:[process.env.FRONTEND],
  }
})

io.on("connection",(socket)=>{
  socket.on("send-location", (data)=>{
    io.emit("receive-location",{id:socket.id, ...data});
  })
  console.log("connected", socket.id)
})

export {app, server,io}