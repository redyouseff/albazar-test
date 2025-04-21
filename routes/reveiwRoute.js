const express =require("express");
const {createReview,getAllReveiw,getSpesificReview,updataReview,deleteReview,setFilter,setListingIdAndUserIdToTheBody}= require("../services/reveiwServices");
const { protect } = require("../services/authServices");
const { getAll } = require("../services/handlersFactory");
const { getOneReviewValidator, createReviewValidator, deleteReviewValidator, updateReviewValidator } = require("../utilts/validator/reviewValidator");

const router=express.Router()


router.route("/listing/:listingId").post(protect,setListingIdAndUserIdToTheBody,createReviewValidator,createReview)

.get(setFilter,getAllReveiw)

router.route("/:id").get(getOneReviewValidator,getSpesificReview)
.put(protect,updateReviewValidator,updataReview)
.delete(protect,deleteReviewValidator,deleteReview)


module.exports=router;







