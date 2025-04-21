const express=require("express");
const { creatListing, uploadlistingImag, getAllListing, getSpesificListing, updateListing, deleteListing ,reasizeImage, getLoggedUserListing
    ,acceptListing,
    rejectListing, 
    getFollowinglisting
} = require("../services/listingService");
const { protect, allowedTo } = require("../services/authServices");


const router=express.Router();




router.route("/followinglisting").get(protect,getFollowinglisting)
router.route("/userListing").get(protect,getLoggedUserListing)
router.route('/').post(protect,uploadlistingImag,reasizeImage,(req,res,next)=>{
    req.body.user=req.currentUser._id;
    next();    
},creatListing)
.get(getAllListing)
router.route("/:id").get(getSpesificListing)
.put(uploadlistingImag,updateListing)
.delete(deleteListing)





router.route("/accept/:id").put(protect,allowedTo("admin"),acceptListing)
router.route("/reject/:id").put(protect,allowedTo("admin"),rejectListing)



module.exports=router;   





