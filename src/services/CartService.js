const CartModel=require('../models/CartModel')

const mongoose=require('mongoose')
const WishModel = require("../models/WishModel");
const ObjectId=mongoose.Types.ObjectId;

const SaveCartListService=async (req)=>{
    try{
        let userId=req.headers.userId;
        let reqBody=req.body;
        reqBody.userID=userId;
        let data=await CartModel.create(reqBody);
        return {status:'success',msg:'cart List added Successfully',data:data}
    }catch (e) {
        return {status:'failed',msg:'cart List not added',err:e.toString()}
    }
}

const RemoveCartListService=async (req)=>{
    try{
        let userId=req.headers.userId;
        let reqBody=req.body;
        reqBody.userID=userId;
        await CartModel.deleteOne(reqBody);
        return {status:'success',msg:'cart List Removed Successfully'}
    }catch (e) {
        return {status:'failed',msg:'cart List not Removed',err:e.toString()}
    }
}

const UpdateCartListService=async (req)=>{
    try{
        let userId=req.headers.userId;
        let cartId=req.params.cartId;
        let reqBody=req.body;
        let data=await CartModel.updateOne({userID:userId,_id:cartId},{$set:reqBody});
        return {status:'success',msg:'cart List updated Successfully',data:data}
    }catch (e) {
        return {status:'failed',msg:'cart List not Removed',err:e.toString()}
    }

}

const ReadCartListService=async (req)=>{
    try {
        let userId=new ObjectId(req.headers.userId)

        let matchingStage={$match:{userID:userId}};
        let joinWithProductStage={$lookup:{from:'products',localField:'productID',foreignField:'_id',as:'WishProduct'}}
        let unwindProductStage={$unwind:'$WishProduct'};

        let joinWithBrandStage={$lookup:{from:'brands',localField:'WishProduct.brandID',foreignField:'_id',as:'brand'}}
        let unwindBrandStage={$unwind:'$brand'};

        let joinWitCategoryStage={$lookup:{from:'categories',localField:'WishProduct.categoryID',foreignField:'_id',as:'category'}}
        let unwindCategoryStage={$unwind:'$category'};

        let projectionStage={$project:{'userID':0,'productID':0,'createdAt':0,'updatedAt':0,'WishProduct._id':0,
                'WishProduct.createdAt':0,'WishProduct.updatedAt':0,'category._id':0,'brand._id':0,'category.updatedAt':0,
                'category.createdAt':0,'brand.updatedAt':0,'brand.createdAt':0,
            }}

        let data=await CartModel.aggregate([
            matchingStage,
            joinWithProductStage,
            unwindProductStage,
            joinWitCategoryStage,
            unwindCategoryStage,
            joinWithBrandStage,
            unwindBrandStage,
            projectionStage
        ])

        return {status:'success',msg:'Cart List showed Successfully',data:data}
    }catch (e) {
        return {status:'failed',msg:'Cart not found',err:e.toString()}
    }
}

module.exports={
    SaveCartListService,
    RemoveCartListService,
    UpdateCartListService,
    ReadCartListService
}