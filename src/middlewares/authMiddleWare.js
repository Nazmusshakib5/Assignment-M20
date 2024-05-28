const {DecodeToken} = require("../utility/TokenHelper");

module.exports=(req,res,next)=>{
    let token=req.headers['token'];
    if(!token){
        token=req.cookies['token']
    }

    let decodeData=DecodeToken(token)
    if(decodeData===null){
       return  res.status(401).json({status:'failed',msg:'unauthorized'})
    }
    else {
        let email=decodeData['email']
        let userId=decodeData['userId']
        req.headers.email=email
        req.headers.userId=userId;

        next();
    }
}
