const {Server}=require("socket.io")
const http=require("http");
const express=require("express");
const { Socket } = require("dgram");

const app =express();
const server=http.createServer(app)

const io=new Server(server);


const userSocketMap = {};
const getReceiverSocketId=(userId)=>{
    return userSocketMap[userId];
}

io.on("connection",(Socket)=>{
    console.log("a user connected ",Socket.id);
    const userId=Socket.handshake.query.userId;
    if(userId) userSocketMap[userId]=Socket.id;

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    Socket.on("disconnect",()=>{
        console.log("A user disconnected", Socket.id);
        delete  userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

module.exports={io,app,server,getReceiverSocketId}

