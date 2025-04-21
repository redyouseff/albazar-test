const reveiwModel = require("../models/reviewModel");
const { createOne, getAll, getOne, updateOne, deletOne } = require("./handlersFactory");
const asyncHandler = require('express-async-handler')



const setListingIdAndUserIdToTheBody=asyncHandler((req,res,next)=>{
  
    if(!req.body.user){
        req.body.user=req.currentUser._id
    }
    if(!req.body.listing){
        req.body.listing=req.params.listingId;
    }
    next();

})

const setFilter=(req,res,next)=>{
    let filter={};
    if(req.params.listingId){
        filter={listing:req.params.listingId};
    }

    req.filterObj=filter;
    next();
}

const createReview=createOne(reveiwModel);
const getAllReveiw=getAll(reveiwModel);
const getSpesificReview=getOne(reveiwModel);
const updataReview=updateOne(reveiwModel);
const deleteReview=deletOne(reveiwModel);


module.exports={createReview,getAllReveiw,getSpesificReview,updataReview,deleteReview,setFilter,setListingIdAndUserIdToTheBody}
