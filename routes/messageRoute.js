const express=require("express");
const { sendMessage, getUsersForSidebar, getMessages, updateFCMToken, testFCMConnection } = require("../services/messageServices");
const { protect } = require("../services/authServices");
const router=express.Router();

router.route("/users").get(protect,getUsersForSidebar)
router.route("/updatefcmtoken").put(protect,updateFCMToken)
router.route("/test").post(protect,testFCMConnection)

router.route("/:id").post(protect,sendMessage)
.get(protect,getMessages)





module.exports=router;