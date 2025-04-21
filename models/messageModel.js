const mongoose=require("mongoose");

const messageSchema = new mongoose.Schema(
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
      },
      image: {
        type: String,
      },
    },
    { timestamps: true }
  );

  const messageModel=mongoose.model("message",messageSchema);
  
  module.exports=messageModel;