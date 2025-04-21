const express=require("express");
const {signUp,login,protect,forgetPassword,verifyResetCode,resetPassword} = require("../services/authServices");
const router=express.Router();

router.route("/signup").post(signUp)
router.route("/login").post(login)
router.route("/forgetPassword").post(forgetPassword);
router.route("/verifyResetCode").post(verifyResetCode);
router.route("/resetPassword").post(resetPassword)








module.exports=router