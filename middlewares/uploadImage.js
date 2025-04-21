const multer =require("multer");
const { appError } = require("../utilts/appError");

const multerOptions=()=>{

    const multerStorage=multer.memoryStorage();

    const multerFilter=(req,file,cb)=>{
        if(file.mimetype.startsWith("image")){
            cb(null,true);
        }
        else{
            cb(new appError("only image is allowed",500))
        }
            
        

    }

    const upload=multer({storage:multerStorage,fileFilter:multerFilter})

    return upload;

}

const uploadSingleImage=(fileName)=>{

    return multerOptions().single(`${fileName}`)

}

const uploadMixedImage=(arrayOfField)=>{

    return multerOptions().fields(arrayOfField);
}


module.exports =  {uploadMixedImage,uploadSingleImage}

