const asyncHandler = require('express-async-handler')
const userModel = require('../models/userModel')
const createToken = require('../utilts/createToken')
const bcrypt=require("bcrypt")
const { appError } = require('../utilts/appError')
const  crypto = require('crypto');
let jwt = require('jsonwebtoken');
const { use } = require('../routes/userRoute')
const { sendEmail } = require('../utilts/sendMail')


const signUp=asyncHandler(async(req,res,next)=>{
    const user =await  userModel.create({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        password:req.body.password,
        phone:req.body.phone,
        city:req.body.city,
        birthday:req.body.birthday

    })

    const token=createToken(user._id)
    res.status(200).json({data:user,token:token})

})

const login =asyncHandler(async(req,res,next)=>{
    const user =await userModel.findOne({email:req.body.email})
    if(!user || !(await bcrypt.compare(req.body.password , user.password))){
        next (new appError("email or password is not correct ",500))
    }

    const token=createToken(user._id) 
    res.status(200).json({data:user,token:token})
    
})


const protect=asyncHandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return next (new appError("you are not loged in ",500));
    }
    const decode= jwt.verify(token,process.env.JWT_SECRET_KEY);
    const currentUser= await userModel.findById(decode.userId)
    if(!currentUser){
        return  next (new appError("user is nolonger exist ",500) );
    }
    const passChangedTimestamp=parseInt(
        currentUser.passwordChangedAt / 1000,
        10
      );

      if(passChangedTimestamp > decode.iat){
        return next(new appError("you are recently changed your password pleace log again "))
    }

    
    req.currentUser=currentUser;
 
    next();

})


const allowedTo=(...roles)=>{
   
    return asyncHandler(async(req,res,next)=>{
      
        if(!roles.includes(req.currentUser.role)){
            return next(new appError("you are not allowed to access this route ",500));
        }
        next();

    })
}


const forgetPassword = asyncHandler(async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
        return next(new appError(`Email not found: ${req.body.email}`, 400));
    }

   
    const resetCode = Math.floor(Math.random() * 900000) + 100000;

 
    const hashCode = await crypto.createHash("md5").update(String(resetCode)).digest("hex");

  
    user.passwordResetCode = hashCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes
    user.passwordResetVerified = false;

    await user.save();

    
    const subject = "🔐 Reset Your Password - Action Required!";
    const message = `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
            <h2 style="color: #2c3e50;">Hello ${user.name},</h2>
            <p>We received a request to reset your password. Use the code below to proceed:</p>
            <h1 style="background: #f4f4f4; padding: 10px; text-align: center; width: fit-content; margin: auto;">${resetCode}</h1>
            <p>This code is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
            <p>For security reasons, do not share this code with anyone.</p>
            <p style="margin-top: 20px;">Best regards,<br><strong>ALBazar Support Team</strong></p>
        </div>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: subject,
            message: message, 
            html: message, 
        });
    } catch (err) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
        return next(new appError("There was an error sending the email: " + err, 500));
    }

    res.json({
        status: "success",
        message: "A password reset email has been sent.",
    });
});


const verifyResetCode=asyncHandler(async(req,res,next)=>{
 
     const hashResetCode =await crypto
     .createHash("md5")
     .update(req.body.resetCode)
     .digest("hex")
     const user=await userModel.findOne({
        passwordResetCode:hashResetCode,
        passwordResetExpires:{$gt:Date.now()}
     })

     if(!user){
        return next(new appError("reset code invlaid or expire "));
     }
     user.passwordResetVerified=true;
     user.save();
     res.status(200).json({data:"success"});
})

    

const resetPassword =asyncHandler(async(req,res,next)=>{
    const user =await userModel.findOne({email:req.body.email})
    
    if(!user){
        return next(new appError("no user on this emai ! ",500));
    }
    if( !user.passwordResetVerified){
        return next (new appError("reset code are not verifyied",500))
    }
    user.password=req.body.password;
    user.passwordResetCode=undefined;
    user.passwordChangedAt=undefined;
    user.passwordResetVerified=undefined;
    await user.save();  
    const token =createToken(user._id)
    res.status(200).json({token:token})
})







module.exports=  {signUp,login,protect,forgetPassword,verifyResetCode,allowedTo,resetPassword}