const mongoose=require("mongoose");

const categoreSchema=mongoose.Schema({
    name:{
        unique:true,
        type:String,
      
        required:[true,"name is required"],
        
        minLength:[3,"too short categore name"],
        maxLength:[32,"too long categore name"]
    },
    // a b => a-b
    slug:{
        type:String,
        lowercase:true,
    },
    image:{
               
        type:String
    }

    

},{timestamps:true})

const setImageUrl=(doc)=>{
 
    if(doc.image && !doc.image.startsWith("http")){
        const imageUrl=`${process.env.BASE_URL}/categore/${doc.image}`;
        doc.image=imageUrl;
    }
}


categoreSchema.post("init",(doc)=>{
    setImageUrl(doc);
})
categoreSchema.post("save",(doc)=>{
    setImageUrl(doc)
})




const categoreModel=mongoose.model("categore",categoreSchema);


module.exports=categoreModel;