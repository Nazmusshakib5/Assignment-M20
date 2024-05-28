const {ReadWishListService,SaveWishListService,RemoveWishListService}=require('../services/WishService')

exports.ReadWishList=async (req,res)=>{
    const data=await ReadWishListService(req);
    return res.status(200).json(data);
}

exports.SaveWishList=async (req,res)=>{
    const data=await SaveWishListService(req);
    return res.status(200).json(data);
}

exports.RemoveWishList=async (req,res)=>{
    const data=await RemoveWishListService(req);
    return res.status(200).json(data);
}