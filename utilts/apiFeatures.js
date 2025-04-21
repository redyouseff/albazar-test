

class apiFeatures{

    constructor (queryStringObject,mongooseQuery){
        this.queryStringObject=queryStringObject;
        this.mongooseQuery=mongooseQuery;
    }

    filter(){
        let quearyStr={...this.queryStringObject};
     
        const excludesFields=["page","limit","sort","fields","keyword"]
        excludesFields.forEach((field)=>delete quearyStr[field]);
        let quearyString=JSON.stringify(quearyStr);
        quearyString = quearyString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        
        this.mongooseQuery=this.mongooseQuery.find(JSON.parse(quearyString))
      
      
        return this

    }
   

    sort(){
        
        if(this.queryStringObject?.sort){
            const sort=this.queryStringObject.sort.split(",").join(" ");
         
            this.mongooseQuery=this.mongooseQuery.sort(sort);

        }
        return this;
    
    }




    limitFields(){
        if(this.queryStringObject.fields){
            const field=this.queryStringObject.fields.split(",").join(" ")
            this.mongooseQuery=this.mongooseQuery.select(field)
        }
        return this
    }




    search(modelName){
        if(this.queryStringObject.keyword){
            let query ={};
            if(modelName=="listing"){
            
            query.$or = [
                { 'ad title': { $regex: this.queryStringObject.keyword, $options: 'i' } },
                { description: { $regex: this.queryStringObject.keyword, $options: 'i' } },
              ];
              
            this.mongooseQuery=this.mongooseQuery.find(query)
            
        }
        else if (modelName=="user"){
            

            query.$or=[

                {firstname:{$regex:this.queryStringObject.keyword,$options:'i'}},
                {lastname:{$regex:this.queryStringObject.keyword,$options:'i'}},

            ]
            
            this.mongooseQuery=this.mongooseQuery.find(query)
        }
        }

        return this ;
    }


    paginate(countDocuments){
     

        const page=this.queryStringObject.page*1 || 1 ;
        const limit=this.queryStringObject.limit*1 || 5;
        const skip=(page-1)*limit
        const endIndex=page*limit
        let pagination={};
        pagination.currentPage=page
        pagination.limit=limit;
        pagination.numbeOfPage=Math.ceil(countDocuments / limit);
        pagination.totalResults=countDocuments
        if(endIndex<countDocuments){
            pagination.next=(page+1);
        }
        if(skip>0){
            pagination.prev=(page-1)
        }


        this.paginationRedult=pagination;
       
        this.mongooseQuery=this.mongooseQuery.skip(skip).limit(limit)
      

        return this

    }
    


}

module.exports=apiFeatures