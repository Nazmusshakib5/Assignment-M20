const { SaveCartListService,RemoveCartListService,UpdateCartListService,ReadCartListService}=require('../services/CartService')


exports.SaveCartList=async (req,res)=>{
    const data=await SaveCartListService(req);
    return res.status(200).json(data)
}

exports.RemoveCartList=async (req,res)=>{
    const data=await RemoveCartListService(req);
    return res.status(200).json(data)
}

exports.UpdateCartList=async (req,res)=>{
    const data=await UpdateCartListService(req);
    return res.status(200).json(data)
}

exports.ReadCartList=async (req,res)=>{
    const data=await ReadCartListService(req);
    return res.status(200).json(data)
}