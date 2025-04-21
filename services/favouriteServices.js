 const asyncHandler = require('express-async-handler')
const userModel = require('../models/userModel')

 const addListingToFavoutite=asyncHandler(async(req,res,next)=>{
   
    const   user=await userModel.findByIdAndUpdate(req.currentUser._id,{
        $addToSet:{favourite:req.params.listingId}
    },{new:true});
    res.status(200).json({message:"product add to you favourite",
        data:user.favourite
    })
 },)


 const deleteListingFromFavourite=asyncHandler(async(req,res,next)=>{
    const user =await userModel.findByIdAndUpdate(req.currentUser._id,{
        $pull:{favourite:req.params.listingId}
    },{new:true});
    user.save();

    res.status(200).json({message:"listing removed from the favourite",
        data:user.favourite
    })
 })

 const getLoggedUserFavourites=asyncHandler(async(req,res,next)=>{
    const user =await userModel.findById(req.currentUser._id).populate("favourite");
    res.status(200).json({data:user.favourite})
 })



 module.exports =  {getLoggedUserFavourites,deleteListingFromFavourite,addListingToFavoutite}