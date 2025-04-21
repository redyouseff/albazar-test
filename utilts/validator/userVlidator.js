const { check } = require("express-validator");
const validator = require("../../middlewares/validator");
const userModel = require("../../models/userModel");
const bcrypt=require("bcrypt")


const getUserValidator =[
    check("id").isMongoId().withMessage("invalid user id format")
    ,validator
]


const changePasswordValidator=[
    check("currrentPassword").notEmpty().withMessage("currentPassword can not be empty"),
    check("confirmPassword").notEmpty().withMessage("confirmPassword can not be empty"),
    check("password").notEmpty().withMessage("password is required")
    .custom(async (val,{req})=>{
        const user=await userModel.findById(req.currentUser._id)
        console.log(req.params.id)
        if(!user){
            throw new Error("user not found");
        }
        const correctPassword= await bcrypt.compare(req.body.currrentPassword,user.password);
        if(!correctPassword){


            throw new Error ("incorrect old password");

        }
        if(val!=req.body.confirmPassword){
            throw new Error("incorrent confirmation password ")
        }

    })

,validator]


module.exports={
    changePasswordValidator,
    getUserValidator

}