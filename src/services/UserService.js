const EmailSend=require('../utility/EmailHelper')
const TokenHelper = require('../utility/TokenHelper')
const UserModel=require('../models/UserModel')
const ProfileModel=require('../models/ProfileModel')

const UserOtpService=async (req)=>{
    try{
        const email=req.params.email;
        const OTP=Math.floor(100000+Math.random()*900000);
        const text=`Your verification code is ${OTP}`
        const subject='Email Verification';
        await EmailSend(email,text,subject)

        await UserModel.updateOne({email:email},{$set:{otp:OTP}},{upsert:true})

        return {status:'success',msg:'Verification code success'}

    }catch (e) {
        return {status:'failed',msg:'Verification code failed'}
    }
}

const VerifyLoginOtpService=async (req)=>{
    try{
        let email=req.params.email;
        let otp=req.params.otp;
        const user=await UserModel.find({email:email,otp:otp}).count('total');
        if(user>0){
            const userID=await UserModel.find({email:email,otp:otp}).select('_id');
            const token=await TokenHelper.EncodeToken(email,userID[0]['_id'].toString())
            await UserModel.updateOne({email:email},{$set:{otp:'0'}})
            return {status:'success',msg:'validOtp',token:token}

        }else{
            return {status:'failed',msg:'InvalidOtp'}
        }

    }catch (e) {
        return {msg:e.toString()}
    }
}


const SaveProfileService=async (req)=>{
    try{
        let userId=req.headers.userId;
        let reqBody=req.body;
        reqBody.userID=userId;
        let data= await ProfileModel.updateOne({userID:userId},{$set:reqBody},{upsert:true})
        return {status:'success',msg:'Data Saved Successfully',data:data}

    }catch (e) {
        return {status:'failed',msg:'Profile is not created'}
    }
}


const ReadProfileService=async (req)=>{
    try{
        let userId=req.headers.userId;
        let data=await ProfileModel.find({userID:userId});
        return {status:'success',msg:'Profile read Successfully',data:data}

    }catch (e) {
        return {status:'failed',msg:'Profile can not read'}
    }
}

module.exports={
    UserOtpService,
    VerifyLoginOtpService,
    SaveProfileService,
    ReadProfileService
}