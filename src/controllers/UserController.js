const {UserOtpService} = require("../services/UserService");
const {VerifyLoginOtpService,SaveProfileService,ReadProfileService} = require("../services/UserService");


exports.UserOtp=async (req,res)=>{
    const data=await UserOtpService(req);
    return res.status(200).json(data);
}

exports.VerifyLogin=async (req,res)=>{
    const data=await VerifyLoginOtpService(req)
    if(data['status']==='success'){
        let cookieOption={expires:new Date(Date.now()+24*6060*1000),httponly:false}
        res.cookie('token',data['token'],cookieOption)
        return res.status(200).json(data);
    }
    else {
        return res.status(200).json(data);
    }

}

exports.UserLogout=async (req,res)=>{
    let cookieOption={expires:new Date(Date.now()-24*6060*1000),httponly:false}
    res.cookie('token','',cookieOption)
    return res.status(200).json({msg:'successfully logged out'});

}

exports.CreateProfile=async (req,res)=>{
    const data=await SaveProfileService(req)
    return res.status(200).json(data);
}

exports.UpdateProfile=async (req,res)=>{
    const data=await SaveProfileService(req)
    return res.status(200).json(data);
}

exports.ReadProfile=async (req,res)=>{
    const data=await ReadProfileService(req)
    return res.status(200).json(data);
}