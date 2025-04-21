class appError extends Error{
    constructor(message,statusCode){
        super(message);
        this.message=message;
        this.statusCode=statusCode;
        this.status=`${statusCode}`.startsWith(4) ? "failed":"error"
        this.isOperational=true

    }
}

module.exports={appError}