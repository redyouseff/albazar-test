const express=require("express");
const  {uploadCategoreImage,reasizeImage,createCategore, getSpesificCategore, updataCategore, deleteCategore, getAllCategore} = require("../services/categoreServices");
const { protect } = require("../services/authServices");
const router=express.Router();


router.route("/").post(uploadCategoreImage,reasizeImage,createCategore)
.get(getAllCategore)

router.route("/:id").get(getSpesificCategore)
.put(protect,uploadCategoreImage,reasizeImage,updataCategore)
.delete(protect,deleteCategore)






module.exports=router