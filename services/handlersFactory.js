
const asyncHandler = require('express-async-handler')
const { model, models } = require('mongoose')
const { appError } = require('../utilts/appError')
const apiFeatures = require('../utilts/apiFeatures')
const userModel = require('../models/userModel')




const createOne=(model)=>{
    return asyncHandler(async(req,res,next)=>{
      
        const doc=await model.create(req.body)
        if(model.modelName=="listing"){
            const user= await userModel.findById(req.currentUser._id);
            const Balance=user.Balance;
            // if(Balance<1){
            //     return next (new appError(`you have reach to the max number of posts please charge the balance`,400));
            // }
         
    
            user.Balance=Balance-1;
           await  user.save();
   
        }

        res.status(200).json({data:doc})
    })
}




const deletOne=(model)=>{
    return asyncHandler(async(req,res,next)=>{
        const doc=await model.findByIdAndDelete(req.params.id);

        if(!doc){
            next (new appError(`there is no document on this id ${req.params.id}`,500));
        }
        res.status(200).json({message:`document is deleted with id ${req.params.id}`})

    })
}




const updateOne=(model)=>{
    return asyncHandler(async(req,res,next)=>{
        try{
            const doc=await model.findByIdAndUpdate(req.params.id,req.body,{
                new:true
            })
            await  doc.save()
            res.status(200).json({data:doc})

        }
        catch{
            return next (new appError(`there is no found decument with id ${req.params.id}`),500);
        }
    })

}



const getOne=(model,populatetionOptions)=>{
    return asyncHandler(async(req,res,next)=>{
        let doc=await model.findById(req.params.id)
        if (populatetionOptions && populatetionOptions.length > 0) {
         
            populatetionOptions.forEach(option => {
                document = document.populate(option);
            });
        }
        

        const result=doc
        if(!result){
            return next (new appError(`there is no document for this id ${req.params.id}`,500));
        }

        res.status(200).json({data:result});
    })
}



const getAll=(model)=>{
   
    return asyncHandler(async(req,res,next)=>{
        let filter={}
        if(req.filterObj){
            filter=req.filterObj 

        }
        
     
        const countDocuments=await model.countDocuments();
        const queryStringObject={...req.query}
        
        
        
        const Features= new apiFeatures(queryStringObject,model.find(filter))
        .search(model.modelName)
        .paginate(countDocuments)
        .filter()
        .sort()
        .limitFields()

        const {paginationRedult,mongooseQuery}=Features
        const result=await mongooseQuery;

        res.status(200).json({paginate:paginationRedult,data:result})
        
        

    })
}




module.exports={createOne,deletOne,updateOne,getOne,getAll}