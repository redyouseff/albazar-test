const mongoose=require("mongoose");

const listingShema=mongoose.Schema({
  
   
   " عنوان الاعلان":{
        type:String,
        required:[true,"title is required "],
        trim:true,
        minLength:[5,"too short title"],
        maxLength:[200,"too long title "]
    },

    "الوصف":{
        type:String,
        required:[true,"description is required"],
        minLength:[30,"too short descripton "]

    },
    "نوع العقار":{
        type:String,
    },
    "المساحه":{
        type:String
    },
    "بيع او ايجار":{
        type:String
    },
    "الكماليات":[String],
    "عدد الغرف":{
        type:Number
    },
    "عدد الحمامات ":{
        type:Number
    },
    "الفرش":{
        type:Boolean
    },
    "حاله العقار":{
        type:String
    },
    "شروط التسليم":{
        type:String
    },
    "موقع العقار ":{
        type:String
    },
    " معدل الايجار ":{
        type:String
    },
    " رسوم الايجار":{
        type:String
    },
    "التامين":{
        type:Number
    },


    "طريقه الدفع":{
        type:String
    },
    "السعر":{
        type:String
    },
    "قابل للتفاوض":{
        type:Boolean
    },
    "الاسم":{
        type:String
    },  
    "رقم التليفون":{
        type:Number
    },
    "طريقه التواصل":{
        type:String
    },

    "الصور":[String],

    "الماركه":{
        type:String
    },
    "اضافات":[String],
    "نوع الوقود":[String],
    "ناقل الحركه ":String,
   "كيلو مترات ":String,
   "مقدم":String,

  

    التصنيف:{
        type:mongoose.Schema.ObjectId,
        ref:"categore",
        required:[true,"categore is required"]
    },
    

    ratingAverage:{
        type:Number,
        min:[1,"the number must be greater than 1"],
        max:[5,"the number cant be greater than 5"]

    },
     
    ratingQuantity:{
        type:Number,
        default:0
    },


    

},{timestamps:true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


const listingModel=mongoose.model("listing",listingShema);

module.exports=listingModel;