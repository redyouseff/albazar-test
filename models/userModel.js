const mongoose=require("mongoose");
const bcrypt = require('bcrypt');

const userShema=  mongoose.Schema({
    firstname:{
        type:String,
        required:[true,"first name is required"],
        trim:true
    },
    lastname:{
        type:String,
        required:[true,"last name is required"],
        trim:true
    },
    about:{
        type:String
    },
    slug:{
        type:String,
        lowercase:true,
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        lowercase:true,
    },
    phone:{
    type:String
    },
    profileImage:String,
    password:{
        type:String,
        required:[true,"password is required"],
        minLength:[6,"too short password"]
    },
    role:{
        type:String,
        enum:["user","seller","admin"],
        default:"user"
    },
    active:{
        type:Boolean,
        default:true,
    },
    Balance:{
        type:Number,
        default:5
    },
    passwordChangedAt:{
        type:Date,
    },
    
    birthday:{
        type:Date
    },
    city:{
        type:String
    },
    fcmToken: {
        type: String,
        default: null
    },

    passwordResetCode:String,
    passwordResetExpires:Date,
    passwordResetVerified:Boolean,
   
    favourite:[{
        type:mongoose.Schema.ObjectId,
        ref:"listing"
       
    }],
    followers:[{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        default:[]

    }],


    following:[{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        default:[]

    }]


    

},{timestamps:true})


const setImageUrl=(doc)=>{
 
    if(doc.profileImage){
        const imageUrl=`${process.env.BASE_URL}/users/${doc.profileImage}`;
        doc.profileImage=imageUrl;
    }

}

userShema.post("init",(doc)=>{
    setImageUrl(doc);
})
userShema.post("save",(doc)=>{
    setImageUrl(doc)
   
})

userShema.pre("save",async function(next){
  
    if(!this.isModified("password")){
      
        return next();
    }
    
    this.password= await bcrypt.hash(this.password,12);
    next();

})   


const userModel=mongoose.model("user",userShema)
module.exports=userModel;  