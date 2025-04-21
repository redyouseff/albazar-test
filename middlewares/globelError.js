const { appError } = require("../utilts/appError");

const globelError=(err,req,res,next)=>{
    if(err.name=="TokenExpiredError"){
        err.statusCode=403
    }
   
    err.statusCode=err.statusCode||400;
    err.status=res.status || "failed"

    if(process.env.NODE_ENV=="development "){
      
        sendErrorForDev(err,res);

    }

    else {
       
        if(err.name=="JsonWebTokenError") err=hanleInvalidSignature();
        if(err.name=="TokenExpiredError") err=new appError("expired token ",403)

            sendErrorForProd(err,res);

    }
   
  
}




const hanleInvalidSignature =()=> new appError("invalid token",400);

sendErrorForProd=(err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
    })

}



sendErrorForDev=(err,res)=>{
  
    res.status(err.statusCode).json({
        statusCode:err.statusCode,
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack
    })
   
}

module.exports= {globelError}   