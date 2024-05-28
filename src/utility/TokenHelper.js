const jwt=require('jsonwebtoken');

exports.EncodeToken=(email,userId)=>{
    let KEY='ABC-1234';
    let EXPIRE={expiresIn:'24h'}
    let PAYLOAD={email:email,userId:userId}
    return jwt.sign(PAYLOAD,KEY,EXPIRE)
}

exports.DecodeToken=(token)=>{
    try{
        let KEY='ABC-1234';
        return jwt.verify(token,KEY)

    }catch (e) {
        return  null
    }
}
