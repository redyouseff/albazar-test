
const express =require("express");
const { protect } = require("../services/authServices");
const { addListingToFavoutite, deleteListingFromFavourite, getLoggedUserFavourites } = require("../services/favouriteServices");
const router=express.Router();


router.route("/").get(protect,getLoggedUserFavourites)


router.route("/:listingId")
.delete(protect,deleteListingFromFavourite)
.post(protect,addListingToFavoutite)



module.exports=router

