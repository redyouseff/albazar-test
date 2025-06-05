
const asyncHandler = require('express-async-handler')
const userModel = require('../models/userModel')
const { appError } = require('../utilts/appError')
const { uploadSingleImage } = require('../middlewares/uploadImage')
const sharp =require("sharp")
const { v4: uuidv4 } = require('uuid');
const bcrypt=require("bcrypt")
const createToken = require('../utilts/createToken')
const { getAll } = require('./handlersFactory')
const listingModel = require('../models/listingModel')



const uploadImage=uploadSingleImage("profileImage")

const reasizeImage =asyncHandler(async(req,res,next)=>{
    const fileName=`user-${uuidv4()}-${Date.now()}.jpeg`;
    
    if(req?.file?.buffer){
     
        sharp(req.file.buffer).resize(600,600)
        .toFormat("jpeg")
        .jpeg({quality:90})
        .toFile(`uploads/users/${fileName}`)
        req.body.profileImage=fileName;

    }



    next();
})



const creagteUser=asyncHandler(async(req,res,next)=>{
const user = await userModel.create(req.body)

res.status(200).json({state:"success",data:user})
    

})



const getSpesificUser=asyncHandler(async(req,res,next)=>{
    const user = await userModel.findById(req.params.id)
    let numberOfListing=0;
    const listing=await listingModel.find({user:req.params.id})
    if(listing){
        numberOfListing=listing.length
    }
    if(!user){
        next(new appError(`there is no user for this id ${req.params.id}`,400))
    }
    res.status(200).json({state:"success",data:user,numberOfListing:numberOfListing});
})



const getAllUser=getAll(userModel)


const updateUser=asyncHandler(async(req,res,next)=>{
    const user= await  userModel.findByIdAndUpdate(req.params.id,{
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        slug:req.body.slug,
        email:req.body.email,
        phone:req.body.phone,
        role:req.body.role,
        birthday:req.body.birthday,
        city:req.body.city,
        profileImage:req.body.profileImage

    });

    if(!user){
        next (new appError(`there is no user for this id ${req.params.id}`,400))
    }


    res.status(200).json({state:"success",data:user});
})


const deleteUser=asyncHandler(async(req,res,next)=>{
    const  user =await userModel.findByIdAndDelete(req.params.id)
    if(!user){
        next (new appErro(`there is no user for this id ${req.params.id}`,400));
    }
    res.status(200).json({message:"user is deleted"});

})

const getLoggedUser=asyncHandler(async(req,res,next)=>{
    req.params.id=req.currentUser._id

    next()
})


const updateLoggedUserPassword =asyncHandler(async(req,res,next)=>{
    const user =await userModel.findByIdAndUpdate(req.currentUser._id,{
        password:await bcrypt.hash(req.body.password,12),
        passwordChangedAt:Date.now()
    },{new:true})
    
    const token=createToken(user._id)
    res.status(200).json({data:user,token:token})


})



const updateLoggedUserData =asyncHandler(async(req,res,next)=>{
    const user=await userModel.findByIdAndUpdate(req.currentUser._id,{
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        phone:req.body.phone,
        city:req.body.city,
        birthday:req.body.birthday
        
    });

    res.status(200).json({data:user})


})


const deleteLoggedUserData =asyncHandler(async(req,res,next)=>{

    const user =await userModel.findByIdAndUpdate(req.currentUser._id,{
        active:false
    })
    res.status(200).json({state:"success"});
})



const folloewUser=asyncHandler(async(req,res,next)=>{
    const updateLoggedUser=await userModel.findByIdAndUpdate(req.currentUser._id,{
        $addToSet:{following:req.params.id}
    })
    const updateUser=await userModel.findByIdAndUpdate(req.params.id,{
        $addToSet:{followers:req.currentUser._id}
    });
    res.status(200).json({message:`user follow this id ${req.params.id} success`})
})

const unFollowUser=asyncHandler(async(req,res,next)=>{
    const updateLoggedUser =await userModel.findByIdAndUpdate(req.currentUser._id,{
        $pull:{following:req.params.id}
    })

    const updateUser=await userModel.findByIdAndUpdate(req.params.id,{
        $pull:{followers:req.currentUser._id},
    })

    res.status(200).json({message:`user unfollow this id ${req.params.id} success`})

})




module.exports=  {creagteUser,getSpesificUser,updateUser,deleteUser,getAllUser,reasizeImage,uploadImage,getLoggedUser,updateLoggedUserPassword
    ,updateLoggedUserData,
    deleteLoggedUserData,
    folloewUser,
    unFollowUser
    
}



