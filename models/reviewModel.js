const mongoose=require("mongoose");
const listingModel = require("./listingModel");

const reviewSchema=mongoose.Schema({

    title:{
        type:String

    },
    rating:{
        type:Number,
        min:[1,"min rating is 1"],
        max:[5,"max rating is 5"],
        required:[true,"rating is requred"]
        
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:[true,"review must belong to the user "]
    },
    listing:{
        type:mongoose.Schema.ObjectId,
        ref:"listing",
        required:[true,"reveiw must belong to listing"]
    }

},{
    timestamps:true
},{timestamps:true})

reviewSchema.pre(/^find/,function(next){
    this.populate({path:"user",select:"firstname  lastname  email phone active"})
    next();

})


reviewSchema.statics.calcRatingAverageAndRatingQuantity= async function (listingId) {

    const result=await this.aggregate([
        {$match:{listing:listingId}},
        {
            $group:{
                _id:`${listingId}`,
                ratingAverage:{$avg:`$rating`},
                ratingQuantity:{$sum:1},
                count1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
                count2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
                count3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
                count4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
                count5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
              
                

            }
        }
    ])

 
   
    if(result.length>0){
     
         const list = await listingModel.findByIdAndUpdate(listingId,{
            "rating average":result[0].ratingAverage,
            "rating quantity":result[0].ratingQuantity,
            "count1":result[0].count1,
            "count2":result[0].count2,
            "count3":result[0].count3,
            "count4":result[0].count4,
            "count5":result[0].count5,



        })
     
        
    }

    else{
        await listingModel.findByIdAndUpdate(listingId,{
            "rating average":0,
            "rating quantity":0,
            "count1":0,
            "count2":0,
            "count3":0,
            "count4":0,
            "count5":0,
        })
    }

    
}

reviewSchema.post("save",async function(){
    await this.constructor.calcRatingAverageAndRatingQuantity(this.listing)
})
reviewSchema.post("remove",async function () {

    await this.constructor.calcRatingAverageAndRatingQuantity(this.listing)

})
reviewSchema.post("findOneAndDelete", async function(doc) {
    if (doc) {
        await doc.constructor.calcRatingAverageAndRatingQuantity(doc.listing);
    }
});




const reveiwModel=mongoose.model("review",reviewSchema)

module.exports=reveiwModel;


