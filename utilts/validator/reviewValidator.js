const { check } = require("express-validator")
const validator =require("../../middlewares/validator")
const reveiwModel = require("../../models/reviewModel")



const getOneReviewValidator=[check("id").isMongoId().withMessage("invlid review id "),validator]


const createReviewValidator=[ 
    check("title").notEmpty().withMessage("title is required"),
    check("rating").notEmpty().withMessage("reting is required")
    .isFloat({min:1,max:5}).withMessage("rating value is from 1 to 5 "),
     check("user").isMongoId().withMessage("invalid format to user id"),
     check("listing").isMongoId().withMessage("invalid format to listing id ")
     .custom((val,{req})=>
        reveiwModel.findOne({listing:req.body.listing,user:req.currentUser._id}).then(
            (review)=>{
                if(review){
                    return Promise.reject(
                        new Error("you are already created an review before")
                    )
                }
            }
        )
       
    )
     
    ,validator]


    const deleteReviewValidator=[
        check("id").isMongoId().withMessage("invlaid review id ")
        .custom((val,{req})=>{

            if(req.currentUser.role=="user"){
                return reveiwModel.findById(val).then((review)=>{
                    if(!review){
                        return Promise.reject(new Error(`there is no reveiw for this id ${val}`))
                    }
                    if(req.currentUser._id.toString()!=review.user._id){
                        return Promise.reject(new Error("you are allowed to remove only your review"))
                    }
                })

            }
            return true;

        }
            
        )
        ,validator]


        const updateReviewValidator=[
            check("id").isMongoId().withMessage("invalid format reveiw id")
            .custom((val,{req})=>
                reveiwModel.findById(val).then((review)=>{
                    if(!review){
                        return Promise.reject(new Error(`there is no reveiw for this id ${val}`))
                    }
                    if(req.currentUser._id.toString()!=review.user._id){
                       
                        return Promise.reject(new Error("you only update your review"))
                    }

                })
            )
            ,validator]






module.exports={
    getOneReviewValidator,
    createReviewValidator,
    deleteReviewValidator,
    updateReviewValidator
}