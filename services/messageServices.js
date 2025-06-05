const asyncHandler = require('express-async-handler');
const messageModel = require('../models/messageModel');
const { getReceiverSocketId, io } = require('../config/socker');
const apiFeatures = require('../utilts/apiFeatures');
const { appError } = require('../utilts/appError');
const userModel = require('../models/userModel');
const admin=require("../config/firebase")

const sendMessage=asyncHandler(async(req,res,next)=>{

    const { text, image } = req.body;
    const { id: receiverId } = req.params;
   
    const senderId = req.currentUser._id;
    req.body.receiverId=receiverId;
    req.body.senderId=senderId

    const sender = await userModel.findById(senderId).select('firstname lastname profileImage');
    const receiver = await userModel.findById(receiverId).select('firstname lastname fcmToken');


    const message=await messageModel.create(req.body);

    if(!message){
        return next (new appError("there is erro on creating message",400));
    }

    const receiverSocketId=getReceiverSocketId(receiverId);
    const senderSocketId=getReceiverSocketId(senderId);

    const notificationData = {
      message: text,
      senderName: `${sender.firstname} ${sender.lastname}`,
      senderImage: `${process.env.BASE_URL}/users/${sender.profileImage}`,
      timestamp: new Date(),
      messageId: message._id
  };



    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",message);
        io.to(receiverSocketId).emit("newMessageNotification", notificationData);
        
    }


    if (receiver.fcmToken) {
   
      try {
          const fcmMessage = {
              notification: {
                  title: `New message from ${sender.firstname} ${sender.lastname}`,
                  body: text || 'New message received',
              },
              data: {
                  messageId: message._id.toString(),
                  senderId: senderId.toString(),
                  type: 'new_message',
                  click_action: 'FLUTTER_NOTIFICATION_CLICK', // For Flutter apps
              },
              token: receiver.fcmToken
          };

          await admin.messaging().send(fcmMessage);
         
      } catch (error) {
          console.log('Error sending FCM notification:',error);
          // Don't throw error as message is already sent
      }
  }

    
    if(receiverSocketId){
      io.to(receiverSocketId).emit("updateSidebar");
    }
      if(senderSocketId){
        io.to(senderSocketId).emit("updateSidebar");
      }


    res.status(200).json({message});
    
    
})


const updateFCMToken=asyncHandler(async(req,res,next)=>{
  const {fcmToken}=req.body;
  const user=await userModel.findByIdAndUpdate(req.currentUser._id,{
    fcmToken
  })
  
  res.status(200).json({ message: 'FCM token updated successfully' });

})


const getUsersForSidebar = asyncHandler(async (req, res, next) => {
  const loggedInUserId = req.currentUser._id;

  const usersWithLastMessage = await messageModel.aggregate([
    {
      $match: {
        $or: [
          { senderId: loggedInUserId },
          { receiverId: loggedInUserId }
        ]
      }
    },
    {
      $addFields: {
        chatKey: {
          $cond: {
            if: { $gt: ["$senderId", "$receiverId"] },
            then: { $concat: [{ $toString: "$senderId" }, "_", { $toString: "$receiverId" }] },
            else: { $concat: [{ $toString: "$receiverId" }, "_", { $toString: "$senderId" }] }
          }
        }
      }
    },
    {
      $sort: { createdAt: -1 } 
    },
    {
      $group: {
        _id: "$chatKey", 
        lastMessage: { $first: "$$ROOT" } 
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "lastMessage.senderId",
        foreignField: "_id",
        as: "senderUser"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "lastMessage.receiverId",
        foreignField: "_id",
        as: "receiverUser"
      }
    },
    {
      $unwind: "$senderUser"
    },
    {
      $unwind: "$receiverUser"
    },
    {
      $project: {
        _id: {
          $cond: {
            if: { $eq: ["$lastMessage.senderId", loggedInUserId] },
            then: "$receiverUser._id",
            else: "$senderUser._id"
          }
        },
        firstname: {
          $cond: {
            if: { $eq: ["$lastMessage.senderId", loggedInUserId] },
            then: "$receiverUser.firstname",
            else: "$senderUser.firstname"
          }
        },
        lastname: {
          $cond: {
            if: { $eq: ["$lastMessage.senderId", loggedInUserId] },
            then: "$receiverUser.lastname",
            else: "$senderUser.lastname"
          }
        },
        phone: {
          $cond: {
            if: { $eq: ["$lastMessage.senderId", loggedInUserId] },
            then: "$receiverUser.phone",
            else: "$senderUser.phone"
          }
        },
        email: {
          $cond: {
            if: { $eq: ["$lastMessage.senderId", loggedInUserId] },
            then: "$receiverUser.email",
            else: "$senderUser.email"
          }
        },
        profileImage: {
          $cond: {
            if: { $eq: ["$lastMessage.senderId", loggedInUserId] },
            then: { $concat: [process.env.BASE_URL, "/users/", "$receiverUser.profileImage"] },
            else: { $concat: [process.env.BASE_URL, "/users/", "$senderUser.profileImage"] }
          }
        },
        
        lastMessage: {
          text: "$lastMessage.text",
          createdAt: "$lastMessage.createdAt",
          senderId: "$lastMessage.senderId"
        }
      }
    },
    {
      $sort: { "lastMessage.createdAt": -1 } // Sorting conversations by the latest message
    }
  ]);

  res.status(200).json(usersWithLastMessage);
});



const getMessages=asyncHandler(async(req,res,next)=>{
    const message=await messageModel.find({
        $or:[
            {receiverId:req.params.id,senderId:req.currentUser._id},
            {receiverId:req.currentUser._id,senderId:req.params.id},
           ]      
    })

    res.status(200).json(message)  

})




const testFCMConnection = asyncHandler(async(req, res, next) => {
  try {
      // Get project details
      const projectId = admin.app().options.projectId;
      const apps = admin.apps.length;

      // Try to send a test message to a topic
      const testMessage = {
          notification: {
              title: 'Test',
              body: 'Testing FCM connection'
          },
          topic: 'test'  // Using topic instead of token for testing
      };

      const response = await admin.messaging().send(testMessage);

      res.status(200).json({
          success: true,
          projectId,
          apps,
          messageId: response
      });
  } catch (error) {
      console.error('FCM Test Error:', error);
      res.status(400).json({
          success: false,
          error: error.message,
          errorInfo: error.errorInfo || {},
          projectId: admin.app().options.projectId
      });
  }
});





module.exports={sendMessage,getUsersForSidebar,getMessages,updateFCMToken,testFCMConnection};

