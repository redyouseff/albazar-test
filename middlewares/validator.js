const { param, validationResult } = require('express-validator');

const validator=(req,res,next)=>{
    const errros=validationResult(req);
    if(!errros.isEmpty()){
        return res.status(400).json({errors:errros.array()})
    }
    next();

}

module.exports=validator